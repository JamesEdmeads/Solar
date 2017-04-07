"use strict";

window.onload = server();

//Attributes of Venus are changed here
var speed = 0;
var size = 0;
var distance = 0;
var colour = "blue";

//Runs automaticaly the SolarSystem when all data is stored.
// window.onload = onStart();

function server(){
   var xmlhttp = new XMLHttpRequest();
   var string;
   xmlhttp.open("GET","http://localhost:8080/load", true);
   xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           string=xmlhttp.responseText;
           console.log("STRING", string);
           var attributes = string.split("&");

           distance = attributes[0];
           console.log("distance", distance);
           size = attributes[1];
           console.log("size", size);
           speed = parseFloat(attributes[2]);
           console.log("speed", speed);
           colour = attributes[3];
           console.log("colour", colour);

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
  var jupiter	= THREEx.Planets.createSun();

  var venus	= THREEx.Planets.createJupiter(colour);
  venus.scale.x = size;
  venus.scale.y = size;
  venus.scale.z = size;
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
		venus.rotation.z += 3 * delta;
	  mars.rotation.z += 4 * delta;
	  earth.rotation.z += 1 * delta;
	  jupiter.rotation.z += 0.125 * delta;
	});

  updateFcts.push(function(){
    venus.position.x = distance * Math.cos(venusangle * Math.PI / 180);
    venus.position.y = distance * Math.sin(venusangle * Math.PI / 180);
    mars.position.x = 2 * Math.cos(marsangle * Math.PI / 180);
    mars.position.y = 2 * Math.sin(marsangle * Math.PI / 180);
    earth.position.x = 3 * Math.cos(earthangle * Math.PI / 180);
    earth.position.y = 3 * Math.sin(earthangle * Math.PI / 180);

    venusangle += speed;
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
