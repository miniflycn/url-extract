var extracter = require('./index');

extracter.bind(function (job) {});
extracter.snapshot('http://www.baidu.com');
extracter.snapshot('http://www.sohu.com');
extracter.snapshot('http://www.qq.com');
extracter.snapshot('http://www.google.com');
extracter.snapshot('http://www.cnblogs.com');
extracter.snapshot('http://www.w3school.com.cn/');
extracter.snapshot('http://www.nodejs.org/');

setInterval(function () {
	console.log('new begin: ' + new Date());
	extracter.snapshot('http://www.baidu.com');
	extracter.snapshot('http://www.sohu.com');
	extracter.snapshot('http://www.qq.com');
	extracter.snapshot('http://www.google.com');
	extracter.snapshot('http://www.cnblogs.com');
	extracter.snapshot('http://www.w3school.com.cn/');
	extracter.snapshot('http://www.nodejs.org/');
}, 10000);