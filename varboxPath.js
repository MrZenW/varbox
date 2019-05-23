;
"use strict";
(function VarBoxModuleSpace(undefined) {
  function BLANK_FUNCTION () {}
  function DEFAULT_EXIST_CHECKER (arg) {
    return _has(arg.variable, arg.key);
  }
  function _isNone(value) {
    if (value === undefined || value === null) return true;
    if (isNaN(value) && 'number' === typeof value) return true;
    return false;
  }
  function _has(variable, key) {
    if (_isNone(variable)) return false;
    var keyType = typeof key;
    if ('number' === keyType || 'string' === keyType) {
      if (Array.isArray(variable)) {
        var index = parseInt(key, 10);
        if (isNaN(index)) return false;
        return variable.length > index && index >= 0;
      }
      return Object.prototype.hasOwnProperty.call(variable, key);
    }
    return false;
  }
  function _isFunction(variable) {
    return 'function' === typeof variable;
  }
  function _isObject(variable) {
    return 'object' === typeof variable && variable === Object(variable);
  }
  function _isArray(variable) {
    return Array.isArray(variable);
  }
  function _merge(target) {
    if (_isNone(target)) throw new TypeError('Cannot convert undefined or null to object');
    var to = Object(target);
    var isTargetArray = _isArray(target);
    for (var i = 1; i < arguments.length; i += 1) {
      var nextSource = Object(arguments[i]);
      if (nextSource) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            isTargetArray ? to.push(nextSource[nextKey]) :to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  }
  function $destory(variable, callback, $path) {
    if (_isObject(variable)) {
      $path = $path || [];
      if (_isArray(variable)) {
        var key = -1;
        while(variable.length) {
          key += 1;
          var p = [].concat($path, key);
          $destory(variable.shift(), callback, p);
          callback({
            eventType: 'destory',
            variable: variable,
            key: key,
            path: p,
            pathString: p.join('.'),
          });
        }
      } else {
        for (var key in variable) {
          var v = variable[key];
          delete variable[key];
          var p = [].concat($path, key);
          $destory(v, callback, p);
          callback({
            eventType: 'destory',
            variable: variable,
            key: key,
            path: p,
            pathString: p.join('.'),
          });
        }
      }
    }
  }
  function $set(rootVariable, pathArray, newValue, callback, isMerge) {
    if (!_isObject(rootVariable)) {
      throw new TypeError('Need an object for variable');
    }
    if (!_isArray(pathArray)) {
      throw new TypeError('Need an array for path');
    }
    callback = callback || BLANK_FUNCTION;
    var pathArrayString;
    return $deepMap(rootVariable, pathArray, function _deepIntoSet(arg) {
      pathArrayString = pathArrayString || (_isArray(arg.targetPath) ? arg.targetPath.join('.') : '');
      if (arg.path.length === arg.targetPath.length) {
        var eventType;
        var oldValue = arg.variable[arg.key];
        if (isMerge && _has(arg.variable, arg.key) &&
            (_isObject(arg.variable[arg.key]) || _isArray(arg.variable[arg.key]))) {
          arg.variable[arg.key] = _merge(arg.variable[arg.key], newValue);
          eventType = 'merge';
        } else {
          arg.variable[arg.key] = newValue;
          eventType = 'set';
        }
        callback({
          eventType: eventType,
          variable: arg.variable,
          key: arg.key,
          path: arg.path,
          pathString: arg.path.join('.'),
          targetPath: arg.targetPath,
          targetPathString: pathArrayString,
          oldValue: oldValue,
          newValue: arg.variable[arg.key],
        });
      } else if (!_has(arg.variable, arg.key) || !_isObject(arg.variable[arg.key])) {
        // a node but not exists, include null undefined NaN
        arg.variable[arg.key] = {};
        callback({
          eventType: 'add',
          variable: arg.variable,
          key: arg.key,
          path: arg.path,
          pathString: arg.path.join('.'),
          targetPath: arg.targetPath,
          targetPathString: pathArrayString,
          oldValue: undefined,
          newValue: arg.variable[arg.key],
        });
      }
      return true;
    });
  }
  function $merge(rootVariable, pathArray, newValue, callback) {
    return $set(rootVariable, pathArray, newValue, callback, true);
  }
  function $deepMerge(varA, varB, path) {
    for (var key in varB) {
      var aNextV = varA[key];
      var isAArray = _isArray(varA);

      var bNextV = varB[key];
      var isBArray = _isArray(varB);

      if (isAArray && isBArray) {
        for (var i = 0; i < varB.length; i += 1) {
          varA.push(varB[i]);
        }
      } else if (_isObject(aNextV) && _isObject(bNextV)) {
        // both object
        $deepMerge(varA[key], varB[key]);
      } else {
        varA[key] = varB[key];
      }
    }
  }
  function $get(rootVariable, pathArray) {
    if (!_isObject(rootVariable)) {
      throw new TypeError('Need an object for variable');
    }
    if (!_isArray(pathArray)) {
      throw new TypeError('Need an array for path');
    }
    return $deepMap(rootVariable, pathArray).value;
  }
  function $delete(rootVariable, pathArray, callback) {
    if (!_isObject(rootVariable)) {
      throw new TypeError('Need an object for variable');
    }
    if (!_isArray(pathArray)) {
      throw new TypeError('Need an array for path');
    }
    callback = callback || BLANK_FUNCTION;
    var pathArrayString;
    var isBack = true;
    return $deepMap(rootVariable, pathArray, function _deepIntoDelete(arg) {
      if (arg.path.length === arg.targetPath.length) {
        var oldValue = arg.variable[arg.key];
        pathArrayString = pathArrayString || (_isArray(arg.targetPath) ? arg.targetPath.join('.') : '');
        delete arg.variable[arg.key];
        callback({
          eventType: 'delete',
          variable: arg.variable,
          key: arg.key,
          path: arg.path,
          pathString: arg.path.join('.'),
          targetPath: arg.targetPath,
          targetPathString: pathArrayString,
          oldValue: oldValue,
        });
      }
      return true;
    }, isBack).value;
  }
  function $has(rootVariable, pathArray) {
    return $deepMap(rootVariable, pathArray).isExist;
  }
  function $deepMap(rootVariable, pathArray, checker) {
    if (!_isObject(rootVariable)) {
      throw new TypeError('Need an object for variable');
    }
    if (!_isArray(pathArray)) {
      throw new TypeError('Need an array for path');
    }
    checker = checker || DEFAULT_EXIST_CHECKER;
    pathArray = [].concat(pathArray);
    var pathArrayString = pathArray.join('.');
    var parentVariable;
    var rootChildren = rootVariable;

    for (var i = 0; i < pathArray.length; i += 1) {
      var pathIndex = i;
      var currentKey = pathArray[pathIndex];
      var currentPath = pathArray.slice(0, pathIndex + 1);
      if (false !== checker({
        variable: rootChildren,
        key: currentKey,
        value: Object(rootChildren)[currentKey],
        path: currentPath,
        pathString: currentPath.join('.'),
        targetPath: pathArray,
        targetPathString: pathArrayString,
      })) {
        parentVariable = rootChildren;
        rootChildren = rootChildren[currentKey];
      } else {
        return {
          isExist: false,
          variable: rootChildren,
        };
      }
    }
    return {
      isExist: true,
      value: rootChildren,
      variable: parentVariable,
    };
  }
  function $deepBack(rootVariable, pathArray, checker, $i) {
    if (!_isArray(pathArray)) {
      throw new TypeError('Need an array for path');
    }
    checker = checker || DEFAULT_EXIST_CHECKER;
    if ('number' !== typeof $i) $i = pathArray.length - 1;
    if ($i < 0) return;
    pathArray = [].concat(pathArray);
    var currentKey = pathArray[$i];
    $deepBack(_isObject(rootVariable) ? rootVariable[currentKey] : {}, pathArray, checker, $i - 1);
    var currentPath = pathArray.slice(0, $i);
    checker({
      variable: rootVariable,
      key: currentKey,
      value: Object(rootVariable)[currentKey],
      path: currentPath,
      pathString: currentPath.join('.'),
      targetPath: pathArray,
      targetPathString: pathArray.join('.'),
    })
  }
  var _everyNodeDuplicateCache = {};
  var _everyNodeDuplicateCacheCounter = 0;
  function $everyNode(variable, callback, itsKey, itsPath, contextKey) {
    var isTopLevel = false;
    if (!contextKey) {
      _everyNodeDuplicateCacheCounter += 1;
      contextKey = _everyNodeDuplicateCacheCounter;
      isTopLevel = true;
    }
    _everyNodeDuplicateCache[contextKey] = _everyNodeDuplicateCache[contextKey] || [];
    var currentCache = _everyNodeDuplicateCache[contextKey];
    if (_isObject(variable)) {
      itsPath = itsPath || [];

      function _do(key) {
        var v = variable[key];
        if (!_isObject(v) || currentCache.indexOf(v) === -1) {
          // don't cache non-object variable
          currentCache.push(v);
          var p = [].concat(itsPath, key);
          callback({
            variable: variable,
            key: key,
            value: v,
            path: p,
            pathString: p.join('.'),
          });
          $everyNode(v, callback, key, p, contextKey);
        }
      }

      if (_isArray(variable)) {
        for (var i = 0; i < variable.length; i += 1) {
          _do(i);
        }
      } else {
        for (var key in variable) {
          _do(key);
        }
      }
      if (isTopLevel) {
        currentCache.splice(0);
        delete _everyNodeDuplicateCache[contextKey];
      }
    } else if (isTopLevel){
      callback({
        variable: undefined,
        key: itsKey,
        value: variable,
        path: itsPath,
        pathString: itsPath.join('.'),
      });
    }
  }

  var PATH_ROOT = '/';
  function createVarbox(defaultVariable) {
    var rootVariable = {};
    rootVariable[PATH_ROOT] = {};
    if (arguments.length > 0) {
      rootVariable[PATH_ROOT] = defaultVariable;
    }
    var watcherIdCounter = 0;
    var watchers = {};
    function _onEvent(event) {
      for(var watcherId in watchers) {
        watchers[watcherId](event);
      }
    }
    return {
      set: function set_(pathArray, val) {
        if (arguments.length < 2) throw new Error('Need two arguments!');
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        return $set(rootVariable, [].concat(PATH_ROOT, pathArray), val, _onEvent);
      },
      get: function get_(pathArray) {
        if (arguments.length === 0) return rootVariable[PATH_ROOT];
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        return $get(rootVariable, [].concat(PATH_ROOT, pathArray));
      },
      delete: function delete_(pathArray) {
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        return $delete(rootVariable, [].concat(PATH_ROOT, pathArray), _onEvent);
      },
      watch: function watch_(watcher) {
        watcherIdCounter += 1;
        var thisId = watcherIdCounter;
        watchers[thisId] = watcher;
        return function unwatch() {
          delete watchers[thisId];
        };
      },
      has: function has_(pathArray) {
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        return $has(rootVariable, [].concat(PATH_ROOT, pathArray));
      },
      destory: function destory_(pathArray) {
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        pathArray = [].concat(PATH_ROOT, pathArray);
        var v = $deepMap(rootVariable, pathArray);
        if (v.isExist) {
          $destory(v.value, _onEvent, pathArray);
        }
      },
      deepMap: function deepInto_(pathArray, checker) {
        return $deepMap(rootVariable, pathArray, checker);
      },
      deepBack: function deepInto_(pathArray, checker) {
        return $deepBack(rootVariable, pathArray, checker);
      },
      merge: function merge_(pathArray, val) {
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        return $merge(rootVariable, [].concat(PATH_ROOT, pathArray), val, _onEvent);
      },
      everyNode: function everyNode_(pathArray, callback) {
        if (typeof pathArray === 'string') pathArray = pathArray.split('.');
        if (!_isArray(pathArray)) pathArray = [];
        pathArray = [].concat(PATH_ROOT, pathArray);
        var v = $deepMap(rootVariable, pathArray);
        if (v.isExist) {
          // $destory(v.value, _onEvent, pathArray);
          return $everyNode(v.value, callback);
        } else {
          return callback(null);
        }
      }
    };
  }
  if (typeof module === 'object') module.exports = { createVarbox: createVarbox };
  if (typeof window === 'object') window.createVarbox = createVarbox;
})();
