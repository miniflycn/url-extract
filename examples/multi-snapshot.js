module.exports = (function () {
  "use strict"
  var urlExtract = require('../')()
    , i = 1;
    
  urlExtract.snapshot(['http://www.baidu.com', 'http://www.qq.com', 'http://www.sina.com'], function (job) {
    console.log(job);
    if ((i++) === 3) process.exit();
  });
})();