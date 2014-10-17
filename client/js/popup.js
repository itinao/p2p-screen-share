
var load = function() {
  var bg = chrome.extension.getBackgroundPage();
  var desc = document.querySelector('.js-description');
  var shareUrl = document.querySelector('.js-share-url');
  var captureOnOff = document.querySelector('#switch');
  var qrBaseUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=';
  var description = {
    ready: '画面共有を開始するとURLが生成されます',
    work: '共有URLを生成しました'
  };
  
  if (bg.appPeer.stream && !bg.appPeer.stream.ended) {
    var conLen = Object.keys(bg.appPeer.connections).length;// 自身は除く
    captureOnOff.checked = true;
    desc.innerHTML = description.work + '<br>' + conLen + '人が接続中です';
    // 短縮URLを取得する
    gapi.client.load('urlshortener', 'v1', function() {
      var req = gapi.client.urlshortener.url.insert({
        resource: {'longUrl': bg.appPeer.shareUrl}
      });
      req.execute(function(data){
        if (data.error) {
          shareUrl.textContent = bg.appPeer.shareUrl;
          return;
        }
        var shortUrl = data.id;
        shareUrl.textContent = shortUrl;
      });
    });
  //  shareQr.src = qrBaseUrl + bg.appPeer.shareUrl;
  } else {
    captureOnOff.checked = false;
    shareUrl.textContent = '';
    desc.textContent = description.ready;
  }
  
  captureOnOff.addEventListener('change', function(event) {
    if (captureOnOff.checked) {// ONに変更時
//      shareUrl.textContent = bg.appPeer.shareUrl;
//      desc.textContent = description.work;
//      shareQr.src = qrBaseUrl + bg.appPeer.shareUrl;
      bg.appPeer.startCapture(function() {
//        alert(bg.appPeer.shareUrl);
      });
    } else {// OFFに変更時
      bg.location.reload();
    }
  });

}

//var SUPPORT_VERSION = 35;
//var matches = navigator.userAgent.match(/Chrome\/(...)/);// 念のため3桁とる
//var version = Number(matches[1]);
//if (SUPPORT_VERSION < version) {
//  // 対象内！
//}




