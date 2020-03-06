;
var Varbox = (function VarboxModuleSpace() {
  'use strict';
  /**
   * the _getUndefined() function is used to avoid
   * the programmer I make any mistake cause the
   * undefined variable to be overridden
   */
  function _getUndefined (){ return void 0; }
  /**
   * the undefined variable is used to avoid the programmer I 
   * to use the undefined variable directly
   */
  var undefined = _getUndefined();

  // var MATCHING_TYPE_PATH = 'MATCHING_TYPE_PATH';
  var MATCHING_TYPE_VARIABLE = 'MATCHING_TYPE_VARIABLE';

  function BLANK_FUNCTION () {}
  function DEFAULT_EXIST_CHECKER (nodeInfo) {
    return _has(nodeInfo.parentVariable, nodeInfo.key);
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
  var ARRAY_TYPE_STRINGIFY = Object.prototype.toString.call([]);
  function _isArray(variable) {
    return Object.prototype.toString.call(variable) === ARRAY_TYPE_STRINGIFY;
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Polyfill
  function _is(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  function _isNone(value) {
    if (value === _getUndefined() || null === value) return true;
    if (isNaN(value) && 'number' === typeof value) return true;
    return false;
  }
  function _has(variable, key) {
    if (_isNone(variable)) return false;
    var keyType = typeof key;
    if ('number' === keyType || 'string' === keyType) {
      if (_isArray(variable)) {
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
    return 'object' === typeof variable && Object(variable) === variable;
  }
  function _merge(target) {
    if (_isNone(target)) throw new TypeError('Cannot convert undefined or null to object');
    var to = Object(target);
    var isTargetArray = _isArray(target);
    var _nextSource;
    if (isTargetArray) {
      for (var iArray = 1; iArray < arguments.length; iArray += 1) {
        _nextSource = arguments[iArray];
        if (_isArray(_nextSource)) {
          to.push.apply(to, _nextSource);
        } else {
          to.push.call(to, _nextSource);
        }
      }
    } else {
      for (var iObject = 1; iObject < arguments.length; iObject += 1) {
        _nextSource = Object(arguments[iObject]);
        if (_nextSource) {
          for (var nextKey in _nextSource) {
            if (Object.prototype.hasOwnProperty.call(_nextSource, nextKey)) {
              to[nextKey] = _nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }

  function $destroy(variable, callback, $path) {
    if (_isObject(variable)) {
      $path = $path || [];
      if (_isArray(variable)) {
        var index = -1;
        while(variable.length) {
          index += 1;
          var arrayPath = [].concat($path, index);
          $destroy(variable.shift(), callback, arrayPath);
          callback({
            eventType: 'destroy',
            // variable: variable,
            key: index,
            path: arrayPath,
          });
        }
      } else {
        for (var key in variable) {
          var v = variable[key];
          delete variable[key];
          var objectPath = [].concat($path, key);
          $destroy(v, callback, objectPath);
          callback({
            eventType: 'destroy',
            // variable: variable,
            key: key,
            path: objectPath,
          });
        }
      }
    }
  }
  function $set(rootVariable, pathArray, value, callback) {
    function setTargetValueWrapping (sourceEvent) {
      sourceEvent.newValue = value;
      return sourceEvent;
    }
    function updateCallback (event) {
      event.targetValue = value;
      callback(event);
    }
    return $update(rootVariable, pathArray, setTargetValueWrapping, updateCallback);
  }
  function $update(rootVariable, pathArray, valueSource, callback) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(valueSource)) throw new TypeError('Need a function for value source');
    if (!_isFunction(callback)) callback = BLANK_FUNCTION;
    return $nodeMap(rootVariable, pathArray, function _nodeMapSet(nodeInfo) {
      var oldValue = nodeInfo.parentVariable[nodeInfo.key];
      var isOldValueObject = _isObject(oldValue);
      var doesTheKeyExist = _has(nodeInfo.parentVariable, nodeInfo.key);
      var eventType = null;
      // the end of the path
      if (nodeInfo.path.length === nodeInfo.targetPath.length) {
        if (doesTheKeyExist) {
          eventType = 'replace';
        } else {
          eventType = 'add';
        }
        var targetEvent = {
          eventType: eventType,
          parentVariable: nodeInfo.parentVariable,
          key: nodeInfo.key,
          path: nodeInfo.path,
          targetPath: nodeInfo.targetPath,
          // targetValue: valueSource,
          oldValue: oldValue,
          exists: doesTheKeyExist,
        };
        var refNewValueEvent = _merge({
          // newValue: oldValue, // put the oldValue to newValue let caller modify
        }, targetEvent);
        var returnNewValueEvent = valueSource(refNewValueEvent, doesTheKeyExist);
        if (_isObject(returnNewValueEvent)) {
          refNewValueEvent = returnNewValueEvent;
        }
        targetEvent = _merge({}, refNewValueEvent, targetEvent);
        if (_has(targetEvent, 'newValue')) {
          var newValue = targetEvent.newValue;
          nodeInfo.parentVariable[nodeInfo.key] = newValue;
          // check if modified the original variable
          if (isOldValueObject && _isObject(newValue) && _is(oldValue, newValue)) {
            eventType = 'update';
            targetEvent.eventType = eventType;
          }
        } else {
          eventType = null;
          targetEvent.eventType = eventType;
        }
        callback(targetEvent);
        return;
      }
      if (!doesTheKeyExist || !isOldValueObject) {
        // a node but does not exist, include null undefined NaN
        if (!doesTheKeyExist) {
          eventType = 'add';
        } else if (!isOldValueObject) {
          eventType = 'replace';
        }
        oldValue = _getUndefined();
        if (doesTheKeyExist) oldValue = nodeInfo.parentVariable[nodeInfo.key];
        nodeInfo.parentVariable[nodeInfo.key] = {};
        var nodeEvent = {
          eventType: eventType,
          parentVariable: nodeInfo.parentVariable,
          key: nodeInfo.key,
          path: nodeInfo.path,
          targetPath: nodeInfo.targetPath,
          // targetValue: valueSource,
          oldValue: oldValue,
          newValue: nodeInfo.parentVariable[nodeInfo.key],
          exists: doesTheKeyExist,
        };
        callback(nodeEvent);
        return;
      }
      return;
    });
  }
  function $merge(rootVariable, pathArray, targetValue, callback) {
    function mergeSurceValueWrapping (sourceEvent) {
      var oldValue = sourceEvent.oldValue;
      if (_isObject(oldValue) || _isArray(oldValue)) {
        sourceEvent.newValue = _merge(oldValue, targetValue);
      } else if (_isObject(targetValue)) {
        sourceEvent.newValue = _merge({}, targetValue);
      } else if (_isArray(targetValue)) {
        sourceEvent.newValue = _merge([], targetValue);
      } else {
        sourceEvent.newValue = targetValue;
      }
      return sourceEvent;
    }
    function updateCallback (event) {
      event.targetValue = targetValue;
      callback(event);
    }
    return $update(rootVariable, pathArray, mergeSurceValueWrapping, updateCallback);
    // return $set(rootVariable, pathArray, targetValue, callback, true);
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
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    return $nodeMap(rootVariable, pathArray).value;
  }
  function $delete(rootVariable, pathArray, callback) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(callback)) callback = BLANK_FUNCTION;
    var isBack = true;
    return $nodeMap(rootVariable, pathArray, function _nodeMapDelete(nodeInfo) {
      if (!DEFAULT_EXIST_CHECKER(nodeInfo)) return false;
      if (nodeInfo.path.length === nodeInfo.targetPath.length) {
        var oldValue = nodeInfo.parentVariable[nodeInfo.key];
        if (_isArray(nodeInfo.parentVariable)) {
          nodeInfo.parentVariable.splice(nodeInfo.key, 1);
        } else {
          delete nodeInfo.parentVariable[nodeInfo.key];
        }
        callback({
          eventType: 'delete',
          parentVariable: nodeInfo.parentVariable,
          key: nodeInfo.key,
          path: nodeInfo.path,
          targetPath: nodeInfo.targetPath,
          oldValue: oldValue,
        });
      }
      return true;
    }, isBack).value;
  }

  function $has(rootVariable, pathArray) {
    return $nodeMap(rootVariable, pathArray).exists;
  }

  function $metadata(rootVariable, pathArray) {
    return $nodeMap(rootVariable, pathArray);
  }

  function $nodeMap(rootVariable, pathArray, checker) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(checker)) checker = DEFAULT_EXIST_CHECKER;
    pathArray = _merge([], pathArray);
    var parentVariable;
    var rootChildren = rootVariable;
    var exists = true;
    var currentKey;
    var currentPath;
    for (var i = 0; i < pathArray.length; i += 1) {
      var pathIndex = i;
      currentKey = pathArray[pathIndex];
      currentPath = pathArray.slice(0, pathIndex + 1);  
      if (false !== checker({
        parentVariable: rootChildren,
        key: currentKey,
        value: Object(rootChildren)[currentKey],
        path: currentPath,
        targetPath: pathArray,
      })) {
        exists = true;
        parentVariable = rootChildren;
        rootChildren = rootChildren[currentKey];
      } else {
        exists = false;
        return {
          exists: exists,
          targetPath: pathArray,
          interruptPath: currentPath,
          interruptKey: currentKey,
          parentVariable: rootChildren,
        };
      }
    }
    return {
      exists: exists,
      value: rootChildren,
      targetPath: pathArray,
      key: currentKey,
      parentVariable: parentVariable,
    };
  }

  function $nodeBackMap(rootVariable, pathArray, checker, $i) {
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(checker)) checker = DEFAULT_EXIST_CHECKER;
    if ('number' !== typeof $i) $i = pathArray.length - 1;
    if ($i < 0) return;
    var currentKey = pathArray[$i];
    $nodeBackMap(_isObject(rootVariable) ? rootVariable[currentKey] : {}, pathArray, checker, $i - 1);
    var currentPath = pathArray.slice(0, $i);
    checker({
      parentVariable: rootVariable,
      key: currentKey,
      value: Object(rootVariable)[currentKey],
      path: currentPath,
      targetPath: pathArray,
    });
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
    function _do(key) {
      var v = variable[key];
      if (!_isObject(v) || -1 === currentCache.indexOf(v)) {
        // don't cache non-object variable
        currentCache.push(v);
        var p = [].concat(itsPath, key);
        callback({
          variable: variable,
          key: key,
          value: v,
          path: p,
        });
        $everyNode(v, callback, key, p, contextKey);
      }
    }

    if (_isObject(variable)) {
      itsPath = itsPath || [];
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
    } else if (isTopLevel) {
      callback({
        variable: _getUndefined(),
        key: itsKey,
        value: variable,
        path: itsPath,
      });
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  // . * + ? ^ $ { } ( ) | / [ ] \
  var regExpForEscape = /[.*+?^${}()|/[\]\\]/g;
  function _escapeRegExp(regExp) {
    // $& means the whole matched string;
    if (regExp instanceof RegExp) return regExp.source.replace(regExpForEscape, '\\$&');
    return (regExp + '').replace(regExpForEscape, '\\$&');
  }

  function _parseMatchPath (matchPath) {
    var isMatchPathArray = false;
    var isMatchPathRegExp = false;
    if (_isArray(matchPath)) {
      isMatchPathArray = true;
      matchPath = [].concat(matchPath);
    } else if (matchPath instanceof RegExp) {
      isMatchPathRegExp = true;
      matchPath = new RegExp(matchPath);
    } else { // string
      isMatchPathArray = false;
      isMatchPathRegExp = false;
      matchPath += ''; // toString
      if (matchPath.indexOf('+') > -1 || matchPath.indexOf('#') > -1) {
        isMatchPathRegExp = true;
        matchPath = _escapeRegExp(matchPath);
        matchPath = new RegExp('^' + matchPath.replace(/\\\+/g, '[^/]+').replace(/#/g, '.*') + '$');
      }
    }
    return {
      isMatchPathArray: isMatchPathArray,
      isMatchPathRegExp: isMatchPathRegExp,
      matchPath: matchPath
    };
  }

  // xxx/path/subpath
  function _checkIfMatchedForWatchPath(event, matchPathInfo) {
    var isMatchPathArray = matchPathInfo.isMatchPathArray;
    var isMatchPathRegExp = matchPathInfo.isMatchPathRegExp;
    var matchPath = matchPathInfo.matchPath;

    if (isMatchPathRegExp) {
      return matchPath.test(event.pathString);
    } else if (isMatchPathArray) {
      var isMatched = false;
      for (var i = 0; i < matchPath.length && i < event.path.length; i += 1) {
        var currentPathSlice = event.path[i];
        var forMatch = matchPath[i];
        if (forMatch === currentPathSlice) {
          isMatched = true;
        } else if (forMatch instanceof RegExp && forMatch.test(currentPathSlice)) {
          isMatched = true;
        } else {
          return false;
        }
      }
      return isMatched;
    } else {
      return 0 === matchPath.indexOf(event.pathString);
    }
  }

  // path/subpath/xxx
  function _checkIfMatchedForWatchVariable(event, matchPathInfo) {
    var isMatchPathArray = matchPathInfo.isMatchPathArray;
    var isMatchPathRegExp = matchPathInfo.isMatchPathRegExp;
    var matchPath = matchPathInfo.matchPath;

    if (isMatchPathRegExp) {
      return matchPath.test(event.pathString);
    } else if (isMatchPathArray) {
      if (event.path.length < matchPath.length) return false;
      var isMatched = false;
      for (var i = 0; i < matchPath.length && i < event.path.length; i += 1) {
        var currentPathSlice = event.path[i];
        var forMatch = matchPath[i];
        if (forMatch === currentPathSlice) {
          isMatched = true;
        } else if (forMatch instanceof RegExp && forMatch.test(currentPathSlice)) {
          isMatched = true;
        } else {
          return false;
        }
      }
      return isMatched;
    } else if ('string' === typeof event.pathString) {
      return 0 === event.pathString.indexOf(matchPath);
    } else {
      return event.pathString === matchPath;
    }
  }

  function _parsePathArgument(pathArg, PATH_SEPARATOR) {
    if ('string' === typeof pathArg) return pathArg.split(PATH_SEPARATOR);
    if (!_isArray(pathArg)) return [];
    return pathArg;
  }

  function _parseBoxOpts(opts) {
    if ('string' === typeof opts) return { BOX_NAME: opts };
    if (!_isObject(opts)) return {};
    if (_has(opts, 'BOX_NAME')) opts['BOX_NAME'] = '' + opts['BOX_NAME'];
    return opts;
  }

  var BOXES = {};
  var boxCounter = 0;
  function createVarbox(opts) {
    // box name
    opts = _parseBoxOpts(opts);
    var BOX_NAME = opts.BOX_NAME;

    if (!BOX_NAME) {
      boxCounter += 1;
      BOX_NAME = '' + boxCounter;
    }
    var existedBox = getVarbox(BOX_NAME);
    if (existedBox) return existedBox;

    var PATH_SEPARATOR = '/';
    var ROOT_PATH = ['ROOT'];
    if (_has(opts, 'ROOT_PATH')) {
      ROOT_PATH = opts['ROOT_PATH'];
      if (!_isArray(ROOT_PATH)) ROOT_PATH = [ROOT_PATH];
    }
    if (_has(opts, 'PATH_SEPARATOR')) PATH_SEPARATOR = opts['PATH_SEPARATOR'];

    var rootVariable = {};
    var watcherIdCounter = 0;
    var watchers = {};
    function _onEvent(event) {
      event = _merge({}, event);
      if (_isArray(event.path)) {
        event.path = event.path.slice(ROOT_PATH.length);
        if (0 === event.path.length) {
          event.pathString = _getUndefined();
        } else {
          event.pathString = event.path.join(PATH_SEPARATOR);
        }
      }
      if (_isArray(event.targetPath)) {
        event.targetPath = event.targetPath.slice(ROOT_PATH.length);
        if (0 === event.targetPath.length) {
          event.targetPathString = _getUndefined();
        } else {
          event.targetPathString = event.targetPath.join(PATH_SEPARATOR);
        }
      }
      for(var watcherId in watchers) {
        watchers[watcherId](event);
      }
    }
    function _onEventForUpdate(event) {
      event.method = 'update';
      return _onEvent(event);
    }
    function _onEventForSet(event) {
      event.method = 'set';
      return _onEvent(event);
    }
    function _onEventForMerge(event) {
      event.method = 'merge';
      return _onEvent(event);
    }
    function _onEventForDelete(event) {
      event.method = 'delete';
      return _onEvent(event);
    }
    function _onEventForDestroy(event) {
      event.method = 'destroy';
      return _onEvent(event);
    }
    function _unwatchGenerator(watcherId) {
      return function unwatch() {
        delete watchers[watcherId];
      };
    }
    function watch_(watcher) {
      watcherIdCounter += 1;
      watchers[watcherIdCounter] = watcher;
      return _unwatchGenerator(watcherIdCounter);
    }
    function update_(pathArray, valueSource) {
      if (arguments.length < 2) throw new Error('Need two arguments!');
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $update(rootVariable, [].concat(ROOT_PATH, pathArray), valueSource, _onEventForUpdate);
    }
    function set_(pathArray, val) {
      if (arguments.length < 2) throw new Error('Need two arguments!');
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $set(rootVariable, [].concat(ROOT_PATH, pathArray), val, _onEventForSet);
    }
    function get_(pathArray) {
      if (0 === arguments.length) return rootVariable[ROOT_PATH];
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $get(rootVariable, [].concat(ROOT_PATH, pathArray));
    }
    function delete_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $delete(rootVariable, [].concat(ROOT_PATH, pathArray), _onEventForDelete);
    }
    function watchPath_ (matchPath, watcher, matchType) {
      if (!_isFunction(watcher)) throw new Error('Watcher should be a function');
      if (_isNone(matchPath)) return watch_(watcher);
      var matchParseResult = _parseMatchPath(matchPath);
      if (matchType === MATCHING_TYPE_VARIABLE) {
        return watch_(function watcherOnWatch (event) {
          if(_checkIfMatchedForWatchVariable(event, matchParseResult)) watcher(event);
        });
      } else {
        return watch_(function watcherOnWatch (event) {
          if(_checkIfMatchedForWatchPath(event, matchParseResult)) watcher(event);
        });
      }
    }
    function watchVariable_ (matchPath, watcher) {
      return watchPath_(matchPath, watcher, MATCHING_TYPE_VARIABLE);
    }
    function metadata_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $metadata(rootVariable, [].concat(ROOT_PATH, pathArray));
    }
    function has_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $has(rootVariable, [].concat(ROOT_PATH, pathArray));
    }
    function destroy_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      pathArray = [].concat(ROOT_PATH, pathArray);
      var v = $nodeMap(rootVariable, pathArray);
      if (v.exists) {
        $destroy(v.value, _onEventForDestroy, pathArray);
      }
    }
    function nodeMap_(pathArray, checker) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $nodeMap(rootVariable, [].concat(ROOT_PATH, pathArray), checker);
    }
    function nodeBackMap_(pathArray, checker) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $nodeBackMap(rootVariable, [].concat(ROOT_PATH, pathArray), checker);
    }
    function merge_(pathArray, val) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $merge(rootVariable, [].concat(ROOT_PATH, pathArray), val, _onEventForMerge);
    }
    function everyNode_(pathArray, callback) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      var v = $nodeMap(rootVariable, [].concat(ROOT_PATH, pathArray));
      if (v.exists) {
        // $destroy(v.value, _onEvent, pathArray);
        return $everyNode(v.value, callback);
      } else {
        return callback(null);
      }
    }
    var theBox = {
      update: update_,
      get: get_,
      set: set_,
      merge: merge_,
      metadata: metadata_,
      has: has_,
      have: has_,
      delete: delete_,
      destroy: destroy_,
      watch: watch_,
      watchPath: watchPath_,
      watchVariable: watchVariable_,
      nodeMap: nodeMap_,
      nodeBackMap: nodeBackMap_,
      everyNode: everyNode_
    };
    BOXES[BOX_NAME] = theBox;
    return _merge({}, theBox);
  }
  function getVarbox (boxName) {
    if (0 === arguments.length) {
      var allBox = _merge({}, BOXES);
      for (var aBoxName in allBox) {
        allBox[aBoxName] = _merge({}, allBox[aBoxName]);
      }
      return allBox;
    }
    var theBox = BOXES[boxName];
    if (theBox) return _merge({}, theBox);
    return _getUndefined();
  }
  function grabVarbox(opts) {
    opts = _parseBoxOpts(opts);
    if (!_has(opts, 'BOX_NAME')) throw new Error('Need to provide a BOX_NAME parameter!');
    var theBox = getVarbox(opts.BOX_NAME);
    if (theBox) return theBox;
    return createVarbox(opts);
  }
  function _VarboxModuleFactory() {
    return {
      createBox: createVarbox,
      createVarbox: createVarbox,
      createVarBox: createVarbox,
      getBox: getVarbox,
      getVarbox: getVarbox,
      getVarBox: getVarbox,
      grabBox: grabVarbox,
      grabVarBox: grabVarbox,
      grabVarbox: grabVarbox,
      version: '2.0.2',
    };
  }
  if ('object' === typeof module) module.exports = _VarboxModuleFactory();
  if ('object' === typeof window) {
    window.Varbox = _VarboxModuleFactory();
    window.VarBox = _VarboxModuleFactory();
  }
  if ('object' === typeof self) {
    self.Varbox = _VarboxModuleFactory();
    self.VarBox = _VarboxModuleFactory();
  }
  if ('object' === typeof this) {
    this.Varbox = _VarboxModuleFactory();
    this.VarBox = _VarboxModuleFactory();
  }
  if ('function' === typeof define && define.amd) {
    define([], _VarboxModuleFactory);
  }
  if ('function' === typeof define && define.cmd) {
    define(function CMDFactory(_require, _exports, _module) {
      _module.exports = _VarboxModuleFactory();
    });
  }
  return _VarboxModuleFactory();
})();
