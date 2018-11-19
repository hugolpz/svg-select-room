/* ****************************************************** */
/* Get today rental status json for default today ******* */

/* ****************************************************** */
/* TOOLBOX ********************************************** */
var click = function() { console.log("hoy"); };
//Function to convert hex format to a rgb color
var rgb2hex = function (rgb){
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};



/* ****************************************************** */
/* NOT USED YET : UPDATE svg from API JSON ************** */
var update = function(svg,data){
	svg.selectAll('path')
		.data(data)
		.enter()
		.attr('class','selected')
		//.attr('x', function(d,i) { d.clicked=false; return 100+100*i; })
		//.attr('y', function(d,i) { return 0; })
		//.style('width', width + 'px')
		//.style('height',function(d,i) { return 20; })
		.attr('fill', function() { return 'red'; } )
		//.text(function(d){ return d;})
		;
};

/* ****************************************************** */
/* MASTER FUNCTION ************************************** */
var ready = function (error, res) {
	if (error) throw error;
	var xml  = res[0],
			currentRooms = res[1];

/* ****************************************************** */
/* Init svg with default (file) ************************* */
	d3.select("#hook1")
		.html(xml);
	
	var spaces = d3.select('svg')
			.attr('width', 300)
			.attr('height', null)
		.select('#spaces')
			.selectAll('path');

/* ****************************************************** */
/* UPDATE svg polygons color from data (local or API JSON */
	spaces.each(function() {
		// this = <path ...></path>
		var id = d3.select(this).attr("id"),
				roomData = currentRooms.filter(function (d){ return d.room==id; })[0] || {room:'others spaces', status:'n.a.'},
				color = roomData.status=="free"? "#AAFFAA" 
						: roomData.status=="taken"?"#FFBB88"
						: "#CCCCCC";
		// console.log('data',data);
		console.log('id',id);
		console.log('roomData',roomData);
		console.log('roomData.status',roomData.status);
		
		d3.select(this)
			.style('fill', color)
			.style("stroke", "white")
			.style("stroke-width", 3)
			//.on("click", function(){ click() })
			.on('click' , function(){ 
					var col = rgb2hex(d3.select(this).style('fill')).toUpperCase();
					col == "#AAFFAA"?
						d3.select(this).style('fill', "#FFBB88")
						:d3.select(this).style('fill', "#AAFFAA");
					console.log('click() on:',this.id,col);
				});
		});
	
};


/* ****************************************************** */
/* MASTER CALL ****************************************** */
d3.queue()
    .defer(d3.text, "./img/F20.svg") // get svg
    .defer(d3.json, "./js/rooms.json") // get data
    .awaitAll(ready); // runs all the script !
