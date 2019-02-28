/**
 * cvss2.js
 *
 * Implements all functions to calculate the score and vector of Common
 * Vulnerabilities Scoring System version 2.  It also implements routines
 * to manage the interface with the user and provide all functionalities.
 *
 * Author: José Lopes de Oliveira Jr. <http://jilo.cc>
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
// Table of Values -- Defined by CVSS v2.  NEVER change it.
this.TABLE_VALUES = [[[0.395, 0.646, 1.0],  // Base Metrics - AV
                      [0.35, 0.61, 0.71],  // AC
                      [0.45, 0.56, 0.704],  // Au
                      [0.0, 0.275, 0.660],  // C
                      [0.0, 0.275, 0.660],  // I
                      [0.0, 0.275, 0.660]], // A
                     [[0.85, 0.9, 0.95, 1.00, 1.00],  // Temp Metrics - E
                      [0.87, 0.90, 0.95, 1.00, 1.00],  // RL
                      [0.90, 0.95, 1.00, 1.00]], // RC
                     [[0, 0.1, 0.3, 0.4, 0.5, 0],  // Envi Metrics - CDP
                      [0, 0.25, 0.75, 1.00, 1.00],  // TD
                      [0.5, 1.0, 1.51, 1.0],  // CR
                      [0.5, 1.0, 1.51, 1.0],  // IR
                      [0.5, 1.0, 1.51, 1.0]]]; // AR

// Table of Strings -- Defined by CVSS v2.  NEVER change it.
this.TABLE_STRINGS = [[["L", "A", "N"],  // Base Metrics - AV
                       ["H", "M", "L"],  // AC
                       ["M", "S", "N"],  // Au
                       ["N", "P", "C"],  // C
                       ["N", "P", "C"],  // I
                       ["N", "P", "C"]],  // A
                      [["U", "POC", "F", "H", "ND"],  // Temp Metrics - E
                       ["OF", "TF", "W", "U", "ND"],  // RL
                       ["UC", "UR", "C", "ND"]],  // RC
                      [["N", "L", "LM", "MH", "H", "ND"],  // Envi M. - CDP
                       ["N", "L", "M", "H", "ND"],  // TD
                       ["L", "M", "H", "ND"],  // CR
                       ["L", "M", "H", "ND"],  // IR
                       ["L", "M", "H", "ND"]]];  // AR

// Current Vector.  These values are set according
// to the user's choices.
this.int_vector = [[0, 0, 0, 0, 0, 0],  // Base Metrics
                   [0, 0, 0],  // Temporal Metrics
                   [0, 0, 0, 0, 0]];  // Environmental Metrics

// Defines if Temporal and/or Environmental Metrics
// will be used.  Do not change it manually: use
// switcher().
this.switchboard = [false, false];


/**
 * CVSS v2 [DIRECT RELATED] FUNCTIONS
 * All rules implemented here were defined in:
 * http://www.first.org/cvss/cvss-guide
 * (last accessed in 2014-04-09).
 */
function rounder(f) {
    /** Rounds a float number to 1 decimal.
     */
    return Math.round(f * 10) / 10;
}

function calc() {
    /** Calculate CVSS v2 score.
     */
    var base = 0,
        temp = 0,

        bvalues = get_values(0),  // Retrieve base values
        impact = 0.0,
        exploitability = 0.0,
        fimpact = 0,
        av = bvalues[0],
        ac = bvalues[1],
        au = bvalues[2],
        c = bvalues[3],
        i = bvalues[4],
        a = bvalues[5],

        tvalues = get_values(1),  // Retrieve temp values
        e = tvalues[0],
        rl = tvalues[1],
        rc = tvalues[2],

        evalues = get_values(2),  // Retrieve envi values
        adjusted_temporal = 0.0,
        adjusted_impact = 0.0,
        cdp = evalues[0],
        td = evalues[1],
        cr = evalues[2],
        ir = evalues[3],
        ar = evalues[4];

    // Base calc
    impact = rounder(10.41 * (1 - (1 - c) * (1 - i) * (1 - a)));
    exploitability = rounder(20 * av * ac * au);
    if (impact) { fimpact = 1.176; }
    base = rounder(((0.6 * impact) + (0.4 * exploitability) - 1.5) *
                   fimpact); 

    if (this.switchboard[0]) {  // Temporal calc
        temp = rounder(base * e * rl * rc);

        if (this.switchboard[1]) {  // Environmental calc
            adjusted_impact = rounder(Math.min(10, 10.41 *
                                                   (1 - (1 - c * cr) * 
                                                    (1 - i * ir) *
                                                    (1 - a * ar))));
            adjusted_base = rounder(((0.6 * adjusted_impact) +
                                     (0.4 * exploitability) - 1.5) *
                                     fimpact);
            adjusted_temporal = rounder(adjusted_base * e * rl * rc);

            return rounder((adjusted_temporal + (10 - adjusted_temporal) * 
                            cdp) * td);
        } else { return temp; }
    } else { return base; }
}

function switcher(t, e) {
    /** Switches Temporal and Environment Metrics On and Off.
     *
     * You should use this function instead of changing those
     * values manually.  The rules are:
     * - both could be off at the same time;
     * - Temporal could be on and Environment off; and
     * - Temporal is always on when Environment is on.
     *
     * Example
     * switcher(false, true)
     * Will turn on both variables because you can't
     * calculate Environmental metrics without the
     * Temporal ones.
     */
    if (e) {
        this.switchboard[0] = true;
        this.switchboard[1] = true;
    } else if (t) {
        this.switchboard[0] = true;
        this.switchboard[1] = false;
    } else {
        this.switchboard[0] = false;
        this.switchboard[1] = false;
    }
}


/**
 * VECTOR FUNCTIONS
 */
function get_values(g) {
    /** Get appropriate values to vector according to user choices.
     *
     * This function will return an array of values according to
     * the current values on this.int_vector. 
     *
     * Uses this.table_values to get values and this.int_vector to
     * get user's choices.
     *
     * g - identifier of which group of metrics will be returned.
     *     Possible values are 0 (Base), 1 (Temp) and 2 (Envi).
     *
     * Returns an array whose length is the same as
     * this.int_vector[g], but instead of positions of the user's
     * choices, there are values to be used in CVSS v2 equations.
     */
    var a = [];
    
    if (g != 0 && g != 1 && g != 2) { throw "Invalid table index."; }

    for (var i=0; i < this.TABLE_VALUES[g].length; i++) {
        a.push(this.TABLE_VALUES[g][i][this.int_vector[g][i]]);
    }

    return a;
}

function get_strings(g) {
    /** Get appropriate strings to vector according to user choices.
     *
     * This function will return an array of strings according to
     * the current values on this.int_vector. 
     *
     * Uses this.table_values to get values and this.int_vector to
     * get user's choices.
     *
     * g - identifier of which group of metrics will be returned.
     *     Possible values are 0 (Base), 1 (Temp) and 2 (Envi).
     *
     * Returns an array whose length is the same as
     * this.int_vector[g], but instead of positions of the user's
     * choices, there are strings to be used in CVSS v2 vector.
     */
    var a = [];

    if (g != 0 && g != 1 && g != 2) { throw "Invalid table index."; }

    for (var i=0; i < this.TABLE_STRINGS[g].length; i++) {
        a.push(this.TABLE_STRINGS[g][i][this.int_vector[g][i]]);
    }
    
    return a;
}

function gen_vector() {
    /** Generates the vector according to user's choices.
     *
     * Uses get_strings() to transform user's choices to strings
     * and switcher() to figure out if Temporal and Environmental
     * metrics are needed in the output.
     *
     * Returns a string containing the vector.
     */
    var dstrs = get_strings(0),  // Default strings
        v = "";  // Vector to be returned

    v = "AV:" + dstrs[0] + "/AC:" + dstrs[1] + "/Au:" + dstrs[2] +
        "/C:" + dstrs[3] + "/I:" + dstrs[4] + "/A:" + dstrs[5];

    if (this.switchboard[0]) {
        dstrs = get_strings(1);
        v += "/E:" + dstrs[0] + "/RL:" + dstrs[1] + "/RC:" + dstrs[2];

        if (this.switchboard[1]) {
            dstrs = get_strings(2);
            v += "/CDP:" + dstrs[0] + "/TD:" + dstrs[1] +
                 "/CR:" + dstrs[2] + "/IR:" + dstrs[3] +
                 "/AR:" + dstrs[4];
        }
    }

    return v;
}

function translator(g, v) {
    /** Translates a split vector into an int vector.
     *
     * This function receives a split vector in a format like
     * ["AV:L", "AC:M", ..., "I:P"] (Base) and translates it
     * into a format accepted by this.int_vector.
     *
     * -g is the index of each group of metrics --0 Base, 1 Temp,
     *  2 Envi.
     * -v is the split array --as described above-- to be
     *  processed.
     * 
     * Returns an int array --Base, Temp or Envi-- acceptable by
     * this.int_vector.
     */
    var values = [],
        value = "";

    for (var i=0; i < v.length; i++) {
        value = v[i].replace(/^.*:/, "");

        for (var j=0; j < this.TABLE_STRINGS[g][i].length; j++) {
            if (this.TABLE_STRINGS[g][i][j] == value) {
                values.push(j);
            }
        }
    }

    return values;
}

function parser(v) {
    /** Parses a vector to fill this.int_vector.
     *
     * -v is a CVSS v2  vector like AV:L/AC:M/Au:N...
     *
     * The correct value to Authentication (Base), according
     * to CVSS v2 Guide, is Au.  This implementation uses AU
     * just to be case insensitive, which is better for the
     * user.
     *
     * Returns true or false for good or bad v.  If v is
     * good, this.int_vector will be updated with v's values.
     * Else, nothing happens.
     */
    v = v.toUpperCase();  // Case insensitive

    var bre = "^AV:(L|A|N)\/AC:(H|M|L)\/AU:(M|S|N)\/C:(N|P|C)\/I:(N|P|C)\/A:(N|P|C)$",
        tre = "\/E:(U|POC|F|H|ND)\/RL:(OF|TF|W|U|ND)\/RC:(UC|UR|C|ND)$",
        ere = "\/CDP:(N|L|LM|MH|H|ND)\/TD:(N|L|M|H|ND)\/CR:(L|M|H|ND)\/IR:(L|M|H|ND)\/AR:(L|M|H|ND)$",
        is_base = new RegExp(bre).exec(v),
        is_temp = new RegExp(bre.replace(/\$/, tre)).exec(v),
        is_envi = new RegExp(bre.replace(/\$/,
                                         tre).replace(/\$/, ere)).exec(v),
        spl_vector = [],  // Split vector
        ivector = [[0, 0, 0, 0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0, 0, 0]];

    if (! is_base && ! is_temp && ! is_envi) { return false; }

    spl_vector = v.split('/');

    // Processing Base choices
    ivector[0] = translator(0, spl_vector.slice(0, 6));

    if (is_temp) {  // Processing Temporal choices
        switcher(true, false);
        ivector[1] = translator(1, spl_vector.slice(6, 9));

    } else if (is_envi) {  // Processing Environmental choices
        switcher(true, true);
        ivector[1] = translator(1, spl_vector.slice(6, 9));
        ivector[2] = translator(2, spl_vector.slice(9, 14));
    }

    this.int_vector = ivector;
    return true;
}


/**
 * INTERFACE FUNCTIONS
 */
function set_radio(v) {
    /** Sets a radio button state.
     * Rules for values' pattern can be read in h_radios().
     */
    $("input[value=" + v + "]").attr("checked", true);
    $("input[value=" + v + "]").parent(".btn").addClass("active");
}

function set_radios(g) {
    /** Checks radio buttons according to some group of metrics.
     *
     * This function works just like set_radio(), but it changes
     * a group of radios instead of only one.
     *
     * The pattern to identify radio buttons is explained in
     * h_radios().
     *
     * -g is an identifier of which group of metrics will be used:
     *  0 for Base, 1 for Temporal or 2 for Environmental.
     */
    for (var i=0; i < this.int_vector[g].length; i++) {
        set_radio('r' + g + i + this.int_vector[g][i]);
    }
}

function reset() {
    /* Resets variables and interface. */
    this.int_vector[0] = [0, 0, 0, 0, 0, 0];  // Base
    this.int_vector[1] = [0, 0, 0];  // Temp
    this.int_vector[2] = [0, 0, 0, 0, 0];  // Envi
    switcher(false, false);

    set_radios(0);  // Base Metrics
    set_radios(1);  // Temporal Metrics
    set_radios(2);  // Environmental Metrics
}


/**
 * EVENT HANDLERS
 */
function h_radios() {
    /** Handler function for radio buttons.
     *
     * This handler is just an way to change the this.int_vector
     * values according to the user's choices using the radio
     * buttons.
     *
     * This function uses the values of the radio buttons to
     * figure out what was the user's choice.  So, these values
     * are standardized as:
     *  r<group><metric><value>
     * Where:
     *  -group: group of metrics --base, temp, envi.
     *  -metric: the metric itself --AV, AC, CDP...
     *  -value: a valid value for that metric --L, POC, H...
     * Example:
     *  r123: Radio button for Temporal, RL, Workaround. ;-)
     *
     * These values are defined in the HTML file.
     *
     *  IMPORTANT:
     *  Every items (group, metric, value) start from 0!
     *
     * Do not use 'this.var' here.  Use 'var' instead, because
     * this function is directly called inside $(document).ready(). 
     */
    var i = $(this).val(),
        g = parseInt(i[1]),  // Group of metrics --base, temp, envi
        m = parseInt(i[2]),  // Metric
        v = parseInt(i[3]);  // Value

    int_vector[g][m] = v;
    $("#score").text(calc());
    $("#vector").val(gen_vector());
}


/**
 * MAIN
 */
$(document).ready(function() {
    /* Do not use 'this.var' here.  Use 'var' instead. */
    // Base Metrics' Handlers
    // Names follow this pattern:
    // (R)adio(B)ase/(T)emporal/(E)nvironmental-<metric>
    // Ex: rb-av: Radiobuttons Base Access Vector
    $("input[name=rb-av]").on("change", h_radios);
    $("input[name=rb-ac]").on("change", h_radios);
    $("input[name=rb-au]").on("change", h_radios);
    $("input[name=rb-c]").on("change", h_radios);
    $("input[name=rb-i]").on("change", h_radios);
    $("input[name=rb-a]").on("change", h_radios);

    $("input[name=rt-e]").on("change", h_radios);  // Temporal Metrics
    $("input[name=rt-rl]").on("change", h_radios);
    $("input[name=rt-rc]").on("change", h_radios);

    $("input[name=re-cdp]").on("change", h_radios);  // Envi. Metrics
    $("input[name=re-td]").on("change", h_radios);
    $("input[name=re-cr]").on("change", h_radios);
    $("input[name=re-ir]").on("change", h_radios);
    $("input[name=re-ar]").on("change", h_radios);

    $("#temp-title").on("click", function() {
        switcher(! switchboard[0], false);
        $("#score").text(calc());
        $("#vector").val(gen_vector());
        
        if (! switchboard[0] && $("#envi-data").is(":visible")) {
            $("#envi-data").collapse("hide");
        }
    });

    $("#envi-title").on("click", function() {
        switcher(switchboard[0], ! switchboard[1]);
        $("#score").text(calc());
        $("#vector").val(gen_vector());

        if (! $("#temp-data").is(":visible")) {
            $("#temp-data").collapse("show");
        }
    });

    // Initializing Popovers (Bootstrap)
    $("#base-av").popover();
    $("#base-ac").popover();
    $("#base-au").popover();
    $("#base-c").popover();
    $("#base-i").popover();
    $("#base-a").popover();

    $("#temp-e").popover();
    $("#temp-rl").popover();
    $("#temp-rc").popover();

    $("#envi-cdp").popover();
    $("#envi-td").popover();
    $("#envi-cr").popover();
    $("#envi-ir").popover();
    $("#envi-ar").popover();

    // Initializing Tooltips (Bootstrap)
    $("#rb-av-l").tooltip();
    $("#rb-av-a").tooltip();
    $("#rb-av-n").tooltip();
    $("#rb-ac-h").tooltip();
    $("#rb-ac-m").tooltip();
    $("#rb-ac-l").tooltip();
    $("#rb-au-m").tooltip();
    $("#rb-au-s").tooltip();
    $("#rb-au-n").tooltip();
    $("#rb-c-n").tooltip();
    $("#rb-c-p").tooltip();
    $("#rb-c-c").tooltip();
    $("#rb-i-n").tooltip();
    $("#rb-i-p").tooltip();
    $("#rb-i-c").tooltip();
    $("#rb-a-n").tooltip();
    $("#rb-a-p").tooltip();
    $("#rb-a-c").tooltip();

    $("#rt-e-u").tooltip();
    $("#rt-e-poc").tooltip();
    $("#rt-e-f").tooltip();
    $("#rt-e-h").tooltip();
    $("#rt-e-nd").tooltip();
    $("#rt-rl-of").tooltip();
    $("#rt-rl-tf").tooltip();
    $("#rt-rl-w").tooltip();
    $("#rt-rl-u").tooltip();
    $("#rt-rl-nd").tooltip();
    $("#rt-rc-uc").tooltip();
    $("#rt-rc-ur").tooltip();
    $("#rt-rc-c").tooltip();
    $("#rt-rc-nd").tooltip();

    $("#re-cdp-n").tooltip();
    $("#re-cdp-l").tooltip();
    $("#re-cdp-lm").tooltip();
    $("#re-cdp-mh").tooltip();
    $("#re-cdp-h").tooltip();
    $("#re-cdp-nd").tooltip();
    $("#re-td-n").tooltip();
    $("#re-td-l").tooltip();
    $("#re-td-m").tooltip();
    $("#re-td-h").tooltip();
    $("#re-td-nd").tooltip();
    $("#re-cr-l").tooltip();
    $("#re-cr-m").tooltip();
    $("#re-cr-h").tooltip();
    $("#re-cr-nd").tooltip();
    $("#re-ir-l").tooltip();
    $("#re-ir-m").tooltip();
    $("#re-ir-h").tooltip();
    $("#re-ir-nd").tooltip();
    $("#re-ar-l").tooltip();
    $("#re-ar-m").tooltip();
    $("#re-ar-h").tooltip();
    $("#re-ar-nd").tooltip();

    // Processing URI parameters --if some
    if (! window.location.search) {
        reset();  // No parameters
    } else {
        parser(window.location.search.replace(/^\?v=/, ""));
        $("#score").text(calc());
        $("#vector").val(gen_vector());
        set_radios(0);
        set_radios(1);
        set_radios(2);

        if (switchboard[1]) {
            $("#temp-data").collapse("show");
            $("#envi-data").collapse("show");
        } else if (switchboard[0]) {
            $("#temp-data").collapse("show");
        }
    }
});
