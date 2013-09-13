module.exports = (function () {
  "use strict"
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
    for (var i = _stack.length; i--;) {
      if (_stack[i].id === id) {
        _stack.splice(i, 1);
        break;
      }
    }
    return get(id);
  }

  /**
   * count
   * @return {Number}
   */
  function count() {
    return _stack.length;
  }

  return {
    push: push,
    shift: shift,
    get: get,
    remove: remove,
    count: count
  };

})();