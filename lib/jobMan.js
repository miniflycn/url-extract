module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , child_process = require('child_process')
    , fetch = require('./fetch.js')
    , bridge = require('./bridge.js')
    , _jobs = {}
    , _workers = {}
    , _workingWorkers = []
    , _doneWorkers = []
    , _workerTimeout = 10000
    , _currWorkerNum = 0
    , _maxWorkers = 3;

  bridge.on('login', _login)
        .on('post', _fire)
        .on('done', _done);

  function _fire(workerId, opts) {
    var campaignId = opts.campaignId
      , job = _jobs[campaignId]
      , fetchObj = fetch(opts.html);

    if (job) {
      if (+opts.status && fetchObj.title) {
        job.urls.push({
          id: opts.id,
          url: opts.url,
          image: opts.image,
          title: fetchObj.title,
          description: fetchObj.description,
          status: +opts.status
        });
      } else {
        job.urls.push({
          id: opts.id,
          url: opts.url,
          status: +opts.status
        });
      }

      if (!job.waiting) {
        job.waiting = true;
        setTimeout(function () {
          _send(campaignId);
        }, 500);
      }
      job.finishNum ++;
    } else {
      console.log('job can not found!');
    }
  }

  function _getUrls(workerId, campaignId) {
    var job = _jobs[campaignId];
    if (job) {
      job.workerId = workerId;
      return job.cacheUrls;
    }
  }

  function _login(workerId, campaignId) {
    _workers[workerId] = {
      id: workerId
    };
    _workingWorkers.push(_workers[workerId]);
    bridge.send(workerId, {
      method: 'POST',
      urls: _getUrls(workerId, campaignId)
    });
  }

  function _done(workerId) {
    var worker;
    for (var i = _workingWorkers.length; i--;) {
      if (_workingWorkers[i].id === workerId) {
        worker = _workingWorkers[i];
        _workingWorkers.splice(i, 1);
        _doneWorkers.push(worker);
      }
    }
    if (worker) {
      setTimeout(function () {
        for (var i = _doneWorkers.length; i--;) {
          if (_doneWorkers[i] === worker) {
            _doneWorkers.splice(i, 1);
            bridge.send(worker.id, {
              method: 'CLOSE'
            });
            _workers[workerId] = null;
            delete _workers[workerId];
          }
        }
      }, _workerTimeout);
    }
  }

  function _send(campaignId) {
    var job = _jobs[campaignId];
    if (!job) return;
    if (job.waiting) {
      job.waiting = false;
      clearTimeout(job.timeout);
      var finished = (job.urlsNum === job.finishNum)
        , data = {
        campaignId: campaignId,
        urls: job.urls,
        finished: finished
      };
      job.urls = [];
      var res = job.res;
      if (finished) {
        _jobs[campaignId] = null;
        delete _jobs[campaignId]
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.statuCode = 200;
      res.end(JSON.stringify(data));
    }
  }

  function _makeWorkerDoJob(campaignId) {
    if (!_doneWorkers.length) {
      if (_currWorkerNum < _maxWorkers) {
        var commands = [
          'phantomjs',
          'snapshot.js',
          campaignId
        ];
        child_process.exec(commands.join(' '), function (err, stdout, stderr) {
          console.log(stdout);
          if (err !== null) console.log('exec error: ' + err);
        });
        _currWorkerNum++;
      } else {
        var worker = _workingWorkers.shift();
        _jobs[campaignId].workerId = worker.id;
        bridge.send(worker.id, {
          method: 'POST',
          urls: _jobs[campaignId].cacheUrls
        });
        _workingWorkers.push(worker);
      }
    } else {
      var worker = _doneWorkers.shift();
      _jobs[campaignId].workerId = worker.id;
      bridge.send(worker.id, {
        method: 'POST',
        urls: _jobs[campaignId].cacheUrls
      });
      _workingWorkers.push(worker);
    }
  }
  
  function register(campaignId, urls, req, res, next) {
    // campaignId is jobId
    _jobs[campaignId] = {
      workerId: undefined,
      urlsNum: urls.length,
      finishNum: 0,
      urls: [],
      cacheUrls: urls,
      res: null,
      waiting: false,
      timeout: null
    };
    _makeWorkerDoJob(campaignId);
    watch(campaignId, req, res, next);
  }

  function watch(campaignId, req, res, next) {
    _jobs[campaignId].res = res;
    // 20s timeout
    _jobs[campaignId].timeout = setTimeout(function () {
      _send(campaignId);
    }, 20000);
  }

  return {
    register: register,
    watch: watch
  };

})();