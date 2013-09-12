var assert = require('assert')
  , fs = require('fs')
  , connect = require('connect')
  , extracter = require('../lib/extracter')
  , config = require('../config');

var testSever = connect().use('/test', function (req, res, next) {
                  res.end('<html><head><title>test</title><meta name="description" content="Just a test." /></head></html>')
                }).listen(7777);

var _image;

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
      makeSureImage(job.image, done);
    });
    _job = extracter.extract('http://localhost:7777/test/1');
  });

  it('should able to create a snapshot url job', function (done) {
    var _job;
    extracter.bind(function (job) {
      job.id.should.equal(_job.id);
      job.content.should.be.false;
      makeSureImage(job.image, done);
      extracter.bind();
    });
    _job = extracter.snapshot('http://localhost:7777/test/2');
  });

  it('should able to set a callback for a extract url job', function (done) {
    var _job = extracter.extract('http://localhost:7777/test/3', function (job) {
      job.id.should.equal(_job.id);
      job.content.should.be.true;
      _image = job.image;
      makeSureImage(job.image, done);
    });
  });

  it('should able to cache the same extract url job data', function (done) {
    var _job = extracter.extract('http://localhost:7777/test/3', function (job) {
      job.image.should.equal(_image);
      job.content.should.be.true;
      done();
    });
  });

  it('should able to set a callback for a snapshot url job', function (done) {
    var _job = extracter.snapshot('http://localhost:7777/test/4', function (job) {
      job.id.should.equal(_job.id);
      job.content.should.be.false;
      _image = job.image;
      makeSureImage(job.image, done);
    });
  });

  it('should able to cache the same snapshot url job data', function (done) {
    var _job = extracter.snapshot('http://localhost:7777/test/4', function (job) {
      job.image.should.equal(_image);
      job.content.should.be.false;
      done();
    });
  });

  it('should able to extract more than one url at a time', function (done) {
    var num = 1;
    extracter.extract(['http://localhost:7777/test/1', 'http://localhost:7777/test/3'], function (job) {
      if ((num++) === 2) return done();
    });
  });

  it('should able to snapshot more than one url at a time', function (done) {
    var num = 1;
    extracter.snapshot(['http://localhost:7777/test/2', 'http://localhost:7777/test/4'], function (job) {
      if ((num++) === 2) return done();
    });
  });

  it('should able to extract more than one url at a time with groupId', function (done) {
    var num = 1;
    extracter.extract(['http://localhost:7777/test/1', 'http://localhost:7777/test/3'], {
      groupId: 'test1',
      callback: function (job) {
        job.groupId.should.equal('test1');
        if ((num++) === 2) return done();
      }
    });
  });

  it('should able to snapshot more than one url at a time with groupId', function (done) {
    var num = 1;
    extracter.snapshot(['http://localhost:7777/test/2', 'http://localhost:7777/test/4'], {
      groupId: 'test2',
      callback: function (job) {
        job.groupId.should.equal('test2');
        if ((num++) === 2) return done();
      }
    });
  });

  it('should able to save the snapshot in a specified the path', function (done) {
    extracter.snapshot('http://localhost:7777/test/5', {
      image: './snapshot/test/test.png',
      callback: function (job) {
        makeSureImage('./snapshot/test/test.png', done);
      }
    });
  });

  it('should able to reset the free worker', function (done) {
    extracter.reset(1, function () {
      done();
    });
  });

  it('should able to make sure url is valid or not', function (done) {
    var _job = extracter.snapshot('localhost:7777/test/6', function (job) {
      job.status.should.be.false;
      done();
    });
    _job.should.be.false;
  });
});