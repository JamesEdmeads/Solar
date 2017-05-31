/*Script to run the solar system. This makes use of the threex.planets library
https://github.com/jeromeetienne/threex.planets by Jerome Etienne
The code has been adapted to work for our website and for styling purposes
(full details of changes in report)

This script on load sends the current user id to the server and retrieves
their solar system data from the database. It uses this data to create each
planets and displays these via a scene. It then runs an animation loop to update
each position on each frame
*/

"use strict";

//On startup, loads values from server
addEventListener('load', fetchId);

//2D array holds the values for each planet
//global variables needed for 3D planet library
var planetNum = 5;
var planets = createArray(planetNum);
var Sun;

//Creates 2D array filled with zeros.
function createArray(planetNum){

    var planets = [];
    for(var i = 0; i < planetNum; i++){
        var values = {speed:0, size:0, distance:0, colour:null};
        planets[i] = values;
    }

  return planets;
}


//sends current user id to server
function fetchId(){

    var q = new XMLHttpRequest();
    q.open("GET", "load?" + sessionStorage.getItem('id'), true);
    q.onreadystatechange = server;
    q.send();

}

//Gets data from the server, places data in array then calls main function loop
function server(){

     if (this.readyState === 4 && this.status === 200){
        var string=this.responseText;
        var attributes = string.split("&");
        var i, j = 0;

        for(i = 0; i < planetNum; i++){
            planets[i]["distance"] = attributes[j];
            planets[i]["size"] = attributes[j+1];
            planets[i]["speed"] = parseFloat(attributes[j+2]);
            planets[i]["colour"] = attributes[j+3];
            j += 4;
        }
        system();
     }

}

//re-directs back to initial page - called when title clicked on
function link()  {

    window.location.href = "../index.html";

}

//adds light to scene
function createLight(scene)  {

    var ambilight = new THREE.AmbientLight( 0x888888 );
	  scene.add( ambilight );

    var light	= new THREE.DirectionalLight( 0xcccccc, 1 );

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

}


//adapted from threex.planets library to provide sun glow
function addSunGlow(scene, Sun)  {

    var glowColor	= new THREE.Color('orange')

    for(var i = 0; i < 2; i++)  {
      var geometry = new THREE.SphereGeometry(0.5, 32, 32)
      geometry = Sun.geometry.clone()
	    var material = THREEx.createAtmosphereMaterial()
	    if(i === 1)  {
		    material.side	= THREE.BackSide
        material.uniforms.coeficient.value	= 0.1
        material.uniforms.power.value		= 10
	    }
	    material.uniforms.glowColor.value	= glowColor
	    var mesh	= new THREE.Mesh(geometry, material );
	    if(i === 0) mesh.scale.multiplyScalar(1.01);
	    else mesh.scale.multiplyScalar(2);
	    scene.add( mesh );
    }

}

//adds sun then sets up and adds each planet to an array and the scene
function addPlanets(scene)  {

    Sun = THREEx.Planets.createSun();
    scene.add(Sun);
    addSunGlow(scene, Sun);

    var solarSystem = []

    for(var i = 0; i < planetNum; i++)  {
        solarSystem[i] = THREEx.Planets.createPlanet(planets[i]["colour"]);
        solarSystem[i].scale.x = planets[i]["size"];
        solarSystem[i].scale.y = planets[i]["size"];
        solarSystem[i].scale.z = planets[i]["size"];
        solarSystem[i].position.x = 0;
        solarSystem[i].position.y = 0;
        solarSystem[i].position.z = 0;
        scene.add(solarSystem[i]);
    }

    return solarSystem;

}

//sets an array for each planets angle
function getAngles()  {

    var angles = [];
    for(var i = 0; i < planetNum; i++)  {
        angles[i] = 0;
    }

    return angles;
}

//sets up the renderer
function getRenderer()  {

    var renderer = new THREE.WebGLRenderer({
        antialias	: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMapEnabled	= true;

    return renderer;

}

//initiates camera, sets the position and adds to scene
function getCamera(scene)  {

    var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    //camera.position.set(0,6,0);
    camera.position.z = 2;
    scene.add(camera);

    return camera;

}

//Main loop function which calls all set up functions then runs main loop
function system()  {

    //set up functions
    document.getElementById('title').addEventListener('click', link);

    var renderer = getRenderer();
    var scene = new THREE.Scene();
    var camera	= getCamera(scene);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    createLight(scene);
    var systemPlanets = addPlanets(scene);
    var Angles = getAngles();
 	var updateFcts	= [];

 	//update functoions
    updateFcts.push(function(delta, now){
        for(var i = 0; i < planetNum; i++)  {
        systemPlanets[i].rotation.y += 3 * delta;

        }
        Sun.rotation.y += 1 * delta;
    });

    updateFcts.push(updatePlanets);
    function updatePlanets()  {
        for(var i = 0; i < planetNum; i++)  {
            systemPlanets[i].position.x = planets[i]["distance"] * Math.cos(Angles[i] * Math.PI / 180);
            systemPlanets[i].position.y = planets[i]["distance"] * Math.sin(Angles[i] * Math.PI / 180);
            Angles[i] += planets[i]["speed"];
        }
    }

    updateFcts.push(function(){
        renderer.render( scene, camera );
    });

    //animation loop
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
