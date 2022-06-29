//Load HTTP module
var http = require("http");
var hostname = '127.0.0.1';
var port = 3000;
//Create HTTP server and listen on port 3000 for requests
var server = http.createServer(function(req, res) {
    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, function() {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});