//event method passed and js should find event.target


function help(event)  {
  "use strict";
  var modal = this.nextElementSibling;
  console.log(modal)
  modal.style.display = "block";
}

function stop(event)  {
  "use strict";
  var x = this.parentNode.parentNode;
  x.style.display = 'none';
}

function actionSliders(arr)  {
  "use strict";

   arr[0].noUiSlider.on('slide', function( values, handle) {
      var newvalue = values[handle];
      document.getElementById('orbdis').value = newvalue;
    });
    //size
     arr[1].noUiSlider.on('slide', function( values, handle) {
      var newvalue = values[handle];
      newvalue /= 5;
      newvalue = newvalue.toFixed(2);
      document.getElementById('plansize').value = newvalue;
    });
     //speed
     arr[2].noUiSlider.on('slide', function( values, handle) {
      var newvalue = values[handle];
      newvalue /= 20;
      newvalue = newvalue.toFixed(1);
      document.getElementById('spchange').value = newvalue;
    });

}

//unable to use strict with this function due to noUiSlider non-compatibility
function createSliders(arr)  {

  for(i = 0; i < arr.length; i++)  {
    arr[i].style.height = '20px';
    arr[i].style.width = '30%';
    noUiSlider.create(arr[i], {
      start: [ 0, ], // Handle start position
      margin: 20, // Handles must be more than '20' apart
      direction: 'ltr', // Put '0' at the bottom of the slider
      orientation: 'horizontal', // Orient the slider vertically
      behaviour: 'tap-drag', // Move handle on tap, bar is draggable
      range: { // Slider can select '0' to '10'
        'min': 1,
        'max': 10
      }
    });
    arr[i].firstElementChild.value = 1;
  }
  arr[1].firstElementChild.value = 0.2;
  arr[2].firstElementChild.value = 0.1;

}

function actionHelp(helpAll)  {
  "use strict";
  for(i = 0; i < helpAll.length; i++)  {
      console.log(helpAll[i]);
    helpAll[i].addEventListener('click', help);
  }

}

function actionFinish(fin)  {
  "use strict";
  for(i = 0; i < fin.length; i++)  {

    fin[i].addEventListener('click', stop);
  }
}

function ColourSel()  {
  "use strict";
  console.log("before change" + document.getElementById('col').value)
  var value = document.getElementById('Colchoice');
  var text0 = value.options[value.selectedIndex].text;
  document.getElementById('col').value = text0;
  console.log("selected from drop down" + text0);
  console.log("in hidden file" + document.getElementById('col').value)
}

//updates session count and sets in the html form
function setCount()  {

  var count = sessionStorage.getItem('cnt');
  if(count > 5)  {
    sessionStorage.clear();
  }
  count++;
  document.getElementById('planetCount').value = count;
  sessionStorage.setItem('cnt', count);

}

function setUp() {
  "use strict";
  var OrbHelp = document.getElementById('orbitHelp');
  var ColourHelp = document.getElementById('colourHelp');
  var SizeHelp = document.getElementById('sizeHelp');
  var SpeedHelp = document.getElementById('speedHelp');

  var finish0 = document.getElementById('X0');
  var finish1 = document.getElementById('X1');
  var finish2 = document.getElementById('X2');
  var finish3 = document.getElementById('X3');

  var SlideDis = document.getElementById('orbitDisSlide');
  var Col = document.getElementById('Colchoice');
  var SlideSize = document.getElementById('planetSizeSlide');
  var SlideSpeed = document.getElementById('speedSlide');

  var valueInput = document.getElementById('value-input');

  var all = [SlideDis, SlideSize, SlideSpeed];
  var helpAll = [OrbHelp, ColourHelp, SizeHelp, SpeedHelp];
  var allFinish = [finish0, finish1, finish2, finish3];
  Col.addEventListener('change', ColourSel);

  createSliders(all);
  actionSliders(all);
  actionHelp(helpAll);
  actionFinish(allFinish);

  //new to set count on form
  setCount();

}

addEventListener('load', setUp);
