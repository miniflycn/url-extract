module.exports = (function () {
  "use strict"
  var _pool = {}
    , _stack = [];

  function push(job) {
    _stack.push(job);
    _pool[job.id] = job;
  }

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

  function get(id) {
    var job = _pool[id];
    _pool[id] = null;
    delete _pool[id];
  }

  return {
    push: push,
    shift: shift,
    get: get
  };

})();