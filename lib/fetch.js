/*!
 * url-extract - fetch
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gmail.com>
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";

  /**
   * fetch
   * @param {String} html
   * @return {Object} data
   */
  return function (html) {
    if (!html) return { title: false, description: false };

    var title = html.match(/\<title\>(.*?)\<\/title\>/)
      , meta = html.match(/\<meta\s(.*?)\/?\>/g)
      , description;

    if (meta) {
      for (var i = meta.length; i--;) {
        if (~meta[i].indexOf('name="description"') || ~meta[i].indexOf('name="Description"')){
          description = meta[i].match(/content\=\"(.*?)\"/)[1];
        }
      }
    }

    (title && title[1] !== '') ? (title = title[1]) : (title = 'No Title');
    description || (description = 'No Description');

    return {
      title: title,
      description: description
    };
  };

})();