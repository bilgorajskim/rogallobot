'use strict';
var _ = require('lodash');

class Game {
  makeBet(amount, target, condition, callback) {
    this.siteAdapter.bet(amount, target, condition, (error, res) => {

      this.stats.countRequest();

      if (error !== false) {
        console.log(error);
        console.log(res);
        console.log("Error! Aborting...");
        return;
      }

      let loseCounter = this.stats.loseCounter;
      let loseStreaks = this.stats.loseStreaks;
      if (res.win === false) {
        loseCounter++;
        if ( ! loseStreaks.hasOwnProperty(loseCounter))
        {
          loseStreaks[loseCounter] = 0;
        }
        loseStreaks[loseCounter]++;
      }
      else {
        loseCounter = 0;
      }
      this.stats.loseCounter = loseCounter;
      this.stats.loseStreaks = loseStreaks;

      let bet = res;
      if (this.stats.bets.all().length > 0)
      {
        bet.totalProfit = this.stats.bets.last().totalProfit + bet.profit;
      }
      else
      {
        bet.totalProfit = bet.profit;
      }
      this.stats.profit = bet.totalProfit;
      this.stats.balance = bet.balance;

      this.logger.log(bet);
      this.stats.bets.add(bet);

      this._frontendAdapter.onBet(bet);

      callback(res);
    });
  }

  constructor(site, strategy, frontend) {
    this.stats = new(require('./Stats'));
    this._frontendAdapter = new (frontend)(this.stats);
    this.siteAdapter = site;
    this.logger = new (require('./Logger'))('bets.log');

    let credentials = {
      username: '...',
      password: '...'
    };
    this.siteAdapter.auth(credentials, (error) => {
      this.stats.countRequest();
      if (error) {
        console.log("Auth error");
        console.log(error);
        return;
      }
      strategy.init(this);
      strategy.start();
    });

    this._frontendAdapter.start();
  }
}
module.exports = Game;