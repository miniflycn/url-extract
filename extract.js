module.exports = (function () {
  "use strict"
  var connect = require('connect')
    , fs = require('fs')
    , child_process = require('child_process')
    , Watcher = require('./Watcher.js')
    , maxAge = 3600;

  var app = connect()
    .use('/snapshot', connect.static(__dirname + '/snapshot', { maxAge: maxAge }))
    .use(connect.bodyParser())
    .use('/api', function (req, res, next) {
      if (req.method !== "POST") return next();
      if (req.body.timestamp) return Watcher.watch(req.body.timestamp, req, res, next);
      if (!req.body.urls || !req.body.urls.length) return next();

      // we want to get a urls list
      // like req.body.urls
      var commands = [
        'phantomjs',
        'snapshot.js',
        (new Date()).valueOf()
      ]
        , fileMap = {};
      commands = Array.prototype.concat.apply(commands, req.body.urls);

      fs.mkdirSync(__dirname + '/snapshot/' + commands[2]);
      child_process.exec(commands.join(' '), function (err, stdout, stderr) {
        console.log(stdout);
        if (err !== null) console.log('exec error: ' + err);
      });

      Watcher.register(commands[2], commands.length - 3, req, res, next);

    })
    .use(connect.static(__dirname, { maxAge: maxAge }))
    .listen(3000, function () { console.log('listen: ' + 3000); });

})();



