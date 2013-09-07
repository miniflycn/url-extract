var assert = require('assert')
	, Job = require('../lib/Job')
	, jobPool = require('../lib/jobPool');

describe('jobPool', function () {
  it('should able to cache job', function () {
    var job1 = Job.extract('http://localhost/test1')
      , job2 = Job.extract('http://localhost/test2')
      , job3 = Job.extract('http://localhost/test3')
      , jobList;
    jobPool.push(job1);
    jobPool.push(job2);
    jobPool.push(job3);
    jobList = jobPool.shift(3);
    jobList.length.should.equal(3);
  });

  it('should able to get a job', function () {
    var job = Job.extract('http://localhost/test4')
      , id = job.id;
    jobPool.push(job);
    jobPool.shift(1);
    jobPool.get(job.id).should.equal(job);
  });

  it('should able to push some jobs at a time', function () {
    var job1 = Job.extract('http://localhost/test5')
      , job2 = Job.extract('http://localhost/test6')
      , jobList;
    jobPool.push([job1, job2]);
    jobList = jobPool.shift(5);
    jobList.length.should.equal(2);
  });

  it('should able to count jobs', function () {
    var job1 = Job.extract('http://localhost/test7')
      , job2 = Job.extract('http://localhost/test8')
      , job3 = Job.extract('http://localhost/test9')
      , job4 = Job.extract('http://localhost/test10');
    jobPool.push([job1, job2, job3, job4]);
    jobPool.count().should.equal(4);
    jobPool.shift(4);
  });
});