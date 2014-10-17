/**
 * Desctop Capture Share VIEW MODEL
 */
var desktopCaptureShareInstance = null;
var DesktopCaptureShareVM = Class.extend({
  peerConfig: {
    host: 'screen-share-signaling.itinao.asia',
    port: 8080,
    path: '/share',
    debug: 2,
    shareUrl: 'http://screen-share.itinao.asia/share.html'
  },
  bg: chrome.extension.getBackgroundPage(),
//  qrBaseUrl: 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=',
  descriptions: {
    ready: '画面共有を開始するとURLが生成されます',
    work: '共有URLを生成しました<br>{{$1}}人が接続中です'
  },
  readyShareUrl: 'URL',
  supportVersion: 35,

  captureOnOff: null,
  shareUrl: null,
  shareDescription: null,
  
  init: function() {
    this.captureOnOff = ko.observable();
    this.shareUrl = ko.observable();
    this.shareDescription = ko.observable();

    if (this.bg.appPeer && this.bg.appPeer.stream && !this.bg.appPeer.stream.ended) {
      // 接続中だった場合
      this.initConnected();
    } else {
      // 未接続だった場合
      this.initUnConnected();
    }
  },

  initConnected: function() {
    var conLen = Object.keys(this.bg.appPeer.connections).length;
    this.captureOnOff(true);
    this.shareDescription(this.descriptions.work.replace('{{$1}}', conLen));

    // 短縮URLを取得する
    gapi.client.load('urlshortener', 'v1', function() {
      var req = gapi.client.urlshortener.url.insert({
        resource: {'longUrl': this.bg.appPeer.shareUrl}
      });
      req.execute(function(data){
        if (data.error) {
          this.shareUrl(this.bg.appPeer.shareUrl);
          return;
        }
        this.shareUrl(data.id);
      }.bind(this));
    }.bind(this));
  },

  initUnConnected: function() {
    this.captureOnOff(false);
    this.shareUrl(this.readyShareUrl);
    this.shareDescription(this.descriptions.ready);
  },

  changeCaptureStatus: function(self, event) {
    event.currentTarget.checked;
    if (event.currentTarget.checked) {
      // ONに変更時
      this.createPeerInstance(function() {
        setTimeout(function() {// SWITCHのアニメーションを見せてからダイアログ出す
          this.bg.appPeer.startCapture();
        }.bind(this), 500);
      }.bind(this));
    } else {
      // OFFに変更時
      this.bg.location.reload();
      this.shareUrl(this.readyShareUrl);
      this.shareDescription(this.descriptions.ready);
    }
  },

  createPeerInstance: function(openCallback) {
    this.bg.appPeer = new this.bg.AppPeer({
      host: this.peerConfig.host,
      port: this.peerConfig.port,
      path: this.peerConfig.path,
      debug: this.peerConfig.debug,
      shareUrl: this.peerConfig.shareUrl,
      openCallback: openCallback
    });
  },

  isSupport: function() {
    var matches = navigator.userAgent.match(/Chrome\/(...)/);// 念のため3桁とる
    var version = Number(matches[1]);
    return this.supportVersion < version ? true : false;
  }
});

var load = function() {
  desktopCaptureShareInstance = new DesktopCaptureShareVM;
  ko.applyBindings(desktopCaptureShareInstance);
};
