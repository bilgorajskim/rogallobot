'use strict';
var _ = require('lodash');
class BetsList {

  constructor() {
    this._bets = [];
  }

  add(bet) {
    this._bets.push(bet);
  }

  last() {
    return _.last(this._bets);
  }

  all() {
    return this._bets;
  }
}
module.exports = BetsList;