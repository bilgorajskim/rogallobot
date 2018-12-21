'use strict';
class Linear {
  constructor(options) {
    let defaultOptions = {
      bet: 1
    };
    if (options === undefined)
    {
      options = defaultOptions;
    }
    if ( ! this._compareKeys(options, defaultOptions))
    {
      throw new Error('Invalid options provided for strategy');
    }

    this.bet = options.bet;
  }

  _compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }

  init(game) {
    this.game = game;
    this.stats = game.stats;
  }

  start() {
    this._bet();
  }

  _setupBet(res) {

  }

  _bet() {
    this.game.makeBet(this.bet, 49.5, '<', (res) => {
      this._setupBet(res);

      this._bet();
    });
  }
}

module.exports = Linear;