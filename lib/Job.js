module.exports = (function () {
  "use strict"
  function Job(id, url, content) {
    this.id = id;
    this.url = url;
    this.content = content;
  }
  Job.prototype = {
    constructor: Job,
    /**
     * setData
     * @param {Object} data
     */
    setData: function (data) {
      if (data.status) {
        this.status = true;
        if (data.content) {
          this.title = data.title;
          this.description = data.description;
          this.image = data.image;
        } else {
          this.image = data.image
        }
      } else {
        this.status = false;
      }
    },
    /**
     * setTime
     */
    setTime: function () {
      this.time = new Date();
    },
    /**
     * getTime
     * @return {Date}
     */
    getTime: function () {
      return this.time;
    }
  };
  Job.create = function (id, url) {
    return new Job(id, url, true);
  }

  return Job;

})();