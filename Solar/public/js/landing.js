"use strict"

function show()  {
  //to be ammended depending on what server returns
  document.getElementById('login').style.display = 'block';
  document.getElementById('choosePlanet').style.display = "block";

}

function setUp()  {

  var cookie = document.cookie;
  alert("This site uses cookies to save your solar system, or something like this");

  if (cookie.length < 1)  {
    document.getElementById('checkBox').value = -1;
    console.log("-1"+document.getElementById('checkBox').value);

  }
  else {
    document.getElementById('checkBox').value = cookie;
    console.log("other"+document.getElementById('checkBox').value);
  }
  console.log(document.getElementById('checkBox').value);
  document.getElementById('form0').submit();
  
  //var connect;
  //checks for modern browser support
 // if(window.XMLHttpRequest)  {
   // connect = new XMLHttpRequest();
  //} 
  //for IE5 and IE6
  //else  {
    //connect = new ActiveXObject("Microsoft.XMLHTTP");
  //}
  //connect.open("GET", "http://localhost:8080/check" + "cookie", true);
  //connect.send();
  //TODO : this bit not working yet : not getting response back
  //console.onreadystatechange=function(){
    //if(connect.readystate==4 & connect.status==200) {
      //var string = connect.responseText;
      //console.log("string");
      //console.log("HERE");
    //}
 //}

//temp solution just to test the chnage in display : will use show dependent on what server returns
  document.addEventListener('click', show);
}

addEventListener('load', setUp);
