module.exports = (function () {
  "use strict"
  var uid = require('uid2');

  function Job(groupId, url, content, callback) {
    this.id = uid(10);
    this.groupId = groupId;
    this.url = url;
    this.content = content;
    callback && this.setCallback(callback);
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
    },
    /**
     * setCallback
     * @param {Function} callback
     */
    setCallback: function (callback) {
      this.callback = callback;
    },
    /**
     * getCallback
     * @return {Function}
     */
    getCallback: function () {
      return this.callback;
    }
  };
  /**
   * Job.extract(id, url)
   * Job.extract(url)
   * @param id {String} id, Unique Id
   * @param url {String} url
   */
  Job.extract = function (id, url, callback) {
    if (url && !(typeof url === 'Object')) return new Job(id, url, true);
    return new Job(null, id, true);
  };
  /**
   * Job.snapshot(id, url)
   * Job.snapshot(url)
   * @param id {String} id, Unique Id
   * @param url {String} url
   */
  Job.snapshot = function (id, url, callback) {
    if (url) return new Job(id, url, false);
    return new Job(null, id, false);
  }

  return Job;

})();