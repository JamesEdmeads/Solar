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
  insert: function (planet, dist, p_size, speed, color, user)  {
    var ps = db.prepare("insert into planet values(?,?,?,?,?,?)");
    ps.run(planet,dist, p_size, speed, color, user);
    ps.finalize();

    /*test functions - all working
    updateSpeed(5, 1);
    updateDistance(5, 1);
    updateSize(5, 1);
    updateColour(5, 1);
    */
  },

  getplanet: function(execute)  {
    db.get("select * from planet where id = 1", ready);

    function ready(err, row){
      var result = "";
      result = result + row.distance + "&";
      result = result + row.p_size + "&";
      result = result + row.speed + "&";
      result = result + row.colour;
      execute(result);
    }
  }

};
