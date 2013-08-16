module.exports = function () {
  function Req() {
    this.headers = {};
  }
  Req.prototype = {
    contructor: Req,
  	setHeader: function (key, value) {
      this.headers[key] = value;
      return this;
    },
    setUrl: function (url) {
      this.url = url;
      this.originUrl = url;
      return this;
    }
  };

  return (new Req());
};