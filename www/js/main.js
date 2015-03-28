$.fn.nodoubletapzoom = function() {
    $(this).bind('touchstart', function preventZoom(e){
        var t2 = e.timeStamp,t1 = $(this).data('lastTouch') || t2,dt = t2 - t1,fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1){return;}
        e.preventDefault();
        $(e.target).trigger('touchend');
    });
};

$(document).ready(function () {

    $("body").nodoubletapzoom();
    var score = 0;
    var isPlaying = false;
    var timer;
    var sec;
    var additionalTime;
    var extra = false;
    var adCount = 0;
    var adDismissCount = 0;
    var powerupPromptCount = 0;
    document.gameboard = {};

    document.admobid = {};
    // select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) { 
        admobid = { // for Android
            banner: 'ca-app-pub-8159900971777689/1412531056',
            interstitial: 'ca-app-pub-8159900971777689/7958592259'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        //alert('30');
        admobid = { // for iOS
            banner: 'ca-app-pub-8159900971777689/1412531056',
            interstitial: 'ca-app-pub-8159900971777689/7958592259'
        };
    } else {
        admobid = { // for Windows Phone
            banner: 'ca-app-pub-8159900971777689/1412531056',
            interstitial: 'ca-app-pub-8159900971777689/7958592259'
        };
    }
    
    if (window.localStorage.getItem('showAds') === undefined || window.localStorage.getItem('showAds') === null){
        window.localStorage.setItem('showAds', true);
    }

    if (window.localStorage.getItem('notifyOfPowerups') === undefined || window.localStorage.getItem('notifyOfPowerups') === null){
        window.localStorage.setItem('notifyOfPowerups', true);
    }

    //window.localStorage.clear();

    document.checkAd = function() {
        adCount++;
        if (adCount == 1){
            if (typeof AdMob !== 'undefined') {
                if(AdMob) AdMob.createBanner( {
                    adId: admobid.banner, 
                    position: AdMob.AD_POSITION.BOTTOM_CENTER, 
                    autoShow: true 
                });
            }
        } else if (adCount == 3) {
            if (typeof AdMob !== 'undefined') {
                if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
            }
        } else if (adCount == 17) {
            if (typeof AdMob !== 'undefined') {
                adCount = 0;
                AdMob.showInterstitial();
            }
        }
    }

    var load = window.localStorage.getItem('firstload');
    if(load){

    } else {
        window.localStorage.setItem('firstload', true);
        window.localStorage.setItem('highscore', 0);
        window.localStorage.setItem('life', 3);
        $('span.badge').text(Number(window.localStorage.getItem('life')));
        window.localStorage.setItem('resetday', moment().hour(00).minute(00).second(01));
    }

    document.gameboard.checkTime = function(){
        var a = moment().hours(00).minutes(00).seconds(01);
        var b = window.localStorage.getItem('resetday');
        var c = a.diff(b, 'minutes');
        if(c >= 1440){
            window.localStorage.setItem('life', 3);
            window.localStorage.setItem('resetday', moment().hours(00).minutes(00).seconds(01));
        }
        $('span.badge').text(Number(window.localStorage.getItem('life')));
    }

    function allowResume(){
        $('div.end').hide();
        $('div.pregame').hide();
        $('div.play').hide();
        $('div.resume').show();
    }

    function stop(timer, sec) {
        clearInterval(timer);
        if (isPlaying == true) {
            if (additionalTime == false) {
                $('img.add').hide();$('div.badge-holder').hide();
            }else {
                $('img.add').show();$('div.badge-holder').show();
                var diff = Number(window.localStorage.getItem('highscore')) - score;
                if (diff < 10 && diff > 0 && window.localStorage.getItem('life') == 0){
                    if(powerupPromptCount % 4 === 0 || powerupPromptCount == 0) {
                        promptPurchase(diff);
                    } 
                    powerupPromptCount++;
                }
            }
            $('div.play').fadeIn('fast');
        }
        if (score > window.localStorage.getItem('highscore')) {window.localStorage.setItem('highscore', score);}
        $('.end span.final').text('Score: ' + score);$('.end span.high').text('High Score: ' + window.localStorage.getItem('highscore'));
        var data = {score: window.localStorage.getItem('highscore'),leaderboardId: "tapgreen_leaderboard"};
         
        gamecenter.submitScore(true, false, data);
        isPlaying = false;
        $('.end').fadeIn('fast');
        $('div.pregame').fadeIn('fast');
        $('span.badge').text(Number(window.localStorage.getItem('life')));
        if(window.localStorage.getItem('showAds') == 'true')document.checkAd();
    }

    function start(scoreUpdate, second, extra) {
        if (extra != true) {
            score = 0;
            sec = 10;
            additionalTime = true;
        }else{
            score = scoreUpdate;
            sec = Number(second) + 3;
        };
        isPlaying = true;
        $('.meta-left span.time').text(sec);
        $('.meta-right span.score').text(score);
        sec = $('.meta-left span.time').text(),
        timer = setInterval(function () { 
            $('.meta-left span.time').text(--sec);
            if (sec == 0) {
                stop(timer, sec);
            } 
        }, 1000);
    }

    function updateBoard() {
        var random = (Math.floor(Math.random() * 2));
        if (random == 0) {
            $('.left').toggleClass('red green');
            $('.right').toggleClass('red green');
        }
    }

    function updateScore() {
        score++;
        updateBoard();
        $('.meta-right span.score').text(score);
    }

    function purchaseExtraTime() {
        IAP.buy('EXTRA03');
    }

    function continueGame() {
        extra = true;
        if (isPlaying == false) {start(score, sec, extra);$('div.resume').hide();$('.end').hide();$('div.play').hide();$('div.pregame').hide();}
        $('.end span').text('');
        additionalTime = false;
    }

    function notifyOfPowerups() {
        $('.messageBox').children('p').text('Oh no, that was your last one! Purchase more by pressing the Power-Up button at any time when you are out.');
        $('span.buttons').html('<button class="closeMB">Ok</button>');
        $('.messageBox').show();
    }

    function promptPurchase(diff) {
        $('.messageBox').children('p').text('You are only '+diff+' away from your high score! Purchase a Power-Up and go for it!');
        $('span.buttons').html('<button class="closeMB">Ok</button>');
        $('.messageBox').show();
    }

    IAP = {
      list: [ "EXTRA03", "AD001"]
    };

    IAP.load = function () {
      // Check availability of the storekit plugin
      if (!window.storekit) {
          alert("In-App Purchases not available");
          return;
      }

       // Initialize
       storekit.init({
            debug:    true, // Enable IAP messages on the console
            ready:    IAP.onReady,
            purchase: IAP.onPurchase,
            restore:  IAP.onRestore,
            error:    IAP.onError
       });
    }


    IAP.onReady = function () {
       storekit.load(IAP.list, function (products, invalidIds) {
            IAP.products = products;
            IAP.loaded = true;
            for (var i = 0; i < invalidIds.length; ++i) {
                 alert("Error: could not load In App Purchases.");
            }
       });
       console.log(IAP.products[0]);
       alert(IAP.products);
    };

    IAP.onPurchase = function (transactionId, productId, receipt) {
       if(productId == 'EXTRA03'){
            window.localStorage.setItem('life', Number(window.localStorage.getItem('life')) + 3);
            allowResume();
       }
       if(productId == 'AD001'){
            window.localStorage.setItem('showAds', false);
            AdMob.removeBanner();
            $('.messageBox').children('p').text('Ads Removed Successfully!');
            $('span.buttons').html('<button class="closeAd">Ok</button>');
       }
    };

    IAP.onRestore = function (transactionId, productId, transactionReceipt) {
        if(productId == 'EXTRA03'){}
        if(productId == 'AD001'){window.localStorage.setItem('showAds', false);}
    };

    IAP.onError = function (errorCode, errorMessage) {
       console.log(errorCode + ' : test : ' + errorMessage);
    };

    IAP.buy = function(productId){
        storekit.purchase(productId);
    };

    IAP.restore = function(){
       storekit.restore();
    };

    $(document).on('touchend', '.begin', function() {
        if (isPlaying == false) {start(timer, sec);$('.begin').hide();$('div.pregame').hide();}
    });

    $(document).on('touchstart', '.green', function() {
        if (isPlaying == true) {updateScore();}
    });

    $(document).on('touchstart', '.red', function() {
        if (isPlaying == true) {stop(timer, sec);}
    });

    $(document).on('touchend', 'img.play', function() {
        if (isPlaying == false) {start(score, sec);$('.end').hide();$('div.play').hide();$('div.pregame').hide();}
        $('.end span').text('');
    });

    $(document).on('touchend', 'img.resume', function() {
        continueGame();
    });

    $(document).on('touchend', 'button.closeMB', function() {
        $('.messageBox').hide();
        setTimeout(function(){
            $('img.resume').fadeIn('slow');
        }, 700);
    });

    $(document).on('touchend', 'button.closeAd', function() {
        $('.messageBox').hide();
    });

    $(document).on('touchstart', 'button.removeAds', function() {
        $('.messageBox').hide();
        $('div.play').hide();
        IAP.buy('AD001');
        setTimeout(function(){
            $('.messageBox').show();
            $('div.play').show();
        }, 2000);
    });

    $(document).on('touchend', 'img.add', function() {
        if (window.localStorage.getItem('life') > 0) {
            window.localStorage.setItem('life', Number(window.localStorage.getItem('life')) - 1);
            $('span.badge').text(Number(window.localStorage.getItem('life')));
            if(window.localStorage.getItem('life') == 0 && window.localStorage.getItem('notifyOfPowerups') == 'true') {
                window.localStorage.setItem('notifyOfPowerups', false);
                $('img.resume').hide();
                notifyOfPowerups();
            }
            allowResume();
        } else {
            $('span.badge').text(Number(window.localStorage.getItem('life')));
            $('img.add').hide();
            $('img.play').hide();
            $('span.badge').hide();
            purchaseExtraTime();
            setTimeout(function(){
                $('img.add').show();
                $('img.play').show();
                $('span.badge').css("display","inherit");
            }, 2500);
        }
    });

    $('img.help').on('touchstart', function() {     
        $('div.help').show();
    });

    $('img.close').on('touchstart', function() {
        $('div.help').hide();
    });

    $(document).on('touchend', 'img.leaderboard', function() {
        var data = {
            leaderboardId: "tapgreen_leaderboard"
        };
        gamecenter.showLeaderboard(true, false, data);
    });

    $(document).on('touchend', 'img.share', function() {
        window.plugins.socialsharing.shareViaFacebook('My high score on "Tap Green" is '+window.localStorage.getItem('highscore')+'! Think you can beat it?', 'http://www.haganmcphail.com/common/img/tap_green.png', null /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
    });

    document.addEventListener('onAdDismiss',function(data){
        adDismissCount++;
        if (adDismissCount % 4 == 0 || adDismissCount == 1){
            $('.messageBox').children('p').text('Would you like to stop seeing Ads?');
            $('span.buttons').html('<button class="closeMB">No</button>   <button class="removeAds">Yes</button>');
            $('.messageBox').show();
        }
    });

    $(document).bind('touchmove', function(e) {
        e.preventDefault();
    });

});
