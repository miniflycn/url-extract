var assert = require('assert')
	, Job = require('../lib/Job')
	, jobPool = require('../lib/jobPool');

describe('jobPool', function () {
	it('should able to cache job', function () {
		var job1 = Job.fetch('http://localhost/test1')
			, job2 = Job.fetch('http://localhost/test2')
			, job3 = Job.fetch('http://localhost/test3')
			, jobList;
		jobPool.push(job1);
		jobPool.push(job2);
		jobPool.push(job3);
		jobList = jobPool.shift(3);
		jobList.length.should.equal(3);
	});

	it('should able to get a job', function () {
		var job = Job.fetch('http://localhost/test4');
		jobPool.push(job);
		jobPool.shift(1);
		jobPool.get('http://localhost/test4').should.equal(job);
	});
});