[![build status](https://secure.travis-ci.org/miniflycn/url-extract.png)](http://travis-ci.org/miniflycn/url-extract)
# url-extract[`中文介绍`](https://github.com/miniflycn/url-extract#%E4%B8%AD%E6%96%87%E4%BB%8B%E7%BB%8D)
Homepage: https://github.com/miniflycn/url-extract

## Project Goals
Provide a NodeJS Module for us extracting url's information.

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
urlExtract.extract('http://www.google.com', function (job) {
  console.log(job);
});
urlExtract.extract('http://www.nodejs.org', function (job) {
  console.log(job);
});
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
 * snapshot a url
 * @param {String} url
 * @param {Function} callback
 */
urlExtract.snapshot('http://www.baidu.com', function (job) {
  console.log(job);
});
/**
 * snapshot(urls, callback)
 * snapshot some urls
 * @param {Array} urls
 * @param {Function} callback
 */
urlExtract.snapshot(['http://www.baidu.com', 'http://www.google.com'], function (job) {
  console.log(job);
});
```

## License
All code inside is licensed under MIT license.


# 中文介绍

主页: https://github.com/miniflycn/url-extract

## 目标
提供一个url信息抓取的NodeJS模块。

## 依赖
请确认PhantomJS已经安装，并且```phantomjs```二进制文件在环境变量PATH当中，并且其版本大于1.9.0。也就是说，在终端键入：

    $ phantomjs -v
    
如果打印1.9.x，那么请进行下一步。

## 安装

    $ npm install url-extract

或者

    $ git clone git@github.com:miniflycn/url-extract.git
    $ cd url-extract
    $ npm install

## 使用

```js
var urlExtract = require('url-extract');
// 抓取http://www.google.com的信息，并返回
urlExtract.extract('http://www.google.com', function (job) {
  console.log(job);
});
// 抓取http://www.nodejs.org的信息，并返回
urlExtract.extract('http://www.nodejs.org', function (job) {
  console.log(job);
});
```

## API
```js
/**
 * extract(url, callback)
 * 抓取单个url信息
 * @param {String} url
 * @param {Function} callback
 */
urlExtract.extract('http://www.baidu.com', function (job) {
  console.log(job);
});
/**
 * extract(urls, callback)
 * 抓取多个url信息
 * @param {Array} urls
 * @param {Function} callback
 */
urlExtract.extract(['http://www.baidu.com', 'http://www.google.com'], function (job) {
  console.log(job);
});
/**
 * snapshot(url, callback)
 * 根据单个url截取快照
 * @param {String} url
 * @param {Function} callback
 */
urlExtract.snapshot('http://www.baidu.com', function (job) {
  console.log(job);
});
/**
 * snapshot(urls, callback)
 * 根据多个url截取快照
 * @param {Array} urls
 * @param {Function} callback
 */
urlExtract.snapshot(['http://www.baidu.com', 'http://www.google.com'], function (job) {
  console.log(job);
});
```

## License
All code inside is licensed under MIT license.
