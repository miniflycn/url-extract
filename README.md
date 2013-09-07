[![build status](https://secure.travis-ci.org/miniflycn/url-extract.png)](http://travis-ci.org/miniflycn/url-extract)
# url-extract

Homepage: https://github.com/miniflycn/url-extract

## Project Goals
Provide a web server for us extracting url's information.

## Dependence
make sure PhantomJS is installed. This module expects the ```phantomjs``` binary to be in PATH somewhere. In other words, type this:

    $ phantomjs
    
If that works, you can do next.

## Install

    $ npm install

## Use

```js
var uExtract = require('./url-extract');
uExtract.bind(function (job) {
	console.log(job);
});
uExtract.extract('http://www.google.com');
uExtract.extract('http://www.nodejs.org');
```

## License
All code inside is licensed under MIT license.
