// $(document).ready(function () {

//     var score = 0;
//     var isPlaying = false;
//     var timer;
//     var sec;
//     var highscore = 0;

//     function stop(timer, sec) {
//         clearInterval(timer);
//         $('.end span').text('Score: ' + score);
//         isPlaying = false;
//         $('.end').fadeIn("fast");
//         $('.meta-left span').text(10);
//         $('.meta-right span').text(0);
//         if (score > highscore) {highscore = score;}
//         console.log(highscore);

//     }

//     function updateBoard() {
//         var random = (Math.floor(Math.random() * 2));
//         if (random == 0) {
//             $('.left').toggleClass('red green');
//             $('.right').toggleClass('red green');
//         }
//     }

//     function updateScore() {
//         if (isPlaying == true) {score++;updateBoard();$('.meta-right span').text(score);}
//     }

//     $(document).on('tap', '.begin', function() {
//         if (isPlaying == false) {start(timer, sec);$('.begin').hide();}
//     });

//     $(document).on('tap', '.green', function() {
//         updateScore();
//     });

//     $(document).on('tap', '.red', function() {
//         stop(timer, sec);
//     });

//     $(document).on('tap', '.play', function() {
//         if (isPlaying == false) {start(timer, sec);$('.end').hide();}
//         $('.end span').text('');
//     });

//     $(document).bind('touchmove', function(e) {
//         e.preventDefault();
//     });

//     function start() {
//         score = 0;
//         isPlaying = true;
//         sec = $('.meta-left span').text(),
//         timer = setInterval(function () { 
//         var timer2 = setInterval(function () { 
//                 $('.green').tap();
//             }, 0001);
//             $('.green').tap();
//             $('.meta-left span').text(--sec);
//             if (sec == 0) {
//                 isPlaying = false;
//                 stop(timer, sec);
//             } 
//         }, 1000);
//     }

// });



$.fn.nodoubletapzoom = function() {
    $(this).bind('touchstart', function preventZoom(e){
        var t2 = e.timeStamp;
        var t1 = $(this).data('lastTouch') || t2;
        var dt = t2 - t1;
        var fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1){
            return;
        }
        e.preventDefault();
        $(e.target).trigger('click');
    });
};

$(document).ready(function () {

    $("body").nodoubletapzoom();
    var score = 0;
    var isPlaying = false;
    var timer;
    var sec;

    function stop(timer, sec) {
        clearInterval(timer);
        if (isPlaying == true) {$('div.play').show();}
        $('.end span.final').text('Score: ' + score);
        //$('.end span.high').text('High Score: ' + localStorage.highscore);
        isPlaying = false;
        $('.end').fadeIn("fast");
    }

    // function start() {
    //     score = 0;
    //     isPlaying = true;
    //     $('.meta-left span.time').text(10);
    //     $('.meta-right span.score').text(0);
    //     sec = $('.meta-left span.time').text(),
    //     timer = setInterval(function () { 
    //         $('.meta-left span.time').text(--sec);
    //         if (sec == 0) {
    //             stop(timer, sec);
    //         } 
    //     }, 1000);
    // }

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

    $(document).on('tap', '.begin', function() {
        if (isPlaying == false) {start(timer, sec);$('.begin').hide();}
    });

    $(document).on('tap', '.green', function() {
        if (isPlaying == true) {updateScore();}
    });

    $(document).on('tap', '.red', function() {
        if (isPlaying == true) {stop(timer, sec);}
    });

    $(document).on('tap', 'img.play', function() {
        if (isPlaying == false) {start(timer, sec);$('.end').hide();$('div.play').hide();}
        $('.end span').text('');
    });

    $(document).bind('touchmove', function(e) {
        e.preventDefault();
    });

    function start() {
        score = 0;
        isPlaying = true;
        $('.meta-left span.time').text(10);
        $('.meta-right span.score').text(0);
        sec = $('.meta-left span.time').text(),
        timer = setInterval(function () { 
        var timer2 = setInterval(function () { 
                $('.green').tap();
            }, 0001);
            $('.green').tap();
            $('.meta-left span.time').text(--sec);
            if (sec == 0) {
                stop(timer, sec);
            } 
        }, 1000);
    }

});

