"use strict";

//On startup, loads values from server. NOTE edge case access without preloading?
window.onload = server();

//2D array holds the values for each planet
var planetNum = 5;
var planets = createArray(planetNum);

//Creates 2D array filled with zeros.
function createArray(planetNum){
  var planets = []; //new Array is bad: https://www.w3schools.com/js/js_arrays.asp
  for(var i=0;i<planetNum;i++){
    var values = {speed:0, size:0, distance:0, colour:null};
    planets[i] = values;
  }

  return planets;
}

//Gets data from the server
function server(){

  var xmlhttp = new XMLHttpRequest();
  var string;
  xmlhttp.open("GET","http://localhost:8080/load", true);
  xmlhttp.onreadystatechange=function(){
     if (xmlhttp.readyState==4 && xmlhttp.status==200){
        string=xmlhttp.responseText;
        console.log("STRING", string);
        var attributes = string.split("&");

        planets[0]["distance"] = attributes[0];
        console.log("distance", planets[0]["distance"]);

        planets[0]["size"] = attributes[1];
        console.log("size", planets[0]["distance"]);

        planets[0]["speed"] = parseFloat(attributes[2]);
        console.log("speed", planets[0]["speed"]);

        planets[0]["colour"] = attributes[3];
        console.log("colour", planets[0]["colour"]);

        system();
     }
   }
   xmlhttp.send();

}

//The SolarSystem function
function system()  {

  var renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.shadowMapEnabled	= true;

	var updateFcts	= [];
	var scene	= new THREE.Scene();

  /////////////////////////////////////
  //		Camera Controls							//
  ///////////////////////////////////

	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.set(0,6,0);
	scene.add(camera); //not necessary?

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  /////////////////////////////////////
  //		Light Controls							//
  ///////////////////////////////////

  var ambilight	= new THREE.AmbientLight( 0x151515 );
	scene.add( ambilight );

  var light	= new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set(5,5,5);
  scene.add(light);
  light.castShadow	= true;
  light.shadowCameraNear	= 0.01;
  light.shadowCameraFar	= 15;
  light.shadowCameraFov	= 45;

  light.shadowCameraLeft	= -1;
  light.shadowCameraRight	=  1;
  light.shadowCameraTop	=  1;
  light.shadowCameraBottom= -1;

  light.shadowBias	= 0.001;
  light.shadowDarkness	= 0.2;

  light.shadowMapWidth	= 1024;
  light.shadowMapHeight	= 1024;

  /////////////////////////////////////
  //		added planet    						//
  ///////////////////////////////////

  var venusangle = 0;
  var earthangle = 0;
  var marsangle = 0;

  //Jupiter already allows for change of texture
  var jupiter	= THREEx.Planets.createJupiter(planets[0]["colour"]);

  var venus	= THREEx.Planets.createVenus();
  venus.scale.x = planets[0]["size"];
  venus.scale.y = planets[0]["size"];
  venus.scale.z = planets[0]["size"];
  venus.position.x = 0;
  venus.position.y = 0;
  venus.position.z = 0;

  var mars = THREEx.Planets.createMars();
  mars.scale.x = 0.25;
  mars.scale.y = 0.25;
  mars.scale.z = 0.25;
  mars.position.x = 0;
  mars.position.y = 0;
  mars.position.z = 0;

  var earth	= THREEx.Planets.createEarth();
  earth.scale.x = 0.4;
  earth.scale.y = 0.4;
  earth.scale.z = 0.4;
  earth.position.x = 0;
  earth.position.y = 0;
  earth.position.z = 0;

	scene.add(venus);
	scene.add(mars);
	scene.add(jupiter);
  scene.add(earth);

  updateFcts.push(function(delta, now){
		venus.rotation.x += 3 * delta;
	  mars.rotation.x += 4 * delta;
	});

  updateFcts.push(function(){
    venus.position.x = planets[0]["distance"] * Math.cos(venusangle * Math.PI / 180);
    venus.position.y = planets[0]["distance"] * Math.sin(venusangle * Math.PI / 180);
    mars.position.x = 2 * Math.cos(marsangle * Math.PI / 180);
    mars.position.y = 2 * Math.sin(marsangle * Math.PI / 180);
    earth.position.x = 3 * Math.cos(earthangle * Math.PI / 180);
    earth.position.y = 3 * Math.sin(earthangle * Math.PI / 180);

    venusangle += planets[0]["speed"];
    earthangle += 0.5;
    marsangle += 0.3;
  });

	/////////////////////////////////////
	//		render the scene						//
	///////////////////////////////////

	updateFcts.push(function(){
		renderer.render( scene, camera );
	});

	/////////////////////////////////
	//		loop runner							//
	///////////////////////////////
	var lastTimeMsec= null;
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
		lastTimeMsec	= nowMsec;
		// call each update function
		updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, nowMsec/1000);
		});
	});

}
