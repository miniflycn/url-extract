module.exports = (function () {
  var config = require('../config')
    , emitter = (typeof process === 'object') && new (require('events').EventEmitter)()
    , isChange = false;

  function get() {
    return config;
  }

  function set(opts) {
    var opt;
    for (opt in opts) {
      if (opt in config) config[opt] = opts[opt];
    }
    emitter && emitter.emit('set', opts);
    isChange || (isChange = true);
    return config;
  }

  function changed(boolean) {
    if (!arguments.length) return isChange;
    return (isChange = boolean);
  }

  return {
    get: get,
    set: set,
    on: emitter && emitter.on.bind(emitter),
    off: emitter && emitter.removeListener.bind(emitter),
    changed: changed
  };

})();