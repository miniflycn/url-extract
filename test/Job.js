var assert = require('assert')
  , Job = require('../lib/Job');

describe('Job', function () {
  it('should able to create a extract url job with id', function () {
    var job = Job.extract('test', 'http://localhost/test');
    job.groupId.should.equal('test');
    job.url.should.equal('http://localhost/test');
    job.content.should.be.true;
  });

  it('should able to create a extract url job without id', function () {
    var job = Job.extract('http://localhost/test');
    job.url.should.equal('http://localhost/test');
    job.content.should.be.true;
  });

  it('should able to create a snapshot job with id', function () {
    var job = Job.snapshot('test', 'http://localhost/test');
    job.groupId.should.equal('test');
    job.url.should.equal('http://localhost/test');
    job.content.should.be.false;
  });

  it('should able to create a snapshot job without id', function () {
    var job = Job.snapshot('http://localhost/test');
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
    var job = Job.extract('http://localhost/test');
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
    var job = Job.snapshot('http://localhost/test');
    job.setData(data);
    job.getData().should.eql({
      image: 'http://localhost/test.png'
    });
  });

  it('should able to set status is unavailable', function () {
    var data = {
      status: false
    };
    var job = Job.snapshot('http://localhost/test');
    job.setData(data);
    job.status.should.be.false;
  });

  it('should able to set callback', function () {
    var callback = function () {};
    var job1 = Job.snapshot('http://localhost/test', callback)
      , job2 = Job.extract('http://localhost/test', callback);
    job1.callback.should.equal(callback);
    job2.callback.should.equal(callback);
  });
});