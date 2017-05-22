// Run a node.js web server for local development of a static web site.
// Start with "node server.js" and put pages in a "public" sub-folder.
// Visit the site at the address printed on the console.

// The server is configured to be platform independent.  URLs are made lower
// case, so the server is case insensitive even on Linux, and paths containing
// upper case letters are banned so that the file system is treated as case
// sensitive even on Windows.

// Load the library modules, and define the global constants.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// Start the server: change the port to the default 80, if there are no
// privilege issues and port number 80 isn't already in use.

var http = require("http");
var QS = require("querystring");
var fs = require("fs");
var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned, parameters = "";
var dbmethod = require("./db/db.js");
var cnt = 1;
start(8080);

// Start the http service.  Accept only requests from localhost, for security.
function start(port) {
    types = defineTypes();
    banned = [];
    banUpperCase("./public/", "");
    var service = http.createServer(handle);
    service.listen(port, "localhost");
    var address = "http://localhost";
    if (port != 80) address = address + ":" + port;
    console.log("Server running at", address);
    dbmethod.cleanDB();
}

// Serve a request by delivering a file.
function handle(request, response) {
    var url = request.url.toLowerCase();
    console.log("url", url);
    if (url.endsWith("/")) url = url + "index.html";
    if (isBanned(url)) return fail(response, NotFound, "URL has been banned");
    var type = findType(url);
    console.log("requests:", url);

// Checks if user already create a system, if not returns new uid.
function checkUID(id){
  //TODO
}

// The main tree of the website:
    switch (url) {

      //Landing
      case "/check":
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!RECIEVED!!!!!!!!!!!!!!!!!!!!!");
        checkUser(id, execute);

        function execute(result){
          var textTypeHeader = { "Content-Type": "text/plain" };
          response.writeHead(200, textTypeHeader);
          response.end(result);
        }
      break;

      case "/save":
        // what happens at the back - get the data
        request.on('data', add);
        request.on('end', end);

        // places all the data in one large string
        var body = "";
        function add(chunk) { body = body + chunk.toString(); }

        // splits the usefull data into an array
        function end() {
          var params = QS.parse(body);
          console.log(params.distance, params.size, params.speed, params.colour);
          dbmethod.insert(params.distance, params.size, params.speed, params.colour, 1); //TODO userID;
          parameters = "";
          parameters = parameters + params.distance + "&";
          parameters = parameters + params.size + "&";
          parameters = parameters + params.speed + "&";
          parameters = parameters + params.colour;

          // added count from choice.js as params.count and set the 5 check to this
          if(params.count >= 5){
            renderHTML("./public/solar.html", response, type);
          }else{
            renderHTML("./public/choice.html", response, type);
          }
        }
      break;

      case "/load":
        //NOTE hardcode 1 for now.
        dbmethod.getplanet(execute, 1);

        function execute(result){
          var textTypeHeader = { "Content-Type": "text/plain" };
          response.writeHead(200, textTypeHeader);
          console.log(result);
          response.end(result);
        }
      break;

      default:
        console.log("DEFAULT");
        if (type == null) return fail(response, BadType, "File type unsupported");
        var file = "./public" + url;
        renderHTML(file, response, type);
      }
}

function renderHTML(file, response, type){
  fs.readFile(file, ready);
  function ready(err, content) { deliver(response, type, err, content); }
}

// Forbid any resources which shouldn't be delivered to the browser.
function isBanned(url) {
    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (url.startsWith(b)) return true;
    }
    return false;
}

// Find the content type to respond with, or undefined.
function findType(url) {
    var dot = url.lastIndexOf(".");
    var extension = url.substring(dot + 1);
    return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, err, content) {
    if (err) return fail(response, NotFound, "File not found");
    var typeHeader = { "Content-Type": type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) {
    var textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(code, textTypeHeader);
    response.write(text, "utf8");
    response.end();
}

// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
    var folderBit = 1 << 14;
    var names = fs.readdirSync(root + folder);
    for (var i=0; i<names.length; i++) {
        var name = names[i];
        var file = folder + "/" + name;
        if (name != name.toLowerCase()) banned.push(file.toLowerCase());
        var mode = fs.statSync(root + file).mode;
        if ((mode & folderBit) == 0) continue;
        banUpperCase(root, file);
    }
}

// The most common standard file extensions are supported, and html is
// delivered as xhtml ("application/xhtml+xml").  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: for a more complete list, install
// the mime module and adapt the list it provides.
function defineTypes() {
    var types = {
        html : "application/xhtml+xml",
        css  : "text/css",
        js   : "application/javascript",
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: undefined,      // non-standard, use .html
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}
