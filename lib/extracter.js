module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , isArray = require('util').isArray
    , config = require('../config')
    , bridge = require('./bridge')
    , cache = require('./cache/' + config.cache)
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
    if (job.callback) {
      job.callback(job);
      cache.cache(job);
    } else {
      _callback(job);
    }
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
    return cache.filter(job, _success, job.callback || _callback);
  }

  /**
   * extract(url)
   * extract(url, callback)
   * extract(urlList)
   * extract(urllist, callback)
   * extract(groupId, urlList, callback)
   * @param {String} groupId
   * @param {String} url
   * @param {Array} urlList
   * @param {Function} callback
   */
  function extract(groupId, url, callback) {
    var _groupIdIsArray = isArray(groupId)
      , _urlIsArray = isArray(url)
      , _job
      , job
      , urls
      , i;
    if (!_groupIdIsArray && !_urlIsArray) {
      job = Job.extract(groupId, url, callback);
      _push(job);
    } else {
      _groupIdIsArray && (urls = groupId) && !(groupId = null) && (callback = url);
      _urlIsArray && (urls = url);
      job = [];
      for (i = urls.length; i--;) {
        _job = new Job(groupId, urls[i], true, callback);
        job.push(_job);
        _push(_job);
      }
    }
    return job;
  }

  /**
   * snapshot(url)
   * snapshot(url, callback)
   * snapshot(urlList)
   * snapshot(urllist, callback)
   * snapshot(groupId, urlList, callback)
   * @param {String} groupId
   * @param {String} url
   * @param {Array} urlList
   * @param {Function} callback
   */
  function snapshot(groupId, url, callback) {
    var _groupIdIsArray = isArray(groupId)
      , _urlIsArray = isArray(url)
      , _job
      , job
      , urls
      , i;
    if (!_groupIdIsArray && !_urlIsArray) {
      job = Job.snapshot(groupId, url, callback);
      _push(job);
    } else {
      _groupIdIsArray && (urls = groupId) && !(groupId = null) && (callback = url);
      _urlIsArray && (urls = url);
      job = [];
      for (i = urls.length; i--;) {
        _job = new Job(groupId, urls[i], false, callback);
        job.push(_job);
        _push(_job);
      }
    }
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