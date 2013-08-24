var webpage = require('webpage')
  , args = require('system').args
  , fs = require('fs')
  , campaignId = args[1]
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
    var data;
    if (status === 'fail') {
      data = [
        'campaignId=',
        campaignId,
        '&url=',
        encodeURIComponent(url),
        '&id=',
        id,
        '&status=',
        0
      ].join('');
      postPage.open('http://localhost:' + pkg.port + '/bridge', 'POST', data, function () {});
    } else { 
      page.render(imagePath);
      var html = page.content;
      // callback NodeJS
      data = [
        'campaignId=',
        campaignId,
        '&html=',
        encodeURIComponent(html),
        '&url=',
        encodeURIComponent(url),
        '&image=',
        encodeURIComponent(imagePath),
        '&id=',
        id,
        '&status=',
        1
      ].join('');
      postMan.post(data);
    }
    // release the memory
    page.close();
  });
}

var postMan = {
  postPage: null,
  posting: false,
  datas: [],
  len: 0,
  currentNum: 0,
  init: function (snapshot) {
    var postPage = webpage.create();
    postPage.customHeaders = {
      'secret': pkg.secret
    };
    postPage.open('http://localhost:' + pkg.port + '/bridge?campaignId=' + campaignId, function () {
      var urls = JSON.parse(postPage.plainText).urls
        , url;

      this.len = urls.length;

      if (this.len) {
        for (var i = this.len; i--;) {
          url = urls[i];
          snapshot(url.id, url.url, url.imagePath);
        }
      }
    });
    this.postPage = postPage;
  },
  post: function (data) {
    this.datas.push(data);
    if (!this.posting) {
      this.posting = true;
      this.fire();
    }
  },
  fire: function () {
    if (this.datas.length) {
      var data = this.datas.shift()
        , that = this;
      this.postPage.open('http://localhost:' + pkg.port + '/bridge', 'POST', data, function () {
        that.fire();
        // kill child process
        setTimeout(function () {
          if (++this.currentNum === this.len) {
            that.postPage.close();
            phantom.exit();
          }
        }, 500);
      });
    } else {
      this.posting = false;
    }
  }
};
postMan.init(snapshot);