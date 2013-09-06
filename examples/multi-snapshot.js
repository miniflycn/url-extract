module.exports = (function () {
  "use strict"
  var uExtract = require('../')
    , i = 1;

  uExtract.bind(function (job) {
    console.log(job.url + ' job data: ');
    console.log(job);
    if ((i++) === 3) process.exit();
  });
  uExtract.snapshot('http://www.baidu.com');
  uExtract.snapshot('http://www.qq.com');
  uExtract.snapshot('http://www.sina.com');
})();