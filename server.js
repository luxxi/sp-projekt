var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 9998});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    // broadcast to everyone except the sender
    wss.clients.forEach(function (client) {
      if (client !== ws) {
        client.send(data);
      }
    });
  });
});
