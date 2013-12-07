module.exports = (function () {
  "use strict"
  var urlExtract = require('../')();
  var fs = require('fs');

  fs.writeFile('./time.txt', new Date());
  
  setTimeout(function(){
  	process.kill('SIGINT');
  }, 20000);

  function count() {
    var i = 0;
    var start = new Date();
    return function() {
      console.log("start: " + start);
      console.log("num: " + (++i) + " end: " + new Date());

    }
  }
  var counter = count();

  for (var i = 0; i < 1000; i++) {
	  urlExtract.snapshot(['https://www.google.com.hk', 'http://www.amazon.com/'], function (job) {
	  	counter();
	  });
	}	
})();