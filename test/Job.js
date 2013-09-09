var assert = require('assert')
  , Job = require('../lib/Job');

describe('Job', function () {
  it('should able to create a extract url job with group id', function () {
    var job = new Job('http://localhost/test', { groupId:'test' }, true);
    job.groupId.should.equal('test');
    job.url.should.equal('http://localhost/test');
    job.content.should.be.true;
  });

  it('should able to create a extract url job without id', function () {
    var job = new Job('http://localhost/test', true);
    job.url.should.equal('http://localhost/test');
    job.content.should.be.true;
  });

  it('should able to create a snapshot job with id', function () {
    var job = new Job('http://localhost/test', { groupId:'test' }, false);
    job.groupId.should.equal('test');
    job.url.should.equal('http://localhost/test');
    job.content.should.be.false;
  });

  it('should able to create a snapshot job without id', function () {
    var job = new Job('http://localhost/test', false);
    job.url.should.equal('http://localhost/test');
    job.content.should.be.false;
  });

  it('should able to set data & get data in a extract job', function () {
    var data = {
      title: 'title',
      description: 'description',
      image: 'http://localhost/test.png',
      status: true
    };
    var job = new Job('http://localhost/test', true);
    job.setData(data);
    job.getData().should.eql({
      title: 'title',
      description: 'description',
      image: 'http://localhost/test.png'
    });
  });

  it('should able to set data & get data in a snapshot job', function () {
    var data = {
      image: 'http://localhost/test.png',
      status: true
    };
    var job = new Job('http://localhost/test', false);
    job.setData(data);
    job.getData().should.eql({
      image: 'http://localhost/test.png'
    });
  });

  it('should able to set status is unavailable', function () {
    var data = {
      status: false
    };
    var job = new Job('http://localhost/test');
    job.setData(data);
    job.status.should.be.false;
  });

  it('should able to set callback', function () {
    var callback = function () {};
    var job1 = new Job('http://localhost/test', { callback : callback}, false)
      , job2 = new Job('http://localhost/test', { callback : callback}, true);
    job1.callback.should.equal(callback);
    job2.callback.should.equal(callback);
  });

  it('should able to set id', function () {
    var job = new Job('http://localhost/test', { id: 'test' });
    job.id.should.equal('test');
  });

  it('should able to ignore cache', function () {
    var job1 = new Job('http://localhost/test')
      , job2 = new Job('http://localhost/test', { ignoreCache: true });
    job1.cache.should.be.true;
    job2.cache.should.be.false;
  });

  it('should able to set image path', function () {
    var job = new Job('http://localhost/test', { image: './snapshot/test.png' });
    job.image.should.equal('./snapshot/test.png');
  });

  it('should able to get and set time', function () {
    var job = new Job('http://localhost/test');
    job.setTime().should.equal(job.getTime());
  });
});