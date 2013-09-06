module.exports = (function () {
  "use strict"
  var uExtract = require('../')
    , i = 1;

  uExtract.bind(function (job) {
    console.log(job.url + ' job data: ');
    console.log(job);
    if ((i++) === 3) process.exit();
  });
  uExtract.extract('http://www.baidu.com');
  uExtract.extract('http://www.qq.com');
  uExtract.extract('http://www.sina.com');
})();