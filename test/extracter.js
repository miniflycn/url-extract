/*var assert = require('assert')
  , connect = require('connect')
	, extracter = require('../lib/extracter');

var testSever = connect().use('test', function (req, res, next) {
                  res.end('<html><title>test</title></html>')
                }).listen(7777);


describe('extracter', function () {
  it('shold able to create a extract url job', function (done) {
    var _job;
    extracter.bind(function (job) {
      console.log('lalal');
      job.should.equal(_job);
      done();
    });
    _job = extracter.extract('http://localhost:7777/test/1');
  });

  it('should able to create some extract url jobs', function () {
    extracter.bind(function () {});
    var jobs = extracter.extract(['http://localhost/test/2', 'http://localhost/test/3']);
    jobs.length.should.equal(2);
  });
});*/