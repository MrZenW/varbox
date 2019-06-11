var Varbox = require('./varbox');

var box;
var updateTestingKey = 'testUpdate';

test('Varbox.createBox()', function () {
  box = Varbox.createBox();
  var boxKeys = Object.keys(box);

  expect(boxKeys).toContain('get');
  expect(typeof box.get).toBe('function');
  expect(box.get.length).toEqual(1);

  expect(boxKeys).toContain('set');
  expect(typeof box.set).toBe('function');
  expect(box.set.length).toEqual(2);

  expect(boxKeys).toContain('update');
  expect(typeof box.update).toBe('function');
  expect(box.update.length).toEqual(2);

  expect(boxKeys).toContain('merge');
  expect(typeof box.merge).toBe('function');
  expect(box.merge.length).toEqual(2);

  expect(boxKeys).toContain('has');
  expect(typeof box.has).toBe('function');
  expect(box.has.length).toEqual(1);

  expect(boxKeys).toContain('delete');
  expect(typeof box.delete).toBe('function');
  expect(box.delete.length).toEqual(1);

  expect(boxKeys).toContain('destory');
  expect(typeof box.destory).toBe('function');
  expect(box.destory.length).toEqual(1);

  expect(boxKeys).toContain('watch');
  expect(typeof box.watch).toBe('function');
  expect(box.watch.length).toEqual(1);

  expect(boxKeys).toContain('watchPath');
  expect(typeof box.watchPath).toBe('function');
  expect(box.watchPath.length).toEqual(3);

  expect(boxKeys).toContain('watchVariable');
  expect(typeof box.watchVariable).toBe('function');
  expect(box.watchVariable.length).toEqual(2);

  expect(boxKeys).toContain('nodeMap');
  expect(typeof box.nodeMap).toBe('function');
  expect(box.nodeMap.length).toEqual(2);

  expect(boxKeys).toContain('nodeBackMap');
  expect(typeof box.nodeBackMap).toBe('function');
  expect(box.nodeBackMap.length).toEqual(2);

  expect(boxKeys).toContain('everyNode');
  expect(typeof box.everyNode).toBe('function');
  expect(box.everyNode.length).toEqual(2);
});

test('box.watch()', function () {
  box.watch(function (event) {
    expect(typeof event).toBe('object');
  });
});

test('box.watchVariable() for update a new reference', function () {
  var unwatch = box.watchVariable(updateTestingKey, function (event) {
    expect(typeof unwatch).toBe('function');
    unwatch();
    expect(typeof event).toBe('object');
    expect(event.eventType).toBe('add');
  });
});

test('box.update() a new reference', function () {
  var newValue = { Tom: { age: 3 } };
  box.update(updateTestingKey, function (oldValue) {
    expect(arguments.length).toBe(2);
    return newValue;
  })
  expect(box.get(updateTestingKey)).toEqual(newValue);

  expect(box.get(updateTestingKey)).not.toEqual(undefined);
  expect(box.get(updateTestingKey)).not.toEqual(null);
  expect(typeof box.get(updateTestingKey)).toBe('object');

  expect(box.get(updateTestingKey).Tom).not.toEqual(undefined);
  expect(box.get(updateTestingKey).Tom).not.toEqual(null);
  expect(typeof box.get(updateTestingKey).Tom).toBe('object');

  expect(box.get(updateTestingKey).Tom.age).not.toEqual(undefined);
  expect(box.get(updateTestingKey).Tom.age).not.toEqual(null);
  expect(typeof box.get(updateTestingKey).Tom.age).toBe('number');
  expect(box.get(updateTestingKey).Tom.age).toEqual(3);

  
});


test('box.watchVariable() for update the old reference', function () {
  var unwatch = box.watchVariable(updateTestingKey, function (event) {
    expect(typeof unwatch).toBe('function');
    unwatch();
    expect(typeof event).toBe('object');
    expect(event.eventType).toBe('update');
  });
});

test('box.update() the old reference', function () {
  expect(box.get(updateTestingKey).Tom.age).not.toEqual(undefined);
  expect(box.get(updateTestingKey).Tom.age).not.toEqual(null);
  expect(typeof box.get(updateTestingKey).Tom.age).toBe('number');
  expect(box.get(updateTestingKey).Tom.age).toEqual(3);

  var oldAge = box.get(updateTestingKey).Tom.age;

  box.update(updateTestingKey, function (oldValue) {
    expect(arguments.length).toBe(2);
    oldValue.Tom.age += 1;
    return oldValue;
  })
  expect(box.get(updateTestingKey).Tom.age).toEqual(oldAge + 1)
  
});

test.todo('box.watchPath()');
test.todo('box.get()');
test.todo('box.set()');
test.todo('box.merge()');
