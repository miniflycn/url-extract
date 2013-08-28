var assert = require('assert')
  , fs = require('fs')
  , jobMan = require('../lib/jobMan.js')
  , mockRes = require('./tool/mockRes.js');

describe('jobMan', function (done) {
  it('should able to pipe the job to file', function (done) {
    fs.writeFileSync('./bridge/0.txt', '');
    fs.writeFileSync('./bridge/1.txt', '');
    fs.writeFileSync('./bridge/2.txt', '');

    jobMan.register('test', [
      {
        campaignId: 'test',
        url: 'http://localhost/test0',
        content: 1
      },
      {
        campaignId: 'test',
        url: 'http://localhost/test1',
        content: 1
      },
      {
        campaignId: 'test',
        url: 'http://localhost/test2',
        content: 1
      }
    ]);

    setTimeout(function () {
      fs.readFile('./bridge/0.txt', { encoding: 'utf-8' }, function (err, data) {
        data.should.equal('test,http://localhost/test2,1\n');
        done();
      });
    }, 50);
  });

});