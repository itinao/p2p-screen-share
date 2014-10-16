/**
 *
 */
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 8080, path: '/share'});

server.on('connection', function(id) {
  console.log("connection");
  console.log(id);
});

server.on('disconnect', function(id) {
  console.log("disconnection");
  console.log(id);
});
