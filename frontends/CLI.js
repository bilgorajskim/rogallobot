'use strict';
var BitcoinValueFactory = require('./../BitcoinValueFactory');
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var process = require('process');
var _ = require('lodash');

class CLI {
  constructor(stats) {
    this.stats = stats;
    this.screen = blessed.screen({
      smartCSR: true
    });
    this.loseStreakBars = contrib.bar({
      label: 'Lose streaks:',
      barWidth: 2,
      barSpacing: 2,
      xOffset: 0,
      maxHeight: 9,
      top: 0,
      right: 0,
      width: '50%',
      height: '25%'
    });
    this.profitChart = contrib.line(
      {
        style: {
          line: "yellow",
          text: "green",
          baseline: "black"
        },
        xLabelPadding: 0,
        xPadding: 0,
        showLegend: false,
        wholeNumbersOnly: false, //true=do not show fraction in y axis
        label: 'Profit over time:',
        width: '100%',
        height: '25%',
        left: 0,
        top: '50%'
      });
    this.lossChart = contrib.line(
      {
        style: {
          line: "yellow",
          text: "green",
          baseline: "black"
        },
        xLabelPadding: 0,
        xPadding: 0,
        showLegend: false,
        wholeNumbersOnly: false, //true=do not show fraction in y axis
        label: 'Loss over time:',
        width: '100%',
        height: '25%',
        left: 0,
        top: '75%'
      });
    this.betsTableHead = [
      ['', 'Bet ID', 'Amount', 'Target', 'Roll', 'Profit']
    ];
    this.betsTableBody = [];
    this.betsTable = blessed.listtable({
      parent: this.screen,
      top: 0,
      left: 0,
      data: null,
      border: 'line',
      align: 'center',
      tags: true,
      keys: true,
      //width: '80%',
      width: '50%',
      height: '50%',
      vi: true,
      mouse: true,
      style: {
        border: {
          fg: 'red'
        },
        header: {
          fg: 'white',
          bg: 'black',
          bold: true
        },
        cell: {
          fg: 'white',
          selected: {
            bg: 'blue'
          }
        }
      }
    });

    this.statsTable = blessed.listtable({
      parent: this.screen,
      top: '25%',
      left: '50%',
      width: '25%',
      height: '25%',
      data: null,
      border: 'line',
      align: 'center',
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      style: {
        border: {
          fg: 'red'
        },
        header: {
          fg: 'white',
          bg: 'black',
          bold: true
        },
        cell: {
          fg: 'white',
          selected: {
            bg: 'blue'
          }
        }
      }
    });

    this.donut = contrib.donut({
      label: 'Stats:',
      radius: 12,
      arcWidth: 3,
      spacing: 2,
      yPadding: 2,
      top: '25%',
      right: 0,
      width: '25%',
      height: '25%',
      data: [

      ]
    });

    this.betsKeys = [];
    this.profitsValues = [];
    this.losesValues = [];
  }

  onBet(res) {
    let balanceBtc = BitcoinValueFactory.fromMbtc(res.balance).toBTC();
    let betBtc = BitcoinValueFactory.fromMbtc(res.bet).toBTC();
    let profitBtc = BitcoinValueFactory.fromMbtc(res.profit).toBTC();
    let prefix = '{red-bg}';
    let suffix = '{/}';
    if (res.win) {
      prefix = '{green-bg}';
    }
    let newRow = [
      prefix,
      res.id.toString(),
      betBtc,
      res.condition + res.target,
      res.roll.toString(),
      profitBtc
    ];
    if (this.betsTableBody.length >= 100) {
      this.betsTableBody = this.betsTableBody.slice(0, 50);
    }
    this.betsTableBody.unshift(newRow);
    let tableData = this.betsTableHead.concat(this.betsTableBody);
    this.betsTable.setData(tableData);

    this.betsKeys.push(this.betsKeys.length-1);
    this.profitsValues.push(res.totalProfit < 0 ? 0 : res.totalProfit);
    this.losesValues.push(res.totalProfit > 0 ? 0 : -res.totalProfit);

    if (this.betsKeys.length > 100) {
      this.betsKeys.shift();
    }
    if (this.profitsValues.length > 100) {
      this.profitsValues.shift();
    }
    if (this.losesValues.length > 100) {
      this.losesValues.shift();
    }

    let profit = {
      title: 'profit',
      x: this.betsKeys,
      y: this.profitsValues,
      style: {line: 'green'}
    };
    let loss = {
      title: 'loss',
      x: this.betsKeys,
      y: this.losesValues,
      style: {line: 'red'}
    };
    this.profitChart.setData([profit]);
    this.lossChart.setData([loss]);

    let loseStreak = {
      titles: Object.keys(this.stats.loseStreaks),
      data: _.values(this.stats.loseStreaks)
    };

    this.loseStreakBars.setData(loseStreak);

    let requests = this.stats.requests.toString();
    this.donut.setData([
      {percent: requests > 100 ? 100 : requests, label: 'req/s', color: 'green'}
    ]);

    this.statsTable.setData([
      [ 'total requests', requests ],
      [ 'total bets', this.stats.bets.all().length.toString() ],
      [ 'balance', this.stats.balance.toString() ],
      [ 'profit', this.stats.profit.toString() ]
    ]);
  }

  start() {
    this.screen.title = 'rogallobot';

    this.betsTable.focus();
    this.betsTable.setData(this.betsTableHead);

    this.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
      return process.exit(0);
    });

    this.screen.append(this.profitChart);
    this.screen.append(this.lossChart);
    this.screen.append(this.loseStreakBars);
    this.screen.append(this.donut);

    this.screen.render();

    setInterval(() => {
      this.screen.render();
    }, 100);
  }
}
module.exports = CLI;