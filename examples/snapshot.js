module.exports = (function () {
  "use strict"
  var urlExtract = require('../');

  urlExtract.snapshot('http://www.baidu.com', function (job) {
  	console.log('This is a snapshot example.');
    console.log(job);
    process.exit();
  });
})();