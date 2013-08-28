var assert = require('assert')
  , fetch = require('../lib/fetch.js');

describe('fetch', function () {
  it('should get the title from html string', function () {
    var fetchObj = fetch('<html><title>test</title></html>');
    fetchObj.title.should.equal('test');
    fetchObj.description.should.equal('No Description');
  });

  it('should get the description from html string', function () {
    var fetchObj = fetch('<html><head><meta name="description" content="Hello world" /></head></html>');
    fetchObj.title.should.equal('No Title');
    fetchObj.description.should.equal('Hello world');
  });

  it('should get the title as "No Title", when the title is null', function () {
    var fetchObj = fetch('<html><head><title></title></head></html>');
    fetchObj.title.should.equal('No Title');
  });
});