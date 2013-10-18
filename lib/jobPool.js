/*!
 * url-extract - jobPool
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gmail.com>
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";
  var isArray = require('util').isArray;

  var _pool = {}
    , _stack = [];

  function _push(job) {
    _stack.push(job);
    _pool[job.id] = job;
  }

  /**
   * push(job)
   * push(jobList)
   * @param {Job} job
   * @param {Array} jobList
   */
  function push(job) {
    if (!isArray(job)) {
      return _push(job);
    } else {
      for (var i = job.length; i--;) {
        _push(job[i]);
      }
    }
  }

  /**
   * unshift
   * @param {Job} job
   */
  function unshift(job) {
    _stack.unshift(job);
    _pool[job.id] = job;
  }

  /**
   * shift
   * @param {Number} num
   */
  function shift(num) {
    var len = _stack.length
      , list;
    if (num < len) {
      list = _stack.splice(0, num);
    } else {
      list = _stack;
      _stack = [];
    }
    return list;
  }

  /**
   * get
   * @param {String} id
   */
  function get(id) {
    var job = _pool[id];
    if (job) {
      _pool[id] = null;
      delete _pool[id];
      return job;
    } else {
      return null;
    }
  }

  /**
   * remove
   * @param {String} id
   */
  function remove(id) {
    var job = _pool[id];
    if (job) {
      for (var i = _stack.length; i--;) {
        if (_stack[i] === job) {
          _stack.splice(i, 1);
          break;
        }
      }
      return get(id);
    } else {
      return null;
    }
  }

  /**
   * count
   * @return {Number}
   */
  function count() {
    return _stack.length;
  }

  /**
   * quick
   * @param {String} id
   */
  function quick(id) {
    var job = remove(id);
    if (job) {
      return unshift(job);
    }
  }

  return {
    push: push,
    shift: shift,
    unshift: unshift,
    get: get,
    remove: remove,
    count: count,
    quick: quick
  };

})();