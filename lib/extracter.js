module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , isArray = require('util').isArray
    , config = require('../config')
    , bridge = require('./bridge')
    , cache = require('./cache/' + config.cache)()
    , Job = require('./Job')
    , jobPool = require('./jobPool');

  var _callback
    , _freeWorker = [];

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
          _onData(job.fail());
          jobPool.remove(job.id);
          return this.check();
        } else {
          this.jobList.unshift(job);
        }
      }
      setTimeout(function () {
        that.check();
      }, 10000);
    },

    /**
     * done
     * @param {String} jobId
     */
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
    var job = data instanceof Job ? data : jobPool.get(data.jobId);
    if (job) {
      job.setData(data);
      if (job.callback) {
        job.callback(job);
        job.cache && cache.cache(job);
      } else {
        _callback(job);
      }
      jobTimer.done(data.jobId);
    } else {
      // Timeout job is done.
    }
  }

  // init
  bridge.init({
    onGet: _onGet,
    onData: _onData,
    workerNum: config.workerNum
  });

  function _success(job) {
    jobPool.push(job);
    if (_freeWorker.length > 0) {
      var param = _freeWorker.shift();
      return _onGet(param.connectionId, param.num);
    }
  }

  function _push(job) {
    (config.maxQueueJob > jobTimer.jobList.length) ?
      (job.cache ? cache.filter(job, _success, job.callback || _callback) : _success(job)) :
      (_onData(job.fail()));
  }

  function _create(url, opt, content) {
    (typeof opt === 'function') && (opt = { callback: opt });
    var job
      , jobList = []
      , i;
    if (isArray(url)) {
      opt.id && (opt.id = undefined);
      opt.image && (opt.image = undefined);
      for (i = url.length; i--;) {
        job = new Job(url[i], opt, content);
        jobList.push(job);
        _push(job);
      }
      return jobList;
    } else {
      job = new Job(url, opt, content);
      _push(job);
      return job;
    }
  }

  /**
   * extract(url[s], opt)
   * extract(url[s], callback)
   * @param {String} url
   * @param {Array} urls
   * @param {Object} opt
   * @option {String} id
   * @option {String} groupId
   * @option {Function} callback
   * @option {Boolean} ignoreCache
   * @option {String} image
   */
  function extract(url, opt) {
    return _create(url, opt, true);
  }

  /**
   * snapshot(url[s], opt)
   * snapshot(url[s], callback)
   * @param {String} url
   * @param {Array} urls
   * @param {Object} opt
   * @option {String} id
   * @option {String} groupId
   * @option {Function} callback
   * @option {Boolean} ignoreCache
   * @option {String} image
   */
  function snapshot(url, opt) {
    return _create(url, opt, false);
  }

  /**
   * bind
   * @param {Function} callback
   */
  function bind(callback) {
    _callback = function (job) {
      job.cache && cache.cache(job)
      callback(job);
    }
  }

  /**
   * reset(num, callback)
   * reset(num)
   * reset(callback)
   * reset()
   * @param {Number} num
   * @param {Function} callbac
   */
  function reset(num, callback) {
    callback = callback || ((typeof num === 'function') ? num : undefined);
    num = num || -1;
    var worker;
    for (var i = _freeWorker.length; i--;) {
      if (_freeWorker[i].num === config.maxJob) {
        worker = _freeWorker[i];
        _freeWorker.splice(i, 1);
        bridge.close(worker.connectionId, callback);
        if (!(--num)) break;
      }
    }
  }

  return {
    extract: extract,
    snapshot: snapshot,
    bind: bind,
    reset: reset
  };

})();