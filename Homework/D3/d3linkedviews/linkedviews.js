/** linkedviews.js
    Dataprocessing pset 7
    Lysanne van Beek
    10544259 
**/
window.onload = function() {

    // define values for pie plot
    var width = 700,
    height = 250,
    radius = 100;
    
    // make canvas for pie plot
    var svg = d3.select("#pie_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    console.log(svg)
    // on click, update with new data			
	d3.selectAll(".m")
		.on("click", function() {
			var date = this.getAttribute("value");

			// load data depending on which year is clicked
			var str;
			if(date == "2011"){
				str = "gdp_2011_0.csv";
			}else if(date == "2001"){
				str = "gdp_2001_0.csv";
			}
	
        d3.csv(str, function(error, data) {
            console.log(data);
            D3_data = {};
            
            for (var i = 0, len = data.length; i < len; i++)
            {
                // make data numbers
                data[i].GDP = +data[i].GDP;
                data[i].Education = +data[i].Education;
                data[i].Military = +data[i].Military;
                data[i].Health_care = +data[i].Health_care;
                data[i].Country_Name = data[i].Country_Name;
                
                // make an array containing the boundaries for GDP
                var limits = [0.0,1000, 5000,10000,20000,30000,40000,50000];
                
                // add fillKey with the appropriate key to data
                if (data[i].GDP >= limits[0] && data[i].GDP < limits[1]) {  data[i].fillKey = '0.0 - 1.0' }
                else if (data[i].GDP >= limits[1] && data[i].GDP < limits[2]) {  data[i].fillKey = '1.0 - 5.0' }
                else if (data[i].GDP >= limits[2] && data[i].GDP < limits[3]) {  data[i].fillKey = '5.0 - 10.0' }
                else if (data[i].GDP >= limits[3] && data[i].GDP < limits[4]) {  data[i].fillKey = '10.0 - 20.0' }
                else if (data[i].GDP >= limits[4] && data[i].GDP < limits[5]) {  data[i].fillKey = '20.0 - 30.0' }
                else if (data[i].GDP >= limits[5] && data[i].GDP < limits[6]) {  data[i].fillKey = '30.0 - 40.0' }
                else if (data[i].GDP >= limits[6] && data[i].GDP < limits[7]) {  data[i].fillKey = '40.0 - 50.0' }
                else if (data[i].GDP >= limits[7] ) {  data[i].fillKey = '50.0 +'; }
                
                // put the data in the required form
                D3_data[data[i].Country_Code] = data[i]
            }

            var map_container = document.getElementById('map_container');
                
            map_container.innerHTML = "";
            // make the map
            var map = new Datamap({
                scope: 'world',
                element: map_container,
                projection: 'mercator',
                height: 600,
                
                geographyConfig: {
                    borderWidth: 0.2,
                    borderColor: '#4F4F4F',

                    // make a tooltip containing the countries name + happiness level.
                    // the latter only shows if there is data for that country
                    popupTemplate: function(geography, data) {
                        if (!data) return '<div class="hoverinfo">' + geography.properties.name;
                        return '<div class="hoverinfo">' + geography.properties.name + '<br> GDP per capita:  <strong>' +  data.GDP + ' US $' + '</strong>';},
                    },  
                
                // list of colours corresponding to the fillKeys
                fills: {
                    '0.0 - 1.0': '#ffffcc',
                    '1.0 - 5.0': '#ffeda0',
                    '5.0 - 10.0': '#fed976',
                    '10.0 - 20.0': '#feb24c',
                    '20.0 - 30.0': '#fd8d3c',
                    '30.0 - 40.0': '#fc4e2a',
                    '40.0 - 50.0': '#e31a1c',
                    '50.0 +': '#b10026',
                    'no data': 'grey',
                    defaultFill: 'grey'
                },
                
                // put the data in the map
                data: D3_data,
                done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                pieplot(D3_data[geography.id]);
            });
        }
            })
            map.legend();
            
            pieplot(data[260]);
        })

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d.data.label + ": " + Math.round(d.data.value*100)/100 + " %";
            })
            
        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });
            
        svg.call(tip);

        function pieplot(datapoint) {
        	svg[0][0].innerHTML = "";
            data = [
                {'label':'Education', 'value': datapoint.Education, 'color': '#f7fcb9'}, 
                {'label':'Military', 'value': datapoint.Military, 'color': '#addd8e'}, 
                {'label':'Health_care', 'value': datapoint.Health_care, 'color': '#31a354'}];
            
          var g = svg.selectAll(".arc")
              .data(pie(data))
            .enter().append("g")
              .attr("class", "arc")
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

          g.append("path")
              .attr("d", arc)
              .attr("fill", function(d) { return d.data.color; });

          g.append("text")
              .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function(d) { return d.data.label; });
            
            // add graphtitle
            svg.append("text")
              .attr("class", "graphtitle")
              .attr("x", "0")
              .attr("y", "100")
              .style("text-anchor", "middle")
              .text("Percentage of GDP (" + (Math.round((datapoint.Education + datapoint.Military + datapoint.Health_care)*100)/100) + "% combined) spent on education, military and health care for " + datapoint.Country_Name);
        }
    });
}

