'use strict';
let fs = require('fs');
class Logger {
  constructor(file) {
    this.file = file;
  }
  log(msg, callback) {
    fs.appendFile(this.file, JSON.stringify(msg) + "\n", function (err) {
      if (!err && callback !== undefined) callback();
    });
  }
}
module.exports = Logger;