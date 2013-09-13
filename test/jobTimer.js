var assert = require('assert')
  , Job = require('../lib/Job')
  , jobTimer = require('../lib/jobTimer');

describe('fetch', function () {
  it('should able to push job', function () {
    var timer = jobTimer(function () {})
      , job1 = new Job('http://localhost/test1')
      , job2 = new Job('http://localhost/test2')
    timer.push([job1, job2]);
    timer.done(job1.id)[0].should.eql(job1);
    timer.done(job2.id)[0].should.eql(job2);
    timer.destroy();
  });

  it('should able to timeout', function (done) {
    var timer = jobTimer(function (_job) {
          _job.should.equal(job);
          timer.destroy();
          done();
        }, 30, 20)
      , job = new Job('http://localhost/test3');
    timer.push([job]);
  })
});