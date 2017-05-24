"use strict"

var cookie = document.cookie;
var cpyCookie = (' '+cookie).slice(1);

function show(pNum)  {
  //to be ammended depending on what server returns
  if (document.cookie == cpyCookie && pNum >= 5) {
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
          var response = this.responseText;
          var split = response.split("&");
          document.cookie = split[0];
          show(split[1]);
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


  if (cookie.length < 1)  {
    alert("This site uses cookies to save your solar system, or something like this");
    cpyCookie = -1;
  }

  fetchCookie();

  document.getElementById("login").addEventListener('click', goSolar);
  document.getElementById("choosePlanet").addEventListener('click', goChoice);
}

addEventListener('load', setUp);
