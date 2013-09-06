module.exports = (function () {
  "use strict"
  var uExtract = require('../');

  uExtract.bind(function (job) {
    console.log('This is a extract example.');
    console.log(job);
    process.exit();
  });
  uExtract.extract('http://www.baidu.com');
})();