var Varbox = require('../index');

var box = Varbox.createVarbox();

var unwatchVariableFunction = box.watchVariable('country/state/DC', (event) => {
  console.log('#event from watchVariable: %o', event);
})
var unwatchPathFunction = box.watchPath('country/state/DC', (event) => {
  console.log('#event from watchPath: %o', event);
})

box.set('country/state', 'new state');
box.set('country/state/DC', { population: 100 });
box.set('country/state/DC/population', 200);
