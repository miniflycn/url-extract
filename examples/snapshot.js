module.exports = (function () {
  "use strict"
  var uExtract = require('../');

  uExtract.bind(function (job) {
    console.log('This is a snapshot example.');
    console.log(job);
    process.exit();
  });
  uExtract.snapshot('http://www.baidu.com');
})();