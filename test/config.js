var assert = require('assert')
  , config = require('../lib/config')
  , configObj = require('../config');

describe('config', function () {
  it('should able to tell changed or not', function () {
    var zoomFactor = config.get().zoomFactor;
    config.changed().should.be.false;
    config.set({
      zoomFactor: 0.5
    });
    config.changed().should.be.true;
    config.set({
      zoomFactor: zoomFactor
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
    var zoomFactor = config.get().zoomFactor;
    config.set({
      zoomFactor: 0.5
    });
    config.get().zoomFactor.should.equal(0.5);
    config.set({
      zoomFactor: zoomFactor
    });
    config.get().zoomFactor.should.equal(zoomFactor);
  });
});