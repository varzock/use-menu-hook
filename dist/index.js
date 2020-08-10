'use strict';

var react = require('react');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var normalizeKeys = function normalizeKeys(key) {
  if (key === ' ') {
    return 'Space';
  }

  return key;
};
var getPathFromElement = function getPathFromElement(el) {
  if (!el) {
    return '';
  }

  var path = el.getAttribute('id');

  while (el) {
    var name = el.getAttribute('aria-labelledby');

    if (name) {
      path = "".concat(name, "/").concat(path);
    }

    el = el.parentElement;
  }

  return path;
};
var test = function test(match) {
  var regex = new RegExp(match);
  return regex.test.bind(regex);
};

var SetPaths = '__set_paths__';
var SetActiveMousePath = '__set_active_mouse_path__';
var ClearActiveMousePath = '__clear_active_mouse_path__';
var ItemBlur = '__item_blur__';
var ItemKeyDownArrowDown = '__item_keydown_arrow_down__';
var ItemKeyDownArrowUp = '__item_keydown_arrow_up__';
var ItemKeyDownArrowLeft = '__item_keydown_arrow_left__';
var ItemKeyDownArrowRight = '__item_keydown_arrow_right__';
var ItemKeyDownEnter = '__item_keydown_enter__';
var ItemKeyDownHome = '__item_keydown_home__';
var ItemKeyDownEnd = '__item_keydown_end__';
var ItemKeyDownEscape = '__item_keydown_escape__';
var ItemKeyDownSpace = '__item_keydown_space__';
var ButtonKeyDownArrowDown = '__button_keydown_arrow_down__';
var ButtonKeyDownArrowUp = '__button_keydown_arrow_up__';
var ButtonKeyDownSpace = '__button_keydown_space__';
var ButtonKeyDownEnter = '__button_keydown_enter__';

var rotate = function rotate(id, paths) {
  var index = paths.findIndex(test("".concat(id, "$")));
  return paths.slice(index).concat(paths.slice(0, index));
};

var self = function self(id, paths) {
  return paths.find(test("".concat(id, "$")));
};

var parent = function parent(id, paths) {
  return paths.find(test("".concat(id, "$"))).replace("/".concat(id), '');
};

var children = function children(id, paths) {
  return paths.filter(test("".concat(id, "/[a-zA-Z0-9_]+$")));
};

var siblings = function siblings(id, paths) {
  return children(parent(id, paths), paths);
};

function menuReducer(state, action) {
  var paths = state.paths;
  var type = action.type;
  var changes;

  switch (type) {
    case SetPaths:
      {
        changes = {
          paths: action.paths
        };
        break;
      }

    case ItemBlur:
      {
        if (state.activeKeyPath === self(action.id, paths)) {
          changes = {
            activeKeyPath: ''
          };
        }

        break;
      }

    case ItemKeyDownArrowDown:
      {
        changes = {
          activeKeyPath: rotate(action.id, siblings(action.id, paths))[1]
        };
        break;
      }

    case ItemKeyDownArrowUp:
      {
        changes = {
          activeKeyPath: rotate(action.id, siblings(action.id, paths)).reverse()[0]
        };
        break;
      }

    case ItemKeyDownArrowLeft:
      {
        changes = {
          activeKeyPath: parent(action.id, paths)
        };
        break;
      }

    case ItemKeyDownArrowRight:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0] || self(action.id, paths)
        };
        break;
      }

    case ItemKeyDownEnter:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0] || self(action.id, paths)
        };
        break;
      }

    case ItemKeyDownHome:
      {
        changes = {
          activeKeyPath: siblings(action.id, paths)[0]
        };
        break;
      }

    case ItemKeyDownEnd:
      {
        changes = {
          activeKeyPath: siblings(action.id, paths).reverse()[0]
        };
        break;
      }

    case ItemKeyDownEscape:
      {
        changes = {
          activeKeyPath: parent(action.id, paths)
        };
        break;
      }

    case ItemKeyDownSpace:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0] || self(action.id, paths)
        };
        break;
      }

    case ButtonKeyDownArrowDown:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0]
        };
        break;
      }

    case ButtonKeyDownArrowUp:
      {
        changes = {
          activeKeyPath: children(action.id, paths).reverse()[0]
        };
        break;
      }

    case ButtonKeyDownSpace:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0]
        };
        break;
      }

    case ButtonKeyDownEnter:
      {
        changes = {
          activeKeyPath: children(action.id, paths)[0]
        };
        break;
      }

    case SetActiveMousePath:
      {
        changes = {
          activeMousePath: paths.find(test("".concat(action.id, "$")))
        };
        break;
      }

    case ClearActiveMousePath:
      {
        changes = {
          activeMousePath: ''
        };
        break;
      }

    default:
      {
        throw new Error('Reducer called without proper action type.');
      }
  }

  return _objectSpread2(_objectSpread2({}, state), changes);
}

var defaultProps = {
  paths: [],
  activeKeyPath: '',
  activeMousePath: ''
};

var useMenu = function useMenu(userProps) {
  var buttonRef = react.useRef();

  var props = _objectSpread2(_objectSpread2({}, defaultProps), userProps);

  var _useReducer = react.useReducer(menuReducer, {
    paths: props.paths,
    activeKeyPath: props.activeKeyPath,
    activeMousePath: props.activeMousePath
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      _useReducer2$ = _useReducer2[0],
      paths = _useReducer2$.paths,
      activeKeyPath = _useReducer2$.activeKeyPath,
      activeMousePath = _useReducer2$.activeMousePath,
      dispatch = _useReducer2[1];

  var isFocused = function isFocused(id) {
    return activeKeyPath === paths.find(test("".concat(id, "$")));
  };

  var isExpanded = function isExpanded(id) {
    return !!(activeKeyPath.match("".concat(id, "/")) || activeMousePath.match(id));
  };
  /**
   * Detects whether user clicked outside the menu in which case we close the whole menu.
   * @param event
   */


  var handleClickOutside = function handleClickOutside(event) {
    if (!buttonRef) return;
    var id = buttonRef.current.getAttribute('id'); // Check also for the associated menu. Otherwise the menu would be closed when you try to click on it.

    var menu = document.querySelector("[aria-labelledby=\"".concat(id, "\"]"));

    if (!buttonRef.current.contains(event.target) && !menu.contains(event.target)) {
      dispatch({
        type: ClearActiveMousePath,
        id: id
      });
    }
  };

  react.useEffect(function () {
    var el = buttonRef.current;

    if (el) {
      var _paths = [];
      var id = el.getAttribute('id');

      _paths.push(getPathFromElement(el));

      var root = document.querySelector("[aria-labelledby=\"".concat(id, "\"]"));
      Array.from(root.querySelectorAll('[role="menuitem"]')).forEach(function (x) {
        _paths.push(getPathFromElement(x));
      });
      dispatch({
        type: SetPaths,
        paths: _paths
      }); // Add eventlistener that checks if clicked outside the menubutton or menu.

      document.addEventListener('click', handleClickOutside); // Remove the eventlistener

      return function () {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);
  react.useEffect(function () {
    var match = activeKeyPath.match(/\/?([a-zA-Z0-9_]+)$/) || [];
    var id = match[1];
    var el = document.getElementById(id);

    if (el) {
      el.focus();
    }
  }, [activeKeyPath]);

  var itemKeyDownHandlers = function itemKeyDownHandlers(id) {
    return {
      ArrowDown: function ArrowDown() {
        dispatch({
          type: ItemKeyDownArrowDown,
          id: id
        });
      },
      ArrowUp: function ArrowUp() {
        dispatch({
          type: ItemKeyDownArrowUp,
          id: id
        });
      },
      ArrowLeft: function ArrowLeft() {
        dispatch({
          type: ItemKeyDownArrowLeft,
          id: id
        });
      },
      ArrowRight: function ArrowRight() {
        dispatch({
          type: ItemKeyDownArrowRight,
          id: id
        });
      },
      Enter: function Enter() {
        dispatch({
          type: ItemKeyDownEnter,
          id: id
        });
      },
      Home: function Home() {
        dispatch({
          type: ItemKeyDownHome,
          id: id
        });
      },
      End: function End() {
        dispatch({
          type: ItemKeyDownEnd,
          id: id
        });
      },
      Escape: function Escape(event) {
        event.preventDefault();
        dispatch({
          type: ItemKeyDownEscape,
          id: id
        });
        dispatch({
          type: ClearActiveMousePath,
          id: id
        });
      },
      Space: function Space() {
        dispatch({
          type: ItemKeyDownSpace,
          id: id
        });
      }
    };
  };

  var buttonHandleMenuClick = function buttonHandleMenuClick(id) {
    return function (event) {
      dispatch({
        type: SetActiveMousePath,
        id: id
      });
    };
  };

  var itemHandleBlur = function itemHandleBlur(id) {
    return function () {
      dispatch({
        type: ItemBlur,
        id: id
      });
    };
  };

  var buttonKeyDownhandlers = function buttonKeyDownhandlers(id) {
    return {
      ArrowDown: function ArrowDown() {
        dispatch({
          type: ButtonKeyDownArrowDown,
          id: id
        });
      },
      ArrowUp: function ArrowUp() {
        dispatch({
          type: ButtonKeyDownArrowUp,
          id: id
        });
      },
      Space: function Space() {
        dispatch({
          type: ButtonKeyDownSpace,
          id: id
        });
      },
      Enter: function Enter() {
        dispatch({
          type: ButtonKeyDownEnter,
          id: id
        });
      },
      Escape: function Escape() {
        dispatch({
          type: ClearActiveMousePath,
          id: id
        });
      }
    };
  };

  var handleKey = function handleKey(handlers) {
    return function (event) {
      var key = normalizeKeys(event.key);

      if (handlers[key]) {
        handlers[key](event);
      }
    };
  };

  var getMenuItemProps = function getMenuItemProps() {
    var itemProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hasPopup = itemProps.hasPopup,
        id = itemProps.id,
        p = _objectWithoutProperties(itemProps, ["hasPopup", "id"]);

    if (typeof id === 'undefined') {
      throw new Error('getMenuItemProps requires an id');
    }

    var returnProps = _objectSpread2(_objectSpread2({}, p), {}, {
      id: id,
      role: 'menuitem',
      tabIndex: isFocused(id) ? 0 : -1,
      onKeyDown: handleKey(itemKeyDownHandlers(id)),
      onClick: buttonHandleMenuClick(id),
      onBlur: itemHandleBlur(id)
    });

    if (!hasPopup) {
      return returnProps;
    }

    return _objectSpread2({
      'aria-haspopup': true,
      'aria-expanded': isExpanded(id)
    }, returnProps);
  };

  var getMenuButtonProps = function getMenuButtonProps() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref.id,
        itemProps = _objectWithoutProperties(_ref, ["id"]);

    if (typeof id === 'undefined') {
      throw new Error('getMenuButtonProps requires an id');
    }

    return _objectSpread2(_objectSpread2({
      id: id
    }, itemProps), {}, {
      ref: function ref(c) {
        buttonRef.current = c;

        if (itemProps.ref) {
          itemProps.ref(c);
        }
      },
      'aria-haspopup': true,
      'aria-expanded': isExpanded(id),
      onKeyDown: handleKey(buttonKeyDownhandlers(id)),
      onClick: buttonHandleMenuClick(id)
    });
  };

  var getMenuProps = function getMenuProps() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        labelledBy = _ref2.labelledBy,
        itemProps = _objectWithoutProperties(_ref2, ["labelledBy"]);

    if (typeof labelledBy === 'undefined') {
      throw new Error('labelledBy is required');
    }

    return _objectSpread2(_objectSpread2({}, itemProps), {}, {
      role: 'menu',
      'aria-labelledby': labelledBy
    });
  };

  return {
    getMenuItemProps: getMenuItemProps,
    getMenuButtonProps: getMenuButtonProps,
    getMenuProps: getMenuProps,
    isFocused: isFocused,
    isExpanded: isExpanded
  };
};

module.exports = useMenu;
