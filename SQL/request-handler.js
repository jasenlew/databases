var path = require('path');
var url = require('url');
var messages = require('./http-helpers');
var db = require('./db-helpers');
var utils = require('./server-utils');

var messageRouter = {
  'POST' : messages.postMessage,
  'GET' : messages.serveAssets,
  'OPTIONS': messages.sendOptionsResponse
};


exports.handleRequest = function(req, res) {

  var path = url.parse(req.url).pathname;
  var method = req.method;
  console.log('path:', path, 'method:', method);

  // Path to handle OPTIONS request
  if(path === '/' && messageRouter[method]){
    messageRouter[method](req,res);
    return;
  }

  if(path === '/classes/room1' && method === 'GET') {
    //TODO: write send messages
    db.sendMessages(req, res);

  } else if(path === '/classes/room1' && method === 'POST'){
    // get data from post
    // TODO: refactor to use collectData
    console.log('post received');
    var chunk = '';
    req.on('data', function(data){
      chunk += data.toString();
    });

    req.on('end',function(){
      console.log('chunk', chunk);
      var dataObj =  JSON.parse(chunk);
      db.findAndCreate(dataObj, function (dbSuccess) {
        if (dbSuccess) {
          utils.sendResponse(res, 'Successful db insert.', 200);
        } else {
          utils.sendResponse(res, 'Failed db insert.', 500);
        }
      });
    });

  }else if(path.substr(0,7) === '/public'){
    messages.serveAssets(req, res);
  }else {
    messages.send404(req, res);
  }
};
