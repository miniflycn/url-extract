/*!
 * url-extract - cache.object
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gamil.com>
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";

  var maxLength = require('../../config').maxCache
    , cacheMap = {}
    , cacheList = [];

  /**
   * filter
   * @param {Job} job
   * @param {Function} success
   * @param {Function} fail
   */
  function filter(job, success, fail) {
    var data = cacheMap[job.url];
    if (!data || (job.content && (!data.title && !data.description))) {
      return success(job);
    }
    if (!job.image || data.image === job.image) {
      data.status = true;
      job.setData(data);
      return fail(job);
    } else {
      require('../copyFile')(data.image, job.image, function (err) {
        if (err) throw err;
        return success(job);
      });
    }
  }

  /**
   * cache
   * @param {Job} job
   */
  function cache(job) {
    var data = job.getData();
    cacheMap[job.url] = data;
    cacheList.push(job.url);
    if (cacheList.length > maxLength) {
      return remove();
    }
  }

  /**
   * remove
   * @return cache
   */
  function remove() {
    var url = cacheList.shift()
      , cache = cacheMap[url];
    cacheMap[url] = null;
    delete cacheMap[url];
    return cache
  }

  return {
    filter: filter,
    cache: cache,
    remove: remove
  };

});