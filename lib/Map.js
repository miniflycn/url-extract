module.exports = (function () {
  "use strict"

  function Map() {
    this.map = {};
    this.length = 0;
  }
  Map.prototype = {
    constructor: Map,
    /**
     * count
     * @return {Number}
     */
    count: function () {
      return this.length;
    },
    /**
     * set
     * @param {String} key
     * @param {Any} value
     * @return {value or Boolean}
     */
    set: function (key, value) {
      return (!this.has() && ++this.length && (this.map[key] = value)); 
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
          if (key(value)) {
            return value;
          }
        }
      }
      return null;
    },

    /**
     * contains
     * @param {Any} value
     * @return {Boolean}
     */
    contains: function (value) {
      return !!this.get(function (_value) {
        if (value === _value) return true;
        return false;
      });
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
        --this.length;
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
        value = map[key];
        if (!foo(value)) {
          break;
        }
      }
    },

    /**
     * clear
     */
    clear: function () {
      this.map = {};
      this.length = 0;
    }
  }



  return Map;
})();