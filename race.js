'use strict';
const Primedice = require('./sites/Primedice');
const _ = require('lodash');

let credentials = {
  username: '...',
  password: '...'
};

const client = new Primedice();

client.auth(credentials, (error) => {
  let user = '...';
  //userName += userName;
  function tip(username, value)
  {
    console.log('Tipping ' + username + ' with ' + value);
    client.tip(username, value)
      .then((data) => {
        console.log('Response for tipping ' + username + ' with ' + value, data);
      })
      .catch((data) => {
        console.log('err Response for tipping ' + username + ' with ' + value, {
          status: data.status,
          text: data.text
        });
      });
  }
  function bet(value)
  {
    console.log('Betting ' + value);
    client.bet2(value, 98, '<')
      .then((data) => {
        console.log('Response for betting ' + value, data);
      })
      .catch((data) => {
        console.log('err Response for betting ' + value, data);
      });
  }
  tip(user, 51000);
  bet(51000);
  // _.range(1, 100).forEach((n) => {
  //   tip(user, n);
  // });
});