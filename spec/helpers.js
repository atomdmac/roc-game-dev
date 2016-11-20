var fs = require('fs');

module.exports = {
  getJSON: function (path) {
    return JSON.parse(require('fs').readFileSync(path, {encoding: 'utf8'}));
  }
};

