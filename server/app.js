/**
 * PeerJS Server
 * @use https://github.com/peers/peerjs-server
 */
var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 8081, path: '/share'});

server.on('connection', function(id) {
  var date = new Date();
  console.log("[" + date + "] connection: " + id);
});

server.on('disconnect', function(id) {
  var date = new Date();
  console.log("[" + date + "] disconnection: " + id);
});
