//event method passed and js should find event.target

//size : 0.1 - 2
//distance : 1 - 10
//speed : 0.1 - 0.5

function help0(event)  {
  "use strict";
  var modal = document.getElementById('OhelpModal');
   modal.style.display = "block";
}

function help1()  {
  "use strict";
  var modal = document.getElementById('ColorHelpMod');
  modal.style.display = "block";
}

function help2()  {
  "use strict";
  var modal = document.getElementById('SizeHelpMod');
  modal.style.display = "block";
}

function help3()  {
  "use strict";
  var modal = document.getElementById('SpeedHelpMod');
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

  /*for(i = 0; i < arr.length; i++)  {
    var x = arr[i].firstElementChild.value;
    console.log(x);
    arr[i].noUiSlider.on('slide', function( values, handle, x) {
      var newvalue = values[handle];
      console.log(newvalue);
      console.log(x);
      console.log(this);
      document.getElementById('orbdis').value = newvalue;
      document.getElementById('plansize').value = newvalue;
      document.getElementById('spchange').value = newvalue;
    });

  }*/

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

function actionFinish(fin)  {
  "use strict";
  for(i = 0; i < fin.length; i++)  {
    fin[i].addEventListener('click', stop);
  }
}

function ColourSel()  {
  "use strict";
  var value = document.getElementById('Colchoice');
  var text0 = value.options[value.selectedIndex].text;
  document.getElementById('col').value = text0;
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

  OrbHelp.addEventListener('click', help0);
  ColourHelp.addEventListener('click', help1);
  SizeHelp.addEventListener('click', help2);
  SpeedHelp.addEventListener('click', help3);

  Col.addEventListener('click', ColourSel);

  var allFinish = [finish0, finish1, finish2, finish3];

  createSliders(all);
  actionSliders(all);
  actionFinish(allFinish);


}

addEventListener('load', setUp);
