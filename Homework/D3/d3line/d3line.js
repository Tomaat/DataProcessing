/** d3line.js
    Dataprocessing pset 6
    Lysanne van Beek
    10544259 
**/

queue()
	.defer(d3.json, 'hoorn_1995.json')
	.defer(d3.json, 'hoorn_2015.json')
	.await();
