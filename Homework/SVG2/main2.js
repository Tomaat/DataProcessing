/** main2.js
    Dataporcessing pset 3
    Lysanne van Beek
    10544259 **/

window.onload = function() {

    /*  changeColor takes a path ID and a color (hex value)
        and changes that path's fill color unless
        there is no data for that country */
    function changeColor(id, color) {
        var h = document.getElementById(id);
        if (h != null) {
            h.setAttribute('fill', color);
        }
    }
    var string_data = document.getElementById("rawdata").value;
    
    // create a javascript object
    var obj = JSON.parse(string_data);

    // create a dictionary which contains the countries and corresponding codes
    var country_to_code = {};
    for (var j = 0, len = obj.codes.length; j < len; j++) {
        var country_name = obj.codes[j][2];
        var country_code = obj.codes[j][0];
        country_to_code[country_name] = country_code;
    }

    // select countries and population from the points object
    for (var i = 0, l = obj.points.length; i < l; i++) {
        var pop_int = parseInt(obj.points[i].Population);
        var coun = obj.points[i].Country;
        
        // select the corresponding country code
        var coun_code = country_to_code[coun];

        // fill country with certain colour, depending on population size
        if (pop_int < 100000) {
            changeColor(coun_code, '#ffffb2');
        } else if (pop_int > 100000 && pop_int < 1000000) {
            changeColor(coun_code, '#fed976');
        } else if (pop_int > 1000000 && pop_int < 5000000) {
            changeColor(coun_code,  '#feb24c');
        } else if (pop_int > 5000000 &&  pop_int < 10000000) {
            changeColor(coun_code, '#fd8d3c');
        } else if (pop_int > 10000000 && pop_int < 20000000) {
            changeColor(coun_code, '#fc4e2a');
        } else if (pop_int > 20000000 && pop_int < 50000000) {
            changeColor(coun_code, '#e31a1c');
        } else if (pop_int > 50000000) {
            changeColor(coun_code, '#b10026');
        }
    }
}