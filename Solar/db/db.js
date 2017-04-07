//"use strict";

var fs = require("fs");
var file = "db/data.db"; // file where db lives
var exists = fs.existsSync(file); //
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
var result = [];

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

function show(err, row)  {
  if(err) throw err;
  console.log(row);
  result.push(row.distance);
  result.push(row.p_size);
  result.push(row.speed);
  result.push(row.colour);
  for (var i = 0; i < result.length; i++) {
    console.log(result[i]);
  }

}



module.exports = {
  insert: function (planet, dist, p_size, speed, color, user)  {  
    var ps = db.prepare("insert into planet values(?,?,?,?,?,?)");
    ps.run(planet,dist, p_size, speed, color, user);
    ps.finalize();
    addUser(user); //should this be here or seperate?
    
    /*test functions - all working
    updateSpeed(5, 1);
    updateDistance(5, 1);
    updateSize(5, 1);
    updateColour(5, 1);
    */
  },
  
        //NOT NEEDED : only make new user currently when adding a new planet
/*insertuser : function(id)  {
     
    var ps = db.prepare("insert into system values(?)");
    ps.run(id);
    ps.finalize();
},*/
     
  getplanet: function()  {
  
    var sql = ("select * from planet where id = 1");
    db.each(sql, show);
    function ready(err, row) { return result; }
    //return result;
    
    
    
    /*var ps = db.prepare("select * from planet join system on system.id = planet.sys_id WHERE system.id = ? AND planet.sys_id = ?");
    ps.run(user, plan_id);
    ps.finalize();*/
  }

};

