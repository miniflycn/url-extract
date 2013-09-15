module.exports = (function () {
  "use strict"
  var urlExtract = require('../');

  urlExtract.opt({
  	viewportSize: {
      width: 512, 
      height: 300
    },
    clipRect: {
      top: 0, 
      left: 0, 
      width: 512, 
      height: 300
    },
    zoomFactor: 0.5
  });
  urlExtract.snapshot('http://www.baidu.com', function (job) {
    console.log('This is a snapshot example.');
    console.log(job);
    process.exit();
  });
})();