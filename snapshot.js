var webpage = require('webpage')
  , fs = require('fs')
  , args = require('system').args
	, timestamp = args[1]
	, urls = args.slice(2)
	, len = urls.length
  , currentNum = 0;

function snapshot(url, id) {
  var page = webpage.create()
    , send
    , begin
    , save
    , end;
  page.viewportSize = { width: 1024, height: 800 };
  page.settings = {
    javascriptEnabled: false,
    loadImages: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
  };
  send = new Date();
  page.open(url, function (status) {
    begin = new Date();
    page.render('snapshot/' + timestamp + '/' + id + '.png');
    var html = page.evaluate(function () {
      return document.documentElement.outerHTML;
    });
    save = new Date();
    fs.write('cache/' + timestamp + '/' + id + '.html', html, 'w');
    end = new Date();
    console.log(url + ' total cost: ' + (end - send) + 'ms');
    console.log('and snapshot cost: ' + (save - begin) + 'ms');
    console.log('and save cost: ' + (end - save) + 'ms');
    // release the memory
    page.close();
    (++currentNum === len) && (phantom.exit());
  });
}

for (var i = len; i--;) {
  snapshot(urls[i], i);
}