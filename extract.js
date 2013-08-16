module.exports = (function () {
  "use strict"
  var connect = require('connect')
    , fs = require('fs')
    , child_process = require('child_process')
    , jobMan = require('./lib/jobMan.js')
    , bridge = require('./lib/bridge.js')
    , pkg = JSON.parse(fs.readFileSync('./package.json'));

  var app = connect()
    .use('/snapshot', connect.static(__dirname + '/snapshot', { maxAge: pkg.maxAge }))
    .use(connect.bodyParser())
    .use('/bridge', bridge)
    .use('/api', function (req, res, next) {
      if (req.method !== "POST" || !req.body.campaignId) return next();
      if (!req.body.urls || !req.body.urls.length) return jobMan.watch(req.body.campaignId, req, res, next);

      var campaignId = req.body.campaignId
        , commands = [
            'phantomjs',
            'snapshot.js',
            campaignId
          ]
        , imagesPath = 'http://localhost:' + pkg.port + '/snapshot/' + campaignId + '/'
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
      
      for (var i = req.body.urls; i--;) {
        url = req.body.urls[i];
        imagePath = imagesPath + i + '.png';
        _deal(i, url, imagePath);
      }

      jobMan.register(campaignId, urls, req, res, next);
      child_process.exec(commands.join(' '), function (err, stdout, stderr) {
        console.log(stdout);
        if (err !== null) console.log('exec error: ' + err);
      });

    })
    .use(connect.static(__dirname + '/html', { maxAge: pkg.maxAge }))
    .listen(pkg.port, function () { console.log('listen: ' + pkg.port); });

})();