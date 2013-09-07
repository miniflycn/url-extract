module.exports = (function () {
  "use strict"
  var _pool = {}
    , _stack = []
    , _toString = Object.prototype.toString;

  function _isArray(obj) {
    return (_toString.call(obj) === '[object Array]');
  };

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
    if (!_isArray(job)) {
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
      list = _stack.slice(0, num);
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
   * count
   */
  function count() {
    return _stack.length;
  }

  return {
    push: push,
    shift: shift,
    get: get,
    count: count
  };

})();