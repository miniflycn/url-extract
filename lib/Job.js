module.exports = (function () {
  "use strict"
  var uid = require('uid2');

  /**
   * Job
   * @class
   * @param {String} groupId
   * @param {String} url
   * @param {Boolean} content
   * @param {Function} callback
   */
  function Job(groupId, url, content, callback) {
    this.id = uid(10);
    this.groupId = groupId;
    this.url = url;
    this.content = content;
    callback && (this.callback = callback);
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
   * Job.extract(id, url)
   * Job.extract(url)
   * Job.extract(id, url, callback)
   * Job.extract(url, callback)
   * @param {String} id, Unique Id
   * @param {String} url
   * @param {Function} callback
   */
  Job.extract = function (id, url, callback) {
    if (callback) return new Job(id, url, true, callback);
    if (url) {
      if (typeof url === 'function') return new Job(null, id, true, url);
      return new Job(id, url, true);
    }
    return new Job(null, id, true);
  };
  /**
   * Job.snapshot(id, url)
   * Job.snapshot(url)
   * Job.snapshot(id, url, callback)
   * Job.snapshot(url, callback)
   * @param {String} id, Unique Id
   * @param {String} url
   * @param {Function} callback
   */
  Job.snapshot = function (id, url, callback) {
    if (callback) return new Job(id, url, false, callback);
    if (url) {
      if (typeof url === 'function') return new Job(null, id, false, url);
      return new Job(id, url, false);
    }
    return new Job(null, id, false);
  }

  return Job;

})();