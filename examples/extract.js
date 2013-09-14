module.exports = (function () {
  "use strict"
  var urlExtract = require('../');

  urlExtract.extract('http://www.baidu.com', function (job) {
    console.log('This is a extract example.');
    console.log(job);
    process.exit();
  });
})();