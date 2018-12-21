'use strict';
class InsufficientBalance extends Error {
  constructor(message) {
    super(message);
  }
}
module.exports = InsufficientBalance;