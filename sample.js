var Varbox = require('./index');
// console.log(Varbox);
var box = Varbox.createVarbox();

box.set('key/user/name', 'Varbox');
console.log('#set "key/usr/name" to "Varbox": %o', box.get());

box.merge('key/user/name2', 'Varbox2');
console.log('#merge "key/user/name2" to Varbox2: %o', box.get());

box.watch((event) => {
  console.log('#event: %o', event);
})

box.destory('key/user');
console.log('#destory "key/user": %o', box.get());

box.destory();
console.log('#destory whole varbox: %o', box.get());

box.delete('key', 'Varbox2');
console.log('#delete "key"', box.get());

box.set(null, '123');

// box.set('newkey/user/name', 'new Varbox');
console.log('#set the varbox to "123": %o', box.get());
