var webpage = require('webpage')
  , args = require('system').args
  , fs = require('fs')
  , campaignId = args[1]
  , currentNum = 0
  , totalNum = 0
  , shutdown = false
  , pkg = JSON.parse(fs.read('./package.json'));

function snapshot(id, url, imagePath) {
  var page = webpage.create()
    , send
    , begin
    , save
    , end;
  page.viewportSize = { width: 1024, height: 800 };
  page.clipRect = { top: 0, left: 0, width: 1024, height: 800 };
  page.settings = {
    javascriptEnabled: false,
    loadImages: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
  };
  page.open(url, function (status) {
    var data;
    if (status === 'fail') {
      onFail(campaignId, id, url);
    } else { 
      page.render(imagePath);
      var html = page.content;
      // callback NodeJS
      onSuccess(campaignId, id, url, imagePath, html);
    }
    // release the memory
    page.close();
  });
}

function onFail(campaignId, id, url) {
  var data = {
    campaignId: campaignId,
    id: id,
    url: url,
    status: 0
  };
  websocket.send(JSON.stringify(data));
}

function onSuccess(campaignId, id, url, imagePath, html) {
  var data = {
    campaignId: campaignId,
    id: id,
    url, url,
    imagePath: imagePath,
    html, html,
    status: 1
  };
  websocket.send(JSON.stringify(data));
}

function onMessage(data) {
  data = JSON.parse(data);
  if (method === 'POST') {
    var urls = data.urls
      , len = urls.length
      , url;

    if (len) {
      totalNum += len;
      for (var i = len; i--;) {
        url = urls[i]
        snapshot(url.id, url.url, url.imagePath);
      }
    }

  }
}

function createWs() {
  var websocket = new WebSocket('ws://localhost:/' + pkg.wsPort);
  websocket.onopen = function(evt){
    shutdown = false;
    websocket.send(JSON.stringify({
      method: 'LOGIN',
      campaignId: campaignId
    }));
  };
  websocket.onmessage = onMessage;
  websocket.onerror = function (msg) {
    console.log(msg);
  }
  websocket.onclose = function() {
    if (!shutdown) {
      shutdown = ture; 
      setTimeout(function () {
        createWs();
      }, 500);
    }
  };
}
createWs();