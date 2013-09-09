var assert = require('assert')
  , Job = require('../lib/Job')
	, cache = require('../lib/cache/object')();

describe('object', function () {
  it('should able to remove a job', function () {
    var job = new Job('http://localhost/test');
    cache.cache(job);
    cache.remove().should.eql(job.getData());
  });

  it('should able to filter the extract a url job has done before', function (done) {
    cache.filter(new Job('http://localhost/test1', true), function (job) {
      job.setData({
        title: 'title',
        description: 'description',
        image: 'http://localhost/test1.png',
        status: true
      });
      cache.cache(job);

      cache.filter(new Job('http://localhost/test1', true), function () {}, function (job) {
        job.getData().should.eql({
          title: 'title',
          description: 'description',
          image: 'http://localhost/test1.png'
        });
        done();
      });
    }, function () {});
  });

  it('should able to filter the snapshot job has done before', function (done) {
    cache.filter(new Job('http://localhost/test2', false), function (job) {
      job.setData({
        image: 'http://localhost/test2.png',
        status: true
      });
      cache.cache(job);

      cache.filter(new Job('http://localhost/test2', false), function () {}, function (job) {
        job.getData().should.eql({
          image: 'http://localhost/test2.png'
        });
        done();
      });
    }, function () {});
  });

  it('should able to filter the snapshot job when extract the same url job has done before.', function (done) {
    cache.filter(new Job('http://localhost/test3', true), function (job) {
      job.setData({
        title: 'title',
        description: 'description',
        image: 'http://localhost/test3.png',
        status: true
      });
      cache.cache(job);

      cache.filter(new Job('http://localhost/test3', false), function () {}, function (job) {
        job.getData().should.eql({
          image: 'http://localhost/test3.png'
        });
        done();
      })
    }, function () {});
  });

  it('should not filter the extract url job unless it get all data', function (done) {
    cache.filter(new Job('http://localhost/test4', false), function (job) {
      job.setData({
        image: 'http://localhost/test4.png',
        status: true
      });
      cache.cache(job);

      var job2 = new Job('http://localhost/test4', true);
      cache.filter(job2, function (job) {
        job.should.equal(job2);
        done();
      }, function () {})
    }, function () {});
  });
});