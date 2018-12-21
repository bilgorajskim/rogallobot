'use strict';
class Stats {
  constructor() {
    this.loseCounter = 0;
    this.loseStreaks = {};
    this.startingBalance = 0;
    this.balance = 0;
    this.profit = 0;
    this.bets = new (require('./BetsList'))();
    this.requests = 0;
  }
  countRequest() {
    this.requests++;
  }
}
module.exports = Stats;