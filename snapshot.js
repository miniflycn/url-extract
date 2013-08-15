var webpage = require('webpage')
  , args = require('system').args
  , fs = require('fs')
	, timestamp = args[1]
	, urls = args.slice(2)
	, len = urls.length
  , currentNum = 0
  , pkg = JSON.parse(fs.read('./package.json'));

function snapshot(url, id) {
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
    page.render('snapshot/' + timestamp + '/' + id + '.png');
    var html = page.content;
    // callback NodeJS
    var postPage = webpage.create()
      , data = [
          'html=',
          encodeURIComponent(html),
          '&timestamp=',
          timestamp,
          '&url=',
          encodeURIComponent(url),
          '&image=',
          encodeURIComponent('http://localhost:' + pkg.port + '/snapshot/' + timestamp + '/' + id + '.png'),
          '&id=',
          id
        ].join('');
    postPage.customHeaders = {
      'secret': pkg.secret
    };
    postPage.onLoadFinished = function(){
      postPage.close();
      (++currentNum === len) && (phantom.exit());
    }
    postPage.open('http://localhost:' + pkg.port + '/bridge', 'POST', data, function () {});
    // release the memory
    page.close();
  });
}

for (var i = len; i--;) {
  snapshot(urls[i], i);
}