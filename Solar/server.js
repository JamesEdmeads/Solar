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

var https = require("https");
var http = require("http"); // http server that redirects to https
var QS = require("querystring");
var fs = require("fs");

var options = {
    key: fs.readFileSync('key/key.pem'),
    cert: fs.readFileSync('key/cert.pem')
};

var OK = 200, NotFound = 404, BadType = 415, Error = 500;
var types, banned, parameters = "";
var dbmethod = require("./db/db.js");
startHTTPS(8080);
startHTTP(8090);

// http server redirecting to https
function startHTTP(port) {
    var service = http.createServer(handleHTTP);
    service.listen(port, "localhost");
    var address = "http://localhost";
    if (port != 80) address = address + ":" + port;
}

// Redirects to https
function handleHTTP(request, response) {
    response.writeHead(302, {'Location': 'https://localhost:8080'+request.url});
    response.end();
}

// Start the http service.  Accept only requests from localhost, for security.
function startHTTPS(port) {

    types = defineTypes();
    banned = [];
    banUpperCase("./public/", "");
    var service = https.createServer(options, handleHTTPS);
    service.listen(port, "localhost");
    var address = "https://localhost";
    if (port != 443) address = address + ":" + port;
    console.log("Server running at", address);
    dbmethod.cleanDB(); //On every restart of the server the db is cleaned

}

// Checks if user already exists and created a solar system
// Generates new id if not
function check(id, response, type){

    if(id === null){ renderHTML("./public/index.html", response, type); }
    else{ dbmethod.checkUser(id, execute);}
    function execute(result){
        if(result === "Fail")  {
            renderHTML("./public/index.html", response, type);
        }
        else  {
            var textTypeHeader = { "Content-Type": "text/plain" };
            response.writeHead(200, textTypeHeader);
            response.write(result);
            response.end();          
        } 
    }
}

// Saves or updates planets attributes
function save(request, response, type){

  // gets the data
  request.on('data', add);
  request.on('end', end);

  // places all the data in one large string
  var body = "";
  function add(chunk) { body = body + chunk.toString(); }

  // splits the usefull data into an array
  function end() {
      var params = QS.parse(body);
      dbmethod.insert(params.count, params.distance, params.size, params.speed, params.colour, params.user);
      parameters = "";
      parameters = parameters + params.distance + "&";
      parameters = parameters + params.size + "&";
      parameters = parameters + params.speed + "&";
      parameters = parameters + params.colour;

    // Only when all five planets are set, redirects to solar.html
      if(params.count >= 5){ renderHTML("./public/solar.html", response, type); }
      else{ renderHTML("./public/choice.html", response, type); }
  }

}

// Loads the solar system if there is one
function load(id, response, type){

    dbmethod.getplanet(execute, id);

    function execute(result){
        if(result === "fail"){
            renderHTML("./public/index.html", response, type);
        }else{
            var textTypeHeader = { "Content-Type": "text/plain" };
            response.writeHead(200, textTypeHeader);
            response.end(result);
            
        }
    }
}

// Loads the website if it is allowed
function defaultReply(response, type, url){

    if (type === null) return fail(response, BadType, "File type unsupported");
    var file = "./public" + url;
    renderHTML(file, response, type);

}

// Serve a request by delivering a file.
function handleHTTPS(request, response) {

    var url = request.url.toLowerCase();

    if (url.endsWith("/")) url = url + "index.html";
    if(reject(url)) return fail(response, NotFound, "URL access refused");
    if(isBanned(url)) return fail(response, NotFound, "URL has been banned");
    var type = findType(url, request);

    //Splits the url up, first is the requres second, after ? is user ID
    var requestURL = url.split("?");

    // The main tree of the website:
    switch (requestURL[0]) {
        case "/check": check(requestURL[1], response, type); break;
        case "/save": save(request, response, type); break;
        case "/load": load(requestURL[1], response, type); break;
        default: defaultReply(response, type, url);
    }

}

// Delivers the website
function renderHTML(file, response, type){

    fs.readFile(file, ready);
    function ready(err, content) { deliver(response, type, err, content); }

}

// Forbids any resources which shouldn't be delivered to the browser.
function isBanned(url) {

    for (var i=0; i<banned.length; i++) {
        var b = banned[i];
        if (url.startsWith(b)) return true;
    }
    return false;

}

// URL checking, rejects illegal/invalid/empty URLs
function reject(url) {
    var rejectable = ["/./", "/../", "//", "key", "db"];

    if(!isValid(url) || url.length > 2000 || url[0] != "/"){
        return true;
    }

    for (var i=0; i<rejectable.length; i++) {
        if (url.indexOf(rejectable[i]) !== -1){
            return true
        };
    }

    return false;

}

// Checks if string is a valid ascii, addapted from:
// https://stackoverflow.com/questions/14313183/javascript-regex-how-do-i-check-if-the-string-is-ascii-only
function isValid(str){
    if(typeof(str)!=='string'){
        return false;
    }
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>127){
            return false;
        }
    }
    return true;
}

// Handles browsers which can not deal with xhtm+xml
function findType(url, request) {

    var header = request.headers.accept;
    var accepts = header.split(",");
    var extension;
    var ntype = "application/xhtml+xml";
    var otype = "text/html";

    if (accepts.indexOf(otype) >= 0){

        if (accepts.indexOf(ntype) >= 0){
            var dot = url.lastIndexOf(".");
            extension = url.substring(dot + 1);
        }else{ extension = "html"; }

    }else{

        var dot = url.lastIndexOf(".");
        extension = url.substring(dot + 1);

    }

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
        if ((mode & folderBit) === 0) continue;
        banUpperCase(root, file);
    }

}

// Addapted to the types we use
function defineTypes() {

    var types = {
        html : "text/html",
        xhtml : "application/xhtml+xml",
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
