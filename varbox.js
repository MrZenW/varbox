/* eslint-disable no-console */
// eslint-disable-next-line no-extra-semi
;
'use strict';
(function VarBoxModuleSpace() {
  /**
   * the _undefined() function is used to avoid
   * the programmer I make any mistake cause the
   * undefined variable to be overridden
   */
  function _undefined (){ return void 0; }
  /**
   * the undefined variable is used to avoid the programmer I 
   * to use the undefined variable directly
   */
  // eslint-disable-next-line no-unused-vars, no-shadow-restricted-names
  var undefined = _undefined();

  // var MATCHING_TYPE_PATH = 'MATCHING_TYPE_PATH';
  var MATCHING_TYPE_VARIABLE = 'MATCHING_TYPE_VARIABLE';

  function BLANK_FUNCTION () {}
  function DEFAULT_EXIST_CHECKER (nodeInfo) {
    return _has(nodeInfo.variable, nodeInfo.key);
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
  var ARRAY_TYPE_STRINGIFY = Object.prototype.toString.call(Array());
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
    if (value === _undefined() || null === value) return true;
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

  var EVENTBOXES = {};
  var eventBoxIdCounter = 0;
  function createEventBox (eventBoxId) {
    var _eventBox = getEventBox(eventBoxId);
    if (_eventBox) return _eventBox;
    eventBoxIdCounter += 1;
    eventBoxId = eventBoxIdCounter;
    var _events = {};
    var _onceEvents = {};
    function _off(eveName, eveFunc) {
      var events = _events[eveName] || [];
      if (events.length > 0) {
        var eventsFilted = [];
        for (var i = 0; i < events.length; i += 1) {
          var func = events[i];
          if (func !== eveFunc) eventsFilted.push(func);
        }
        _events[eveName] = events;
      }
  
      var onceEvents = _onceEvents[eveName] || [];
      if (onceEvents.length > 0) {
        var onceEventsFilted = [];
        for (var onceI = 0; onceI < onceEvents.length; onceI += 1) {
          var onceFunc = onceEvents[onceI];
          if (onceFunc !== eveFunc) onceEventsFilted.push(onceFunc);
        }
        _onceEvents[eveName] = onceEventsFilted;
      }
  
      return this;
    }
  
    function _on(eveName, eveFunc) {
      _off(eveName, eveFunc);
      _onceEvents[eveName] = _onceEvents[eveName] || [];
      _events[eveName] = _events[eveName] || [];
      _events[eveName].push(eveFunc);
      if (_onceEvents[eveName].length + _events[eveName].length > 10) {
        console.warn('on: More than 10 listeners on the event "' + eveName + '". Details: On ' + _events[eveName].length + ', Once ' + _onceEvents[eveName].length);
      }
      return this;
    }
  
    function _once(eveName, eveFunc) {
      _off(eveName, eveFunc);
      _events[eveName] = _events[eveName] || [];
      _onceEvents[eveName] = _onceEvents[eveName] || [];
      _onceEvents[eveName].push(eveFunc);
      if (_onceEvents[eveName].length + _events[eveName].length > 10) {
        console.warn('once: More than 10 listeners on the event "' + eveName + '". Details: On ' + _events[eveName].length + ', Once ' + _onceEvents[eveName].length);
      }
      return this;
    }
  
    function _emit(eveName/*, eveArgument1*/) {
      var eveArgs = (arguments.length > 1) ? Array.prototype.slice.call(arguments, 1) : [];
  
      var events = _events[eveName] || [];
      var eventSize = events.length;
      if (eventSize > 0) {
        for (var i = 1; i < eventSize; i += 1) {
          var func = events[i];
          if (_isFunction(func)) func.apply(this, eveArgs);
        }
      }
  
      //once
      var onceEvents = _onceEvents[eveName] || [];
      while (onceEvents.length > 0) {
        var onceFunc = onceEvents.pop();
        if (_isFunction(onceFunc)) onceFunc.apply(this, eveArgs);
      }
      return this;
    }
    EVENTBOXES[eventBoxId] = {
      on: _on,
      once: _once,
      off: _off,
      emit: _emit,
    };
    return getEventBox(eventBoxId);
  }

  function getEventBox(eventBoxId) {
    var eventBox = EVENTBOXES[eventBoxId];
    if (eventBox) {
      return _merge({}, eventBox);
    }
    return eventBox;
  }

  function $destory(variable, callback, $path) {
    if (_isObject(variable)) {
      $path = $path || [];
      if (_isArray(variable)) {
        var index = -1;
        while(variable.length) {
          index += 1;
          var arrayPath = [].concat($path, index);
          $destory(variable.shift(), callback, arrayPath);
          callback({
            eventType: 'destory',
            variable: variable,
            key: index,
            path: arrayPath,
          });
        }
      } else {
        for (var key in variable) {
          var v = variable[key];
          delete variable[key];
          var objectPath = [].concat($path, key);
          $destory(v, callback, objectPath);
          callback({
            eventType: 'destory',
            variable: variable,
            key: key,
            path: objectPath,
          });
        }
      }
    }
  }
  function $set(rootVariable, pathArray, value, callback) {
    function setSourceValueWrapping () { return value; }
    function updateCallback (event) {
      event.sourceValue = value;
      callback(event);
    }
    return $update(rootVariable, pathArray, setSourceValueWrapping, updateCallback);
  }
  function $update(rootVariable, pathArray, valueSource, callback) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(valueSource)) throw new TypeError('Need a function for value source');
    if (!_isFunction(callback)) callback = BLANK_FUNCTION;
    return $nodeMap(rootVariable, pathArray, function _nodeMapSet(nodeInfo) {
      var oldValue = nodeInfo.variable[nodeInfo.key];
      var isOldValueObject = _isObject(oldValue);
      var doesTheKeyExist = _has(nodeInfo.variable, nodeInfo.key);
      var eventType;
      if (nodeInfo.path.length === nodeInfo.targetPath.length) {
        if (doesTheKeyExist) {
          eventType = 'replace';
        } else {
          eventType = 'add';
        }
        
        var newValue = valueSource(oldValue, doesTheKeyExist);
        nodeInfo.variable[nodeInfo.key] = newValue;
        if (isOldValueObject && _isObject(newValue) && _is(oldValue, newValue)) {
          eventType = 'update';
        }
        callback({
          eventType: eventType,
          variable: nodeInfo.variable,
          key: nodeInfo.key,
          path: nodeInfo.path,
          targetPath: nodeInfo.targetPath,
          // sourceValue: valueSource,
          oldValue: oldValue,
          newValue: nodeInfo.variable[nodeInfo.key],
        });
        return;
      }
      if (!doesTheKeyExist || !isOldValueObject) {
        // a node but not exists, include null undefined NaN
        if (!doesTheKeyExist) {
          eventType = 'add';
        } else if (!isOldValueObject) {
          eventType = 'replace';
        }
        oldValue = _undefined();
        if (doesTheKeyExist) oldValue = nodeInfo.variable[nodeInfo.key];
        nodeInfo.variable[nodeInfo.key] = {};
        callback({
          eventType: eventType,
          variable: nodeInfo.variable,
          key: nodeInfo.key,
          path: nodeInfo.path,
          targetPath: nodeInfo.targetPath,
          // sourceValue: valueSource,
          oldValue: oldValue,
          newValue: nodeInfo.variable[nodeInfo.key],
        });
        return;
      }
      return;
    });
  }
  function $merge(rootVariable, pathArray, sourceValue, callback) {
    function mergeSurceValueWrapping (oldValue) {
      if (_isObject(oldValue) || _isArray(oldValue)) return _merge(oldValue, sourceValue);
      if (_isObject(sourceValue)) return _merge({}, sourceValue);
      if (_isArray(sourceValue)) return _merge([], sourceValue);
      return sourceValue;
    }
    function updateCallback (event) {
      event.sourceValue = sourceValue;
      callback(event);
    }
    return $update(rootVariable, pathArray, mergeSurceValueWrapping, updateCallback);
    // return $set(rootVariable, pathArray, sourceValue, callback, true);
  }
  // eslint-disable-next-line no-unused-vars
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
        var oldValue = nodeInfo.variable[nodeInfo.key];
        if (_isArray(nodeInfo.variable)) {
          nodeInfo.variable.splice(nodeInfo.key, 1);
        } else {
          delete nodeInfo.variable[nodeInfo.key];
        }
        callback({
          eventType: 'delete',
          variable: nodeInfo.variable,
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
    return $nodeMap(rootVariable, pathArray).isExist;
  }

  function $nodeMap(rootVariable, pathArray, checker) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction(checker)) checker = DEFAULT_EXIST_CHECKER;
    var parentVariable;
    var rootChildren = rootVariable;
    var isExist = false;
    for (var i = 0; i < pathArray.length; i += 1) {
      var pathIndex = i;
      var currentKey = pathArray[pathIndex];
      var currentPath = pathArray.slice(0, pathIndex + 1);
      if (false !== checker({
        variable: rootChildren,
        key: currentKey,
        value: Object(rootChildren)[currentKey],
        path: currentPath,
        targetPath: pathArray,
      })) {
        isExist = true;
        parentVariable = rootChildren;
        rootChildren = rootChildren[currentKey];
      } else {
        isExist = false;
        return {
          isExist: isExist,
          variable: rootChildren,
        };
      }
    }
    return {
      isExist: isExist,
      value: rootChildren,
      variable: parentVariable,
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
      variable: rootVariable,
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
        variable: _undefined(),
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

  var BOXES = {};
  var boxCounter = 0;
  function createBox(opts) {
    // box name
    var BOX_NAME = _undefined();
    if ('string' === typeof opts) BOX_NAME = opts;
    if (!_isObject(opts)) opts = {};
    if (_has(opts, 'BOX_NAME')) BOX_NAME = '' + opts['BOX_NAME'];
    if (!BOX_NAME) {
      boxCounter += 1;
      BOX_NAME = '' + boxCounter;
    }
    var existedBox = getBox(BOX_NAME);
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
          event.pathString = _undefined();
        } else {
          event.pathString = event.path.join(PATH_SEPARATOR);
        }
      }
      if (_isArray(event.targetPath)) {
        event.targetPath = event.targetPath.slice(ROOT_PATH.length);
        if (0 === event.targetPath.length) {
          event.targetPathString = _undefined();
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
    function _onEventForDestory(event) {
      event.method = 'destory';
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
    function has_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      return $has(rootVariable, [].concat(ROOT_PATH, pathArray));
    }
    function destory_(pathArray) {
      pathArray = _parsePathArgument(pathArray, PATH_SEPARATOR);
      pathArray = [].concat(ROOT_PATH, pathArray);
      var v = $nodeMap(rootVariable, pathArray);
      if (v.isExist) {
        $destory(v.value, _onEventForDestory, pathArray);
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
      if (v.isExist) {
        // $destory(v.value, _onEvent, pathArray);
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
      has: has_,
      delete: delete_,
      destory: destory_,
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
  function getBox (boxName) {
    if (0 === arguments.length) {
      var allBox = _merge({}, BOXES);
      for (var aBoxName in allBox) {
        allBox[aBoxName] = _merge({}, allBox[aBoxName]);
      }
      return allBox;
    }
    var theBox = BOXES[boxName];
    if (theBox) return _merge({}, theBox);
    return _undefined();
  }

  var Varbox = {
    createBox: createBox,
    getBox: getBox,
    createVarBox: createBox,
    getVarBox: getBox,
    createEventBox: createEventBox,
    getEventBox: getEventBox,
  };
  if ('object' === typeof module) module.exports = Varbox;
  if ('object' === typeof window) window.Varbox = Varbox;
  if ('object' === typeof self) self.Varbox = Varbox;
})();
