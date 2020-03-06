/* eslint-disable no-console */
var varbox = require('./varbox');


var box = varbox.createBox({
  ROOT_PATH: ['ROOT'],
  PATH_SEPARATOR: '/',
  BOX_NAME: 'custom_box_name',
});

var unwatchPathFunction = box.watchPath('key/user/name2', function (event) {
  console.log('#event from watchPath: %o', event);
});
var unwatchVariableFunction = box.watchVariable('key/user/name2', function (event) {
  console.log('#event from watchVariable: %o', event);
});

box.set('key/user/name', 'varbox');
console.log('#set "key/usr/name" to "varbox": %o', box.get());

box.merge('key/user/name2', 'varbox2');
console.log('#merge "key/user/name2" to varbox2: %o', box.get());

box.merge('key/user/name2/last', 'last name');
console.log('#merge "key/user/name2/last" to varbox2: %o', box.get());

console.log(box.metadata('key/user/name2/last'), 'metadata');

box.destroy('key/user');
console.log('#destroy "key/user": %o', box.get());

box.destroy();
console.log('#destroy whole varbox: %o', box.get());

box.delete('key', 'varbox2');
console.log('#delete "key"', box.get());

box.set(null, '123');
console.log('#set the varbox to "123": %o', box.get());

box.update('key', function(oldValue) {
  console.log('#update oldValue', oldValue);
  return 1;
});
box.update('key', function(oldValue) {
  console.log('#update oldValue', oldValue);
  return 1;
});

unwatchVariableFunction();
unwatchPathFunction();
console.log('#unwatched');

box.set('0', 'number 0');
console.log('#set "0" to "number 0": %o', box.get());
console.log('There won\'t be no more event appear there, because the varbox has been unwatched.');



// box.set('newkey/user/name', 'new varbox');
