
var interval;
var tile_size = 5; // tile size is tile_size x tile_size pixels.
var width; // width in tiles of ant's world 
var height; // height in tiles of ant's world
var ant_x; // ant x coordinate, 0 to width-1
var ant_y;// ant y coordinate, 0 to height-1
var init_direction = 2; // ant orientation 0,1,2,3 
var ant_direction = init_direction;
var canvas;
var ctx;
var black_tile, white_tile;
var rule_array = [1,3]; // specifies the turn associated with each state.

var use_truchet = true; // false;
var use_lines = false;
use_lines = true;
var tr1, tr2;
var tr_a, tr_b, tr_c, tr_d;

var stateArray = [];
var white = [255,255,255,255];
var black = [0,0,0,255];
var blue = [0,0,255,255];
var yellow = [255,255,0,255];
var red = [255,0,0,255];
var green = [0,255,0,255];
var gray = [120,120,120,255]; 
var colors = [black,white,red,green,blue,yellow];
var truchet_color_array = [blue, yellow];

var color_tiles = [];
var colors_of_turns = [3,5,2,4]; // turn 1 (L) has color 5 (yellow), etc.
	
var n_steps = 0;

function plain_square(n){
    if(n == 1){ return [1]; }
    else if(n == 2){ return [1,1,1,1]; }
    else{ // n >= 3
	var array = [];
	for(var i=0; i<n; i++){
	    for(var j=0; j<n; j++){
		array.push((j == 0 || i == 0)? 0: 1);
	    }
	}
	return array;
    }
}

// obj represents a tile, a is an array holding integers 
// indicating the colors of the various pixels in the tile

function sta(a, color_array, obj){
	for(i = 0; i < obj.width * obj.height; i++){
		var j; // 4 bytes per pixel: rgba
		var rgba = color_array[a[i]];
		//		obj.data = rgba.slice();
		// obj.data.splice(4*i, 4, rgba);
		for(j = 0; j < 4; j++){
			obj.data[4*i + j] = rgba[j]; //obj.data[j+1] = obj.data[j+2] = a[i] ? 255 : 0;
		}
	}
	return obj;
}


function step(){
	// alert(['ant_x/y: ', ant_x, ant_y]);
// alert(rule_array);
// alert(['rule_array[0:2]: ', rule_array[0], '.', rule_array[1], '.', rule_array[2]]);
	// get present state of tile where ant is:
	var state = stateArray[ant_y][ant_x]; // present state of the tile

	// get the turn corresponding to this state:
	var turn = rule_array[state]; // turn is 0,1,2,3 - describes how much the ant turns

	// ant_direction is direction.   0: y increasing, 1: x increasing, etc.
	ant_direction = (ant_direction + turn) % 4 ; // Turn.  turn == 3 -> R, turn = 1 -> L, turn == 0 -> straigt, turn == 2 -> go back.

	// increment the state of this location.
	var new_state = (state + 1) % rule_array.length;
	stateArray[ant_y][ant_x] = new_state; // increment the state of this location.
	var new_turn = rule_array[new_state];

	// display the new state.
	var image_data;
	if(use_truchet){
		if(use_lines){
			if((ant_x + ant_y) % 2 == 0){
				image_data = (new_turn == 1) ?  tr1 : tr2;
			}else{
				image_data = (new_turn == 1) ?  tr2 : tr1;
			}
		}else{
			if((ant_x + ant_y) % 2 == 0){
				image_data = (new_turn == 1)? tr_a: tr_c;
			}else{
				image_data = (new_turn == 1)? tr_b: tr_d;
			}
		}
	}
	else{ // no truchet tiles
	image_data = color_tiles[colors_of_turns[new_turn]];
	}
	ctx.putImageData(image_data, ant_x * tile_size, ant_y * tile_size);

	// move the ant
	switch(ant_direction){
		case 0:
			ant_y++; // down
			break;
		case 1:
			ant_x++; // right
			break;
		case 2:
			ant_y--; // up
			break;
		case 3: 
			ant_x--; // left
			break;
		default:
			break;
	}
	// make it a torus
	if(ant_x < 0){ant_x += width}
	else if(ant_x >= width){ant_x -= width}
	if(ant_y < 0){ant_y += height}
	else if(ant_y >= height){ant_y -= height}
	n_steps++;
}
function marray(input, times){
	var k;
	for(k = 0; k < times; k++){
		ta3 = ta3.concat(input);
	}
	return ta3;
}

var bid;
	function pause(){
		clearInterval(interval)
			interval = undefined;
	}
function play(n_steps){
	//	interval = setInterval("step(); step(); step(); step(); step(); step(); step(); step(); step(); step()", 1);
	interval = setInterval(multistep, 1);
}
function load(x){
	if(dc && x === undefined){return}
	pause();
	canvas = document.getElementById("ac");
	if(x === undefined){
		canvas.height = window.innerHeight - 2*tile_size; // 22;// -  canvas.height % tile_size - 2;
		canvas.width = canvas.height;
		canvas.width -= canvas.width % tile_size;
		canvas.height -= canvas.height % tile_size;
		width = canvas.width / tile_size; // number of rows
		height = canvas.height / tile_size; // number of columns
	}else{
		canvas.width = width * tile_size;
		canvas.height = height * tile_size;
	}

	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, width * tile_size, height * tile_size);
	ant_direction = init_direction;
	ant_x = Math.floor(width/2); // start in middle
	ant_y = Math.floor(height/2);  // start in middle
	var cwa = new Array(width);
	var i;
	for(i = 0; i < cwa.length; i++){
		cwa[i] = 0;
	}
	stateArray = new Array(height);
	for(i = 0; i < stateArray.length; i++){
		stateArray[i] = cwa.slice();
		//	alert([stateArray[i]]);
	}
	var j;

	ctx = canvas.getContext("2d");


	if(tile_size == 4){
		tr1 = sta([
				1,0,1,1,
				0,1,1,1,
				1,1,1,0,
				1,1,0,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));
		tr2 = sta([
				1,1,0,1,
				1,1,1,0,
				0,1,1,1,
				1,0,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

if(0){
		tr1 = sta([
				0,0,1,1,
				0,1,1,0,
				1,1,0,0,
				1,0,0,1], truchet_color_array, ctx.createImageData(tile_size,tile_size));
		tr2 = sta([
				1,1,0,0,
				0,1,1,0,
				0,0,1,1,
				1,0,0,1], truchet_color_array, ctx.createImageData(tile_size,tile_size));
}

   		tr1 = sta([
                                0,1,1,0,
                                1,1,0,0,
                                1,0,0,1,
                                0,0,1,1], truchet_color_array, ctx.createImageData(tile_size,tile_size));
                tr2 = sta([
                                0,1,1,0,
                                0,0,1,1,
                                1,0,0,1,
                                1,1,0,0], truchet_color_array, ctx.createImageData(tile_size,tile_size));


		tr_a = sta([
				1,0,0,0,
				0,0,0,0,
				0,0,0,1,
				0,0,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_b = sta([
				0,0,0,1,
				0,0,0,0,
				1,0,0,0,
				1,1,0,0], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_c = sta([
				1,1,1,0,
				1,1,1,1,
				0,1,1,1,
				0,0,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_d = sta([
				0,1,1,1,
				1,1,1,1,
				1,1,1,0,
				1,1,0,0], truchet_color_array, ctx.createImageData(tile_size, tile_size));

	}else if(tile_size == 6){
		tr1 = sta([
				0,0,1,0,0,0,
				0,1,0,0,0,0,
				1,0,0,0,0,0,
				0,0,0,0,0,1,
				0,0,0,0,1,0,
				0,0,0,1,0,0], truchet_color_array, ctx.createImageData(tile_size,tile_size));

		tr2 = sta([
				0,0,0,1,0,0,
				0,0,0,0,1,0,
				0,0,0,0,0,1,
				1,0,0,0,0,0,
				0,1,0,0,0,0,
				0,0,1,0,0,0], truchet_color_array, ctx.createImageData(tile_size,tile_size));

    tr1 = sta([
                                0,0,1,1,0,0,
                                0,1,1,0,0,0,
                                1,1,0,0,0,0,
                                1,0,0,0,0,1,
                                0,0,0,0,1,1,
                                0,0,0,1,1,0], truchet_color_array, ctx.createImageData(tile_size,tile_size));

                tr2 = sta([
                                0,0,1,1,0,0,
                                0,0,0,1,1,0,
                                0,0,0,0,1,1,
                                1,0,0,0,0,1,
                                1,1,0,0,0,0,
                                0,1,1,0,0,0], truchet_color_array, ctx.createImageData(tile_size,tile_size));



		//tr2 = sta([], ctx.createImageData(tile_size, tile_size));
		// truchet tiles, white (1) to ant's R.
		// a: vert R
		// b: horiz R
		// c: vert L
		// d: horiz L
		tr_a = sta([ 
				1,1,0,0,0,0,
				1,0,0,0,0,0,
				0,0,0,0,0,0,
				0,0,0,0,0,1,
				0,0,0,0,1,1,
				0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_b = sta([
				0,0,0,0,1,1,
				0,0,0,0,0,1,
				0,0,0,0,0,0,
				1,0,0,0,0,0,
				1,1,0,0,0,0,
				1,1,1,0,0,0], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_c = sta([
				1,1,1,1,0,0,
				1,1,1,1,1,0,
				1,1,1,1,1,1,
				0,1,1,1,1,1,
				0,0,1,1,1,1,
				0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		tr_d = sta([
				0,0,1,1,1,1,
				0,1,1,1,1,1,
				1,1,1,1,1,1,
				1,1,1,1,1,0,
				1,1,1,1,0,0,
				1,1,1,0,0,0], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		// 
		fy_R = sta([
				1,1,1,0,0,0,1,1,1,
				1,1,0,0,0,0,0,1,1,
				1,0,0,0,0,0,0,0,1,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,
				1,0,0,0,0,0,0,0,1,
				1,1,0,0,0,0,0,1,1,
				1,1,1,0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

		fy_L = sta([
				1,1,1,0,0,0,1,1,1,
				1,1,1,1,0,1,1,1,1,
				1,1,1,1,1,1,1,1,1,
				0,1,1,1,0,1,1,1,0,
				0,0,1,0,0,0,1,0,0,
				0,1,1,1,0,1,1,1,0,
				1,1,1,1,1,1,1,1,1,
				1,1,1,1,0,1,1,1,1,
				1,1,1,0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));


		fy_B = sta([
				1,1,1,0,0,0,1,1,1,
				1,1,1,1,0,1,1,1,1,
				1,1,1,1,1,1,1,1,1,
				0,1,1,1,1,1,1,1,0,
				0,0,1,1,1,1,1,0,0,
				0,1,1,1,1,1,1,1,0,
				1,1,1,1,1,1,1,1,1,
				1,1,1,1,0,1,1,1,1,
				1,1,1,0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));


		fy_T = sta([
				1,1,1,0,0,0,1,1,1,
				1,1,1,0,0,0,1,1,1,
				1,1,1,0,0,0,1,1,1,
				0,0,0,1,1,1,0,0,0,
				0,0,0,1,1,1,0,0,0,
				0,0,0,1,1,1,0,0,0,
				1,1,1,0,0,0,1,1,1,
				1,1,1,0,0,0,1,1,1,
				1,1,1,0,0,0,1,1,1], truchet_color_array, ctx.createImageData(tile_size, tile_size));

	}
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, width * tile_size, height * tile_size);
	color_tiles = []; // empty the array
	var i; for(i in colors){
	    color_tiles.push(sta(plain_square(tile_size), [gray, colors[i]], ctx.createImageData(tile_size, tile_size)));
	}
	var colors_of_turns = [3,5,2,4]; // turn 1 (L) has color 5 (yellow), etc.

	for(i = 0; i < height; i++){
		var ipx = i * tile_size;
		for(j = 0; j < width; j++){
			var jpx = j * tile_size;
			if(! use_truchet){			  
			       ctx.putImageData(color_tiles[colors_of_turns[rule_array[0]]], ipx, jpx);
			}else{
				if((j + i) % 2 == 0){
					if(use_lines){
					    ctx.putImageData(tr1, ipx, jpx);         
					}else{
					    var tre = (rule_array[0] == 1)? tr_a: tr_c;
						ctx.putImageData(tre, ipx, jpx);
						
					}
				}else{
					if(use_lines){
						ctx.putImageData(tr2, ipx, jpx);
					}else{
					    var tro = (rule_array[0] == 1)? tr_b: tr_d;
					    						ctx.putImageData(tro, ipx, jpx);
					}}
			}}
	}

} // end of function load


function key_press_handler(ev_charCode){
    //  alert(['ev.charCode: ', ev_charCode]);
    if(ev_charCode == 32){	// space bar
		if(interval === undefined){
			play(10);
		}else{
			pause();
		}
	}
	else if(ev_charCode >= 49 && ev_charCode <= 57){ // 1-9
	//	if(interval !== undefined){pause()}
		for(i = 0; i < ev_charCode-48; i++){
			step();
		}
		//		}else{
		//			pause();
		//		}
}
}

var dc = false;
function multistep(){
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step(); 
}

function uv(){ // implement changed values of tile_size, width, height?
	var rule_string = document.getElementById("rstr").value;
	rule_array = rule_string.split("");
	var i;	
for(i in rule_array){
	rule_array[i] = parseInt(rule_array[i]);
}
	dc = true; // if true doesn't rest canvas on resize.
	setTimeout(changable, 60000);
	load(true);
}
	

function set_tile_size(){
    var new_tile_size = document.getElementById("tilesize").value;
    tile_size = parseInt(new_tile_size);
    //   alert([new_tile_size, tile_size]);
    load(true);
}

function cycle_rule_string(){
    //  var rule_string = document.getElementById("rstr").value;
    // 	rule_array = rule_string.split("");
	var x = rule_array.shift();
	rule_array.push(x);

	var rule_string = rule_array.join('');
	document.getElementById("rstr").value = rule_string;
	dc = true; // if true doesn't rest canvas on resize.
	setTimeout(changable, 60000); // call changeable after 60000 milliseconds
	load(true);
}

function changable(){
	dc = false;
}
function amult(ar, t){
	var out = [];
	var i;
	for(i = 0; i < t; i++){
		out = out.concat(ar);
	}
	return out;
}

