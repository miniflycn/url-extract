module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , config = require('../config')
    , bridge = require('./bridge')
    , cache = require('./cache/' + config.cache)
    , Job = require('./Job')
    , jobPool = require('./jobPool');

  var _callback
    , _freeWorker = []
    , _toStringApply = Object.prototype.toString.apply;

  function _isArray(arr) {
    return (_toStringApply(arr) === '[object Array]');
  };

  /**
   * jobTimer
   * @static
   * @class
   */
  var jobTimer = {
    jobList: [],
    /**
     * push
     * @param {jobList} jobList
     */
    push: function (jobList) {
      var len = jobList.length
        , i = 0
        , job;
      for (; i < len; i++) {
        job = jobList[i];
        job.setTime();
        this.jobList.push(job);
      }
    },
    /**
     * check
     */
    check: function () {
      // 1 min
      var that = this;
      if (this.jobList.length) {
        var job = this.jobList.shift();
        if (((new Date()) - job.getTime()) > 60000) {
          _onData({
            id: job.id,
            url: job.url,
            status: false 
          });
          return this.check();
        } else {
          this.jobList.unshift(job);
        }
      }
      setTimeout(function () {
        that.check();
      }, 10000);
    },

    done: function (jobId) {
      for (var i = this.jobList.length; i--;) {
        if (this.jobList[i].id === jobId) {
          return this.jobList.splice(i, 1);
        }
      }
    }
  };
  jobTimer.check();

  function _onGet(connectionId, num) {
    var jobList = jobPool.shift(num)
      , len = jobList.length;
    if (len > 0) {
        bridge.send(connectionId, jobList);
        jobTimer.push(jobList);
      if (len < num) {
        _freeWorker.push({
          connectionId: connectionId,
          num: num - len
        });
      }
    } else {
      _freeWorker.push({
        connectionId: connectionId,
        num: num
      });
    }
  }

  function _onData(data) {
    var job = jobPool.get(data.jobId);
    job.setData(data);
    job.callback ? job.callback(job) : _callback(job);
    jobTimer.done(data.jobId);
  }

  // init
  bridge.init({
    onGet: _onGet,
    onData: _onData
  });

  function _success(job) {
    jobPool.push(job);
    if (_freeWorker.length > 0) {
      var param = _freeWorker.shift();
      return _onGet(param.connectionId, param.num);
    }
  }

  function _push(job) {
    return cache.filter(job, _success, _callback);
  }

  /**
   * extract(groupId, url)
   * extract(url)
   * @param {String} groupId
   * @param {String} url
   */
  function extract(groupId, url) {
    var job = Job.extract(groupId, url);
    _push(job);
    return job;
  }

  /**
   * snapshot(groupId, url)
   * snapshot(url)
   * @param {String} groupId
   * @param {String} url
   */
  function snapshot(groupId, url) {
    var job = Job.snapshot(groupId, url);
    _push(job);
    return job;
  }

  /**
   * bind
   * @param {Function} callback
   */
  function bind(callback) {
    _callback = function (job) {
      cache.cache(job)
      callback(job);
    }
  }

  return {
    extract: extract,
    snapshot: snapshot,
    bind: bind
  };

})();