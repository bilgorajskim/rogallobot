'use strict';
let InsufficientBalanceError = require('./../errors/InsufficientBalance');
class Simulation {
  constructor(options) {
    let defaultOptions = {
      simulatedDelay: 0,
      startingBalance: 1000,
      clientSeed: 'client-seed',
      serverSeed: 'server-seed',
      startingNonce: 0
    };
    if (options === undefined) {
      options = defaultOptions;
    }
    if (!this._compareKeys(options, defaultOptions)) {
      throw new Error('Invalid options provided for simulation');
    }
    this.simulatedDelay = options.simulatedDelay;
    this.userBalance = options.startingBalance;
    this.nonce = options.startingNonce;
    this.options = options;
  }

  _compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }

  roll(clientSeed, serverSeed, nonce) {
    var roll = function(key, text) {
      var HmacSHA512 = require("crypto-js/hmac-sha512");
      var encHex = require("crypto-js/enc-hex");
      //create HMAC using server seed as key and client seed as message
      var hash = HmacSHA512(text, key).toString(encHex);

      var index = 0;

      var lucky = parseInt(hash.substring(index * 5, index * 5 + 5), 16);

      //keep grabbing characters from the hash while greater than
      while (lucky >= Math.pow(10, 6)) {
        index++;
        lucky = parseInt(hash.substring(index * 5, index * 5 + 5), 16);

        //if we reach the end of the hash, just default to highest number
        if (index * 5 + 5 > 128) {
          lucky = 99.99;
          break;
        }
      }

      lucky %= Math.pow(10, 4);
      lucky /= Math.pow(10, 2);

      return lucky;
    };

    return roll(serverSeed, clientSeed+'-'+nonce);
  }

  bet(amount, target, condition, callback) {

    if (this.userBalance < amount)
    {
      return callback(new InsufficientBalanceError('Could not bet with amount exceeding current balance'), false);
    }

    target = parseFloat(target);

    let roll = this.roll(this.options.clientSeed, this.options.serverSeed, this.nonce);
    this.nonce++;

    let win = false;
    if (
      (condition == '<' && roll < target) ||
      (condition == '=' && roll === target) ||
      (condition == '>' && roll > target)
    )
    {
      win = true;
      this.userBalance += amount;
    }
    else
    {
      this.userBalance -= amount;
    }

    let betRes = {
      id: this.nonce,
      balance: this.userBalance,
      profit: win ? amount : -amount,
      bet: amount,
      target: target,
      condition: condition,
      win: win,
      roll: roll,
      raw: {}
    };

    setTimeout(() => {
      callback(false, betRes);
    }, this.simulatedDelay);
  }

  getStats(callback) {
    this.client.users(function(error, response) {
      if (error !== false) {
        return callback(error, false);
      }
      callback(false, response);
    });
  }

  auth(credentials, callback) {
    callback(false);
  }
}
module.exports = Simulation;