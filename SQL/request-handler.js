var path = require('path');
var url = require('url');
var messages = require('./http-helpers');


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
    console.log('conditional reached');
    messageRouter[method](req,res);
    return;
  }

  if(path === '/classes/room1' && method === 'GET') {
    //TODO: write send messages
    messages.sendMessags(req, res);

  } else if(path === '/classes/room1' && method === 'POST'){
    // get data from post
    // TODO: refactor to use collectData
    var chunk = '';
    req.on('data', function(data){
      chunk += data.toString();
    });

    req.on('end',function(){
      chunk = chunk.substring(4);
      console.log('chunk', chunk);
      //previously we had to extract the url
      //Stringify and send messgaes
    });

  }else if(path.substr(0,7) === '/public'){
    messages.serveAssets(req, res);
  }else {
    messages.send404(req, res);
  }
};
