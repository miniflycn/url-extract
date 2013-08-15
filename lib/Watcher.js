module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , fetch = require('./fetch.js')
    , _watchers = {};

  function _send(timestamp){
    var watcher = _watchers[timestamp];
    if (!watcher) return;
    if (watcher.timeout) {
      watcher.timeout = false;
      var finished = (watcher.urlsNum === watcher.finishNum)
        , data = {
        timestamp: timestamp,
        urls: watcher.urls,
        finished: finished
      };
      watcher.urls = [];
      var res = watcher.res;
      if (finished) {
        _watchers[timestamp] = null;
        delete _watchers[timestamp]
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.statuCode = 200;
      res.end(JSON.stringify(data));
    }
  }
  
  function register(timestamp, urlsNum, req, res, next) {
    _watchers[timestamp] = {
      watcher: null,
      urlsNum: urlsNum,
      finishNum: 0,
      urls: [],
      res: null,
      timeout: false
    };
    watch(timestamp, req, res, next);
  }

  function watch(timestamp, req, res, next) {
    _watchers[timestamp].res = res;
    // 20s timeout
    setTimeout(function () {
      _send(timestamp);
    }, 20000)
  }

  function fire(timestamp, id, url, image, html) {
    var watcher = _watchers[timestamp]
      , fetchObj = fetch(html);

    watcher.urls.push({
      id: id,
      url: url,
      image: image,
      title: fetchObj.title,
      description: fetchObj.description
    });
    if (!watcher.timeout) {
      watcher.timeout = true;
      setTimeout(function () {
        _send(timestamp);
      }, 500);
    }
    watcher.finishNum ++;
  }

  return {
    register: register,
    watch: watch,
    fire: fire
  };

})();



