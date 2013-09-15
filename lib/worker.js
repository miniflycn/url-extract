var webpage = require('webpage')
  , args = require('system').args
  , fetch = require('./fetch')
  , id = args[1]
  , currentNum = 0
  , now = 0
  , socketMan
  , configMod = require('./config')
  , config = configMod.get();

/**
 * doJob
 * @param {String} jobId
 * @param {String} url
 * @imagePath {String} imagePath
 * @content {Boolean} content, whether it needs to fetch content
 */
function doJob(job) {
  var page = webpage.create()
    , jobId = job.id
    , url = job.url
    , imagePath = job.image
    , content = job.content
    , viewportSize = job.viewportSize || config.viewportSize
    , clipRect = job.clipRect || config.clipRect
    , zoomFactor = job.zoomFactor || config.zoomFactor
    , send
    , begin
    , save
    , end;
  viewportSize && (page.viewportSize = viewportSize);
  clipRect && (page.clipRect = clipRect);
  zoomFactor && (page.zoomFactor = zoomFactor);
  page.settings = {
    javascriptEnabled: false,
    loadImages: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/1.9.0'
  };
  page.open(url, function (status) {
    var data
      , fetchObj;
    if (status === 'fail') {
      data = {
        id: jobId,
        url: url,
        status: false 
      };
    } else { 
      page.render(imagePath);
      if (content) {
        fetchObj = fetch(page.content);
        data = {
          jobId: jobId,
          url: url,
          title: fetchObj.title,
          description: fetchObj.description,
          image: imagePath,
          status: true
        };
      } else {
        data = {
          jobId: jobId,
          url: url,
          image: imagePath,
          status: true
        };
      }
    }
    // release the memory
    page.close();
    // send data to NodeJS
    console.log('{{begin}}' + JSON.stringify(data) + '{{end}}');
    (++now === currentNum) && (setTimeout(function () { socketMan.get(config.maxJob) }, 500));
  });
}

/**
 * begin
 * @param {jobList} jobs
 */
function begin(jobs) {
  var i = jobs.length
    , job
    , imagePath;
  if (i) {
    for (; i--;) {
      job = jobs[i];
      job.image = job.image || './snapshot/' + id + '/' + job.id + '.png';
      doJob(job);
      currentNum++;
    }
  }
}

/**
 * socketMan
 * @static
 * @class
 */
socketMan = {
  websocket: undefined,
  shutdown: false,
  /**
   * createWs
   * connect websocket server
   */
  createWs: function () {
    // unfortunately websocket will cost more than 1s to open
    var websocket = new WebSocket('ws://localhost:' + config.wsPort + '/')
      , that = this;
    that.websocket = websocket;
    websocket.onopen = function(evt){
      that.shutdown = false;
      that.get(config.maxJob);
    };
    websocket.onmessage = this.onMessage;
    websocket.onerror = function (msg) {};
    websocket.onclose = function () {
      if (!that.shutdown) {
        that.shutdown = true; 
        setTimeout(function () {
          that.createWs();
        }, 500);
      } else {
        phantom.exit();
      }
    };
  },
  /**
   * onMessage
   * @param {Event} evt
   */
  onMessage: function (evt) {
    var data = JSON.parse(evt.data);
    if (data.method === 'POST') {
      begin(data.jobList);
    } else if (data.method === 'CLOSE') {
      phantom.exit();
    } else if (data.method === 'CONFIG') {
      configMod.set(data.opts);
      if (config.maxJob) return this.get(config.maxJob);
    }
  },
  /**
   * get
   * @param {Number} num, the number of jobs worker want to get
   */
  get: function (num) {
    this.websocket.send(JSON.stringify({
      method: 'GET',
      num: num,
      id: id
    }));
  }
};
socketMan.createWs();