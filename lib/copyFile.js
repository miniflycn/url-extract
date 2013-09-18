"use strict";
var fs = require('fs');

/**
 * copyFile
 * @param {String} src
 * @param {String} dst
 * @param {Function} callback
 */
module.exports = function (src, dst, callback) {
  var readStream = fs.createReadStream(src)
    , writeStream = fs.createWriteStream(dst);
  readStream.pipe(writeStream);
  readStream.on('end', function () {
  	writeStream.end();
  	callback(null);
  });
  readStream.on('error', callback);
  writeStream.on('error', callback);
};