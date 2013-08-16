var assert = require('assert')
  , fs = require('fs')
  , jobMan = require('../lib/jobMan.js')
  , bridge = require('../lib/bridge.js')
  , mockReq = require('./tool/mockReq')
  , mockRes = require('./tool/mockRes.js')
  , pkg = JSON.parse(fs.readFileSync('./package.json'));

describe('bridge', function () {
  it('should able to get url list from jobMan', function () {
    var urlList = ['http://localhost/test1', 'http://localhost/test2'];
    jobMan.register(123, urlList, {}, mockRes(function () {}), function () {});
    bridge(mockReq().setHeader('secret', pkg.secret).setUrl('/?campaignId=123'), mockRes(function (data) {
      data = JSON.parse(data);
      data.urls.should.eql(urlList);
    }), function () {});
  });
});