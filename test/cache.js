var assert = require('assert')
  , fs = require('fs')
  , cache = require('../lib/cache/object')
  , Job = require('../lib/Job')
  , pkg = JSON.parse(fs.readFileSync('./package.json'));

describe('cache', function () {
  it('should able to filter the fetch a url job has done before', function (done) {
    cache.filter(Job.fetch('http://localhost/test1'), function (job) {
      job.setData({
        title: 'title',
        description: 'description',
        image: 'http://localhost/test1.png',
        status: true
      });
      cache.cache(job);

      cache.filter(Job.fetch('http://localhost/test1'), function () {}, function (job) {
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
    cache.filter(Job.snapshot('http://localhost/test2'), function (job) {
      job.setData({
        image: 'http://localhost/test2.png',
        status: true
      });
      cache.cache(job);

      cache.filter(Job.snapshot('http://localhost/test2'), function () {}, function (job) {
        job.getData().should.eql({
          image: 'http://localhost/test2.png'
        });
        done();
      });
    }, function () {});
  });

  it('should able to filter the snapshot job when fetch the same url job has done before.', function (done) {
    cache.filter(Job.fetch('http://localhost/test3'), function (job) {
      job.setData({
        title: 'title',
        description: 'description',
        image: 'http://localhost/test3.png',
        status: true
      });
      cache.cache(job);

      cache.filter(Job.snapshot('http://localhost/test3'), function () {}, function (job) {
        job.getData().should.eql({
          image: 'http://localhost/test3.png'
        });
        done();
      })
    }, function () {});
  });

  it('should not filter the fetch url job unless it get all data', function (done) {
    cache.filter(Job.snapshot('http://localhost/test4'), function (job) {
      job.setData({
        image: 'http://localhost/test4.png',
        status: true
      });
      cache.cache(job);

      var job2 = Job.fetch('http://localhost/test4');
      cache.filter(job2, function (job) {
        job.should.equal(job2);
        done();
      }, function () {})
    }, function () {});
  });
});