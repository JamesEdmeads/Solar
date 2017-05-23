"use strict";

//On startup, loads values from server. NOTE edge case access without preloading?
addEventListener('load', fetchCookie);

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

function fetchCookie(){
  var q = new XMLHttpRequest();
  q.open("GET", "load?" + document.cookie, true);
  q.onreadystatechange = server;
  q.send();
}

//Gets data from the server
function server(){
     if (this.readyState==4 && this.status==200){
        var string=this.responseText;
        console.log("STRING", string);
        var attributes = string.split("&");
        var i, j = 0;
        for(i=0; i<5; i++){
          planets[i]["distance"] = attributes[j];
          planets[i]["size"] = attributes[j+1];
          planets[i]["speed"] = parseFloat(attributes[j+2]);
          planets[i]["colour"] = attributes[j+3];
          j += 4;
        }
        system();
     }
}

function link()  {
  window.location.href = "http://localhost:8080/landing.html";

}

//The SolarSystem function
function system()  {

  document.getElementById('title').addEventListener('click', link);
  
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

  var oneAngle = 0;
  var twoAngle = 0;
  var threeAngle = 0;
  var fourAngle = 0;
  var fiveAngle = 0;

  //Jupiter already allows for change of texture
  var jupiter	= THREEx.Planets.createJupiter(planets[0]["colour"]);

  var one	= THREEx.Planets.createJupiter(planets[0]["colour"]);
  console.log("one", planets[0]["size"]);
  one.scale.x = planets[0]["size"];
  one.scale.y = planets[0]["size"];
  one.scale.z = planets[0]["size"];
  one.position.x = 0;
  one.position.y = 0;
  one.position.z = 0;

  var two = THREEx.Planets.createJupiter(planets[1]["colour"]);
  console.log("two", planets[1]["size"]);
  two.scale.x = planets[1]["size"];
  two.scale.y = planets[1]["size"];
  two.scale.z = planets[1]["size"];
  two.position.x = 0;
  two.position.y = 0;
  two.position.z = 0;

  var three	= THREEx.Planets.createJupiter(planets[2]["colour"]);
  console.log("three", planets[2]["size"]);
  three.scale.x = planets[2]["size"];
  three.scale.y = planets[2]["size"];
  three.scale.z = planets[2]["size"];
  three.position.x = 0;
  three.position.y = 0;
  three.position.z = 0;

  var four	= THREEx.Planets.createJupiter(planets[3]["colour"]);
  console.log("four", planets[3]["size"]);
  four.scale.x = planets[3]["size"];
  four.scale.y = planets[3]["size"];
  four.scale.z = planets[3]["size"];
  four.position.x = 0;
  four.position.y = 0;
  four.position.z = 0;

  var five	= THREEx.Planets.createJupiter(planets[4]["colour"]);
  console.log("five", planets[4]["size"]);
  five.scale.x = planets[4]["size"];
  five.scale.y = planets[4]["size"];
  five.scale.z = planets[4]["size"];
  five.position.x = 0;
  five.position.y = 0;
  five.position.z = 0;

  scene.add(jupiter);
	scene.add(one);
	scene.add(two);
  scene.add(three);
  scene.add(four);
  scene.add(five);

  updateFcts.push(function(delta, now){
		one.rotation.x += 3 * delta;
	  two.rotation.x += 3 * delta;
    three.rotation.x += 3 * delta;
    four.rotation.x += 3 * delta;
    five.rotation.x += 3 * delta;
	});

  updateFcts.push(function(){
    one.position.x = planets[0]["distance"] * Math.cos(oneAngle * Math.PI / 180);
    one.position.y = planets[0]["distance"] * Math.sin(oneAngle * Math.PI / 180);
    two.position.x = planets[1]["distance"] * Math.cos(twoAngle * Math.PI / 180);
    two.position.y = planets[1]["distance"] * Math.sin(twoAngle * Math.PI / 180);
    three.position.x = planets[2]["distance"] * Math.cos(threeAngle * Math.PI / 180);
    three.position.y = planets[2]["distance"] * Math.sin(threeAngle * Math.PI / 180);
    four.position.x = planets[3]["distance"] * Math.cos(fourAngle * Math.PI / 180);
    four.position.y = planets[3]["distance"] * Math.sin(fourAngle * Math.PI / 180);
    five.position.x = planets[4]["distance"] * Math.cos(fiveAngle * Math.PI / 180);
    five.position.y = planets[4]["distance"] * Math.sin(fiveAngle * Math.PI / 180);

    oneAngle += planets[0]["speed"];
    twoAngle += planets[1]["speed"];
    threeAngle += planets[2]["speed"];
    fourAngle += planets[3]["speed"];
    fiveAngle += planets[4]["speed"];
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
