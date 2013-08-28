module.exports = (function () {
  "use strict"
  /**
   * filter
   * @param {Job} job
   * @param {Function} success
   * @param {Function} fail
   */
  function filter(job, success, fail) {
    success(job);
  }

  function cache(job) {
    return false;
  }

  return {
    filter: filter,
    cache: cache
  }

})();