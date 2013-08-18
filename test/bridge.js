var assert = require('assert')
  , fs = require('fs')
  , bridge = require('../lib/bridge.js')
  , pkg = JSON.parse(fs.readFileSync('./package.json'));

describe('bridge', function () {
  it('should able to send and handle event', function () {
    bridge.send.should.be.a('function');
    bridge.on.should.be.a('function');
  });
});