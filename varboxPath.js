;
"use strict";
(function VarBoxModuleSpace(undefined) {
  var PATH_SEPARATOR = '/';
  var MATCHING_TYPE_PATH = 'MATCHING_TYPE_PATH';
  var MATCHING_TYPE_VARIABLE = 'MATCHING_TYPE_VARIABLE';

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
    if (isTargetArray) {
      for (var i = 1; i < arguments.length; i += 1) {
        var nextSource = arguments[i];
        if (_isArray(nextSource)) {
          to.push.apply(to, nextSource);
        } else {
          to.push.call(to, nextSource);
        }
      }
    } else {
      for (var i = 1; i < arguments.length; i += 1) {
        var nextSource = Object(arguments[i]);
        if (nextSource) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
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
            pathString: p.join(PATH_SEPARATOR),
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
            pathString: p.join(PATH_SEPARATOR),
          });
        }
      }
    }
  }
  function $set(rootVariable, pathArray, newValue, callback, isMerge) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction) callback = BLANK_FUNCTION;
    var pathArrayString;
    return $deepMap(rootVariable, pathArray, function _deepIntoSet(arg) {
      pathArrayString = pathArrayString || (_isArray(arg.targetPath) ? arg.targetPath.join(PATH_SEPARATOR) : '');
      if (arg.path.length === arg.targetPath.length) {
        var eventType;
        var oldValue = arg.variable[arg.key];
        var isObjectType;
        var isArrayType;
        if (isMerge && _has(arg.variable, arg.key) &&
            (
              (isObjectType = _isObject(oldValue)) ||
              (isArrayType = _isArray(oldValue))
            )) {
          var cloningBase = isArrayType ? [] : {};
          arg.variable[arg.key] = _merge(cloningBase, oldValue, newValue);
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
          pathString: arg.path.join(PATH_SEPARATOR),
          targetPath: arg.targetPath,
          targetPathString: pathArrayString,
          oldValue: oldValue,
          newValue: arg.variable[arg.key],
        });
        return;
      }
      var isHaveTheKey = _has(arg.variable, arg.key);
      if (!isHaveTheKey || !_isObject(arg.variable[arg.key])) {
        // a node but not exists, include null undefined NaN
        var oldValue = undefined;
        if (isHaveTheKey) oldValue = arg.variable[arg.key];
        arg.variable[arg.key] = {};
        callback({
          eventType: 'add',
          variable: arg.variable,
          key: arg.key,
          path: arg.path,
          pathString: arg.path.join(PATH_SEPARATOR),
          targetPath: arg.targetPath,
          targetPathString: pathArrayString,
          oldValue: oldValue,
          newValue: arg.variable[arg.key],
        });
        return;
      }
      return;
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
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    return $deepMap(rootVariable, pathArray).value;
  }
  function $delete(rootVariable, pathArray, callback) {
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    if (!_isFunction) callback = BLANK_FUNCTION;
    var pathArrayString;
    var isBack = true;
    return $deepMap(rootVariable, pathArray, function _deepIntoDelete(arg) {
      if (!DEFAULT_EXIST_CHECKER(arg)) return false;
      if (arg.path.length === arg.targetPath.length) {
        var oldValue = arg.variable[arg.key];
        pathArrayString = pathArrayString || (_isArray(arg.targetPath) ? arg.targetPath.join(PATH_SEPARATOR) : '');
        if (_isArray(arg.variable)) {
          arg.variable.splice(arg.key, 1);
        } else {
          delete arg.variable[arg.key];
        }
        callback({
          eventType: 'delete',
          variable: arg.variable,
          key: arg.key,
          path: arg.path,
          pathString: arg.path.join(PATH_SEPARATOR),
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
    if (!_isObject(rootVariable)) throw new TypeError('Need an object for variable');
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
    checker = checker || DEFAULT_EXIST_CHECKER;
    pathArray = [].concat(pathArray);
    var pathArrayString = pathArray.join(PATH_SEPARATOR);
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
        pathString: currentPath.join(PATH_SEPARATOR),
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
    if (!_isArray(pathArray)) throw new TypeError('Need an array for path');
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
      pathString: currentPath.join(PATH_SEPARATOR),
      targetPath: pathArray,
      targetPathString: pathArray.join(PATH_SEPARATOR),
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
            pathString: p.join(PATH_SEPARATOR),
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
        pathString: itsPath.join(PATH_SEPARATOR),
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
      if (matchPath[0] !== PATH_ROOT) {
        matchPath = [].concat(PATH_ROOT, matchPath);
      } else {
        matchPath = [].concat(matchPath);
      }
    } else if (matchPath instanceof RegExp) {
      var regExpSource = matchPath.source;
      if (regExpSource.indexOf('^') === -1) regExpSource = regExpSource.substr(1);
      var rootPath = _escapeRegExp(PATH_ROOT + PATH_SEPARATOR);
      matchPath = new RegExp('^' + rootPath + regExpSource, matchPath.flags);
      isMatchPathRegExp = true;
    } else { // string
      isMatchPathArray = false;
      isMatchPathRegExp = false;
      matchPath += ''; // toString
      if (matchPath.indexOf(PATH_ROOT) !== 0) {
        matchPath = PATH_ROOT + PATH_SEPARATOR + matchPath;
      }
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

  function _checkIfMatchedForWatchVariable(event, matchPathInfo) {
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
      return (matchPath.indexOf(event.pathString) === 0);
    }
  }

  function _checkIfMatchedForWatchPath(event, matchPathInfo) {
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
    } else {
      return (event.pathString.indexOf(matchPath) === 0);
    }
  }

  var PATH_ROOT = 'root';
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
    function set_(pathArray, val) {
      if (arguments.length < 2) throw new Error('Need two arguments!');
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      return $set(rootVariable, [].concat(PATH_ROOT, pathArray), val, _onEventForSet);
    }
    function get_(pathArray) {
      if (arguments.length === 0) return rootVariable[PATH_ROOT];
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      return $get(rootVariable, [].concat(PATH_ROOT, pathArray));
    }
    function delete_(pathArray) {
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      return $delete(rootVariable, [].concat(PATH_ROOT, pathArray), _onEventForDelete);
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
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      return $has(rootVariable, [].concat(PATH_ROOT, pathArray));
    }
    function destory_(pathArray) {
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      pathArray = [].concat(PATH_ROOT, pathArray);
      var v = $deepMap(rootVariable, pathArray);
      if (v.isExist) {
        $destory(v.value, _onEventForDestory, pathArray);
      }
    }
    function deepInto_(pathArray, checker) {
      return $deepMap(rootVariable, pathArray, checker);
    }
    function deepBack_(pathArray, checker) {
      return $deepBack(rootVariable, pathArray, checker);
    }
    function merge_(pathArray, val) {
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
      if (!_isArray(pathArray)) pathArray = [];
      return $merge(rootVariable, [].concat(PATH_ROOT, pathArray), val, _onEventForMerge);
    }
    function everyNode_(pathArray, callback) {
      if (typeof pathArray === 'string') pathArray = pathArray.split(PATH_SEPARATOR);
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
    return {
      set: set_,
      get: get_,
      delete: delete_,
      watch: watch_,
      watchPath: watchPath_,
      watchVariable: watchVariable_,
      has: has_,
      destory: destory_,
      deepMap: deepInto_,
      deepBack: deepBack_,
      merge: merge_,
      everyNode: everyNode_
    };
  }
  var Varbox = { createVarbox: createVarbox };
  if (typeof module === 'object') module.exports = Varbox;
  if (typeof window === 'object') window.Varbox = Varbox;
})();
