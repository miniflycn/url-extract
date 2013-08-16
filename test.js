/*var Crypto = require('cryptojs').Crypto;

console.log(Crypto.DES.encrypt('http://www.baidu.com', {asString: true}));
console.log(Crypto.MD5('http://www.baidu.com'));
console.log((new Date().valueOf()))*/
var i = 1,
	j = 2
for (var i = 1; j < 10000000000; i++, j = j * 2 ) {}

console.log(8 >> 2);