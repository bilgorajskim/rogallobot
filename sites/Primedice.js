'use strict';
let pdAPI = require('./../lib/PrimediceClient');
let request = require('superagent');
let fs = require('fs');
let Promise = require('bluebird');
class Primedice {
  constructor() {
    this._uri = 'https://api.primedice.com/api/';
    this._accessTokenFile = "./access_token.tmp";
  }

  tip(username, amount, callback) {

    var url = this.client._uri + 'tip?access_token=' + this.client._token;
    var body = 'username='+username+'&amount='+amount;

    return new Promise((resolve, reject) => {
      request.post(url).send(body).end(function(error,response) {
        if (error || response.error)
        {
          return reject(response.error);
        }
        return resolve(response);
      });
    });
  }

  bet2(amount, target, condition) {
    return new Promise((resolve, reject) => {
      this.client.bet(amount, target, condition, (error, response) => {
        if (error || response.error)
        {
          return reject(response.error);
        }
        return resolve(response);
      });
    });
  }


  bet(amount, target, condition, callback) {
      this.client.bet(amount, target, condition, (error, res) => {
        if (error !== false) {
          return callback(error, false);
        }
        let betRes = {
          id: res.bet.id,
          balance: res.user.balance,
          profit: res.bet.profit,
          bet: res.bet.amount,
          target: res.bet.target,
          condition: res.bet.condition,
          win: res.bet.win,
          roll: res.bet.roll,
          raw: res
        };
        setTimeout(() => {
          callback(false, betRes);
        }, 500);
      });
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
    let username = credentials.username;
    let password = credentials.password;
    let saveAndRun = (accessToken) => {
      this.accessToken = accessToken;
      this._saveAccessToken(this.accessToken, (error) => {
        if (error)
        {
          return callback(Error('Could not save access token'));
        }
        this.client = new pdAPI(this.accessToken);
        setTimeout(() => {
          callback(false);
        }, 500);
      });
    };
    this._readAccessToken((error, accessToken) => {
      if (error)
      {
        this._obtainAccessToken(username, password, (error, accessToken) => {
          if (error)
          {
            return callback(Error('Could not authenticate'));
          }
          saveAndRun(accessToken);
        });
      }
      else
      {
        saveAndRun(accessToken);
      }
    });
  }

  _saveAccessToken(accessToken, callback)
  {
    fs.writeFile(this._accessTokenFile, accessToken, function(err) {
      if(err) {
        callback(err);
      }
      callback();
    });
  }

  _readAccessToken(callback)
  {
    fs.readFile(this._accessTokenFile, (err, data) => {
      if (err || data.length < 1) {
        callback(Error('No local access token'));
      }
      callback(false, data);
    });
  }

  _obtainAccessToken(username, password, callback) {
    var url = this._uri + 'login';

    request.post(url).send('username='+username+'&password='+password).end(
      (error, response) => {
        if (!error)
        {
          let accessToken = response.body.access_token;
          callback(false, accessToken);
        }
        else
        {
          callback(
            Error(error)
          );
        }
      });
  }
}
module.exports = Primedice;