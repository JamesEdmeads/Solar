/* This handles all javascript on the choice page :
        sets up and monitors slider values
        records colour select changes
        records the current planet via session storage
        places all these values and session cookie into hidden form
        listens for help button clicks
        displays modals for help
        listens to modal being closed
        updates images according to count
*/

//reads values from drop-down colour menu and places value in hidden form
function ColourSel()  {

    "use strict";
    var value = document.getElementById('Colchoice');
    var text0 = value.options[value.selectedIndex].text;
    document.getElementById('col').value = text0;

}

//resets count in storage to 0 and re-directs users to index screen
function titleLink()  {

    "use strict";
    sessionStorage.setItem('cnt', 0);
    window.location.href = "../index.html";

}

//updates count when each planets details submitted, resets on 5 when system
//is shown
function inCount() {

    "use strict";
    var count = sessionStorage.getItem('cnt');
    count++;

    if(count >= 5){
        count = 0;
    }

    sessionStorage.setItem('cnt', count);

}

//unable to use strict with this function due to noUiSlider non-compatibility
//modified from noUiSlider library. Reference :
//https://refreshless.com/nouislider/

//creates each slider and adjusts values.
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

//called by listener on slider action. Takes value of each, modifies this
//for each planet attributes and records on hidden form
//modified from noUiSlider library : for reference see above
function actionSliders(arr)  {
    "use strict";

    //planet distance
    arr[0].noUiSlider.on('slide', function( values, handle) {
        var newvalue = values[handle];
        document.getElementById('orbdis').value = newvalue;
    });
    //planets size
    arr[1].noUiSlider.on('slide', function( values, handle) {
        var newvalue = values[handle];
        newvalue /= 5;
        newvalue = newvalue.toFixed(2);
        document.getElementById('plansize').value = newvalue;
    });
    //planet speed
    arr[2].noUiSlider.on('slide', function( values, handle) {
        var newvalue = values[handle];
        newvalue /= 20;
        newvalue = newvalue.toFixed(1);
        document.getElementById('spchange').value = newvalue;
    });

}

//adds event listeners to help buttons
function actionHelp(helpAll)  {

    "use strict";
    for(i = 0; i < helpAll.length; i++)  {
        helpAll[i].addEventListener('click', help);
    }

}

//displays help modal content when help buttons pressed
function help(event)  {

    "use strict";
    var modal = this.nextElementSibling;
    modal.style.display = "block";

}

//adds event listeners to modal closures
function actionFinish(fin)  {

    "use strict";
    for(i = 0; i < fin.length; i++)  {
        fin[i].addEventListener('click', stop);
    }

}

//when modal closure selected changes display to none to close
function stop(event)  {

    "use strict";
    var x = this.parentNode.parentNode;
    x.style.display = 'none';

}

//updates the session count, the picture that signifies the count, and the
//form button value
//places the count and user into the hidden form
function updateValues()  {

    "use strict";
    var count = sessionStorage.getItem('cnt');
    count++;
    document.getElementById('planetCount').value = count;

    updatePicture(count);

    if(count >= 5)  {
        document.getElementById('Go').value = "Show Solar System";
    }

    document.getElementById('user').value = sessionStorage.getItem('id');

}

//changes the planet count picture
function updatePicture(count)  {

    "use strict";
    var path = "images/progress";
    path = path+count+".png";
    document.getElementById('progress').src = path;

}


//main set up function, gets all needed elements to attach event listeners to
function setUp() {

    "use strict";
    //help buttons
    var OrbHelp = document.getElementById('orbitHelp');
    var ColourHelp = document.getElementById('colourHelp');
    var SizeHelp = document.getElementById('sizeHelp');
    var SpeedHelp = document.getElementById('speedHelp');

    //modal closures
    var finish0 = document.getElementById('X0');
    var finish1 = document.getElementById('X1');
    var finish2 = document.getElementById('X2');
    var finish3 = document.getElementById('X3');

    //sliders
    var SlideDis = document.getElementById('orbitDisSlide');
    var SlideSize = document.getElementById('planetSizeSlide');
    var SlideSpeed = document.getElementById('speedSlide');

    var allSliders = [SlideDis, SlideSize, SlideSpeed];
    var allHelp = [OrbHelp, ColourHelp, SizeHelp, SpeedHelp];
    var allFinish = [finish0, finish1, finish2, finish3];

    document.getElementById('Colchoice').addEventListener('change', ColourSel);
    document.getElementById('title').addEventListener('click', titleLink);
    document.getElementById('Go').addEventListener('click', inCount);

    createSliders(allSliders);
    actionSliders(allSliders);
    actionHelp(allHelp);
    actionFinish(allFinish);

    updateValues();

}

addEventListener('load', setUp);
