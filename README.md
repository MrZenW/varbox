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
// key.user.name = ["key", "user", "name"]
// Also, you are not able to use a String path to describe a path if you have a Dot(.) in your path
// For example, there isn't any method to describe ["key.a", "user", "name"] as a String.
box.set('key.user.name', 'Varbox');
console.log('mark 1: %o', box.get());

box.merge('key.user.name2', 'Varbox2');
console.log('mark 2: %o', box.get());

box.destory('key.user');
console.log('mark 3: %o', box.get());

box.destory();
console.log('mark 4: %o', box.get());

box.delete('key', 'Varbox2');
console.log('mark 5: %o', box.get());

box.watch((event) => {
  console.log('event: %o', event);
})

box.set('newkey.user.name', 'new Varbox');
console.log('mark 6: %o', box.get());
```
**output:**
```

mark 1: { key: { user: { name: 'Varbox' } } }
mark 2: { key: { user: { name: 'Varbox', name2: 'Varbox2' } } }
mark 3: { key: { user: {} } }
mark 4: {}
event: { eventType: 'add',
  variable: { newkey: {} },
  key: 'newkey',
  path: [ '/', 'newkey', [length]: 2 ],
  pathString: '/.newkey',
  targetPath: [ '/', 'newkey', 'user', 'name', [length]: 4 ],
  targetPathString: '/.newkey.user.name',
  oldValue: undefined,
  newValue: {} }
event: { eventType: 'add',
  variable: { user: {} },
  key: 'user',
  path: [ '/', 'newkey', 'user', [length]: 3 ],
  pathString: '/.newkey.user',
  targetPath: [ '/', 'newkey', 'user', 'name', [length]: 4 ],
  targetPathString: '/.newkey.user.name',
  oldValue: undefined,
  newValue: {} }
event: { eventType: 'set',
  variable: { name: 'new Varbox' },
  key: 'name',
  path: [ '/', 'newkey', 'user', 'name', [length]: 4 ],
  pathString: '/.newkey.user.name',
  targetPath: [ '/', 'newkey', 'user', 'name', [length]: 4 ],
  targetPathString: '/.newkey.user.name',
  oldValue: undefined,
  newValue: 'new Varbox' }
mark 5: { newkey: { user: { name: 'new Varbox' } } }
```