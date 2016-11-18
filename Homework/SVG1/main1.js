/* 	Main1.js
	Dataprocessing pset 3
	Lysanne van Beek
	10544259 */

/* use this to test out your function */
window.onload = function() {
 	changeColor('pl', 'red');
	changeColor('it', 'pink')
	changeColor('ie', 'purple')
	changeColor('mk', 'orange')
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    h = document.getElementById(id);
	h.setAttribute('fill', color);
}

