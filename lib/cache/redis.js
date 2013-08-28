module.exports = (function () {
  "use strict"
  var redis = require('redis')
  	, client = redis.createClient();
  
  client.on('error', function (err) {
  	console.log('Redis Error: ' + err);
  });

  /**
   * filter
   * @param {Job} job
   * @param {Function} success
   * @param {Function} fail
   */
  function filter(job, success, fail) {
    client.hgetall(job.url, function (err, data) {
    	if (err) return console.log('Redis Error: ' + err);
      if (!data) return success(job);
    	if (job.content && (!data.title || !data.description)) return success(job);
    	data.status = true;
      job.setData(data);
      return fail(data);
    });
  }

  /**
   * cache
   * @param {Job} job
   */
  function cache(job) {
    var data = {
      image: job.image
    };
    if (job.title && job.description) {
      data.title = job.title;
      data.description = job.description;
    }
    client.hmset(job.url, data);
  }

  return {
    filter: filter,
    cache: cache
  };

})();