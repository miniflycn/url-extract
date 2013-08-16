module.exports = (function () {
  "use strict"
  var fs = require('fs')
    , fetch = require('./fetch.js')
    , _jobs = {};

  function _send(campaignId){
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
  
  function register(campaignId, urls, req, res, next) {
    _jobs[campaignId] = {
      urlsNum: urls.length,
      finishNum: 0,
      urls: [],
      cacheUrls: urls,
      res: null,
      waiting: false,
      timeout: null
    };
    watch(campaignId, req, res, next);
  }

  function watch(campaignId, req, res, next) {
    _jobs[campaignId].res = res;
    // 20s timeout
    _jobs[campaignId].timeout = setTimeout(function () {
      _send(campaignId);
    }, 20000);
  }

  function fire(campaignId, id, url, image, html) {
    var job = _jobs[campaignId]
      , fetchObj = fetch(html);

    if (job) {
      job.urls.push({
        id: id,
        url: url,
        image: image,
        title: fetchObj.title,
        description: fetchObj.description
      });
      if (!job.waiting) {
        job.waiting = true;
        setTimeout(function () {
          _send(campaignId);
        }, 500);
      }
      job.finishNum ++;
    }
  }

  function getUrls(campaignId) {
    var job = _jobs[campaignId];
    if (job) return job.cacheUrls;
  }

  return {
    register: register,
    watch: watch,
    fire: fire,
    getUrls: getUrls
  };

})();



