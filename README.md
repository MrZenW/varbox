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
var box = Varbox.createVarbox();

box.set('key/user/name', 'Varbox');
console.log('#set "key/usr/name" to "Varbox": %o', box.get());

var unwatchFunction = box.watch((event) => {
  console.log('#event: %o', event);
})

box.merge('key/user/name2', 'Varbox2');
console.log('#merge "key/user/name2" to Varbox2: %o', box.get());

box.destory('key/user');
console.log('#destory "key/user": %o', box.get());

box.destory();
console.log('#destory whole varbox: %o', box.get());

box.delete('key', 'Varbox2');
console.log('#delete "key"', box.get());

box.set(null, '123');
console.log('#set the varbox to "123": %o', box.get());

unwatchFunction();
console.log('#unwatched');

box.set('0', 'number 0');
console.log('#set "0" to "number 0": %o', box.get());
console.log('There won\'t be no more event appear there, because the varbox has been unwatched.')
```
**output:**
```
#set "key/usr/name" to "Varbox": { key: { user: { name: 'Varbox' } } }
#event: { eventType: 'set',
  variable: { name: 'Varbox', name2: 'Varbox2' },
  key: 'name2',
  path: [ 'root', 'key', 'user', 'name2', [length]: 4 ],
  pathString: 'root/key/user/name2',
  targetPath: [ 'root', 'key', 'user', 'name2', [length]: 4 ],
  targetPathString: 'root/key/user/name2',
  oldValue: undefined,
  newValue: 'Varbox2',
  method: 'merge' }
#merge "key/user/name2" to Varbox2: { key: { user: { name: 'Varbox', name2: 'Varbox2' } } }
#event: { eventType: 'destory',
  variable: { name2: 'Varbox2' },
  key: 'name',
  path: [ 'root', 'key', 'user', 'name', [length]: 4 ],
  pathString: 'root/key/user/name',
  method: 'destory' }
#event: { eventType: 'destory',
  variable: {},
  key: 'name2',
  path: [ 'root', 'key', 'user', 'name2', [length]: 4 ],
  pathString: 'root/key/user/name2',
  method: 'destory' }
#destory "key/user": { key: { user: {} } }
#event: { eventType: 'destory',
  variable: {},
  key: 'user',
  path: [ 'root', 'key', 'user', [length]: 3 ],
  pathString: 'root/key/user',
  method: 'destory' }
#event: { eventType: 'destory',
  variable: {},
  key: 'key',
  path: [ 'root', 'key', [length]: 2 ],
  pathString: 'root/key',
  method: 'destory' }
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
  newValue: '123',
  method: 'set' }
#set the varbox to "123": '123'
#unwatched
#set "0" to "number 0": { '0': 'number 0' }
There won't be no more event appear there, because the varbox has been unwatched.
```

## License

MIT License

Copyright (c) 2019 ZenWANG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
