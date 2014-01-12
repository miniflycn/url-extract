!function () {
  'use strict';
  var down = require('url-download')
    , Zip = require('adm-zip');

  down('https://github.com/miniflycn/node-websocket-server/archive/master.zip', './')
    .once('done', function () {
      var zip = new Zip('./master.zip');
      zip.extractAllTo('./node_modules/', true);
    });
}();