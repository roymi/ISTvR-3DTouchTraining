// Example of change method with a failure closure
// This structure can be used in any methods of Pressure
// The failure block will return with an "error" and message showing why the device doesn't support 3D Touch and Force Touch

/* Global variables */
/* Mobile application init */
var mobileApp = new Framework7();var $$=Dom7;var mainView=mobileApp.addView('.view-main',{dynamicNavbar:true});mobileApp.onPageInit('about',function(page){$$('.create-page').on('click',function(){createContentPage();});});var dynamicPageIndex=0;function createContentPage(){mainView.router.loadContent('<!-- Top Navbar-->'+'<div class="navbar">'+'  <div class="navbar-inner">'+'    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>'+'    <div class="center sliding">Dynamic Page '+(++dynamicPageIndex)+'</div>'+'  </div>'+'</div>'+'<div class="pages">'+'  <!-- Page, data-page contains page name-->'+'  <div data-page="dynamic-pages" class="page">'+'    <!-- Scrollable page content-->'+'    <div class="page-content">'+'      <div class="content-block">'+'        <div class="content-block-inner">'+'          <p>Here is a dynamic page created on '+ new Date()+' !</p>'+'          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>'+'        </div>'+'      </div>'+'    </div>'+'  </div>'+'</div>');return;}

/* Wrapper Height & Width */
var sh = $("#wrapper").height();
var sw = $("#wrapper").width();
console.log("Wrapper height and width: " + sw + "," + sh);

/* Default config parameters */
var num_points = 10;
var training_time = 15; /* In seconds */

var target_positions = [];
var target_force = [];

var user_positions = [];
var user_force = [];
var current_user_position = 0;
var current_user_force = 0;
var dist_th = 300;
var force_th = 0.3;

function configTraining(_num_points, _training_time) 
{
	if(typeof(_num_points) != "undefined" && _num_points !== null) {
	    num_points = _num_points;
	}
	if(typeof(_num_points) != "undefined" && _num_points !== null) {
	    training_time = _training_time;
	}
	console.log('Configuring new training with values: (N: ' + _num_points + ", D:" + _training_time + ")");
	
	/* Fills the target positions and force with random points */
	for(i=0; i<num_points; i++) 
	{
		tmp_x = Math.floor(Math.random() * sw);
		tmp_y = Math.floor(Math.random() * sh);
		tmp_force = Math.random();
		
		if (tmp_y < 50) tmp_y += 50; /* Considering the title */
		if (tmp_y > sh-50) tmp_y -= 50; /* Considering the title */
		if (tmp_x < 50) tmp_x += 50; /* Considering the max circle size */
		if (tmp_x > sw-50) tmp_x -= 50; /* Considering the max circle size */
		
		target_positions.push(new Point(tmp_x,tmp_y));
		target_force.push(tmp_force);
	}
	
	console.log(target_positions.toString());
}

function animate_circle(i)
{
	setTimeout(	function() { 
		console.log("Simulating target:("+ target_positions[i].x + "," + target_positions[i].y + ")");
		var bgc = jQuery.Color( "rgb(" + parseInt(Pressure.map(target_force[i], 0, 1, 108, 235)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 176, 121)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 67, 53)) +")");
		$("#el1").css('top', this.target_positions[i].y);
		$("#el1").css('left', this.target_positions[i].x);
		$("#el1").show();
		console.log(i);
		$("#el1").animate({
			transform: 'scale('+ (1+target_force[i]) +')',
			backgroundColor: bgc,
			opacity: '1',
		},Math.ceil(training_time/num_points)*1000*0.5);
		console.log('CurrUserPos:', current_user_position);
		if (current_user_position != 0) 
		{
			user_positions.push(current_user_position);
			user_force.push(current_user_force);
		}
		else 
		{
			user_positions.push(new Point(0,0));
			user_force.push(0);
		}
		console.log("User positions: " + user_positions.toString());
		console.log("User force: " + user_force.toString());
		$("#el1").animate({
			transform: 'scale(1)',
			duration: '2',
			opacity: '0',
			backgroundColor: '#6cb043'
		},300);
	 }, Math.ceil(training_time/num_points)*1000*i);
}

/* Score will be computed as percentage of points with distance closer than 50x50 pixels radius and close force (by 0.3) threshold */
function score()
{
	console.log("**** Computing Score ***");
	var score = 0; 
	var percent = 1/num_points;
	/* The first point dosen't count */
	user_positions.push(current_user_position);
	user_force.push(current_user_force);
	user_positions.shift();
	user_force.shift();
	console.log("User positions: " + user_positions.toString());
	console.log("Target positions: " + target_positions.toString());
	console.log("User force: " + user_force.toString());
	console.log("Target force: " + target_force.toString());
	for(i=0; i<num_points; i++) 
	{
		console.log(Point.distance(user_positions[i],target_positions[i]));
		if( user_positions[i].distance(target_positions[i]) < dist_th && Math.abs(user_force[i] - target_force[i]) < force_th ) 
		{
			score += percent;
		}
	}
	mobileApp.alert( Math.floor(score*100) + '%', 'Your training score is:');
}

function runTraining(_num_points, _training_time)
{
	configTraining(_num_points, _training_time);
	for(i=0; i<num_points; i++) 
	{
		animate_circle(i);
	}
	setTimeout( function() { score(); }, Math.ceil(_training_time/_num_points)*1000*_num_points)+3000;
}

Pressure.config({
  polyfill: true
});

$.pressureConfig({
  preventDefault: false
});

function setCurrUserPos(pos) {
	current_user_position = pos;
}

function setCurrUserForce(force) {
	current_user_force = force;
}

var circle = {
  start: function(event){
    console.log('start', event);
    $("#wrapper").append('<div class="element" id="cir" style="position: absolute; left:'+ (event.pageX - 38) +'px;top:'+ (event.pageY - 30) +'px;"></div>');
    setCurrUserPos(new Point(event.pageX-38,event.pageY-30));
  },

  change: function(force, event){
    $('#cir').css('-webkit-transform', 'scale(' + (1 + force) + ')');
    $('#cir').css('backgroundColor', "rgb(" + parseInt(Pressure.map(force, 0, 1, 108, 235)) + "," + parseInt(Pressure.map(force, 0, 1, 176, 121)) + "," + parseInt(Pressure.map(force, 0, 1, 67, 53)) +")");
	setCurrUserForce(force);
  },

  startDeepPress: function(event){
  },

  endDeepPress: function(){
  },

  end: function(){
    console.log('end');
    $('#cir').css('-webkit-transform', 'scale(1)');
    $("#cir").remove();
  },

  unsupported: function(){
    console.log(this);
    this.innerHTML = 'Your device / browser does not support this :(';
  }
}

Pressure.set(document.querySelectorAll('#wrapper'), circle, {polyfill: true});


$( document ).ready(function() {
    console.log( "ready!" );
	mobileApp.popup('.popup-training');
	$$('.popup-training').on('closed', function () 
	{
		console.log('Traing Popup is closed, starting training...');
		
		_num_points = !$("#training-points").val() ? num_points : $("#training-points").val();
		_training_time = !$("#training-duration").val() ? training_time : $("#training-duration").val();
		dist_th = !$("#training-dist-th").val() ? dist_th : $("#training-dist-th").val();
		force_th = !$("#training-force-th").val() ? force_th : $("#training-force-th").val();
	
		runTraining(_num_points, _training_time);
		
	}); 
	
	$("#training-new").click(function() {
		location.reload();
	});
	  
});
