'use strict';
let Game = new (require('./Game'))(
  new (require('./sites/Primedice'))(),
  //new (require('./sites/Simulation'))({
  //  simulatedDelay: 0,
  //  startingBalance: 2000000, // 0.02
  //  clientSeed: '4f142802b1defc0ebb107b5d0e029c0e',
  //  serverSeed: '334dbfcd4019276c40399d2b4a51cfb4944727f1fca826602d65d6fa8db7a5b3',
  //  startingNonce: 0
  //}),
  //new (require('./strategies/Linear'))({
  //  bet: 5000
  //}),
  new (require('./strategies/ShiftedMartingale'))({
    martingaleBet: 10,
    martingaleThreshold: 5,
    multiplier: 2.5,
    baseBet: 1
  }),
  require('./frontends/CLI')
);