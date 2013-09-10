[![build status](https://secure.travis-ci.org/miniflycn/url-extract.png)](http://travis-ci.org/miniflycn/url-extract)
# url-extract

Homepage: https://github.com/miniflycn/url-extract

## Project Goals
Provide a web server for us extracting url's information.

## Dependence
Make sure PhantomJS is installed. This module expects the ```phantomjs``` binary to be in PATH somewhere and must be greater than 1.9.0. In other words, type this:

    $ phantomjs -v
    
If it print 1.9.x, you can do next.

## Setup
Setup

    $ npm install url-extract

or

    $ git clone git@github.com:miniflycn/url-extract.git
    $ cd url-extract
    $ npm install

## Useage

```js
var urlExtract = require('url-extract');
urlExtract.bind(function (job) {
	console.log(job);
});
urlExtract.extract('http://www.google.com');
urlExtract.extract('http://www.nodejs.org');
```

## API
```js
/**
 * extract(url, callback)
 * extract a url information
 * @param {String} url
 * @param {Function} callback
 */
urlExtract.extract('http://www.baidu.com', function (job) {
  console.log(job);
});
/**
 * extract(urls, callback)
 * extract some urls information
 * @param {Array} urls
 * @param {Function} callback
 */
urlExtract.extract(['http://www.baidu.com', 'http://www.google.com'], function (job) {
  console.log(job);
});
/**
 * snapshot(url, callback)
 * snapshot a url information
 * @param {String} url
 * @param {Function} callback
 */
urlExtract.snapshot('http://www.baidu.com', function (job) {
  console.log(job);
});
/**
 * snapshot(urls, callback)
 * snapshot some urls information
 * @param {Array} urls
 * @param {Function} callback
 */
urlExtract.snapshot(['http://www.baidu.com', 'http://www.google.com'], function (job) {
  console.log(job);
});
```

## License
All code inside is licensed under MIT license.
