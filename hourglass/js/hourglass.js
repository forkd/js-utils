/**
 * hourglass.js
 *
 * JavaScript functions to make hourglass work.
 *
 * Author: José Lopes de Olivera Jr. <forkd@tuta.io>
 *
 * Licensed under GPLv2.
 **/

/**
 * GLOBAL VARIABLES
 */
var ttime = 3600,  // total time in seconds -- default 60 minutes
    rtime = ttime;  // remaining time
var timer;


/**
 * FUNCTIONS
 */
function engine(){
    /*This function implements routines that make the time tick.*/

    var display = '',
        t;

    rtime--;
    t = rtime;

    if (t < 0){
        display += '-';
        t *= -1;
    }

    // colors
    if (rtime < (ttime * 0.3)){
        if (rtime >= (ttime * 0.1)){
            $("body").css("background-color", "gold");
        }
        else{
            $("body").css("background-color", "tomato");
        }
    }

    // minutes
    if ((t / 60) < 10){display = display + '0';}
    display = display + Math.floor(t / 60) + ':';

    // seconds
    if ((t % 60) < 10){display = display + '0';}
    display = display + (t % 60);

    $("#display").text(display);
}

function parser(s){
    /*Interprets user parameter (s) and convert it to seconds.*/
    //TODO: process parameters without numbers, like "qwerty"

    var re_hms = /^\?t=([0-9]+[hH])?([0-9]+[mM])?([0-9]+[sS])?$/,
        items = [],
        number, mult, len, secs = 0;

    try{
        items = re_hms.exec(s).filter(function(n){return n != undefined});
        items.shift();  // we don't care about first item
    }
    catch (e){
        items.push(s.replace(/[^0-9]/g, ''));
    }
    
    len = items.length;

    for (var i=0; i < len; i++){
        number = parseInt(items[i].match(/[0-9]+/));
        mult = items[i].match(/[hHmMsS]/);

        if ((mult == 'h') || (mult == 'H')){number *= 3600;}
        else if ((mult == 'm') || (mult == 'M')){number *= 60;}

        secs += number;
    }

    ttime = secs;
    rtime = ttime;
}


/**
 * MAIN
 */
$(document).ready(function(){
    timer = setInterval(engine, 1000);  // updates every 1 second

    if (window.location.search){
        parser(window.location.search);
    }
});

