// Example of change method with a failure closure
// This structure can be used in any methods of Pressure
// The failure block will return with an "error" and message showing why the device doesn't support 3D Touch and Force Touch

/* Global variables */

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/* Wrapper Height & Width */
var sh = $("#wrapper").height();
var sw = $("#wrapper").width();
console.log("Wrapper height and width: " + sw + "," + sh);
var num_points = 10;
var training_time = 15; /* In seconds */
var target_positions = [];
var target_force = [];
var user_positions = [];
var user_force = [];

/* Filling the target positions and force with random points */
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

function animate_circle(i){
	setTimeout(	function() { 
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
		$("#el1").animate({
			transform: 'scale(1)',
			duration: '2',
			opacity: '0',
			backgroundColor: '#6cb043'
		},300);
	 }, Math.ceil(training_time/num_points)*1000*i);
	 
}

for(i=0; i<num_points; i++) 
{
	animate_circle(i);	
}

/*
var animation_sequence = "<style> 	#el1 {left: " + target_positions[0].x +"px; top: " + target_positions[0].y +"px; opacity: 0;}\n@-webkit-keyframes default {";
var percent = 1;
var percent_between = Math.floor((100 - 6*num_points)/ num_points);

animation_sequence += "1% { left: " + target_positions[0].x +"px; top: " + target_positions[0].y +"px; -webkit-transform: scale(1);background: #6cb043; opacity: 0; }\n";	

for(i=0; i<num_points; i++)	
{			
	percent += 5;
	animation_sequence += percent + "% { -webkit-transform: scale("+ (1+target_force[i]) +");background: rgb(" + parseInt(Pressure.map(target_force[i], 0, 1, 108, 235)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 176, 121)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 67, 53)) +"); opacity: 1; }\n"; 
	percent += 1;
	animation_sequence += percent + "% { left: " + target_positions[i].x +"px; top: " + target_positions[i].y +"px; -webkit-transform: scale("+ (1+target_force[i]) +");background: rgb(" + parseInt(Pressure.map(target_force[i], 0, 1, 108, 235)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 176, 121)) + "," + parseInt(Pressure.map(target_force[i], 0, 1, 67, 53)) +"); opacity: 0; }\n";
	percent += percent_between;
	if( i != num_points-1 )
	{
		animation_sequence += percent + "% { left: " + target_positions[i+1].x +"px; top: " + target_positions[i+1].y +"px; -webkit-transform: scale(1);background: #6cb043; opacity: 0; }\n";
	}
	else 
	{
		animation_sequence += percent + "% { left: " + target_positions[0].x +"px; top: " + target_positions[0].y +"px; -webkit-transform: scale(1);background: #6cb043; opacity: 0; }\n";	
	}
}
		animation_sequence += "100% { left: " + target_positions[0].x +"px; top: " + target_positions[0].y +"px; -webkit-transform: scale(1);background: #6cb043; opacity: 0; }\n";	


animation_sequence += "} .animation {-webkit-animation: default " + training_time + "s ease 0s infinite normal none; }</style>";

$("#animation_sequence").html(animation_sequence);
*/

Pressure.config({
  polyfill: true
});

$.pressureConfig({
  preventDefault: false
});

var circle = {
  start: function(event){
    console.log('start', event);
    $("#wrapper").append('<div class="element" id="cir" style="position: absolute; left:'+ (event.pageX - 38) +'px;top:'+ (event.pageY - 30) +'px;"></div>');
    //console.log('created circle on: '+event.pageX+ ' , ' + event.pageY);
    user_positions.push(new Point(event.pageX-38,event.pageY-30));
  },

  change: function(force, event){
    $('#cir').css('-webkit-transform', 'scale(' + (1 + force) + ')');
    $('#cir').css('backgroundColor', "rgb(" + parseInt(Pressure.map(force, 0, 1, 108, 235)) + "," + parseInt(Pressure.map(force, 0, 1, 176, 121)) + "," + parseInt(Pressure.map(force, 0, 1, 67, 53)) +")");

    //console.log('change', force);
  },

  startDeepPress: function(event){
    //console.log('start deep press', event);
  },

  endDeepPress: function(){
   // console.log('end deep press');
  },

  end: function(){
    console.log('end');
    $('#cir').css('-webkit-transform', 'scale(1)');
    $("#cir").remove();
    console.log("User positions: " + user_positions.toString());
  },

  unsupported: function(){
    console.log(this);
    this.innerHTML = 'Your device / browser does not support this :(';
  }
}

Pressure.set(document.querySelectorAll('#wrapper'), circle, {polyfill: true});

var mobileApp = new Framework7();var $$=Dom7;var mainView=mobileApp.addView('.view-main',{dynamicNavbar:true});mobileApp.onPageInit('about',function(page){$$('.create-page').on('click',function(){createContentPage();});});var dynamicPageIndex=0;function createContentPage(){mainView.router.loadContent('<!-- Top Navbar-->'+'<div class="navbar">'+'  <div class="navbar-inner">'+'    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>'+'    <div class="center sliding">Dynamic Page '+(++dynamicPageIndex)+'</div>'+'  </div>'+'</div>'+'<div class="pages">'+'  <!-- Page, data-page contains page name-->'+'  <div data-page="dynamic-pages" class="page">'+'    <!-- Scrollable page content-->'+'    <div class="page-content">'+'      <div class="content-block">'+'        <div class="content-block-inner">'+'          <p>Here is a dynamic page created on '+ new Date()+' !</p>'+'          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>'+'        </div>'+'      </div>'+'    </div>'+'  </div>'+'</div>');return;}


