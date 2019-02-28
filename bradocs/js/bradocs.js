/* bradocs.js
 *
 * Implements mod10() and mod11() functions to validate some document
 * numbers, such CPF, CNPJ, Título Eleitoral and Credit Cards.
 *
 * AUTHOR: José Lopes Oliveira Jr. <jilo.cc>
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.*
 */


/**
 * MODULUS
 */
function mod10(numbers) {
/* Implements Luhn Algorithm (a.k.a. mod10), which
 * is a checksum formula to validate a variety of
 * identification numbers, such as credit card
 * numbers.
 *
 * Require a list of integers with numbers to be
 * validated.
 */
    var sum = 0;
    var double = true;
    var mod = 0;
    var number = 0;

    /* Iterate til the last item of list, adding to
     * sum the item and two times number, interspersed.
     */
    for (var index = numbers.length - 1; index >= 0; index--) {
        number = numbers[index];

        if (double) {
            number *= 2;
            (number > 9) && (number -= 9);
        }

        sum += number;
        double = ! double;
    }

    mod = sum % 10;

    /* sum must be a multiple of 10.  If so, zero is returned.
     * Else, got to calculate how many numbers are missing
     * until 10.
     */
    mod && (mod = 10 - mod);
    
    return mod;
}

function mod11(numbers, max_weight) {
/* Implements Modulus 11 check digit algorithm.
 *
 * It's a variation of HP's Modulus 11 algorithm.
 * The HP's Modulus 11 algorithm can be accessed in:
 * http://docs.hp.com/en/32209-90024/apds02.html --
 * last access in Jan/2012.
 *
 * Requires the sequence to be calculated in an array
 * of integers and the maximum value of weight --
 * optional.
 */
    // Was max_weight given?
    (max_weight === undefined) && (max_weight = 7);

    var sum = 0;
    var weight = 2;
    var number = 0;
    var mod = 0;

    /* Iterate in reversed array, multiplying each value
     * for it's respective weight.  If the weight reaches
     * max_weight, it is restarted to 2.
     */
    for (var index = numbers.length - 1; index >= 0; index--) {
        number = numbers[index];
        sum += number * weight;
        weight++;
        
        (weight > max_weight) && (weight = 2);
    }

    mod = 11 - sum % 11;

    /* HP's Modulus 11 algorithm says that a 10 result is
     * invalid and a 11 result is equal to 0.  This way,
     * both values are returned as 0.
     */
    (mod > 9) && (mod = 0);

    return mod;
}


/**
 * CPF
 */
function chk_cpf(numbers) {
/* Returns true or false for valid CPF.
 * numbers must be an array of 11 int numbers.
 */
    if ((numbers[9] == mod11(numbers.slice(0, 9), 10)) && 
        (numbers[10] == mod11(numbers.slice(0,10), 11)))  {
        return true;
    }
    return false;
}

function gen_cpf(numbers) {
/* Generate a valid CPF.
 * numbers must be an array of 9 int numbers.
 */
    numbers.push(mod11(numbers, 10));
    numbers.push(mod11(numbers, 11));
    return numbers
}


/**
 * CNPJ
 */
function chk_cnpj(numbers) {
/* Returns true or false for valid CNPJ.
 * numbers must be an array of 14 int numbers.
 */
    if ((numbers[12] == mod11(numbers.slice(0, 12), 9)) &&
        (numbers[13] == mod11(numbers.slice(0, 13), 9))) {
        return true;
    }

    return false;
}

function gen_cnpj(numbers) {
/* Return a valid CNPJ.
 * numbers must be an array of 12 int numbers.
 */
    numbers.push(mod11(numbers, 9));
    numbers.push(mod11(numbers, 9));
    return numbers
}


/**
 * TIEL --TÍTULO ELEITORAL
 */
function chk_tiel(numbers) {
/* Returns true or false for valid TIEL.
 * numbers must be an array of 10 int numbers.
 */
    if ((numbers[8] == mod11(numbers.slice(0, 6), 9)) && 
        (numbers[9] == mod11(numbers.slice(6, 9), 9))) {
        return true;
    }
    return false;
}

function gen_tiel(numbers) {
/* Return a valid TIEL.
 * numbers must be an array of 8 int numbers.
 */
    numbers.push(mod11(numbers.slice(0, 6), 9));
    numbers.push(mod11(numbers.slice(6, 9), 9));
    return numbers
}


/**
 * CREDIT CARD
 */
function chk_ccard(numbers) {
/* Returns true or false for valid credit card.
 * numbers must be an array of int numbers.
 */
    lastindex = numbers.length - 1;

    if (numbers[lastindex] == mod10(numbers.slice(0, lastindex))) {
        return true;
    }
    return false;
}

function gen_ccard(numbers) {
/* Return a valid credit card number.
 * numbers must be an array of int numbers.
 */
    numbers.push(mod10(numbers));
    return numbers;
}


/**
 * ARRAY MANAGEMENT
 * All functions beyond this point are specific for 
 * example's page.
 */
function fill_array(array, length) {
/* Create or fill an array of integer values.
 * Each value will be between 0 and 9.  If array is given, it
 * is filled until length.  If not, a new array is created.
 */
    (array === undefined) && (array = []);
    (length === undefined) && (length = 10);

    for (var index = array.length; index < length; index++) {
        array.push(Math.floor(Math.random() * 10));
    }

    return array;
}

function str2intarray(str) {
/* Convert a string of numbers to a array of integers.
 * str must be a string.
 */
    // Preparing the argument
    if (str === undefined) {
        return [];
    }
    else {
        str = str.match(/[0-9]/g); // Only numbers go on
        if (! str) {  // Is str null?
            return [];
        }
    }

    var array_int = [];
    var length = str.length;

    // Exceptions should be treated on str to int conversion. 
    for (var index = 0; index < length; index++) {
        array_int.push(parseInt(str[index]));
    }

    return array_int;
}


/**
 * EVENT HANDLERS
 */
$('#btn-cpf').click(function() {
/* Generate/Check CPF.
 */
    var numbers = str2intarray($('#input-cpf').val());
    var output_color = '#404040';
    
    if (numbers.length >= 11) { // CPF Check
        numbers = numbers.slice(0, 11);

        if (chk_cpf(numbers)) {
            output_color = '#468847';
        }
        else {
            output_color = '#b94a48';
        }
    }
    else {  // CPF Generation
        (numbers.length == 10) && (numbers.pop());  // Deal with 10-digit array

        numbers = fill_array(numbers, 9);
        numbers = gen_cpf(numbers);
    }
    
    numbers = numbers.toString().replace(/\,/g, '')
                 .replace(/^([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/, 
                         '$1\.$2\.$3-$4')

    $('#result-cpf').html(numbers).css('color', output_color);
    return false;
});

$('#btn-cnpj').click(function() {
/* Generate/Check CNPJ.
 */
    var numbers = str2intarray($('#input-cnpj').val());
    var output_color = '#404040';

    if (numbers.length >= 14) {  // CNPJ Check
        numbers = numbers.slice(0, 14);

        if (chk_cnpj(numbers)) {
            output_color = '#468847';
        }
        else {
            output_color = '#b94a48';
        }
    }
    else {  // CNPJ Generation
        (numbers.length == 13) && (numbers.pop());  // Deal with 13-digit array

        numbers = fill_array(numbers, 12);
        numbers = gen_cnpj(numbers);
    }
    
    numbers = numbers.toString().replace(/\,/g, '')
                 .replace(/^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/, 
                         '$1\.$2\.$3/$4-$5')

    $('#result-cnpj').html(numbers).css('color', output_color);
    return false;
});

$('#btn-tiel').click(function() {
/* Generate/Check TIEL.
 */
    var numbers = str2intarray($('#input-tiel').val());
    var output_color = '#404040';

    if (numbers.length >= 10) {  // TIEL Check
        numbers = numbers.slice(0, 10);

        if (chk_tiel(numbers)) {
            output_color = '#468847';
        }
        else {
            output_color = '#b94a48';
        }
    }
    else {  // TIEL Generation
        (numbers.length == 9) && (numbers.pop());  // Deal with 9-digit array

        numbers = fill_array(numbers, 8);
        numbers = gen_tiel(numbers);
    }
    
    numbers = numbers.toString().replace(/\,/g, '')
                 .replace(/^([0-9]{8})([0-9]{2})/, '$1\/$2')

    $('#result-tiel').html(numbers).css('color', output_color);
    return false;
});

$('#btn-ccard').click(function() {
/* Generate/Check CCard.
 */
    var numbers = str2intarray($('#input-ccard').val());
    var output_color = '#404040';

    if (numbers.length >= 16) {  // CCard Check
        numbers = numbers.slice(0, 16);

        if (chk_ccard(numbers)) {
            output_color = '#468847';
        }
        else {
            output_color = '#b94a48';
        }
    }
    else {  // CCard Generation
        numbers = fill_array(numbers, 15);
        numbers = gen_ccard(numbers);
    }
    
    numbers = numbers.toString().replace(/\,/g, '')
                 .replace(/^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})/, 
                         '$1 $2 $3 $4')

    $('#result-ccard').html(numbers).css('color', output_color);
    return false;
});
