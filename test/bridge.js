var assert = require('assert')
  , fs = require('fs')
  , bridge = require('../lib/bridge')
  , Job = require('../lib/Job')
  , pkg = JSON.parse(fs.readFileSync('./package.json'));

var _connectionId;

describe('bridge', function () {
  it('should able to get worker request num.', function (done) {
    bridge.init({
      workerNum: 1
    });
    bridge.on('get', function (connectionId, num) {
      _connectionId = connectionId;
      bridge.on('get');
      done();
    });
  });
  it('should able to get send a job, and get response', function (done) {
    bridge.send(_connectionId, [Job.snapshot('http://www.baidu.com')]);
    bridge.on('data', function (data) {
      if (fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
        fs.rmdirSync(data.image.slice(0, data.image.lastIndexOf('/') + 1));
        done();
      }
    });
  });
});