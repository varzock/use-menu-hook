import { getPathFromElement, normalizeKeys, test } from './utils';
import { useEffect, useReducer, useRef } from 'react';
import menuReducer from './reducer';
import * as changeTypes from './stateChangeTypes';

const defaultProps = {
  paths: [],
  activeKeyPath: '',
  activeMousePath: '',
};

const useMenu = (userProps) => {
  const buttonRef = useRef();
  const props = { ...defaultProps, ...userProps };
  const [{ paths, activeKeyPath, activeMousePath }, dispatch] = useReducer(
    menuReducer,
    {
      paths: props.paths,
      activeKeyPath: props.activeKeyPath,
      activeMousePath: props.activeMousePath,
    },
  );

  const isFocused = (id) => {
    return activeKeyPath === paths.find(test(`${id}$`));
  };

  const isExpanded = (id) => {
    return !!(activeKeyPath.match(`${id}/`) || activeMousePath.match(id));
  };

  /**
   * Is the event target outside menu?
   * @param eventTarget
   * @returns {boolean|boolean}
   */
  const isOutsideMenu = (eventTarget) => {
    if (!buttonRef) return true;

    const id = buttonRef.current.getAttribute('id');
    // Check also for the associated menu. Otherwise the menu would be closed when you try to click on it.
    const menu = document.querySelector(`[aria-labelledby="${id}"]`);

    return (
      !buttonRef.current.contains(eventTarget) && !menu.contains(eventTarget)
    );
  };

  /**
   * Detects whether user clicked outside the menu in which case we close the whole menu.
   * @param event
   */
  const handleClickOutside = (event) => {
    const id = buttonRef.current.getAttribute('id');

    if (id && isOutsideMenu(event.target)) {
      dispatch({ type: changeTypes.ItemBlur, id });
      dispatch({ type: changeTypes.ClearActiveMousePath, id });
    }
  };

  useEffect(() => {
    const el = buttonRef.current;
    if (el) {
      const paths = [];
      const id = el.getAttribute('id');
      paths.push(getPathFromElement(el));
      const root = document.querySelector(`[aria-labelledby="${id}"]`);
      Array.from(root.querySelectorAll('[role="menuitem"]')).forEach((x) => {
        paths.push(getPathFromElement(x));
      });
      dispatch({ type: changeTypes.SetPaths, paths });

      // Add eventlistener that checks if clicked outside the menubutton or menu.
      document.addEventListener('click', handleClickOutside);

      // Remove the eventlistener
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);

  useEffect(() => {
    const match = activeKeyPath.match(/\/?([a-zA-Z0-9_]+)$/) || [];
    const id = match[1];
    const el = document.getElementById(id);
    if (el) {
      el.focus();
    }
  }, [activeKeyPath]);

  const itemKeyDownHandlers = (id) => ({
    ArrowDown() {
      dispatch({ type: changeTypes.ItemKeyDownArrowDown, id });
    },
    ArrowUp() {
      dispatch({ type: changeTypes.ItemKeyDownArrowUp, id });
    },
    ArrowLeft() {
      dispatch({ type: changeTypes.ItemKeyDownArrowLeft, id });
    },
    ArrowRight() {
      dispatch({ type: changeTypes.ItemKeyDownArrowRight, id });
    },
    Enter() {
      dispatch({ type: changeTypes.ItemKeyDownEnter, id });
    },
    Home() {
      dispatch({ type: changeTypes.ItemKeyDownHome, id });
    },
    End() {
      dispatch({ type: changeTypes.ItemKeyDownEnd, id });
    },
    Escape(event) {
      event.preventDefault();
      dispatch({ type: changeTypes.ItemKeyDownEscape, id });
      dispatch({ type: changeTypes.ClearActiveMousePath, id });
    },
    Space() {
      dispatch({ type: changeTypes.ItemKeyDownSpace, id });
    },
  });

  const buttonHandleMenuClick = (id) => () => {
    dispatch({ type: changeTypes.SetActiveMousePath, id });
  };

  const itemHandleBlur = (id) => (event) => {
    dispatch({ type: changeTypes.ItemBlur, id });

    // With blur we need to check on activeElement instead of event.target
    if (isOutsideMenu(event.target)) {
      dispatch({ type: changeTypes.ClearActiveMousePath, id });
    }
  };

  const menuHandleBlur = (id) => (event) => {
    // With blur we need to check on activeElement instead of event.target
    if (isOutsideMenu(event.target)) {
      dispatch({ type: changeTypes.ClearActiveMousePath, id });
    }
  };

  const buttonKeyDownhandlers = (id) => ({
    ArrowDown() {
      dispatch({ type: changeTypes.ButtonKeyDownArrowDown, id });
    },
    ArrowUp() {
      dispatch({ type: changeTypes.ButtonKeyDownArrowUp, id });
    },
    Space() {
      dispatch({ type: changeTypes.ButtonKeyDownSpace, id });
    },
    Enter() {
      dispatch({ type: changeTypes.ButtonKeyDownEnter, id });
    },
    Escape() {
      dispatch({ type: changeTypes.ItemBlur, id });
      dispatch({ type: changeTypes.ClearActiveMousePath, id });
    },
  });

  const handleKey = (handlers) => (event) => {
    const key = normalizeKeys(event.key);
    if (handlers[key]) {
      handlers[key](event);
    }
  };

  const getMenuItemProps = (itemProps = {}) => {
    const { hasPopup, id, ...p } = itemProps;
    if (typeof id === 'undefined') {
      throw new Error('getMenuItemProps requires an id');
    }
    const returnProps = {
      ...p,
      id,
      role: 'menuitem',
      tabIndex: isFocused(id) ? 0 : -1,
      onKeyDown: handleKey(itemKeyDownHandlers(id)),
      onClick: buttonHandleMenuClick(id),
      onBlur: itemHandleBlur(id),
    };

    if (!hasPopup) {
      return returnProps;
    }

    return {
      'aria-haspopup': true,
      'aria-expanded': isExpanded(id),
      ...returnProps,
    };
  };

  const getMenuButtonProps = ({ id, ...itemProps } = {}) => {
    if (typeof id === 'undefined') {
      throw new Error('getMenuButtonProps requires an id');
    }

    return {
      id,
      ...itemProps,
      ref: (c) => {
        buttonRef.current = c;
        if (itemProps.ref) {
          itemProps.ref(c);
        }
      },
      'aria-haspopup': true,
      'aria-expanded': isExpanded(id),
      onKeyDown: handleKey(buttonKeyDownhandlers(id)),
      onClick: buttonHandleMenuClick(id),
      onBlur: menuHandleBlur(id),
    };
  };

  const getMenuProps = ({ labelledBy, ...itemProps } = {}) => {
    if (typeof labelledBy === 'undefined') {
      throw new Error('labelledBy is required');
    }
    return {
      ...itemProps,
      role: 'menu',
      'aria-labelledby': labelledBy,
    };
  };

  return {
    getMenuItemProps,
    getMenuButtonProps,
    getMenuProps,
    isFocused,
    isExpanded,
  };
};
export default useMenu;
