var Varbox;
test('require("varbox")', function () {
  Varbox = require('./varbox');

  var VarboxKeys = Object.keys(Varbox);

  expect(VarboxKeys).toContain('createBox');
  expect(typeof Varbox.createBox).toBe('function');
  expect(Varbox.createBox.length).toEqual(1);

  expect(VarboxKeys).toContain('getBox');
  expect(typeof Varbox.getBox).toBe('function');
  expect(Varbox.getBox.length).toEqual(1);
});

var box;
var updateTestingKey = 'testUpdate';

test('Varbox.createBox()', function () {
  box = Varbox.createBox('firstBox');
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

test('Varbox.createBox() with the same box name: firstBox', function() {
  var box = Varbox.createBox('firstBox');
  var boxGetAgain1 = Varbox.createBox('firstBox');

  var boxGetAgain2 = Varbox.createBox({
    BOX_NAME: 'firstBox',
  });

  for (var k in box) {
    expect(box[k]).toBe(boxGetAgain1[k]);
    expect(box[k]).toBe(boxGetAgain2[k]);

    expect(boxGetAgain1[k]).toBe(box[k]);
    expect(boxGetAgain1[k]).toBe(boxGetAgain2[k]);

    expect(boxGetAgain2[k]).toBe(box[k]);
    expect(boxGetAgain2[k]).toBe(boxGetAgain1[k]);
  }
});

test('Varbox.createBox() with different box name', function() {
  var box = Varbox.createBox('firstBox');

  var otherBox1 = Varbox.createBox('secondBox');
  var otherBox2 = Varbox.createBox({
    BOX_NAME: 'secondBoxWithJSONConfiguration',
  });
  var otherBox3 = Varbox.createBox('');
  var otherBox4 = Varbox.createBox();

  for (var k in box) {
    expect(box[k]).not.toBe(otherBox1[k]);
    expect(box[k]).not.toBe(otherBox2[k]);
    expect(box[k]).not.toBe(otherBox3[k]);
    expect(box[k]).not.toBe(otherBox4[k]);

    expect(otherBox1[k]).not.toBe(box[k]);
    expect(otherBox1[k]).not.toBe(otherBox2[k]);
    expect(otherBox1[k]).not.toBe(otherBox3[k]);
    expect(otherBox1[k]).not.toBe(otherBox4[k]);

    expect(otherBox2[k]).not.toBe(box[k]);
    expect(otherBox2[k]).not.toBe(otherBox1[k]);
    expect(otherBox2[k]).not.toBe(otherBox3[k]);
    expect(otherBox2[k]).not.toBe(otherBox4[k]);

    expect(otherBox3[k]).not.toBe(box[k]);
    expect(otherBox3[k]).not.toBe(otherBox1[k]);
    expect(otherBox3[k]).not.toBe(otherBox2[k]);
    expect(otherBox3[k]).not.toBe(otherBox4[k]);

    expect(otherBox4[k]).not.toBe(box[k]);
    expect(otherBox4[k]).not.toBe(otherBox1[k]);
    expect(otherBox4[k]).not.toBe(otherBox2[k]);
    expect(otherBox4[k]).not.toBe(otherBox3[k]);
  }
});

test('Varbox.createBox() with empty box name', function() {
  var box = Varbox.createBox();

  var boxGetAgain1 = Varbox.createBox('');
  var boxGetAgain2 = Varbox.createBox({
    BOX_NAME: '',
  });
  var boxGetAgain3 = Varbox.createBox({});

  for (var k in box) {
    expect(box[k]).not.toBe(boxGetAgain1[k]);
    expect(box[k]).not.toBe(boxGetAgain2[k]);
    expect(box[k]).not.toBe(boxGetAgain3[k]);

    expect(boxGetAgain1[k]).not.toBe(box[k]);
    expect(boxGetAgain1[k]).not.toBe(boxGetAgain2[k]);
    expect(boxGetAgain1[k]).not.toBe(boxGetAgain3[k]);

    expect(boxGetAgain2[k]).not.toBe(box[k]);
    expect(boxGetAgain2[k]).not.toBe(boxGetAgain1[k]);
    expect(boxGetAgain2[k]).not.toBe(boxGetAgain3[k]);

    expect(boxGetAgain3[k]).not.toBe(box[k]);
    expect(boxGetAgain3[k]).not.toBe(boxGetAgain1[k]);
    expect(boxGetAgain3[k]).not.toBe(boxGetAgain2[k]);
  }
});

test('box.watch()', function () {
  box.watch(function (event) {
    expect(typeof event).toEqual('object');
  });
});

test('box.watchVariable() for update a new reference', function () {
  var unwatch = box.watchVariable(updateTestingKey, function (event) {
    expect(typeof unwatch).toEqual('function');
    unwatch();
    expect(typeof event).toEqual('object');
    expect(event.eventType).toEqual('add');
  });
});

test('box.update() a new reference', function () {
  var newValue = { Tom: { age: 3 } };
  box.update(updateTestingKey, function (oldValue) {
    expect(arguments.length).toEqual(2);
    return newValue;
  })
  expect(box.get(updateTestingKey)).toEqual(newValue);

  expect(box.get(updateTestingKey)).not.toBe(undefined);
  expect(box.get(updateTestingKey)).not.toBe(null);
  expect(typeof box.get(updateTestingKey)).toEqual('object');

  expect(box.get(updateTestingKey).Tom).not.toBe(undefined);
  expect(box.get(updateTestingKey).Tom).not.toBe(null);
  expect(typeof box.get(updateTestingKey).Tom).toEqual('object');

  expect(box.get(updateTestingKey).Tom.age).not.toBe(undefined);
  expect(box.get(updateTestingKey).Tom.age).not.toBe(null);
  expect(typeof box.get(updateTestingKey).Tom.age).toEqual('number');
  expect(box.get(updateTestingKey).Tom.age).toEqual(3);

  
});


test('box.watchVariable() for update the old reference', function () {
  var unwatch = box.watchVariable(updateTestingKey, function (event) {
    expect(typeof unwatch).toEqual('function');
    unwatch();
    expect(typeof event).toEqual('object');
    expect(event.eventType).toEqual('update');
  });
});

test('box.update() the old reference', function () {
  expect(box.get(updateTestingKey).Tom.age).not.toBe(undefined);
  expect(box.get(updateTestingKey).Tom.age).not.toBe(null);
  expect(typeof box.get(updateTestingKey).Tom.age).toEqual('number');
  expect(box.get(updateTestingKey).Tom.age).toEqual(3);

  var oldAge = box.get(updateTestingKey).Tom.age;

  box.update(updateTestingKey, function (oldValue) {
    expect(arguments.length).toEqual(2);
    oldValue.Tom.age += 1;
    return oldValue;
  })
  expect(box.get(updateTestingKey).Tom.age).toEqual(oldAge + 1)
  
});

test.todo('box.watchPath()');
test.todo('box.get()');
test.todo('box.set()');
test.todo('box.merge()');
