Polymer('peer-signal', {

  // PeerJSの接続config (default
  host: 'localhost',
  port: 8888,
  path: '/capture-share',
  debug: 1,

  // PeerJS接続情報の保持
  peer: null,
  connections: {},

  // Share用URL保持
  shareBaseUrl: 'http://localhost/share.html',
  shareUrl: '',

  ready: function() {
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
    //TODO:  これを使ってgrowlなどで接続を通知するとよさそう
    //console.log(connection.metadata.message);
  },

  onDataFromPartner: function(connection, data) {
    console.log(data);
  },

  onCloseFromPartner: function(connection) {
    console.log('close partner: ' + connection.peer);
  },

  // 接続処理
  createConnection: function(connectionId) {
    if (!connectionId) {
      return;
    }
    // TODO: この処理中にmedia connectionのエラーが発生するのを調べる
    var connection = this.peer.connect(connectionId, {
      label: 'captureShare',
      serialization: 'binary',
      reliable: true,
      metadata: {message: 'new connection!!'}
    });
    connection = this.addConnectionEvent(connection);
    this.connections[connectionId] = connection;
  },

});
