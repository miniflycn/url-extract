module.exports = function (foo) {
  return {
    headers: {},
    statuCode: 200,
    end: function (data) {
      foo.call(this, data, this.statuCode, this.headers);
    },
    writeHead: function (statuCode, headers) {
      this.statuCode = statuCode;
      headers && (this.headers = headers);
    },
    setHeader: function (key, value) {
      this.headers[key] = value;
    }
  }
};