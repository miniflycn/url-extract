module.exports = (function () {
  "use strict"
  var urlExtract = require('../');

  urlExtract.snapshot('http://www.baidu.com', {
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
    zoomFactor: 0.5,
    callback: function (job) {
      console.log('This is a snapshot example.');
      console.log(job);
      process.exit();
    }
  });
})();