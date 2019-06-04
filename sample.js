var Varbox = require('./index');

var box = Varbox.create({
  ROOT_PATH: '',
});

box.set('key/user/name', 'Varbox');
console.log('#set "key/usr/name" to "Varbox": %o', box.get());

// var unwatchFunction = box.watch((event) => {
//   console.log('#event: %o', event);
// })

var unwatchVariableFunction = box.watchVariable('/key/user/name2', (event) => {
  console.log('#event from watchVariable: %o', event);
})
var unwatchPathFunction = box.watchPath('/key/user/name2', (event) => {
  console.log('#event from watchPath: %o', event);
})

box.merge('/key/user/name2', 'Varbox2');
console.log('#merge "key/user/name2" to Varbox2: %o', box.get());

box.merge('/key/user/name2/last', 'last name');
console.log('#merge "key/user/name2/last" to Varbox2: %o', box.get());

box.destory('/key/user');
console.log('#destory "key/user": %o', box.get());

box.destory();
console.log('#destory whole varbox: %o', box.get());

box.delete('/key', 'Varbox2');
console.log('#delete "key"', box.get());

box.set(null, '123');
console.log('#set the varbox to "123": %o', box.get());

unwatchVariableFunction();
unwatchPathFunction();
console.log('#unwatched');

box.set('0', 'number 0');
console.log('#set "0" to "number 0": %o', box.get());
console.log('There won\'t be no more event appear there, because the varbox has been unwatched.')



// box.set('newkey/user/name', 'new Varbox');
