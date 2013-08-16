var webpage = require('webpage')
  , args = require('system').args
  , fs = require('fs')
	, campaignId = args[1]
  , currentNum = 0
  , pkg = JSON.parse(fs.read('./package.json'));

function snapshot(id, url, imagePath) {
  var page = webpage.create()
    , send
    , begin
    , save
    , end;
  page.viewportSize = { width: 1024, height: 800 };
  page.clipRect = { top: 0, left: 0, width: 1024, height: 800 };
  page.settings = {
    javascriptEnabled: false,
    loadImages: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
  };
  page.open(url, function (status) {
    page.render(imagePath);
    var html = page.content;
    // callback NodeJS
    var data = [
          'html=',
          encodeURIComponent(html),
          '&campaignId=',
          campaignId,
          '&url=',
          encodeURIComponent(url),
          '&image=',
          encodeURIComponent(imagePath),
          '&id=',
          id
        ].join('');
    postPage.open('http://localhost:' + pkg.port + '/bridge', 'POST', data, function () {});
    // release the memory
    page.close();
  });
}

var postPage = webpage.create();
postPage.customHeaders = {
  'secret': pkg.secret
};
postPage.open('http://localhost:' + pkg.port + '/bridge?campaignId=' + campaignId, function () {
  var urls = JSON.parse(postPage.plainText).urls
    , len = urls.length
    , url;

  if (len) {
    for (var i = len; i--;) {
      url = urls[i]
      snapshot(url.id, url.url, url.imagePath);
    }

    postPage.onLoadFinished = function () {
      if (++currentNum === len) {
        postPage.close();
        phantom.exit();
      }
    }
  }
});
