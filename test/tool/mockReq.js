module.exports = function (body) {
  function Req(body) {
    this.headers = {};
    this.body = body;
  }
  Req.prototype.setHeader = function (key, value) {
    this.headers[key] = value;
    return this;
  }

  return (new Req(body));
};