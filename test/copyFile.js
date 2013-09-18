var assert = require('assert')
  , fs = require('fs')
  , fileCopy = require('../lib/copyFile');

function makeSureFile(file, done) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    done && done();
  }
}

describe('config', function () {
  it('should able to copy file', function (done) {
    fileCopy('./package.json', './package.tmp', function (err) {
      if (err) throw err;
      makeSureFile('./package.tmp', done);
    });
  });
});