/** d3lineExtended.js
    Dataprocessing pset 6
    Lysanne van Beek
    10544259 
    
	Based on:	http://bl.ocks.org/anupsavvy/9513382
				http://www.frankcleary.com/making-an-interactive-line-graph-with-d3-js/
				
**/
window.onload = function() {
    
	// define the canvas
    var svg = d3.select("svg"),
        margin = {top: 50, right: 130, bottom: 50, left: 50},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
            
    // parse the dates
    var	parseDate = d3.time.format("%Y%m%d").parse;
     
    // set the ranges
    var	x = d3.time.scale().range([0, width]);
    var	y = d3.scaleLinear().range([height, 0]);
     
    // define the axes
    var	xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);
     
    var	yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(7);
     
    // define the lines
    var	valueline0 = d3.svg.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.Maximum_temperature); });
        
    var	valueline1 = d3.svg.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.Average_temperature); });
        
    var	valueline2 = d3.svg.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y(d.Minimum_temperature); });
     
    // add the svg canvas
    var	svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// on click, update with new data			
	d3.selectAll(".m")
		.on("click", function() {
			svg[0][0].innerHTML = "";
			
			var date = this.getAttribute("value");

			// load data depending on which year is clicked
			var str;
			if(date == "1995"){
				str = "hoorn_1995.json";
			}else if(date == "2015"){
				str = "hoorn_2015.json";
			}
		
		// get the data
		d3.json(str, function(error, data) {
			data.forEach(function(d) {
				d.Date = parseDate(d.Date);
				d.Maximum_temperature = d.Maximum_temperature / 10;
				d.Average_temperature = d.Average_temperature / 10;
				d.Minimum_temperature = d.Minimum_temperature / 10;
			});

			// scale the range of the data
			x.domain(d3.extent(data, function(d) { return d.Date; }));
			y.domain([0, d3.max(data, function(d) { return Math.max(d.Maximum_temperature, d.Average_temperature, d.Minimum_temperature); }) + 2]);

			// add the valueline path for each line
			svg.append("path")		
				.attr("class", "line")
				.style("stroke", "green")
				.attr("d", valueline0(data));

			svg.append("path")		
				.attr("class", "line")
				.style("stroke", "red")
				.attr("d", valueline1(data));
				
			svg.append("path")		
				.attr("class", "line")
				.style("stroke", "steelblue")
				.attr("d", valueline2(data));
			 
			// add the x axis and x-label
			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)
			
			.selectAll("text")
			  .attr("y", 9)
			  .attr("x", 9)
			  .attr("dy", ".35em")
			  .attr("transform", "rotate(45)")
			  .style("text-anchor", "start");
			
			svg.append("text")
			  .attr("class", "xlabel")
			  .attr("text-anchor", "middle")
			  .attr("x", width / 2)
			  .attr("y", height + margin.bottom)
			  .text("October " + date);

			// add the y axis and y-label
			svg.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(0,0)")
			  .call(yAxis);
			
			svg.append("text")
			  .attr("class", "ylabel")
			  .attr("y", 0 - margin.left)
			  .attr("x", 0 - (height / 2))
			  .attr("dy", "1em")
			  .attr("transform", "rotate(-90)")
			  .style("text-anchor", "middle")
			  .text("Temperature (in degrees Celcius)");

			 // add graphtitle
			svg.append("text")
			  .attr("class", "graphtitle")
			  .attr("y", 0)
			  .attr("x", width/2)
			  .style("text-anchor", "middle")
			  .text("Maximum, average and minimum temperature (in d Celcius) per day in October " + date +  " in Hoorn");
			 
			 // add the labels at the end of each line
			svg.append("text")
				.attr("transform", "translate(" + (width + 3) + "," + y(data[0].Maximum_temperature) + ")")
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", "green")
				.text("Maximum temperature");

			svg.append("text")
				.attr("transform", "translate(" + (width + 3) + "," + y(data[0].Average_temperature) + ")")
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", "red")
				.text("Average temperature");
				
			svg.append("text")
				.attr("transform", "translate(" + (width + 3) + "," + y(data[0].Minimum_temperature) + ")")
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", "steelblue")
				.text("Minimum temperature");
				
			// add mouseover tip 1
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([120, 40])
				.html(function(d) {
					return "Date: "+ d.Date + "<br><strong>Average temperature: " + d.Average_temperature + " degrees Celcius</strong>";
				});

			svg.call(tip);
			
			svg.selectAll(".dot")
			  .data(data)
			  .enter().append("circle")
			  .attr('class', 'datapoint')
			  .attr('cx', function(d) { return x(d.Date); })
			  .attr('cy', function(d) { return y(d.Average_temperature); })
			  .attr('r', 6)
			  .attr('fill', 'white')
			  .attr('stroke', 'red')
			  .attr('stroke-width', '3')
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide);
			  
			// add mouseover tip 2
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([120, 40])
				.html(function(d) {
					return "Date: "+ d.Date + "<br><strong>Maximum temperature: " + d.Maximum_temperature + " degrees Celcius</strong>";
				});

			svg.call(tip);
			
			svg.selectAll(".dot")
			  .data(data)
			  .enter().append("circle")
			  .attr('class', 'datapoint')
			  .attr('cx', function(d) { return x(d.Date); })
			  .attr('cy', function(d) { return y(d.Maximum_temperature); })
			  .attr('r', 6)
			  .attr('fill', 'white')
			  .attr('stroke', 'green')
			  .attr('stroke-width', '3')
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide);
			
			// add mouseover tip 3
			  var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([120, 40])
				.html(function(d) {
					return "Date: "+ d.Date + "<br><strong>Minimum temperature: " + d.Minimum_temperature + " degrees Celcius</strong>";
				});

			svg.call(tip);
			
			svg.selectAll(".dot")
			  .data(data)
			  .enter().append("circle")
			  .attr('class', 'datapoint')
			  .attr('cx', function(d) { return x(d.Date); })
			  .attr('cy', function(d) { return y(d.Minimum_temperature); })
			  .attr('r', 6)
			  .attr('fill', 'white')
			  .attr('stroke', 'steelblue')
			  .attr('stroke-width', '3')
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide);
        
		});
	});
}	