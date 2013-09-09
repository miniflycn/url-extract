module.exports = (function () {
  "use strict"
  var ws = require('websocket-server')
    , spawn = require('child_process').spawn
    , emitter = new (require('events').EventEmitter)()
    , config = require('../config')
    , nullFoo = function () {}
    , websocketMan
    , workerMan
    , _connectionId2WorkerId = {};

  /**
   * websocketMan
   * @static
   * @class
   */
  websocketMan = {
    websocket: undefined,
    onGet: nullFoo,
    /**
     * init
     */
    init: function () {
      var that = this;
      this.websocket = ws.createServer();
      this.websocket.addListener('connection', function (connection) {
        connection.addListener('message', function (msg) {
          msg = JSON.parse(msg);
          _connectionId2WorkerId[connection.id] || (_connectionId2WorkerId[connection.id] = msg.id);
          return that.onGet(connection.id, msg.num);
        });
        connection.addListener('close', function () {
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
    onData: nullFoo,
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
        , string = ''
        , that = this;
      worker.stdout.on('data', function (data) {
        string += data.toString();
        _check();
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
        emitter.emit(id + 'close');
        // worker died
        that.createWorker();
      });

      function _check() {
        if (string.indexOf('{{end}}') == -1) return;
        var match = string.match(/\{\{begin\}\}(.*?)\{\{end\}\}/g);
        string = '';
        if (match) {
          for (var i = match.length; i--;) {
            var data = match[i].replace('{{begin}}', '').replace('{{end}}', '');
            data = JSON.parse(data);
            that.onData(data);
          }
        }
      }
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
    var onGet = opts.onGet || nullFoo
      , onData = opts.onData || nullFoo
      , workerNum = opts.workerNum || require('os').cpus().length;
    websocketMan.init();
    workerMan.init(workerNum);
    websocketMan.onGet = onGet;
    workerMan.onData = onData;
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

  function close(connectionId, callback) {
    websocketMan.send(connectionId, { method: 'CLOSE' });
    callback && emitter.once(_connectionId2WorkerId[connectionId] + 'close', callback);
  }

  return {
    init: init,
    send: send,
    close: close
  };

})();