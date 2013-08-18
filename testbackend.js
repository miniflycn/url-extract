var ws = require('websocket-server');

var server = ws.createServer();

server.addListener('connection', function(connection){
  connection.addListener('message', function(msg){
    server.send(connection.id, msg);
  });

  connection.addListener('close', function(){
    console.log('close');
  });
});

server.listen(3001);