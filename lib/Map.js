module.exports = (function () {
  "use strict"

  function Map() {
    this.map = {};
    this.length = 0;
  }
  Map.prototype = {
    constructor: Map,
    count: function () {
      return this.length;
    },
    set: function (key, value) {
      return (!this.has() && ++this.length && (this.map[key] = value)); 
    },
    has: function (key) {
      return (key in this.map);
    },
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
    }
  }



  return Map;
})();