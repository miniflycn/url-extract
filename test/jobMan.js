var assert = require('assert')
  , jobMan = require('../lib/jobMan.js')
  , bridge = require('../lib/bridge.js')
  , mockRes = require('./tool/mockRes.js');

describe('jobMan', function () {
  it('should response the right data', function (done) {
    jobMan.register(123, [{
      id: 0,
      url: 'http://www.baidu.com',
      imagePath: 'snapshot/test.png'
    }], {}, mockRes(function (data) {
      data = JSON.parse(data)
      data.urls[0].id.should.equal(0);
      data.urls[0].url.should.equal('http://www.baidu.com');
      data.urls[0].status.should.equal(1);
      done();
    }), function () {});
  });
});