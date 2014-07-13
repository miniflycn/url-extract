var connect = require('connect')
  , uExtract = require('../')({
    maxJob: 10
  });

var app = connect()
          .use('/snapshot', function (req, res, next) {
            var url = req.url.match(/\?url\=(.+)$/)[1];
            if (url) {
              uExtract.snapshot(url, function (job) {
                res.writeHead(200, {
                  
                });
                res.end();
              });
            } else {
              next();
            }
          })
          .listen(3000, function () {
            console.log('Listen on port 3000');
          });