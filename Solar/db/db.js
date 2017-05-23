"use strict";

var fs = require("fs");
var file = "db/data.db"; // file where db lives
var exists = fs.existsSync(file); //
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

function updateSpeed(speed, id)  {
  var ps = db.prepare("update planet set speed = ? where id= ?");
  ps.run(speed, id);
  ps.finalize();

}

//Solution adapted from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function updateDistance(dist, id)  {
  var ps = db.prepare("update planet set distance = ? where id= ?");
  ps.run(dist, id);
  ps.finalize();

}

function updateSize(size, id)  {
  var ps = db.prepare("update planet set p_size = ? where id= ?");
  ps.run(size, id);
  ps.finalize();

}

function updateColour(colour, id)  {
  var ps = db.prepare("update planet set colour = ? where id= ?");
  ps.run(colour, id);
  ps.finalize();

}

function addUser(id)  {
  var ps = db.prepare("insert into system values(?)");
  ps.run(id);
  ps.finalize();
}

module.exports = {
  //TODO maybe callback?
  insert: function (count, dist, p_size, speed, color, user)  {
    console.log("JUST IN case________________________");
    var ps1 = db.prepare("select id from planet where sys_id = ? and count = ?");
    ps1.get(user, count, ready);

    function ready(err, row){
      try{
        var ps3 = db.prepare("update planet set count = ?, distance = ?, p_size = ?, speed = ?, colour = ?, sys_id = ? where id = ?");
        ps3.run(count, dist, p_size, speed, color, user, row["id"]);
        ps3.finalize();
        console.log("TRY________________________");
      }catch(err){
        var ps2 = db.prepare("insert into planet (count, distance, p_size, speed, colour, sys_id) values(?,?,?,?,?,?)");
        ps2.run(count, dist, p_size, speed, color, user);
        ps2.finalize();
        console.log("CATCH________________________");
      }
    }

    /*test functions - all working
    updateSpeed(5, 1);
    updateDistance(5, 1);
    updateSize(5, 1);
    updateColour(5, 1);
    */
  },

  // TODO catch edge scenarios
  getplanet: function(execute, id)  {
    var ps = db.prepare("select * from planet where sys_id = ?");
    ps.all(id, ready);

    function ready(err, rows){
      var result = "";
      var i;
      for(i = 0; i<5; i++){
        result = result + rows[i]["distance"] + "&";
        result = result + rows[i]["p_size"] + "&";
        result = result + rows[i]["speed"] + "&";
        result = result + rows[i]["colour"] + "&";
      }
      execute(result);
    }
  },

  //Checks if user exists if no user generates a new user, returns id.
  checkUser: function(id, execute){
    var ps = db.prepare("select id from system where id = ?");
    ps.get(id, ready);

    function ready(err, row){
      var result = "";
      try{
        execute(result + row.id);
        console.log("USER EXISTS");
      }catch(err){
        console.log("DOES NOT EXIST");
        var id = generateUUID();
        addUser(id);
        execute(result + id);
      }
    }
  },

  //cleans the db on server re-start
  cleanDB : function()  {
    var ps = db.prepare("DELETE FROM planet");
    ps.run();
    ps.finalize();
    var ps2 = db.prepare("DELETE FROM system");
    ps2.run();
    ps2.finalize();
    var ps3 = db.prepare("VACUUM");
    ps3.run();
    ps3.finalize();
  }

};
