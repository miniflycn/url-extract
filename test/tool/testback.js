var ws = require('websocket-server');

var server = ws.createServer();

server.addListener('connection', function(connection){
  connection.addListener('message', function(msg){
    server.send(connection.id, JSON.stringify({
    	method: 'POST',
    	urls: [{
    		id: 1,
    		url: 'http://www.baidu.com',
    		imagePath: 'snapshot/test.png'
    	}]
    }));
  });

  connection.addListener('close', function(){
    console.log('close');
  });
});

server.listen(3001);