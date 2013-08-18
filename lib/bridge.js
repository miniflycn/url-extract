module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , ws = require('websocket-server')
    , pkg = JSON.parse(fs.readFileSync('./package.json'))
    , nullFoo = function () {}
    , _callback = {
      onlogin: nullFoo,
      onpost: nullFoo,
      ondone: nullFoo,
      onclose: nullFoo
    };

  function _onmessage(workerId, msg) {
    switch (msg.method) {
      case 'LOGIN':
        return _callback.onlogin(workerId, msg.campaignId);
      case 'POST':
        return _callback.onpost(workerId, msg.data);
      case 'DONE':
        return _callback.ondone(workerId);
      default: 
        return bridge.send('error');
    }
  }

  var bridge = ws.createServer();
  bridge.addListener('connection', function (connection) {
    connection.addListener('message', function (msg) {
      var workerId = connection.id
        , urls;
      msg = JSON.parse(msg);
      _onmeesage(workerId, msg);
    });

    connection.addListener('close', function () {
      console.log('connection ' + connection.id + ' closed.');
      jobMan.logout(connection.id);
    });
  });

  bridge.listen(pkg.wsPort);

  function send(id, msg) {
    if (!msg) return bridge.broadcast(id);
    return bridge.send(id, JSON.stringify(msg));
  }

  function on(event, callback) {
    event = event.toLowerCase();
    var events = {
      login: true,
      post: true,
      done: true
    };
    if (events[event]) {
      _callback['on' + event] = callback;
      return this;
    } else {
      return false;
    }
  }

  return {
    send: send,
    on: on
  };

})();
