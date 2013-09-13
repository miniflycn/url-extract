var assert = require('assert')
  , Map = require('../lib/Map');

describe('Map', function () {
  it('should able to set & get', function () {
    var map = new Map();
    assert.deepEqual(map.get('test'), null);
    map.set('test', 'text');
    map.get('test').should.equal('text');
  });

  it('should able to get the item number', function () {
    var map = new Map();
    map.count().should.equal(0);
    map.set('test', 'text');
    map.count().should.equal(1);
  });

  it('should able to judge key exists or not', function () {
    var map = new Map();
    map.has('test').should.be.false;
    map.set('test', 'text');
  });

  it('should able to get a value randomly', function () {
    var map = new Map();
    map.set('test', 'text');
    map.get().should.equal('text');
  });

  it('should able to get a item by function', function () {
    var map = new Map();
    map.set('test', 'text');
    map.get(function (value) {
      if (value === 'text') {
        return true;
      }
      return false;
    }).should.equal('text');
    assert.deepEqual(map.get(function (value) { return false; }), null);
  });

  it('should able to remove a key', function () {
    var map = new Map();
    map.set('test', 'text');
    map.remove('test');
    map.has('test').should.be.false;
    assert.deepEqual(map.remove('test'), null);
  });

  it('should able to do with each item', function () {
    var map = new Map();
    map.set('test', 'text');
    map.each(function (value) {
      value.should.equal('text');
    });
  });

  it('should able to clear', function () {
    var map = new Map();
    map.set('test', 'text');
    map.count().should.equal(1);
    map.clear();
    map.count().should.equal(0);
  });

  it('should able to judge if it contains a value', function () {
    var map = new Map();
    map.set('test', 'text');
    map.contains('text').should.be.true;
    map.contains('test').should.be.false;
  });
});