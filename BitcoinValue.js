'use strict';
let BigNumber = require('bignumber.js');
class BitcoinValue {
  constructor(satoshis) {
    this.satoshis = new BigNumber(satoshis);
  }

  toBTC() {
    return this.satoshis
      .dividedBy(new BigNumber('100000000'))
      .toFixed(8);
  }
}
module.exports = BitcoinValue;