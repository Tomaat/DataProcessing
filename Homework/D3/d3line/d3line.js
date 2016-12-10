/** d3line.js
    Dataprocessing pset 6
    Lysanne van Beek
    10544259 
    
	Based on: 	http://www.frankcleary.com/making-an-interactive-line-graph-with-d3-js/
				http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
				http://bl.ocks.org/mbostock/3883245
**/
window.onload = function() {
    
	// create the canvas
    var svg = d3.select("svg"),
        margin = {top: 30, right: 20, bottom: 50, left: 50},
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
     
    // define the line
    var	valueline = d3.svg.line()
        .x(function(d) { return x(d.sDate); })
        .y(function(d) { return y(d.Average_temperature); });
        
    // add the svg canvas
    var	svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
    // get the data
    d3.json("hoorn_1995.json", function(error, data) {
        data.forEach(function(d) {
            d.sDate = parseDate(d.Date);
            d.Average_temperature = d.Average_temperature / 10;
        });
     
        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.sDate; }));
        y.domain([0, d3.max(data, function(d) { return d.Average_temperature; }) + 2]);
     
        // add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));
     
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
          .text("October 1995");

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
          .text("Temp (in degrees Celcius)");

        svg.append("text")
          .attr("class", "graphtitle")
          .attr("y", 10)
          .attr("x", width/2)
          .style("text-anchor", "middle")
          .text("Average temperature (in d Celcius) per day in October 1995 in Hoorn");
         
        // mouseover tip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([120, 40])
            .html(function(d) {
                return "Date: "+ d.sDate + "<br><strong>Average temperature: " + d.Average_temperature + " degrees Celcius</strong>";
            });

        svg.call(tip);
        
		// add mouseover tip
        svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr('class', 'datapoint')
          .attr('cx', function(d) { return x(d.sDate); })
          .attr('cy', function(d) { return y(d.Average_temperature); })
          .attr('r', 6)
          .attr('fill', 'white')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', '3')
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
        
        
    });
}