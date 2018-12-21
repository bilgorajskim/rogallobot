'use strict';
class ShiftedMartingale {
  constructor(options) {
    let defaultOptions = {
      martingaleBet: 10,
      martingaleThreshold: 6,
      multiplier: 2.5,
      baseBet: 0
    };
    if (options === undefined)
    {
      options = defaultOptions;
    }
    if ( ! this._compareKeys(options, defaultOptions))
    {
      throw new Error('Invalid options provided for strategy');
    }

    this.loseCounter = 0;
    this.baseBet = options.baseBet;
    this.martingaleBet = options.martingaleBet;
    this.martingaleThreshold = options.martingaleThreshold;
    this.multiplier = options.multiplier;
    this.bet = this.baseBet;
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
    if (res.win !== false)
    {
      this.bet = this.baseBet;
    }
    if (this.stats.loseCounter == this.martingaleThreshold)
    {
      this.bet = Math.ceil(parseFloat(this.martingaleBet*this.multiplier));
    }
    else if (this.stats.loseCounter > this.martingaleThreshold)
    {
      this.bet = Math.ceil(parseFloat(this.bet*this.multiplier));
    }
  }

  _bet() {
    this.game.makeBet(this.bet, 49.5, '<', (res) => {
      this._setupBet(res);

      this._bet();
    });
  }
}

module.exports = ShiftedMartingale;