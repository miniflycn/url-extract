

//ws://echo.websocket.org/
var websocket = new WebSocket('ws://localhost:3001/');
websocket.onopen = function(evt){
  websocket.send(JSON.stringify({
    method: 'LOGIN',
    data: '123132132'
  }));
};
websocket.onmessage = function(evt){
  console.log(evt.data);
  /*setTimeout(function () {
    websocket.close();
  }, 1000);*/
};
websocket.onerror = function(evt){ 
  console.log('error')
  console.log(evt) 
};
websocket.onclose = function(evt) {
  console.log('close')
  console.log(evt) 
}; 
//phantom.exit();