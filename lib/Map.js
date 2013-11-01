/*!
 * url-extract - Map
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gmail.com>
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";

  /**
   * Map
   * @class
   */
  function Map() {
    this.map = {};
    this._len = 0;
  }
  Map.prototype = {
    constructor: Map,
    /**
     * set
     * @param {String} key
     * @param {Any} value
     * @return {value or Boolean}
     */
    set: function (key, value) {
      return (!this.has() && ++this._len && (this.map[key] = value)); 
    },
    /**
     * has
     * @param {String} key
     * @return {Boolean}
     */
    has: function (key) {
      return (key in this.map);
    },
    /**
     * get(key)
     * get(judge)
     * @param {String} key
     * @param {Function} judge
     * @return {value or null}
     */
    get: function (key) {
      var map = this.map
        , tmp
        , value;
      key = key || function () { return true; };
      if (typeof key === 'string') {
        return (map[key] || null);
      } else if (typeof key === 'function') {
        for (tmp in map) {
          value = map[tmp];
          if (key(value)) return value;
        }
      }
      return null;
    },
    /**
     * contains
     * @param {Unless null} value
     * @return {Boolean}
     */
    contains: function (value) {
      return !(this.get(function (_value) {
        if (value === _value) return true;
        return false;
      }) === null);
    },
    /**
     * remove
     * @param {String} key
     * @return {value or null}
     */
    remove: function (key) {
      var value;
      if (value = this.get(key)) {
        this.map[key] = null;
        delete this.map[key];
        --this._len;
        return value;
      } else {
        return null;
      }
    },
    /**
     * each
     * @param {Function} foo
     */
    each: function (foo) {
      var map = this.map
        , key
        , value;
      for (key in map) {
        if (!foo(map[key])) break;
      }
    },
    /**
     * clear
     */
    clear: function () {
      this.map = {};
      this._len = 0;
    }
  }

  // define length
  Object.defineProperty(Map.prototype, 'length', {
    get: function() {
      return this._len;
    }
  });

  return Map;
})();