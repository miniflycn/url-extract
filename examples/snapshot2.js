module.exports = (function () {
  "use strict"
  var urlExtract = require('../')();

  // Sometimes, we do not care how long the snapshot generation
  urlExtract.extract('http://www.baidu.com', './snapshot/test/test.png');

  setTimeout(function () {
  	process.exit();
  }, 10000);
})();