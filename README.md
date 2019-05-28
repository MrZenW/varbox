# Varbox
An observable variable box

## Installation

```bash
$ npm install varbox
```

## Usage



```JavaScript
var Varbox = require('varbox');
var box = Varbox.createVarbox();

// You can use either a String or an Array to describe a path
// key/user/name = ["key", "user", "name"]
// Also, you are not able to use a String path to describe a path if you have a slash(/) in your path
// For example, there isn't any method to describe ["key/a", "user", "name"] as a String.
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
```
**output:**
```
#set "key/usr/name" to "Varbox": { key: { user: { name: 'Varbox' } } }
#merge "key/user/name2" to Varbox2: { key: { user: { name: 'Varbox', name2: 'Varbox2' } } }
#event: { eventType: 'destory',
  variable: { name2: 'Varbox2' },
  key: 'name',
  path: [ 'root', 'key', 'user', 'name', [length]: 4 ],
  pathString: 'root/key/user/name' }
#event: { eventType: 'destory',
  variable: {},
  key: 'name2',
  path: [ 'root', 'key', 'user', 'name2', [length]: 4 ],
  pathString: 'root/key/user/name2' }
#destory "key/user": { key: { user: {} } }
#event: { eventType: 'destory',
  variable: {},
  key: 'user',
  path: [ 'root', 'key', 'user', [length]: 3 ],
  pathString: 'root/key/user' }
#event: { eventType: 'destory',
  variable: {},
  key: 'key',
  path: [ 'root', 'key', [length]: 2 ],
  pathString: 'root/key' }
#destory whole varbox: {}
#delete "key" {}
#event: { eventType: 'set',
  variable: { root: '123' },
  key: 'root',
  path: [ 'root', [length]: 1 ],
  pathString: 'root',
  targetPath: [ 'root', [length]: 1 ],
  targetPathString: 'root',
  oldValue: {},
  newValue: '123' }
#set the varbox to "123": '123'
```