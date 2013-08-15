var assert = require('assert')
  , Watcher = require('../lib/Watcher.js');

function makeRes(foo) {
  return {
    end: function(data){
      foo.call(this, data);
    },
    writeHead: function(){},
    statuCode: 200
  }
}

describe('Watcher', function () {
  it('should response the right data', function (done) {
    Watcher.register(123, 1, {}, makeRes(function (data) {
      data = JSON.parse(data)
      data.timestamp.should.equal(123);
      var url = data.urls[0];
      url.id.should.equal(0);
      url.url.should.equal('http://localhost/test');
      url.image.should.equal('http://localhost/test.png');
      data.finished.should.be.true;
      done();
    }), function () {});
    Watcher.fire(123, 0, 'http://localhost/test', 'http://localhost/test.png', '<html></html>');
  });

  it('should able to pass two url', function (done) {
    Watcher.register(321, 2, {}, makeRes(function (data) {
      data = JSON.parse(data);
      data.urls.length.should.equal(2);
      done();
    }), function () {});
    Watcher.fire(321, 0, 'http://localhost/test1', 'http://localhost/test1.png', '<html></html>');
    Watcher.fire(321, 1, 'http://localhost/test2', 'http://localhost/test2.png', '<html></html>');
  })
});