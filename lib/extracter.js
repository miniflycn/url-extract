/*!
 * url-extract - Snapshot & extract url library
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gmail.com>
 * MIT Licensed
 */
"use strict";
var _extracter
  , configMod = require('./config');

module.exports = function (opts) {
  if (!_extracter){
    return (function (opts) {
      opts && configMod.set(opts);
      var fs = require('fs')
        , isArray = require('util').isArray
        , config = configMod.get()
        , bridge = require('./bridge')
        , cache = require('./cache/' + config.cache)()
        , Job = require('./Job')
        , jobPool = require('./jobPool')
        , Map = require('./Map')
        , jobTimer = require('./jobTimer')(function (job) {
            _onData(job.fail());
          })
        , validUrl = /^https?:\/\//;

      var _noop = function () {}
        , _callback = _noop
        , _freeWorker = new Map()
        , _connectionId2jobList = new Map()
        , _job2connectionId = {};

      function _pushFreeWorker(connectionId, num) {
        var free = _freeWorker.get(connectionId);
        if (free) {
          free.num = num;
        } else {
          _freeWorker.set(connectionId, {
            connectionId: connectionId,
            num: num
          });
        }
      }

      function _pushJobList(connectionId, jobList) {
        for (var i = jobList.length; i--;) {
          _job2connectionId[jobList[i].id] = connectionId;
        }

        var list = _connectionId2jobList.get(connectionId);
        if (list) {
          _connectionId2jobList.remove(connectionId);
          list = list.concat(jobList);
          _connectionId2jobList.set(connectionId, list);
        } else {
          _connectionId2jobList.set(connectionId, jobList);
        }
      }

      function _finishJob(jobId) {
        var connectionId = _job2connectionId[jobId];
        if (connectionId) {
          var jobList = _connectionId2jobList.get(connectionId);
          for (var i = jobList.length; i--;) {
            if (jobId === jobList[i].id) {
              var j = jobList.splice(i, 1);
            }
          }
          _job2connectionId[jobId] = null;
          delete _job2connectionId[jobId];
        }
      }

      function _onGet(connectionId, num) {
        // console.log('connectionId: ' + connectionId + ' get num: ' + num);
        var jobList = jobPool.shift(num)
          , len = jobList.length;
        if (len > 0) {
          bridge.send(connectionId, jobList);
          _pushJobList(connectionId, jobList);
          jobTimer.push(jobList);
          len < num ? _pushFreeWorker(connectionId, num - len) : _freeWorker.remove(connectionId);
        } else {
          _pushFreeWorker(connectionId, num);
        }
      }

      function _onData(data) {
        var job = data instanceof Job ? data : jobPool.get(data.jobId);
        if (job) {
          job.setData(data);
          if (job.callback) {
            job.cache && cache.cache(job);
            job.callback(job);
          } else {
            job.cache && cache.cache(job);
            _callback(job);
          }
          var j = jobTimer.done(data.jobId);
          _finishJob(data.jobId);
        } else {
          // Timeout job is done.
        }
      }

      function _onDied(connectionId) {
        // console.log ('connectionId: ' + connectionId + ' Died.');
        var jobList = _connectionId2jobList.get(connectionId);
        _connectionId2jobList.remove(connectionId);
        var unfinish = [];
        if (jobList) {
          for (var i = 0; i < jobList.length; i++) {
            var jobs = jobTimer.done(jobList[i].id);
            if (typeof jobs != 'undefined' && jobs.length > 0 && jobs[0] instanceof Job) {
              unfinish.push(jobs[0]);
            }
          }
          if (unfinish.length > 0)
            _success(unfinish, true);

          console.log('unfinish job: ' + unfinish.length);
        }
      }


      // init
      bridge.init({
        onGet: _onGet,
        onData: _onData,
        onDied: _onDied,
        workerNum: config.workerNum
      });

      function _success(job, isPriority) {
        isPriority ? jobPool.unshift(job) : jobPool.push(job);
        if (_freeWorker.length > 0) {
          var param = _freeWorker.get();
          return _onGet(param.connectionId, param.num);
        }

      }

      function _checkMaxJob(num) {
        return (config.maxQueueJob ? (config.maxQueueJob >= jobPool.count() + num) : true);
      }

      function _filter(job) {
        return job.cache ? cache.filter(job, _success, job.callback || _callback) : _success(job);
      }

      function _push(job) {
        var i
          , _job;
        if (isArray(job)) {
          if (_checkMaxJob(job.length)) {
            for (i = job.length; i--;) {
              _job = job[i];
              validUrl.test(_job.url) ? 
                _filter(_job) :
                _onData(_job.fail());
            }
            return job;
          } else {
            for (i = job.length; i--;) {
              _onData(job[i].fail());
            }
            return false;
          }
        } else {
          if (_checkMaxJob(1) && validUrl.test(job.url)) {
            _filter(job);
            return job;
          } else {
            _onData(job.fail());
            return false;
          }
        }
      }

      function _create(url, opt, content) {
        (typeof opt === 'function') ? (opt = { callback: opt }) :
          (typeof opt === 'string') && (opt = { image : opt });
        var job
          , jobList = []
          , i;
        if (isArray(url)) {
          if (opt) {
            opt.id && (opt.id = undefined);
            opt.image && (opt.image = undefined);
          }
          for (i = url.length; i--;) {
            job = new Job(url[i], opt, content);
            jobList.push(job); 
          }
          return _push(jobList);
        } else {
          job = new Job(url, opt, content);
          return _push(job);
        }
      }

      /**
       * extract(url[s], opt)
       * extract(url[s], callback)
       * extract(url, image)
       * @param {String} url
       * @param {Array} urls
       * @param {Object} opt
       * @option {String} id
       * @option {String} groupId
       * @option {Function} callback
       * @option {Boolean} ignoreCache
       * @option {Object} viewportSize
       * @option {Object} clipRect
       * @option {Number} zoomFactor
       * @option {String} image
       */
      function extract(url, opt) {
        return _create(url, opt, true);
      }

      /**
       * snapshot(url[s], opt)
       * snapshot(url[s], callback)
       * snapshot(url, image)
       * @param {String} url
       * @param {Array} urls
       * @param {Object} opt
       * @option {String} id
       * @option {String} groupId
       * @option {Function} callback
       * @option {Boolean} ignoreCache
       * @option {Object} viewportSize
       * @option {Object} clipRect
       * @option {Number} zoomFactor
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
        _callback = callback ? callback : _noop;
      }

      /**
       * reset(num, callback)
       * reset(num)
       * reset(callback)
       * reset()
       * @param {Number} num
       * @param {Function} callback
       */
      function reset(num, callback) {
        callback = callback || ((typeof num === 'function') ? num : undefined);
        num = num || -1;
        _freeWorker.each(function (worker) {
          if (worker.num === config.maxJob) {
            bridge.close(worker.connectionId, callback);
            _freeWorker.remove(worker.connectionId);
            if (!(--num)) return false;
          }
          return true;
        });
      }

      function close() {
        _freeWorker.each(function (worker) {
          bridge.close(worker.connectionId);
          _freeWorker.remove(worker.connectionId);
        });
      }

      _extracter = {
        extract: extract,
        snapshot: snapshot,
        bind: bind,
        reset: reset,
        opt: configMod.set,
        quick: jobPool.quick,
        close: close
      };

      return _extracter;
    })(opts);
  } else {
    if (opts) throw new Error('Sorry, url-extract could not be initialized more than one time.');
    return _extracter;
  }
};