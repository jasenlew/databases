
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

var http = require("http");
var handler = require("./helpers/request-handler");

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
