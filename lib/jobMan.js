module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , bridge = require('./bridge.js')
    , filter = require('./filter.js')
    , jobPool = require('./jobPool.js');

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
    check: function() {
      // 1 min
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
      setTimeout(this.check, 10000);
    }
  };
  jobTimer.check();

  function _onGet(connectionId, num) {
    var jobList = jobPool.shift(num);
    if (jobList.length > 0) {
      bridge.send(connectionId, jobList);
      jobTimer.push(jobList);
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
    _callback(job);
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

  /**
   * push
   * @param {Job} job
   */
  function push(job) {
    return filter(job, _success, _callback);
  }

  /**
   * bind
   * @param {Function} callback
   */
  function bind(callback) {
    _callback = callback;
  }

  return {
    bind: bind,
    push: push
  };

})();