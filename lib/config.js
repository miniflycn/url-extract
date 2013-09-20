/*!
 * url-extract - config
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gamil.com>
 * MIT Licensed
 */
module.exports = (function () {
  var config = require('../config')
    , emitter = (typeof process === 'object') && new (require('events').EventEmitter)()
    , isChange = false;

  /**
   * get
   * @return {Object}
   */
  function get() {
    return config;
  }

  /**
   * set
   * @param {Object} opts
   * @return {Object}
   */
  function set(opts) {
    var opt;
    for (opt in opts) {
      if (opt in config) config[opt] = opts[opt];
    }
    emitter && emitter.emit('set', opts);
    isChange || (isChange = true);
    return config;
  }

  /**
   * changed
   * @return {Boolean}
   */
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