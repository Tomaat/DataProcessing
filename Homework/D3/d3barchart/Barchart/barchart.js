/** barchart.js
    Dataporcessing pset 4
    Lysanne van Beek
    10544259 
**/
	
window.onload = function() {

	// set width and height of canvas
	var margin = {top: 20, right: 20, bottom: 70, left: 40},
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// set the ranges
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
	var y = d3.scale.linear().range([height, 0]);

	// make x and y axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5);

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Amount of sunshine:</strong> <span style='color:red'>" + d.Amount_of_sunshine + "</span> <strong>hours</strong>";
		})
		
	// make svg
	var svg = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	svg.call(tip);

	// load the data
	d3.json("../data2_hupsel.json", function(error, data) {

	data.forEach(function(d) {
		d.Date = d.Date;
		d.Amount_of_sunshine = +d.Amount_of_sunshine;
	});

	// scale the range of the data
	x.domain(data.map(function(d) { return d.Date; }));
	y.domain([0, d3.max(data, function(d) { return d.Amount_of_sunshine; })]);

	// add x axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "0.5em")
		.attr("dy", "0.5em")
	
	svg.append("text")
		.attr("dx", "15em")
		.attr("dy", "15em")
		.style("text-anchor", "middle")
		.text("Days of the month");

	// add y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Amount of sunshine (in hours)");

	// add bar chart
	svg.selectAll("bar")
		.data(data)
	.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.Date); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.Amount_of_sunshine); })
		.attr("height", function(d) { return height - y(d.Amount_of_sunshine); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
	});
}