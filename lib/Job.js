module.exports = (function () {
  "use strict"
  var uid = require('uid2');

  /**
   * Job
   * @class
   * @param {String} url
   * @param {Boolean} content
   * @param {Object} opt
   * @option {String} id
   * @option {String} groupId
   * @option {Function} callback
   * @option {Boolean} ignoreCache
   * @option {String} image
   * @option {Object} viewportSize
   * @option {Object} clipRect
   * @option {Number} zoomFactor
   */
  function Job(url, opt, content) {
    this.url = url;
    this.content = ((typeof opt === 'boolean') ? opt : content) || false;
    opt = ((typeof opt === 'boolean') ? {} : opt) || {};
    this.id = opt.id || uid(10);
    this.groupId = opt.groupId || null;
    this.cache = opt.ignoreCache ? false : true;
    this.callback = opt.callback;
    this.image = opt.image;
    opt.viewportSize && (this.viewportSize = opt.viewportSize);
    opt.clipRect && (this.clipRect = opt.clipRect);
    opt.zoomFactor && (this.zoomFactor = opt.zoomFactor);
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
          image: this.image,
          status: this.status
        };
      } else {
        return {
          image: this.image,
          status: this.status
        }
      }
    },
    /**
     * setTime
     * @return {Date}
     */
    setTime: function () {
      return (this.time = new Date());
    },
    /**
     * getTime
     * @return {Date}
     */
    getTime: function () {
      return this.time;
    },
    /**
     * fail
     * @return {Job}
     */
    fail: function () {
      this.status = false;
      return this;
    }

  };

  return Job;

})();