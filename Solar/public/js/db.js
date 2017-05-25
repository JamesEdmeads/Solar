/* Script to interact with the database, includes function for providing a
unique indentifier for each user. This module export functions do that these
can be called by the server
*/
"use strict";

var fs = require("fs");
var file = "db/data.db"; 
var exists = fs.existsSync(file); 
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);


//Solution adapted from: 
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
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

//simple internal function to add user to database
function addUser(id)  {

    var ps = db.prepare("insert into system values(?)");
    try{
        ps.run(id);
        ps.finalize();
        return "success";
    }catch(err){
        return "failure";
    }
  
}

//functions below exported for server use
module.exports = {

    //insert planet function. Selects planet by number and user id. If this 
    //exists will simply update, else failure to find is caught then planet
    //is added instead.
    insert: function (count, dist, p_size, speed, color, user)  {

        var ps1 = db.prepare("select id from planet where sys_id = ? and count = ?");
        ps1.get(user, count, ready);

        function ready(err, row){
            try{
                var ps3 = db.prepare("update planet set count = ?, distance = ?,"+
                " p_size = ?, speed = ?, colour = ?, sys_id = ? where id = ?");
                ps3.run(count, dist, p_size, speed, color, user, row["id"]);
                ps3.finalize();

            }catch(err){
                var ps2 = db.prepare("insert into planet (count, distance,"+
                " p_size, speed, colour, sys_id) values(?,?,?,?,?,?)");
                ps2.run(count, dist, p_size, speed, color, user);
                ps2.finalize();
            }
        }

    },    

    //selects planets from the database. If this fails (i.e there are no rows)
    //send fail message to be handled on client side
    getplanet: function(execute, id)  {
  
        var ps = db.prepare("select * from planet where sys_id = ?");
        ps.all(id, ready);

        function ready(err, rows){
            var result = "";
            try{
                var i;
                for(i = 0; i<5; i++){
                result = result + rows[i]["distance"] + "&";
                result = result + rows[i]["p_size"] + "&";
                result = result + rows[i]["speed"] + "&";
                result = result + rows[i]["colour"] + "&";
            }
            }catch(err){
                result = "fail";
            }
            execute(result);
        }
    
    },

    //Checks if user exists if no user generates a new user, returns id.
    checkUser: function(id, execute){
  
        var ps = db.prepare("select id, (select count(id) from planet where"+
        " sys_id = ?) as cnt from system where id = ?");
        ps.get(id, id, ready);

        function ready(err, row){
            var result = "";
            try{
                execute(result + row.id + "&" + row.cnt);
            }catch(err){
                var id = generateUUID();
                var response = addUser(id);
                if(response == "success")  {
                    execute(result + id);
                }
                else {
                    execute("Fail");                
                }
            }
        }
    
    },

  //cleans the db on server re-start
    cleanDB : function()  {
  
        try{
            var ps = db.prepare("DELETE FROM planet");
            ps.run();
            ps.finalize();
            var ps2 = db.prepare("DELETE FROM system");
            ps2.run();
            ps2.finalize();
            var ps3 = db.prepare("VACUUM");
            ps3.run();
            ps3.finalize();
            return "success";
        }catch(err){
            console.log("Failed to clean Database");
        }
    }

};
