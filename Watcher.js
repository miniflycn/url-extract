module.exports = (function () {
  "use strict"
  var fs = require('fs')
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
        _watchers[timestamp].watcher.close();
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
      fileMap: {},
      res: null,
      timeout: false
    };
    watch(timestamp, req, res, next);
  }

  function watch(timestamp, req, res, next) {
    var watcher = _watchers[timestamp];
    watcher.res = res;
    watcher.watcher = fs.watch(__dirname + '/snapshot/' + timestamp, function (event, filename) {
      if (event === 'rename') watcher.fileMap[filename] = 0;
      if (event === 'change') watcher.fileMap[filename]++;
      if (watcher.fileMap[filename] === 3) {
        watcher.finishNum ++;
        watcher.urls.push('http://localhost:3000/snapshot/' + timestamp + '/' + filename);
        if (!watcher.timeout){
          watcher.timeout = true;
          setTimeout(function () {
            _send(timestamp);
          }, 500);
        }
      }
    });
    // 20s timeout
    setTimeout(function () {
      _send(timestamp);
    }, 20000)
  }

  return {
    register: register,
    watch: watch
  };

})();



