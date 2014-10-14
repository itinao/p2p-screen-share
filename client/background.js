var PeerJS = Class.extend({
  // PeerJSのconfig
  host: 'localhost',
  port: 9000,
  path: '/share',
  debug: 2,

  // PeerJS接続情報の保持
  peer: null,
  connections: {},
  mediaConnections: {},
  stream: null,

  // Share用URL保持
  shareBaseUrl: 'http://localhost/~itinao/12_screen_share/share.html',
  shareUrl: '',

  init: function() {
    this.peer = new Peer({host: this.host, port: this.port, path: this.path, debug: this.debug});
    this.peer.on('open', this.onOpen.bind(this));
    this.peer.on('error', this.onError.bind(this));
    this.peer.on('connection', this.onConnection.bind(this));
  },

  setShareUrl: function(id) {
    this.shareUrl = this.shareBaseUrl + '?id=' + id;
  },

  onOpen: function(id) {
    console.log("open: " + id);
    this.setShareUrl(id);
  },

  onError: function(error) {
    console.log(error);
  },

  onConnection: function(connection) {
    console.log("connection: " + connection.peer);
    connection = this.addConnectionEvent(connection);
    this.connections[connection.peer] = connection;
  },

  // コネクション確立時に各種イベントをセットする
  addConnectionEvent: function(connection) {
    connection.on('open', this.onOpenFromPartner.bind(this, connection));
    connection.on('data', this.onDataFromPartner.bind(this, connection));
    connection.on('close', this.onCloseFromPartner.bind(this, connection));
    return connection;
  },

  onOpenFromPartner: function(connection) {
    console.log('open partner: ' + connection.peer);
    var mediaConnection = this.peer.call(connection.peer, this.stream);
    this.mediaConnections[connection.peer] = this.addMediaConnectionEvent(mediaConnection);

    //TODO:  これを使ってgrowlなどで接続を通知するとよさそう
    //console.log(connection.metadata.message);
  },

  onDataFromPartner: function(connection, data) {
    console.log(data);
  },

  onCloseFromPartner: function(connection) {
    console.log('close partner: ' + connection.peer);
  },

  addMediaConnectionEvent: function(mediaConnection) {
    return mediaConnection;
  },

  startCapture: function() {
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window"] , //ウィンドウとデスクトップどちらも
      function(streamId) {
        if (!streamId) {
          // error
          return;
        }
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                minWidth: 10,
                maxWidth: 1920,
                minHeight: 10,
                maxHeight: 1080
              }
            }
          },
          function(stream) {
            this.stream = stream;
          }.bind(this),
          function(error) {
            console.log(error);
          }
        );
      }.bind(this)
    );
  }

});
var peerjs = new PeerJS;
