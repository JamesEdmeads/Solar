"use strict"

var cookie = document.cookie;
var cpyCookie = cookie;

function show()  {
  //to be ammended depending on what server returns
  if (cookie == cpyCookie) {
    document.getElementById('login').style.display = 'block';
  }
  document.getElementById('choosePlanet').style.display = "block";

}

function fetchCookie(){
  var q = new XMLHttpRequest();
  q.open("GET", "check?" + cpyCookie, true);
  q.onreadystatechange = insertCookie;
  q.send();
}

function insertCookie(){
  if (this.readyState == 4 && this.status == 200) {
          document.cookie = this.responseText;
          show();
     }
}

function goSolar()  {
  window.location.href = "http://localhost:8080/solar.html";

}

function goChoice()  {
  console.log("here");
  window.location.href = "http://localhost:8080/choice.html";
}

function setUp()  {
  alert("This site uses cookies to save your solar system, or something like this");

  if (cookie.length < 1)  {
    cpyCookie = -1;
  }

  fetchCookie();
  
  document.getElementById("login").addEventListener('click', goSolar);
  document.getElementById("choosePlanet").addEventListener('click', goChoice);
}

addEventListener('load', setUp);
