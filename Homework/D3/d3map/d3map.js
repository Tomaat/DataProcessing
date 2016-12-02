/** d3map.js
    Dataprocessing pset 5
    Lysanne van Beek
    10544259 
**/
window.onload = function() {
	var string_data = document.getElementById("rawdata").value;
    
    // create a javascript object
    var obj = JSON.parse(string_data);

    // create a dictionary which contains the countries and corresponding codes
    var country_to_code = {};
    for (var j = 0, len = obj.codes.length; j < len; j++) {
        var country_name = obj.codes[j][2];
        var country_code = obj.codes[j][1];
        country_to_code[country_name] = country_code;
	}
	
	d3.csv("happiness_data.csv", function(error, data) {
		D3_data = {};
		
		for (var i = 0, len = data.length; i < len; i++)
        {
			// make Score a number
			data[i].Score = +data[i].Score;
			
			// get the country code from the dict
			data[i].Country_code = country_to_code[data[i].Country]
			
			// make an array containing the boundaries for Score
			var limits = [2.0,3.0,4.0,4.5,5.0,5.5,6.0,7.0];
			
			// add fillKey with the appropriate key to data
			if (data[i].Score >= limits[0] && data[i].Score < limits[1]) {  data[i].fillKey = '2.0 - 3.0' }
			else if (data[i].Score >= limits[1] && data[i].Score < limits[2]) {  data[i].fillKey = '3.0 - 4.0' }
			else if (data[i].Score >= limits[2] && data[i].Score < limits[3]) {  data[i].fillKey = '4.0 - 4.5' }
			else if (data[i].Score >= limits[3] && data[i].Score < limits[4]) {  data[i].fillKey = '4.5 - 5.0' }
			else if (data[i].Score >= limits[4] && data[i].Score < limits[5]) {  data[i].fillKey = '5.0 - 5.5' }
			else if (data[i].Score >= limits[5] && data[i].Score < limits[6]) {  data[i].fillKey = '5.5 - 6.0' }
			else if (data[i].Score >= limits[6] && data[i].Score < limits[7]) {  data[i].fillKey = '6.0 - 7.0' }
			else if (data[i].Score >= limits[7] ) {  data[i].fillKey = '7.0 +'; }
			
			// put the data in the required form
			D3_data[data[i].Country_code] = data[i]
		}
	
		// make the map
		var map = new Datamap({
			scope: 'world',
			element: document.getElementById('container1'),
			projection: 'mercator',
			height: 500,
			
			geographyConfig: {
				borderWidth: 0.2,
				borderColor: '#4F4F4F',

				// make a tooltip containing the countries name + happiness level.
				// the latter only shows if there is data for that country
				popupTemplate: function(geography, data) {
					if (!data) return '<div class="hoverinfo">' + geography.properties.name;
					return '<div class="hoverinfo">' + geography.properties.name + '<br> Happiness level:  <strong>' +  data.Score;'</strong>'},
				},  
			
			// list of colours corresponding to the fillKeys
			fills: {
				'2.0 - 3.0': '#ffffcc',
				'3.0 - 4.0': '#ffeda0',
				'4.0 - 4.5': '#fed976',
				'4.5 - 5.0': '#feb24c',
				'5.0 - 5.5': '#fd8d3c',
				'5.5 - 6.0': '#fc4e2a',
				'6.0 - 7.0': '#e31a1c',
				'7.0 +': '#b10026',
				'no data': 'grey',
				defaultFill: 'grey'
			},
			
			// the data put in the map
			data: D3_data
		})
		map.legend();
	})
}
