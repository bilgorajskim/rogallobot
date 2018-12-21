'use strict';
let BigNumber = require('bignumber.js');
let BitcoinValue = require('./BitcoinValue');
class BitcoinValueFactory {
  static fromMbtc(input) {
    let satoshis = new BigNumber(input)
      .times(new BigNumber('10'));
    return new BitcoinValue(satoshis);
  }
}
module.exports = BitcoinValueFactory;