module.exports = (function () {
  "use strict"
  function Job(id, url, content) {
    this.id = id || url;
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
        if (this.content) {
          this.title = data.title;
          this.description = data.description;
          this.image = data.image;
        } else {
          this.image = data.image;
        }
      } else {
        this.status = false;
      }
    },

    /**
     * getData
     * @return {Object}
     */
    getData: function () {
      if (this.content) {
        return {
          title: this.title,
          description: this.description,
          image: this.image
        };
      } else {
        return {
          image: this.image
        }
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
  /**
   * Job.fetch(id, url)
   * Job.fetch(url)
   * @param id {String} id, Unique Id
   * @param url {String} url
   */
  Job.fetch = function (id, url) {
    if (url) return new Job(id, url, true);
    return new Job(null, id, true);
  };
  /**
   * Job.snapshot(id, url)
   * Job.snapshot(url)
   * @param id {String} id, Unique Id
   * @param url {String} url
   */
  Job.snapshot = function (id, url) {
    if (url) return new Job(id, url, false);
    return new Job(null, id, false);
  }

  return Job;

})();