'use strict';
let fs = require('fs');
class NullLogger {
  constructor() {
  }
  log(msg, callback) {

  }
}
module.exports = NullLogger;