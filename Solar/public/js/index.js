/*
  Javascript for the landing page. On load checks whether the user has already
  been on the site (stored as a cookie) and whether they have already made
  a solar system, by querying the database. Depending on response will display
  different options to the user
*/

"use strict"

var cookie = document.cookie;
var cpyCookie = (' '+cookie).slice(1);

//sends copy of the cookie to the server for the database to check
function fetchCookie(){

    var q = new XMLHttpRequest();
    q.open("GET", "check?" + cpyCookie, true);
    q.onreadystatechange = insertCookie;
    q.send();
  
}


//deals with server reponse: sets document cookie and passes value of planet
//count to show function
function insertCookie(){

    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        var split = response.split("&");
        document.cookie = split[0];
        show(split[1]);
  }
     
}

//called when server has sent a reponse and changes what elements appear on screen
function show(pNum)  {

    if (document.cookie == cpyCookie && pNum >= 5) {
        document.getElementById('login').style.display = 'block';
    }
    document.getElementById('choosePlanet').style.display = "block";

}

//re-directs to the solar system page
function goSolar()  {
   
    window.location.href = "http://localhost:8080/solar.html";

}

//re-directs to the planet choice page
function goChoice()  {

    window.location.href = "http://localhost:8080/choice.html";
  
}

//closes modal for cookie warning
function close()  {

    this.parentNode.parentNode.style.display = 'none';

}

//Main set up function: if cookie has not yet been set will display alert,
//calls the function to check the cookie and adds event listeners for the 
//buttons
function setUp()  {

    if (cookie.length < 1)  {
        document.getElementById('modContent').style.display = "block";
        cpyCookie = -1;
    }

    fetchCookie();

    document.getElementById("login").addEventListener('click', goSolar);
    document.getElementById("choosePlanet").addEventListener('click', goChoice);
    document.getElementById('X').addEventListener('click', close);
    
}

addEventListener('load', setUp);
