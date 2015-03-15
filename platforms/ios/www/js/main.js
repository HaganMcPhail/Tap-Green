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
    document.gameboard = {};

    //window.localStorage.clear();
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
                $('img.add').hide();
                $('div.badge-holder').hide();
            }else {$('img.add').show();$('div.badge-holder').show();}
            $('div.play').show();
        }
        if (score > window.localStorage.getItem('highscore')) {window.localStorage.setItem('highscore', score);}
        $('.end span.final').text('Score: ' + score);
        $('.end span.high').text('High Score: ' + window.localStorage.getItem('highscore'));
        var data = {
            score: window.localStorage.getItem('highscore'),
            leaderboardId: "tapgreen_leaderboard"
        };
         
        gamecenter.submitScore(true, false, data);
        isPlaying = false;
        $('.end').fadeIn("fast");
        $('div.pregame').fadeIn("fast");
        $('span.badge').text(Number(window.localStorage.getItem('life')));
    }

    function start(scoreUpdate, second, extra) {
        if (extra != true) {
            score = 0;
            sec = 10;
            additionalTime = true;
        }else{
            score = scoreUpdate;
            sec = Number(second) + 3;
            console.log(sec);
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

    IAP = {
      list: [ "EXTRA03"]
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
    };

    IAP.onPurchase = function (transactionId, productId, receipt) {
       if(productId == 'EXTRA03'){
            window.localStorage.setItem('life', Number(window.localStorage.getItem('life')) + 3);
            allowResume();
       }
    };

    IAP.onRestore = function (transactionId, productId, transactionReceipt) {
       if(productId == 'EXTRA03'){}
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

    $(document).on('touchend', 'img.add', function() {
        if (window.localStorage.getItem('life') > 0) {
            window.localStorage.setItem('life', Number(window.localStorage.getItem('life')) - 1);
            $('span.badge').text(Number(window.localStorage.getItem('life')));
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

    $('img.help').on('touchend', function() {
        $('div.help').show();
    });

    $('img.close').on('touchend', function() {
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

    $(document).bind('touchmove', function(e) {
        e.preventDefault();
    });

});
