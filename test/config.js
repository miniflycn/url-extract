var assert = require('assert')
  , config = require('../lib/config')
  , configObj = require('../config');

describe('config', function () {
  it('should able to tell changed or not', function () {
    var maxJob = config.get().maxJob;
    config.changed().should.be.false;
    config.set({
      maxJob: 50
    });
    config.changed().should.be.true;
    config.set({
      maxJob: maxJob
    });
  })

  it('should able to get config', function () {
    config.get().should.equal(configObj);
  });

  it('should not able to set a unavailable param', function (done) {
    function onSet() {
      config.off('set', onSet);
      done();
    }
    config.on('set', onSet);
    config.set({
      xxxx: true
    });
    assert.equal(config.get().xxxx, undefined);
  });

  it('should able to set a param', function () {
    var maxJob = config.get().maxJob;
    config.set({
      maxJob: 50
    });
    config.get().maxJob.should.equal(50);
    config.set({
      maxJob: maxJob
    });
    config.get().maxJob.should.equal(maxJob);
  });
});