var path = require('path');
var url = require('url');
var messages = require('./http-helpers');


var messageRouter = {
  'POST' : messagesp.postMessage,
  'GET' : messages.getMessages,
  'OPTIONS': archive.sendOptionsResponse
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
      archive.isUrlInList(chunk, function(urlFound){
        if(urlFound){
          console.log('url is found');
          // read from sites dir and send cached html
          // archive.
          messages.sendCachedPage(req, res, chunk);
        }else{
          // response with loading.html
          messages.sendStaticPage(req, res, true);
        }
      });
    });

  }else if(path.substr(0,7) === '/public'){
    messages.sendStaticPage(req, res);
  }else {
    messages.send404(req, res);
  }
};
