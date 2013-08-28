module.exports = (function () {
  "use strict"
  
  // now push every job into jobPool
  function filter(job, success, fail) {
    success(job);
  }

  return filter;

})();