# Varbox
An observable variable box

## Installation

```bash
$ npm install varbox
```

## API

----------

### Varbox.<strong>createVarbox()</strong>

Create a variable box

```JavaScript
var box = Varbox.create();
```

----------

### Varbox.box#<strong>get(path)</strong>

Get a value from the path of the box

```JavaScript
box.get('classrooms/A/students/Ruofei/age');
// or
box.get(['classrooms', 'A','students', 'Ruofei', 'age']);
```

The path argument could be an `Array` or `String`, any other type of argument will override to an empty array `[]` .

----------

### Varbox.box#<strong>set(path, value)</strong>

Set a value to the path of the box

```JavaScript
box.set('classrooms/A/students/Ruofei/age', 4);
// or
box.set(['classrooms', 'A','students', 'Ruofei', 'age'], 4);
```

The path argument could be an `Array` or `String`, any other type of argument will override to an empty array `[]` .

----------

### Varbox.box#<strong>merge(path, value)</strong>

Set `a new variable` to the path of the box.

```JavaScript
box.merge('classrooms/A/students/Ruofei', { isAbsent: false });
// or
box.merge(['classrooms', 'A','students', 'Ruofei'], { isAbsent: false });
```

The new variable is merged from the original value and the value argument.

The path argument could be an `Array` or `String`, any other type of argument will override to an empty array `[]` .

----------

### Varbox.box#<strong>has(path)</strong>

Return `true` or `false` to describe if the path exists.

```JavaScript
box.has('classrooms/A/students/Ruofei');
// or
box.has(['classrooms', 'A','students', 'Ruofei']);
```

----------

### Varbox.box#<strong>delete(path)</strong>

Delete a variable which on the path.

```JavaScript
box.delete('classrooms/A/students/Ruofei');
// or
box.delete(['classrooms', 'A','students', 'Ruofei']);
```

----------

### Varbox.box#<strong>destory(path)</strong>

Delete all of the properties of all of the variables on and under the path argument.

```JavaScript
box.destory('classrooms/A/students');
// or
box.destory(['classrooms', 'A','students']);
```

----------

### Varbox.box#<strong>watch(watcher)</strong>

Watching any change of the box.

```JavaScript
box.watch(function watcher(event) {
  console.log(event);
});
```

The watcher function has an argument which used to describe what change happened.

```JavaScript
{
  eventType: 'set', // set, add, merge, delete, destory
  variable: { name: 'Varbox', name2: 'Varbox2' },
  key: 'name2',
  path: [ 'root', 'varbox', 'name2' ],
  pathString: 'root/varbox/name2',
  targetPath: [ 'root', 'varbox', 'name2' ],
  targetPathString: 'root/varbox/name2',
  oldValue: undefined,
  newValue: 'Varbox2',
  method: 'merge' 
}
```

----------

### Varbox.box#<strong>watchPath(path, watcher)</strong>

Watching all of the paths which ***UNDER*** the path argument of the box.

```JavaScript
box.watchPath('classrooms/A/students', function watcher(event) {
  console.log(event);
});
// or
box.watchPath(['classrooms', 'A', 'students'], function watcher(event) {
  console.log(event);
});
// or
box.watchPath('classrooms/+/students', function watcher(event) {
  // + will match noly one node in the path.
  console.log(event);
});
// or
box.watchPath('classrooms/#/students', function watcher(event) {
  // # will match at least one node in the path.
  console.log(event);
});
// or
box.watchPath(/^classrooms\/.*\/students/, function watcher(event) {
  // this example used to show you a path is can be a RegExp.
  console.log(event);
});
```

The path argument could be an `Array` or `String` or `RegExp`, any other type of argument will call the `Varbox.box#watch(watcher)` function.

The watcher function has an argument which used to describe what change happened.

```JavaScript
{
  eventType: 'set', // set, add, merge, delete, destory
  variable: { name: 'Varbox', name2: 'Varbox2' },
  key: 'name2',
  path: [ 'root', 'varbox', 'name2' ],
  pathString: 'root/varbox/name2',
  targetPath: [ 'root', 'varbox', 'name2' ],
  targetPathString: 'root/varbox/name2',
  oldValue: undefined,
  newValue: 'Varbox2',
  method: 'merge' 
}
```

----------

### Varbox.box#<strong>watchVariable()</strong>

Watching all of the paths which ***ABOVE*** the path argument of the box.

```JavaScript
box.watchPath('classrooms/A/students', function watcher(event) {
  console.log(event);
});
// or
box.watchPath(['classrooms', 'A', 'students'], function watcher(event) {
  console.log(event);
});
// or
box.watchPath('classrooms/+/students', function watcher(event) {
  // + will match noly one node in the path.
  console.log(event);
});
// or
box.watchPath('classrooms/#/students', function watcher(event) {
  // # will match at least one node in the path.
  console.log(event);
});
// or
box.watchPath(/^classrooms\/.*\/students/, function watcher(event) {
  // this example used to show you a path is can be a RegExp.
  console.log(event);
});
```

The path argument could be an `Array` or `String` or `RegExp`, any other type of argument will call the `Varbox.box#watch(watcher)` function.

The watcher function has an argument which used to describe what change happened.

```JavaScript
{
  eventType: 'set', // set, add, merge, delete, destory
  variable: { name: 'Varbox', name2: 'Varbox2' },
  key: 'name2',
  path: [ 'root', 'varbox', 'name2' ],
  pathString: 'root/varbox/name2',
  targetPath: [ 'root', 'varbox', 'name2' ],
  targetPathString: 'root/varbox/name2',
  oldValue: undefined,
  newValue: 'Varbox2',
  method: 'merge' 
}
```

----------

### Varbox.box#<strong>nodeMap(path[, checker])</strong>

Enumerate all of the nodes in the path from left to right which in the argument path.

```JavaScript
box.nodeMap('classrooms/A/students', function checker(variable) {

});
```

Argument `checker` is optional, which is a check function you can provide. You can change the varbox in the checker function and return `false` to stop the mapping process, otherwise will continue.

Checker argument:
```JavaScript
{
  variable: variable,
  key: currentKey,
  value: variable[currentKey],
  path: currentPath,
  pathString: pathString,
  targetPath: pathArray,
  targetPathString: targetPathString,
}
```

Return:
```JavaScript
{
  isExist: true, // true or false
  value: theValue,
  variable: parentVariable,
}
```

----------

### Varbox.box#<strong>nodeBackMap(path[, checker])</strong>

Enumerate all of the nodes in the path from right to left which in the argument path.

```JavaScript
box.nodeBackMap('classrooms/A/students', function checker(variable) {

});
```

Argument `checker` is optional, which is a check function you can provide. You can change the varbox in the checker function.

Checker argument:
```JavaScript
{
  variable: variable,
  key: currentKey,
  value: variable[currentKey],
  path: currentPath,
  pathString: pathString,
  targetPath: pathArray,
  targetPathString: targetPathString,
}
```


----------

### Varbox.box#<strong>everyNode(path, callback)</strong>

Map all of the nodes which under the path argument of the box.

The path argument could be an `Array` or `String`, any other type of argument will override to an empty array `[]` .

```JavaScript
box.everyNode('classrooms/A/students', function callback(variable) {

})
```

Argument `callback` is a callback function that you can provide. You can change the varbox in the function.

Callback function argument:
```JavaScript
{
  variable: variable,
  key: key,
  value: value,
  path: path,
  pathString: pathString,
}
```

----------

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
