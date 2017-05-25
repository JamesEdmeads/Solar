/*
  Javascript for the landing page. On load checks whether the user has already
  been on the site (stored as a cookie) and whether they have already made
  a solar system, by querying the database. Depending on response will display
  different options to the user
*/

"use strict"

var id = sessionStorage.getItem('id');
var cpyId = (' '+id).slice(1);

//sends copy of the cookie to the server for the database to check
function fetchId(){

    var q = new XMLHttpRequest();
    q.open("GET", "check?" + cpyId, true);
    q.onreadystatechange = insertId;
    q.send();

}


//deals with server reponse: sets document cookie and passes value of planet
//count to show function
function insertId(){

    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        var split = response.split("&");
        sessionStorage.setItem('id', split[0]);
        show(split[1]);
  }

}

//called when server has sent a reponse and changes what elements appear on screen
function show(pNum)  {

    if (sessionStorage.getItem('id') == cpyId && pNum >= 5) {
        document.getElementById('login').style.display = 'block';
    }
    document.getElementById('choosePlanet').style.display = "block";

}

//re-directs to the solar system page
function goSolar()  {

    window.location.href = "https://localhost:8080/solar.html";

}

//re-directs to the planet choice page
function goChoice()  {

    window.location.href = "https://localhost:8080/choice.html";

}

//closes modal for cookie warning
function close()  {

    this.parentNode.parentNode.style.display = 'none';

}

//Main set up function: if cookie has not yet been set will display alert,
//calls the function to check the cookie and adds event listeners for the
//buttons
function setUp()  {

    if (id == null || id.length < 1)  {
        document.getElementById('modContent').style.display = "block";
        cpyId = -1;
    }

    fetchId();

    document.getElementById("login").addEventListener('click', goSolar);
    document.getElementById("choosePlanet").addEventListener('click', goChoice);
    document.getElementById('X').addEventListener('click', close);

}

addEventListener('load', setUp);
