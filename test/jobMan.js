var assert = require('assert')
  , jobMan = require('../lib/jobMan.js')
  , mockRes = require('./tool/mockRes.js');

describe('jobMan', function () {
  it('should response the right data', function (done) {
    jobMan.register(123, ['http://localhost/test'], {}, mockRes(function (data) {
      data = JSON.parse(data)
      data.campaignId.should.equal(123);
      var url = data.urls[0];
      url.id.should.equal(0);
      url.url.should.equal('http://localhost/test');
      url.image.should.equal('http://localhost/test.png');
      data.finished.should.be.true;
      done();
    }), function () {});
    jobMan.fire({
      campaignId: 123,
      id: 0,
      url: 'http://localhost/test',
      image: 'http://localhost/test.png',
      html: '<html></html>',
      status: 1
    });
  });

  it('should able to pass two url', function (done) {
    jobMan.register(321, ['http://localhost/test1', 'http://localhost/test2'], {}, mockRes(function (data) {
      data = JSON.parse(data);
      data.urls.length.should.equal(2);
      done();
    }), function () {});
    jobMan.fire({
      campaignId: 321,
      id: 0,
      url: 'http://localhost/test1',
      image: 'http://localhost/test1.png',
      html: '<html></html>',
      status: 1
    });
    jobMan.fire({
      campaignId: 321,
      id: 1,
      url: 'http://localhost/test2',
      image: 'http://localhost/test2.png',
      html: '<html></html>',
      status: 1
    });
  });

  it('should able to get the url list', function () {
    var urlList = ['http://localhost/test1', 'http://localhost/test2'];
    jobMan.register(456, urlList, {}, mockRes(function () {}), function () {});
    jobMan.getUrls(456).should.equal(urlList);
  });
});