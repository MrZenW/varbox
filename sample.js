var Varbox = require('./index');
// console.log(Varbox);
var box = Varbox.createVarbox();

box.set('key/user/name', 'Varbox');
console.log('mark 1: %o', box.get());

box.merge('key/user/name2', 'Varbox2');
console.log('mark 2: %o', box.get());

box.destory('key/user');
console.log('mark 3: %o', box.get());

box.destory();
console.log('mark 4: %o', box.get());

box.delete('key', 'Varbox2');
console.log('mark 5: %o', box.get());

box.watch((event) => {
  console.log('event: %o', event);
})

box.set('newkey/user/name', 'new Varbox');
console.log('mark 6: %o', box.get());