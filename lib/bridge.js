/*!
 * url-extract - bridge
 * Copyright(c) 2013 Radica Systems Limited
 * Copyright(c) 2013 Daniel Yang <miniflycn@gamil.com>
 * MIT Licensed
 */
module.exports = (function () {
  "use strict"
  var ws = require('websocket-server')
    , spawn = require('child_process').spawn
    , emitter = new (require('events').EventEmitter)()
    , configMod = require('./config')
    , config = configMod.get()
    , websocketMan
    , workerMan
    , _connectionId2WorkerId = {};

  configMod.on('set', function (opts) {
    var msg = {
      method: 'CONFIG',
      opts: opts
    };
    websocketMan.broadcast(msg);
  });
  /**
   * websocketMan
   * @static
   * @class
   */
  websocketMan = {
    websocket: undefined,
    /**
     * init
     */
    init: function () {
      var that = this;
      this.websocket = ws.createServer();
      this.websocket.addListener('connection', function (connection) {
        connection.addListener('message', function (msg) {
          msg = JSON.parse(msg);
          !(_connectionId2WorkerId[connection.id]) &&
            (_connectionId2WorkerId[connection.id] = msg.id) &&
            configMod.changed() &&
            that.send(connection.id, {
              method: 'CONFIG',
              opts: config
            });
          return emitter.emit('get', connection.id, msg.num);
        });
        connection.addListener('close', function () {
          emitter.emit(connection.id + 'Close');
          // connection close
        });
      });
      this.websocket.listen(config.wsPort);
    },
    /**
     * send
     */
    send: function (connectionId, msg) {
      this.websocket.send(connectionId, JSON.stringify(msg));
    },
    /**
     * broadcast
     */
    broadcast: function (msg) {
      this.websocket.broadcast(JSON.stringify(msg));
    }
  };

  /**
   * websocketMan
   * @static
   * @class
   */
  workerMan = {
    sub: 'w',
    mid: 0,
    /**
     * init
     */
    init: function (num) {
      for (; num--;) {
        this.createWorker();
      }
    },
    /**
     * getId
     */
    getId: function () {
      return this.sub + (this.mid++) + Math.round(Math.random() * 10);
    },
    /**
     * createWorker
     * create a worker and handle its event
     */
    createWorker: function () {
      var id = this.getId()
        , worker = spawn('phantomjs', [__dirname + '/worker.js', id])
        , that = this;
      worker.stdout.on('data', function (data) {
        that.check(data.toString());
      });
      worker.stderr.on('data', function (data) {
        console.log('PhantomJS worker ' + id + ' has occur a error: ' + data);
      });
      worker.on('close', function (code) {
        var key;
        for (key in _connectionId2WorkerId) {
          if (_connectionId2WorkerId[key] === id) {
            _connectionId2WorkerId[key] = null;
            delete _connectionId2WorkerId[key];
            break;
          }
        }
        emitter.emit(id + 'Died');
        // worker died
        that.createWorker();
      });
    },
    /**
     * check
     * @param {String} string
     */
    check: function (string) {
      if (string.indexOf('{{end}}') == -1) return;
      var match = string.match(/\{\{begin\}\}(.*?)\{\{end\}\}/);
      match && emitter.emit('data', JSON.parse(match[1]));
    }
  };

  /**
   * init
   * @param {Object} opts
   * @param {Function} opts.onGet
   * @param {Function} opts.onPost
   * @param {Function} opts.onData
   */
  function init(opts) {
    var workerNum = opts.workerNum || require('os').cpus().length;
    websocketMan.init();
    workerMan.init(workerNum);
    opts.onGet && emitter.on('get', opts.onGet);
    opts.onData && emitter.on('data', opts.onData);
  }

  /**
   * send
   * @param {String} connectionId
   * @param {Array} jobList
   * @param {Job} jobList[n]
   * @param {String} jobList[n].id
   * @param {String} jobList[n].url
   * @param {Boolean} jobList[n].content
   */
  function send(connectionId, jobList) {
    var msg = {
      method: 'POST',
      jobList: jobList
    };
    websocketMan.send(connectionId, msg);
  }

  /**
   * close
   * @param {String} connectionId
   * @param {Function} callback
   */
  function close(connectionId, callback) {
    websocketMan.send(connectionId, { method: 'CLOSE' });
    callback && emitter.once(_connectionId2WorkerId[connectionId] + 'Died', callback);
  }

  return {
    init: init,
    send: send,
    close: close,
    on: emitter.on.bind(emitter),
    off: emitter.removeListener.bind(emitter)
  };

})();