module.exports = (function () {
  "use strict"

  var maxLength = require('../../config').maxCache
    , cacheMap = {}
    , cacheList = [];

  function _remove() {
    var url = cacheList.shift();
    cacheMap[url] = null;
    delete cacheMap[url];
  }

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
    data.status = true;
    job.setData(data);
    return fail(job);
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
      return _remove();
    }
  }

  return {
    filter: filter,
    cache: cache
  };

})();