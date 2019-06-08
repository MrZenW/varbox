var Varbox = require('../varbox');

var box = Varbox.createBox();

var unwatchVariableFunction = box.watchVariable('country/state/DC', (event) => {
  console.log('#event from watchVariable: %o',event.path, event.eventType, box.get('country/state/DC'));
})
// var unwatchPathFunction = box.watchPath('country/state/DC', (event) => {
//   console.log('#event from watchPath: %o', event);
// })

box.set('country/state', 'new state');
// box.set('country/state/DC', { population: 100 });
// box.set('country/state/DC/population', 200);
box.merge('country/state/DC', { name: 123 });
console.log(box.get('country/state/DC'));
box.merge('country/state/DC', { sex: 321 });
console.log(box.get('country/state/DC'));
