/**
 * engine.js
 *
 * Implements JavaScript functions to deal with IPv4 addresses.  It also
 * have routines to manage the user interface.
 *
 * Author: José Lopes de Oliveira Jr. <forkd@tuta.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/


/**
 * GLOBAL VARIABLES
 */
// Charsets
var lower = 'a b c d e f g h i j k l m n o p q r s t u v x y w z'.split(' '),
    upper = 'A B C D E F G H I J K L M N O P Q R S T U V X Y W Z'.split(' '),
    numbers = '0 1 2 3 4 5 6 7 8 9'.split(' '),
    nalpha = '" ! @ # $ % & * ( ) _ - + = { } [ ] ? / | < > , . ; : ^ ~ `'.split(' '),
    matrix = [lower, upper, numbers, nalpha];

// Which charsets will be used?
var use_upper = true,
    use_lower = true,
    use_numbers = true,
    use_nalpha = true;

var length = 20,  // default password length
    re_similar = /[lLiIoO01]/g,  // similar chars to avoid
    re_program = /[ !@#\$><\&\)\(\]\[\}\{\\\|\/'"`\.,;\^~]/g;  // prog. chars

nalpha.push('\'', '\\', ' ');  // add some chars to nalpha


/**
 * FUNCTIONS
 */
function random(max){
    return Math.floor(Math.random() * max);  // rand int between 0 and max - 1
}

function avoid_chars(str, re){
    /* Removes re from str and fills str again. */
    
    var i = 0;  // security variable to avoid infinite loops

    str = str.replace(re, '');

    while ((str.length < length) && (i < 20)) {
        i++;
        str += shuffle(length - str.length);
        str = str.replace(re, '');
    }

    return str;
}

function shuffle(len){
    /* Generates a random sequence of len chars and returns it. */

    var chars = '', i, x;

    for (i = 0; i < len; i++) {
        x = matrix[random(matrix.length)];

        try {chars += x[random(x.length)];}
        catch(TypeError) {return '';}
    }

    return chars;
}


/**
 * CALLBACK FUNCTIONS
 */
function update_output(){
    /* Update output component. */

    length = parseInt($('#txt_length').val().replace(/[^0-9]/g, ''));
    $('#txt_length').val(length.toString());
    $('#txt_output').val(shuffle(length));
}

$(document).ready(function(){
    $('#txt_output').val(shuffle(length));  // starts with a new password

    // BUTTONS 
    $('#btn_gen').click(update_output);
    $('#btn_similar').click(function(){$('#txt_output').val(avoid_chars($('#txt_output').val(), re_similar))});
    $('#btn_program').click(function(){$('#txt_output').val(avoid_chars($('#txt_output').val(), re_program))});

    // LENGTH
    $('#txt_length').keypress(function(e){
        if (e.keyCode == 13){update_output();}
    });

    // CHECKBOXES
    $('#chk_upper').click(function(){
        use_upper = ! use_upper;
        if (use_upper){matrix.push(upper);}
        else {matrix.splice(matrix.indexOf(upper), 1);}
    });

    $('#chk_lower').click(function(){
        use_lower = ! use_lower;
        if (use_lower){matrix.push(lower);}
        else {matrix.splice(matrix.indexOf(lower), 1);}
    });

    $('#chk_numbers').click(function(){
        use_numbers = ! use_numbers;
        if (use_numbers){matrix.push(numbers);}
        else {matrix.splice(matrix.indexOf(numbers), 1);}
    });

    $('#chk_nalpha').click(function(){
        use_nalpha = ! use_nalpha;
        if (use_nalpha){matrix.push(nalpha);}
        else {matrix.splice(matrix.indexOf(nalpha), 1);}
    });
});

