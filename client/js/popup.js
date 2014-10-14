$(function () {
  var bg = chrome.extension.getBackgroundPage();
//  chrome.tabs.getSelected(null, function(tab) {
//    $('#title').text(tab.title);
//    $('#url').text(tab.url);
//  });
  $('#url').text(bg.peerjs.shareUrl);
});


