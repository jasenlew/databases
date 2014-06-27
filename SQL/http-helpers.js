var path = require('path');
var fs = require('fs');
var utils = require('./server-utils');
var url = require('url');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};



exports.serveAssets = function(req, res){
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      utils.sendResponse(res);
      return;
    } else if (uri === '/') {
      filename += 'public/index.html';
    }

    var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
    res.writeHead(200, mimeType);

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);

  });
};


exports.sendOptionsResponse = function(req, res){
  utils.sendResponse(res, null);
};

exports.send404 = send404 = function(req, res){
  utils.sendResponse(res, 'Not Found', 404);
};

