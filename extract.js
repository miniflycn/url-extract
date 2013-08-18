module.exports = (function () {
  "use strict"
  var connect = require('connect')
    , fs = require('fs')
    , ws = require('websocket-server')
    , jobMan = require('./lib/jobMan.js')
    , bridge = require('./lib/bridge.js')
    , pkg = JSON.parse(fs.readFileSync('./package.json'));

  var app = connect()
    .use(connect.logger('dev'))
    .use('/snapshot', connect.static(__dirname + '/snapshot', { maxAge: pkg.maxAge }))
    .use(connect.bodyParser())
    .use('/api', function (req, res, next) {
      if (req.method !== "POST" || !req.body.campaignId) return next();
      if (!req.body.urls || !req.body.urls.length) return jobMan.watch(req.body.campaignId, req, res, next);

      var campaignId = req.body.campaignId
        , imagesPath = './snapshot/' + campaignId + '/'
        , urls = []
        , url
        , imagePath;

      function _deal(id, url, imagePath) {
        // just push into urls list
        urls.push({
          id: id,
          url: url,
          imagePath: imagePath
        });
      }
      
      for (var i = req.body.urls.length; i--;) {
        url = req.body.urls[i];
        imagePath = imagesPath + i + '.png';
        _deal(i, url, imagePath);
      }

      jobMan.register(campaignId, urls, req, res, next);
    })
    .use(connect.static(__dirname + '/html', { maxAge: pkg.maxAge }))
    .listen(pkg.port, function() {
      console.log((new Date()) + 'Server is listening on port ' + pkg.port);
    });

})();