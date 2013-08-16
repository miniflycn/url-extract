module.exports = (function () {
  "use strict"
  var jobMan = require('./jobMan.js')
    , fs = require('fs')
    , pkg = JSON.parse(fs.readFileSync('./package.json'));

  return function (req, res, next) {
      if (req.headers.secret !== pkg.secret) return next();
      // Snapshot APP can post url information
      if (req.method === "POST") {
        var body = req.body;
        return jobMan.fire(body.campaignId, body.id, body.url, body.image, body.html);
      // Snapshot APP can get the urls should extract
      } else {
        var urls = jobMan.getUrls(req.body.campaignId);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.statuCode = 200;
        res.end(JSON.stringify({ urls: urls }));
      }
  };

})();
