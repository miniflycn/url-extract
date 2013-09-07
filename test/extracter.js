var assert = require('assert')
  , fs = require('fs')
  , connect = require('connect')
	, extracter = require('../lib/extracter');

var testSever = connect().use('/test', function (req, res, next) {
                  res.end('<html><head><title>test</title><meta name="description" content="Just a test." /></head></html>')
                }).listen(7777);


function makeSureImage(image, done) {
  if (fs.existsSync(image)) {
    fs.unlinkSync(image);
    fs.rmdirSync(image.slice(0, image.lastIndexOf('/') + 1));
    done && done();
  }
}

describe('extracter', function () {
  it('should able to create a extract url job', function (done) {
    var _job;
    extracter.bind(function (job) {
      job.id.should.equal(_job.id);
      job.title.should.equal('test');
      job.description.should.equal('Just a test.');
      makeSureImage(job.image, done)
    });
    _job = extracter.extract('http://localhost:7777/test/1');
  });

  it('should able to create a snapshot url job', function (done) {
    var _job;
    extracter.bind(function (job) {
      job.id.should.equal(_job.id);
      job.content.should.be.false;
      makeSureImage(job.image, done);
    });
    _job = extracter.snapshot('http://localhost:7777/test/2');
  });
});