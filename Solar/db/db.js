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
  insert: function (dist, p_size, speed, color, user)  {
    var ps = db.prepare("insert into planet (distance, p_size, speed, colour, sys_id) values(?,?,?,?,?)");
    ps.run(dist, p_size, speed, color, user);
    ps.finalize();

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
      console.log("RETURNING SOMETHING", row.id);
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
