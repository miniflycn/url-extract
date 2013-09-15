module.exports = (function () {
  "use strict"
  var urlExtract = require('../');

  urlExtract.snapshot('http://www.baidu.com', {
    viewportSize: {
      width: 800, 
      height: 400
    },
    clipRect: {
      top: 0, 
      left: 0, 
      width: 800, 
      height: 400 
    },
    callback: function (job) {
      console.log('This is a snapshot example.');
      console.log(job);
      process.exit();
    }
  });

})();