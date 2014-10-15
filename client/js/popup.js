var bg = chrome.extension.getBackgroundPage();
var shareUrl = document.querySelector('#js-share-url');
var shareQr = document.querySelector('#js-share-qr');
var captureOnOff = document.querySelector('#js-capture-on-off');
var qrBaseUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=';

if (bg.appPeer.stream && !bg.appPeer.stream.ended) {
  captureOnOff.checked = true;
  shareUrl.textContent = bg.appPeer.shareUrl;
  shareQr.src = qrBaseUrl + bg.appPeer.shareUrl;
} else {
  captureOnOff.checked = false;
  //shareUrl.textContent = bg.appPeer.shareUrl;
  shareUrl.textContent = "シェアを開始するとURL/QRコードが表示されます";
}

captureOnOff.addEventListener('change', function(event) {
  if (captureOnOff.checked) {
    shareUrl.textContent = bg.appPeer.shareUrl;
    shareQr.src = qrBaseUrl + bg.appPeer.shareUrl;
    bg.appPeer.startCapture(function() {
      alert(bg.appPeer.shareUrl);
    });
  }
});

