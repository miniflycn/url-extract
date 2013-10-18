/*!
 * url-extract - jobTimer
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gmail.com>
 * MIT Licensed
 */
module.exports = function (fail, timeout, cycleTime) {
  "use strict";
  var jobPool = require('./jobPool');

  var _jobList = []
    , _timer
    , timeout = timeout || 60000
    , cycleTime = cycleTime || 10000;

  /**
   * push
   * @param {jobList} jobList
   */
  function push(jobList) {
    var len = jobList.length
      , i = 0
      , job;
    for (; i < len; i++) {
      job = jobList[i];
      job.setTime();
      _jobList.push(job);
    }
  }

  /**
   * check
   */
  function check() {
    // 1 min
    if (_jobList.length) {
      var job = _jobList.shift();
      if (((new Date()) - job.getTime()) > timeout) {
        fail(job);
        jobPool.remove(job.id);
        return check();
      } else {
        _jobList.unshift(job);
      }
    }
    _timer = setTimeout(function () {
      check();
    }, cycleTime);
  }

  /**
   * done
   * @param {String} jobId
   */
  function done(jobId) {
    for (var i = _jobList.length; i--;) {
      if (_jobList[i].id === jobId) {
        return _jobList.splice(i, 1);
      }
    }
  }

  /**
   * destroy
   */
  function destroy() {
    clearTimeout(_timer);
    _jobList = [];
  }

  check();

  return {
    push: push,
    check: check,
    done: done,
    destroy: destroy
  };
};