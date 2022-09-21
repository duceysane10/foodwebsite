
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@master-slider/animator')) :
  typeof define === 'function' && define.amd ? define(['@master-slider/animator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MasterSlider = factory(global.animator));
})(this, (function (animator) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var animator__default = /*#__PURE__*/_interopDefaultLegacy(animator);

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

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

  /* eslint-disable func-names */

  /* eslint-disable no-prototype-builtins */
  (function (arr) {
    arr.forEach(item => {
      if (item.hasOwnProperty('remove')) {
        return;
      }

      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  // eslint-disable-next-line func-names
  (function (doc, proto) {
    try {
      // check if browser supports :scope natively
      doc.querySelector(':scope body');
    } catch (err) {
      // polyfill native methods if it doesn't
      ['querySelector', 'querySelectorAll'].forEach(method => {
        const nativ = proto[method]; // eslint-disable-next-line func-names

        proto[method] = function (selectors) {
          if (/(^|,)\s*:scope/.test(selectors)) {
            // only if selectors contains :scope
            const {
              id
            } = this; // remember current element id

            this.id = 'ID_' + Date.now(); // assign new unique id

            selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID

            const result = doc[method](selectors);
            this.id = id; // restore previous id

            return result;
          }

          return nativ.call(this, selectors); // use native code for other selectors
        };
      });
    }
  })(window.document, Element.prototype);

  /**
   * Custom object event emitter class
   * @author Averta
   * @version 1.0.0
   */
  class Emitter {
    constructor() {
      this.listeners = {};
      this._onceList = []; // define alias method names

      this.addEventListener = this.on;
      this.removeEventListener = this.off; // debug flag it traces all triggers

      this.debugEvents = false;
    }
    /**
     * Triggers new event
     * @param {String} name event name
     * @param {*} args handler custom arguments
     * @param {Boolean} usePrefix whether add prefix before event name on parent Emitter
     */


    trigger(name, args, usePrefix = false) {
      if (this.debugEvents) {
        /* eslint-disable */
        console.log(name, args);
        /* eslint-enable */
      }

      if (this.parentEmitter) {
        this.parentEmitter.trigger(!usePrefix ? name : this._transformName(name), args);
      }

      if (!this.listeners) {
        return;
      }

      if (this.listeners[name]) {
        if (args) {
          args.unshift(name);
        } else {
          args = [name];
        }

        this.listeners[name].forEach(action => {
          action.callback.apply(action.context, args);
        });
      }

      if (this._onceList.length) {
        this._onceList = this._onceList.filter(value => {
          if (value.name === name) {
            this.off(value.name, value.callback, value.context);
            return false;
          }

          return true;
        });
      }
    }
    /**
     * Adds new event listener
     * @param {String} name Event name
     * @param {Function} callback Event listener
     * @param {*} context Event listener this argument
     * @param {Number} priority Listener priority
     */


    on(name, callback, context, priority = 0) {
      if (name.indexOf(',') !== -1) {
        name.replace(/\s*/g, '').split(',').forEach(namePart => {
          this.on(namePart, callback, context, priority);
        });
        return;
      }

      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }

      let listeners = this.listeners[name];

      if (listeners.find(l => l.callback === callback && l.context === context && l.priority === priority)) {
        return;
      }

      listeners.push({
        callback,
        priority,
        context
      });
      listeners = listeners.sort((a, b) => {
        if (a.priority > b.priority) {
          return 1;
        }

        if (a.priority < b.priority) {
          return -1;
        }

        return 0;
      });
    }
    /**
     * Adds new event listener which only calls once
     * @param {String} name Event name
     * @param {Function} callback Event listener
     * @param {*} context Event listener this argument
     * @param {Number} priority Listener priority
     */


    once(name, callback, context, priority) {
      this.on(name, callback, context, priority);

      this._onceList.push({
        name,
        callback,
        context
      });
    }
    /**
     * Removes the added event
     * @param {String} name Event name
     * @param {Function} callback Event callback
     * @param {*} context Callback this argument
     */


    off(name, callback, context) {
      if (name.indexOf(',') !== -1) {
        name.replace(/\s*/g, '').split(',').forEach(namePart => {
          this.off(namePart, callback, context);
        });
        return;
      }

      const listeners = this.listeners[name];

      if (listeners && listeners.length) {
        this.listeners[name] = listeners.filter(value => value.callback !== callback || value.context !== context);
      }
    }
    /**
     * Removes all registered listeners that has the callback with the given this argument value
     * @param {*} context This argument value of registered callbacks
     */


    offOnContext(context) {
      Object.keys(this.listeners).forEach(key => {
        this.listeners[key] = this.listeners[key].filter(value => value.context !== context);
      });
    }
    /**
     * Removes all registered listeners of the given event name
     * @param {String} name Event name
     */


    offByName(name) {
      if (this.listeners[name]) {
        this.listeners[name] = undefined;
      }
    }
    /**
     * Prepends event prefix to event name
     * @param {String} name event name
     */


    _transformName(name) {
      if (this.eventPrefix && this.eventPrefix.length) {
        return this.eventPrefix + name.slice(0, 1).toUpperCase() + name.slice(1);
      }

      return name;
    }

  }

  // This module contains all global variables
  const prefix = 'ms';
  const isTouch = ('ontouchstart' in document);
  const has$1 = Object.prototype.hasOwnProperty;

  const breakpoints = {
    phone: 480,
    tablet: 768
  };
  const breakpointNames = Object.keys(breakpoints).sort((a, b) => breakpoints[b] - breakpoints[a]);
  /**
   *
   * @returns {name: string, index:number, size:number} current breakpoint info
   */

  const findBreakpoint = () => {
    const refWidth = window.innerWidth;
    let currentBreakpoint = null;
    let currentBreakpointIndex = -1;
    [...breakpointNames].reverse().some((breakpoint, index) => {
      if (refWidth <= breakpoints[breakpoint]) {
        currentBreakpoint = breakpoint;
        currentBreakpointIndex = breakpointNames.length - index - 1;
        return true;
      }

      return false;
    });
    return {
      name: currentBreakpoint,
      index: currentBreakpointIndex,
      size: breakpoints[currentBreakpoint] || refWidth
    };
  };

  class ResponsiveHelperClass extends Emitter {
    constructor() {
      super();
      this.update = this.update.bind(this);
      window.addEventListener('resize', this.update);
      this.activeBreakpoint = null;
      this.activeBreakpointIndex = null;
      this.activeBreakpointSize = null;
      this.update();
    }

    update(event) {
      const delayBeforeResize = 20;

      if (event && delayBeforeResize > 0) {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(this.update, delayBeforeResize);
        return;
      }

      const {
        name,
        index,
        size
      } = findBreakpoint();

      if (name !== this.activeBreakpoint) {
        this.activeBreakpoint = name;
        this.activeBreakpointIndex = index;
        this.activeBreakpointSize = size;
        this.trigger('breakpointChange', [name, index, size]);
      }
    }

  }

  const responsiveHelper = new ResponsiveHelperClass();
  /**
   * Returns the value that is related to the current breakpoint, the given value can be an object which each breakpoint
   * value defines by a breakpoint name or an array sorted based based on breakpoint sizes order.
   *
   * @param {Object|Array|Observable} values Any value to check with active breakpoint, it can be an array or an object
   * @param {String} breakpoint Overrides active breakpoint name
   */

  const getResponsiveValue = (values, breakpoint) => {
    if (!breakpoint) {
      breakpoint = findBreakpoint().name;
    }

    const breakpointIndex = breakpointNames.indexOf(breakpoint);

    if (Array.isArray(values)) {
      if (values.length === 0) {
        return undefined;
      }

      const value = values[breakpointIndex + 1];

      if (!value || typeof value === 'string' && !value.length) {
        if (breakpoint === 'none') {
          return undefined;
        }

        return getResponsiveValue(values, breakpointIndex >= 1 ? breakpointNames[breakpointIndex - 1] : 'none');
      }

      return value;
    } // observable object


    if (has$1.call(values, 'toObject')) {
      values = values.toObject();
    }

    if (typeof values === 'object') {
      if (has$1.call(values, breakpoint)) {
        return values[breakpoint];
      }

      if (breakpoint === 'none') {
        return undefined;
      }

      return getResponsiveValue(values, breakpointIndex >= 1 ? breakpointNames[breakpointIndex - 1] : 'none');
    }

    return values;
  };
  /**
   * Reads all breakpoint related attribute values and creates an object from them
   * @param {Element} element Target element
   * @param {String} attribute Element data attribute name
   */

  const getAttrValues = (element, attribute) => {
    const bps = {};

    if (element.hasAttribute(`data-${attribute}`)) {
      bps.none = element.getAttribute(`data-${attribute}`);
    }

    breakpointNames.forEach(name => {
      if (element.hasAttribute(`data-${name}-${attribute}`)) {
        bps[name] = element.getAttribute(`data-${name}-${attribute}`);
      }
    });
    return bps;
  };
  const addHideOn = (element, bps, callback, className = 'ms-hidden') => {
    const update = (action, bp) => {
      if (bp === null) {
        bp = 'desktop';
      }

      if (bps.includes(bp)) {
        if (callback) callback(true);
        element.classList.add(className);
      } else {
        if (callback) callback(false);
        element.classList.remove(className);
      }
    };

    update('', findBreakpoint().name);
    responsiveHelper.on('breakpointChange', update);
  };
  /**
   * Watches a set of responsive values and calls the callback function with the new active value upon breakpoint changes.
   * @param {Array | string} from An array or a comma separated string of responsive values
   * @param {Function} callback Watch the active breakpoint
   */

  const watchResponsiveValue = (from, callback) => {
    let values = from;

    if (Array.isArray(from)) {
      if (from.length === 1) {
        callback(from[0]);
        return;
      }

      values = from.slice();
    } else if (typeof from === 'string' && from.includes(',')) {
      values = from.split(',').map(v => v.trim());
    } else {
      callback(values);
      return;
    }

    let lastValue = undefined;

    const check = (action, breakpoint) => {
      const value = getResponsiveValue(values, breakpoint);

      if (value !== lastValue) {
        lastValue = value;
        callback(value);
      }
    };

    responsiveHelper.on('breakpointChange', check);
    check('', responsiveHelper.activeBreakpoint);
  };
  /**
   * Watches multiple responsive values and calls the callback function upon the breakpoint changes
   * @param {Array} from An array of multiple responsive values
   * @param {Function} callback The callback function that calls whenever on of the responsive values changes
   */

  const watchMultipleResponsiveValues = (from, callback) => {
    const result = [];
    let timeOut;

    const callTheCB = () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        callback(result);
      }, 1);
    };

    from.forEach((value, index) => watchResponsiveValue(value, val => {
      result[index] = val;
      callTheCB();
    }));
  };

  /**
   * This class is responsible to control the content layout. It defines all needed layout options,
   * adds required containers for UI controls, resizes the view and finds active breakpoint.
   */

  class LayoutController {
    /**
     * Creates new layout controller instance
     * @param {Composer} composer Master Composer instance
     * @param {DomView} view
     * @param {Observable} options
     */
    constructor(composer, view, options) {
      this.composer = composer;
      this.options = options;
      this.view = view;
      this.innerContainers = {};
      this.outerContainers = {};
      this._matchHeightList = [];
      this.options.register({
        layout: 'boxed',
        // fullscreen, auto, fullwidth
        stretchWidth: false,
        width: 900,
        height: 500,
        columns: 1,
        rtl: false,
        keepAspectRatio: true,
        delayBeforeResize: 0,
        // sizingReference: 'box',
        fullscreenMargin: 0,
        narrowLayoutOn: 'phone',
        autoHeight: false,
        overflowFix: true
      });
      this.primaryContainer = document.createElement('div');
      this.primaryContainer.classList.add(`${prefix}-primary-container`);
      this.composer.element.appendChild(this.primaryContainer); // wrap view element

      this.viewContainer = document.createElement('div');
      this.viewContainer.classList.add(`${prefix}-view-container`);
      this.view.appendTo(this.viewContainer);
      this.primaryContainer.appendChild(this.viewContainer); // update view reverse option and container class name

      if (this.view.options.has('reverse')) {
        const isRTL = this.options.get('rtl');
        this.view.options.set('reverse', isRTL);

        if (isRTL) {
          this.composer.element.classList.add(`${prefix}-rtl`);
        }

        this.options.observe('rtl', (name, value) => {
          this.view.options.set('reverse', value);
          this.composer.element.classList[value ? 'add' : 'remove'](`${prefix}-rtl`);
        });
      }

      this.update = this.update.bind(this);
      window.addEventListener('resize', this.update, false);
      this.update();
    }
    /**
     * Updates the content layout
     * @param {Event} event Resize event object [optional]
     */


    update(event) {
      const delayBeforeResize = this.options.get('delayBeforeResize');

      if (event && delayBeforeResize > 0) {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(this.update, delayBeforeResize);
        return;
      }

      const options = this.options.get(['layout', 'width', 'height', 'maxHeight', 'minHeight', 'keepAspectRatio', 'autoHeight', 'fullscreenMargin', 'overflowFix', 'narrowLayoutOn']);
      const composerContainer = this.composer.element;
      composerContainer.classList.add(`${prefix}-layout-${options.layout}`);
      const {
        name: breakpoint,
        size: breakpointSize
      } = findBreakpoint();

      if (breakpoint !== this.activeBreakpoint) {
        if (this.activeBreakpoint) {
          this.composer.element.classList.remove(`${prefix}-bp-${this.activeBreakpoint}`);
        }

        this.activeBreakpoint = breakpoint;

        if (breakpoint !== null) {
          this.composer.element.classList.add(`${prefix}-bp-${breakpoint}`);
        }

        this.activeBreakpointSize = breakpoint ? breakpointSize : getResponsiveValue(options.width, breakpoint);
      } // is it narrow?


      this.isNarrow = breakpoint === options.narrowLayoutOn;

      if (this._lastNarrowStatus !== this.isNarrow) {
        if (this.isNarrow) {
          composerContainer.classList.add(`${prefix}-narrow-layout`);
        } else {
          composerContainer.classList.remove(`${prefix}-narrow-layout`);
        }

        this._lastNarrowStatus = this.isNarrow;
      } // set width


      switch (options.layout) {
        case 'fullscreen':
          if (options.overflowFix) {
            document.body.classList.add(`${prefix}-overflow-fix`);
          }

        case 'fullwidth':
          composerContainer.style.width = document.body.clientWidth + 'px';
          setTimeout(() => {
            composerContainer.style.width = document.body.clientWidth + 'px';
          }); // fix unexpected horizontal scroll

          composerContainer.style.marginLeft = '';
          composerContainer.style.marginLeft = -composerContainer.offsetLeft + 'px';
          break;

        case 'boxed':
          composerContainer.style.maxWidth = getResponsiveValue(options.width, breakpoint) + 'px';

      }

      const width = composerContainer.offsetWidth; // auto height

      if (options.autoHeight) {
        options.height = 'auto';
      }

      this.autoHeight = options.height === 'auto';

      if (!this.autoHeight || options.layout === 'fullscreen') {
        let height = getResponsiveValue(options.height, breakpoint);

        if (options.keepAspectRatio) {
          height *= width / this.activeBreakpointSize;
        } // set height


        switch (options.layout) {
          case 'fullscreen':
            if (options.fullscreenMargin) {
              composerContainer.style.height = `calc( 100vh - ${options.fullscreenMargin}px )`;
            } else {
              composerContainer.style.height = '100vh';
            }

            break;

          case 'fullwidth':
          case 'boxed':
            composerContainer.style.height = height + 'px';

        }
      }

      this.composer.trigger('beforeViewResize');
      this.view.resize();

      this._updateMatchHeights();

      if (width !== this.width || this.height !== composerContainer.offMatchHeight) {
        this.width = width;
        this.height = composerContainer.offsetHeight;
        this.composer.trigger('resize');
      }

      this.composer.trigger('layoutUpdate');
    }
    /**
     * Returns the related container based on given area
     * @param {String} area The target area
     */


    getContainer(area) {
      if (typeof area !== 'string') {
        return false;
      }

      area = area.toLowerCase();
      const isInner = area.indexOf('inner') !== -1;
      const alignment = area.replace('inner', '');
      const containers = isInner ? this.innerContainers : this.outerContainers;

      if (!has$1.call(containers, alignment)) {
        this._createContainer(alignment, isInner);
      }

      return containers[alignment];
    }
    /**
     * Matches element height with the view height
     * @param {Element} element
     */


    onMatchHeight(element) {
      this._matchHeightList.push(element);

      this._updateMatchHeights();
    }
    /**
     * Disables the match height feature from element
     * @param  {Element} element
     */


    offMatchHeight(element) {
      element.style.height = '';

      this._matchHeightList.splice(this._matchHeightList.indexOf(element), 1);
    }
    /**
     * Updates all registered element in match height list
     * @private
     */


    _updateMatchHeights() {
      this._matchHeightList.forEach(element => {
        element.style.height = this.slider.view.height + 'px';
      });
    }
    /**
     * Creates new container
     * @private
     *
     * @param {String} alignment
     * @param {Boolean} isInner
     */


    _createContainer(alignment, isInner) {
      const container = document.createElement('div');
      container.classList.add(`${prefix}-${alignment}-container`);

      if (isInner) {
        if (!this.hasInnerBox) {
          this.hasInnerBox = true;
          this.innerBox = document.createElement('div');
          this.innerBox.classList.add(`${prefix}-inner-container`);
          this.innerBox.appendChild(this.viewContainer);
          (this.hasMidRow ? this.midRow : this.primaryContainer).appendChild(this.innerBox);
        }

        this.innerContainers[alignment] = container;

        if (alignment === 'right' || alignment === 'left') {
          if (!this.hasInnerMidRow) {
            this.hasInnerMidRow = true;
            this.innerMidRow = document.createElement('div');
            this.innerMidRow.classList.add(`${prefix}-mid-row`);
            this.innerMidRow.appendChild(this.viewContainer);
            this.innerBox.appendChild(this.innerMidRow);
          }

          this.innerMidRow.appendChild(container);
        } else {
          this.innerBox.appendChild(container);
        }
      } else {
        this.outerContainers[alignment] = container;

        if (alignment === 'right' || alignment === 'left') {
          if (!this.hasMidRow) {
            this.hasMidRow = true;
            this.midRow = document.createElement('div');
            this.midRow.classList.add(`${prefix}-mid-row`);
            this.midRow.appendChild(this.hasInnerBox ? this.innerBox : this.viewContainer);
            this.primaryContainer.appendChild(this.midRow);
          }

          this.midRow.appendChild(container);
        } else {
          this.primaryContainer.appendChild(container);
        }
      }

      this.update();
    }

  }

  /**
   * This class triggers the given action callback after all dependencies get done.
   * To add a new dependency call `hold` method and after the dependency resolved call `exec`
   */
  class ActionTrigger {
    /**
     * Creates new action trigger instance
     * @param {Function} action
     * @param {boolean} noMoreExec
     */
    constructor(action, noMoreExec = true) {
      this._dependencies = 1;
      this.action = action;
      this.noMoreExec = noMoreExec;
    }
    /**
     * Adds new dependency
     */


    hold() {
      this._dependencies += 1;
    }
    /**
     * Charges trigger for given value
     * @param {Number} times
     */


    charge(times) {
      this._dependencies += times;
    }
    /**
     * One dependency resolved, it automatically calls the action after all dependencies
     */


    exec() {
      if (this._executed) {
        if (this.noMoreExec) {
          throw new Error('The action is triggered before.');
        } else {
          return true;
        }
      }

      this._dependencies -= 1;

      if (this._dependencies <= 0) {
        this._executed = true;
        this.action();
        return true;
      }

      return false;
    }

  }

  /**
   * Converts string value to an array
   * @param {String} value
   * @param {Boolean} numbers Whether parse values to number or not
   */
  function toArray$1(value, numbers = true) {
    if (typeof value !== 'string') {
      return value;
    }

    value = value.replace(/\s+/g, '').split(',');

    if (numbers) {
      value = value.map(val => Number.parseInt(val, 10));
    }

    return value;
  }

  !function () {

    if ("undefined" != typeof window) {
      var t = window.navigator.userAgent.match(/Edge\/(\d{2})\./),
          e = t ? parseInt(t[1], 10) : null,
          n = !!e && 16 <= e && e <= 18;

      if (!("objectFit" in document.documentElement.style != !1) || n) {
        var o = function (t, e, i) {
          var n, o, l, a, d;
          if ((i = i.split(" ")).length < 2 && (i[1] = i[0]), "x" === t) n = i[0], o = i[1], l = "left", a = "right", d = e.clientWidth;else {
            if ("y" !== t) return;
            n = i[1], o = i[0], l = "top", a = "bottom", d = e.clientHeight;
          }

          if (n !== l && o !== l) {
            if (n !== a && o !== a) return "center" === n || "50%" === n ? (e.style[l] = "50%", void (e.style["margin-" + l] = d / -2 + "px")) : void (0 <= n.indexOf("%") ? (n = parseInt(n, 10)) < 50 ? (e.style[l] = n + "%", e.style["margin-" + l] = d * (n / -100) + "px") : (n = 100 - n, e.style[a] = n + "%", e.style["margin-" + a] = d * (n / -100) + "px") : e.style[l] = n);
            e.style[a] = "0";
          } else e.style[l] = "0";
        },
            l = function (t) {
          var e = t.dataset ? t.dataset.objectFit : t.getAttribute("data-object-fit"),
              i = t.dataset ? t.dataset.objectPosition : t.getAttribute("data-object-position");
          e = e || "cover", i = i || "50% 50%";
          var n = t.parentNode;
          return function (t) {
            var e = window.getComputedStyle(t, null),
                i = e.getPropertyValue("position"),
                n = e.getPropertyValue("overflow"),
                o = e.getPropertyValue("display");
            i && "static" !== i || (t.style.position = "relative"), "hidden" !== n && (t.style.overflow = "hidden"), o && "inline" !== o || (t.style.display = "block"), 0 === t.clientHeight && (t.style.height = "100%"), -1 === t.className.indexOf("object-fit-polyfill") && (t.className = t.className + " object-fit-polyfill");
          }(n), function (t) {
            var e = window.getComputedStyle(t, null),
                i = {
              "max-width": "none",
              "max-height": "none",
              "min-width": "0px",
              "min-height": "0px",
              top: "auto",
              right: "auto",
              bottom: "auto",
              left: "auto",
              "margin-top": "0px",
              "margin-right": "0px",
              "margin-bottom": "0px",
              "margin-left": "0px"
            };

            for (var n in i) e.getPropertyValue(n) !== i[n] && (t.style[n] = i[n]);
          }(t), t.style.position = "absolute", t.style.width = "auto", t.style.height = "auto", "scale-down" === e && (e = t.clientWidth < n.clientWidth && t.clientHeight < n.clientHeight ? "none" : "contain"), "none" === e ? (o("x", t, i), void o("y", t, i)) : "fill" === e ? (t.style.width = "100%", t.style.height = "100%", o("x", t, i), void o("y", t, i)) : (t.style.height = "100%", void ("cover" === e && t.clientWidth > n.clientWidth || "contain" === e && t.clientWidth < n.clientWidth ? (t.style.top = "0", t.style.marginTop = "0", o("x", t, i)) : (t.style.width = "100%", t.style.height = "auto", t.style.left = "0", t.style.marginLeft = "0", o("y", t, i))));
        },
            i = function (t) {
          if (void 0 === t || t instanceof Event) t = document.querySelectorAll("[data-object-fit]");else if (t && t.nodeName) t = [t];else {
            if ("object" != typeof t || !t.length || !t[0].nodeName) return !1;
            t = t;
          }

          for (var e = 0; e < t.length; e++) if (t[e].nodeName) {
            var i = t[e].nodeName.toLowerCase();

            if ("img" === i) {
              if (n) continue;
              t[e].complete ? l(t[e]) : t[e].addEventListener("load", function () {
                l(this);
              });
            } else "video" === i ? 0 < t[e].readyState ? l(t[e]) : t[e].addEventListener("loadedmetadata", function () {
              l(this);
            }) : l(t[e]);
          }

          return !0;
        };

        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", i) : i(), window.addEventListener("resize", i), window.objectFitPolyfill = i;
      } else window.objectFitPolyfill = function () {
        return !1;
      };
    }
  }();

  /**
   * Adds object fit and position values as style and data attribute
   * @param {Element} element Target element
   * @param {String} fit Object fit value
   * @param {String} position Object position value
   * @param {Boolean} readAttribute Whether check object fit and position of element or not.
   * @param {Boolean} overrideAttributes Whether to override attributes with the given position and fit values
   */

  function objectFit(element, fit, position, readAttribute = true, overrideAttributes = false) {
    if (readAttribute && element.hasAttribute('data-object-fit')) {
      fit = element.getAttribute('data-object-fit');
    }

    if (fit === 'tile' && element.nodeName === 'IMG') {
      element.style.visibility = 'hidden';
      element.parentElement.style.backgroundImage = `url( ${element.getAttribute('data-src') || element.src})`;
      return;
    }

    if (!element.hasAttribute('data-object-fit') || overrideAttributes) {
      element.setAttribute('data-object-fit', fit);
    }

    element.style.objectFit = fit;

    if (readAttribute && element.hasAttribute('data-object-position')) {
      position = element.getAttribute('data-object-position');
    }

    if (position) {
      if (!element.hasAttribute('data-object-position') || overrideAttributes) {
        element.setAttribute('data-object-position', position);
      }

      element.style.objectPosition = position;
    }

    if (window.objectFitPolyfill) {
      window.objectFitPolyfill(element);
    }
  }
  const responsiveObjectFit = (element, defaultFit, defaultPosition = '50% 50%') => {
    const {
      objectFit: objectFitAttr = defaultFit,
      objectPosition = defaultPosition
    } = element.dataset;
    const objectFitArr = objectFitAttr.split(',').map(v => v.trim());
    objectPosition.split(',').map(v => v.trim());

    const update = (action, breakpoint) => {
      objectFit(element, getResponsiveValue(objectFitArr, breakpoint), getResponsiveValue(objectPosition, breakpoint), false, true);
    };

    responsiveHelper.on('breakpointChange', update);
    update('', responsiveHelper.activeBreakpoint);
  };

  /**
   * Replaces image element src and srcset attributes values with related data values beside adding load and error event
   * @param {Element} element Target image element
   * @param {Function} onLoad On load event listener
   * @param {Function} onError On error event listener
   */
  function loadImage(element, onLoad, onError) {
    if (element.hasAttribute('data-srcset')) {
      element.setAttribute('srcset', element.getAttribute('data-srcset'));
      element.removeAttribute('data-srcset');
    }

    if (element.hasAttribute('data-src')) {
      element.setAttribute('src', element.getAttribute('data-src'));
      element.removeAttribute('data-src');
    }

    if (element.complete) {
      if (onLoad || onError) {
        if (element.naturalWidth && onLoad) {
          onLoad();
        } else if (onError) {
          onError();
        }
      }

      return;
    }

    if (onLoad) {
      element.addEventListener('load', onLoad, false);
    }

    if (onError) {
      element.addEventListener('error', onError, false);
    }
  }

  /**
   * Section class, it can contain layers, background image, video etc.
   */

  class Section extends Emitter {
    /**
     * Creates new section
     * @param {Element} element Section element
     * @param {Composer} composer
     */
    constructor(element, composer) {
      super();
      this.element = element;
      this.composer = composer;
      this.view = composer.view;
      this.space = 0;
      this.merge = 1;
      this.id = element.id;
      this.targetHeight = element.dataset.wrapperHeight ? element.dataset.wrapperHeight.split(',') : composer.options.get('height'); // add event prefix

      this.eventPrefix = 'section';
      this.parentEmitter = this.composer; // initial values

      this.position = -1;
      this.offset = -1;
      this.size = 0;

      if (this.element.hasAttribute('data-merge')) {
        this.merge = toArray$1(this.element.getAttribute('data-merge'));
      }

      this.trigger('sectionCreate', [this], true);
      this.readyTrigger = new ActionTrigger(this.ready.bind(this));
      this.loadTrigger = new ActionTrigger(this.loadContent.bind(this), false);
      this._active = false; // setup background

      this._setupBackground();
    }
    /**
     * Gets section active value
     */


    get active() {
      return this._active;
    }
    /**
     * Sets section active value
     */


    set active(value) {
      if (this._active !== value) {
        this._active = value;
        this.element.classList[value ? 'add' : 'remove'](`${prefix}-active`);
        this.trigger(value ? 'activated' : 'deactivated', [this], true);

        if (this.isReady) {
          this.trigger(value ? 'readyAndActivated' : 'readyAndDeactivated', [this], true);
        }
      }
    }
    /**
     * Gets current status
     */


    get status() {
      return this._status;
    }
    /**
     * Sets status
     */


    set status(value) {
      if (value === this._status) {
        return;
      } // add and remove status class names


      this.element.classList.add(`${prefix}-${value}`);

      if (this._status) {
        this.element.classList.remove(`${prefix}-${this._status}`);
      }

      const oldValue = this._status;
      this._status = value;
      this.trigger('statusChange', [this, value, oldValue], true);
    }
    /**
     * Gets pending offset value
     */


    get pendingOffset() {
      return this._pendingOffset;
    }
    /**
     * Sets pending offset
     * Appear offset indicates the section portion length that is located out side of view. The value is 0 when section is entirely visible.
     */


    set pendingOffset(value) {
      if (value !== this._pendingOffset) {
        this._pendingOffset = value;
        this.trigger('pendingOffsetChange', [this, value, value / this.size]);
      }
    }

    triggerPendingOffsetChange() {
      this.trigger('pendingOffsetChange', [this, this._pendingOffset, this._pendingOffset / this.size]);
    }
    /**
     * Calculates the sections size based on columns number and direction
     */


    calculateSize() {
      let columns = this.composer.options.get('columns');
      let merge = getResponsiveValue(this.merge);
      const isHorizontal = this.view.options.is('dir', 'h');
      const sizeReference = isHorizontal ? 'offsetWidth' : 'offsetHeight';

      if (!columns) {
        this.size = this.element[sizeReference] + this.space;
      } else {
        columns = getResponsiveValue(columns);
        let noSpaceSize = this.view.size - this.space * (columns - 1);
        this.size = noSpaceSize / columns + this.space;

        if (merge > 1) {
          merge = Math.min(columns, merge);
          this.size = this.size * merge + this.space * (merge - 1);
          noSpaceSize += this.space * (merge - 1);
        }
      }

      this.autoHeight = this.composer.options.get('autoHeight');

      if (isHorizontal) {
        this.element.style.width = this.size - this.space + 'px';

        if (!this.autoHeight) {
          this.element.style.height = this.view.height + 'px';
        } else {
          this.element.style.height = getResponsiveValue(this.targetHeight) + 'px';
        }
      } else {
        this.element.style.width = this.view.width + 'px';
        this.element.style.height = this.size - this.space + 'px';
      }

      this.checkResize();
    }
    /**
     * Checks wether the given value is located in side the section or not.
     * This method is used by scroll views
     * @param {Number} value
     */


    inRangeTest(value) {
      return value >= this.position && value < this.position + this.size;
    }
    /**
     * Tells the section that is has mounted
     */


    mount() {
      if (this.firstMount !== false) {
        this.firstMount = true;
      } else {
        this.firstMount = false;
      }

      this.trigger('beforeMount', [this], true);
      this.mounted = true;

      if (!this.isReady && !this.isLoading) {
        this.loadTrigger.exec();
      }

      this.trigger('afterMount', [this], true);
    }
    /**
     * Tells the section that is has unmounted
     */


    unmount() {
      this.mounted = false;
    }
    /**
     * On section gets ready, usually after loading all contents
     */


    ready() {
      this.element.classList.add(`${prefix}-ready`);
      this.isReady = true;
      this.isLoading = false;
      this.trigger('ready');

      if (this._active) {
        this.trigger('readyAndActivated', [this], true);
      }
    }
    /**
     * Starts loading content
     */


    loadContent() {
      this.isLoading = true;
      this.trigger('loadingStart', [this], true);

      if (this.backgroundImage) {
        this._onBgLoad = this._onBgLoad.bind(this);
        loadImage(this.backgroundImage, this._onBgLoad, this._onBgLoad);
      } else {
        this.readyTrigger.exec();
      }
    }
    /**
     * Checks section width and height and triggers resize event
     * @param {Boolean} force
     */


    checkResize(force) {
      const width = this.element.offsetWidth;
      const height = this.element.offsetHeight;

      if (force || this.height !== height || this.width !== width) {
        this.width = width;
        this.height = height;
        this.trigger('resize', [this, width, height], true);
      }
    }
    /**
     * Setups the section background
     * @private
     */


    _setupBackground() {
      this.backgroundImage = this.element.querySelector(`:scope > img.${prefix}-bg`);

      if (!this.backgroundImage) {
        return;
      } // Section background container


      this.bgImageCont = document.createElement('div');
      this.bgImageCont.classList.add(`${prefix}-bg-container`);
      this.bgImageCont.appendChild(this.backgroundImage);
      this.element.appendChild(this.bgImageCont); // objectFit(this.backgroundImage, this.composer.options.get('sectionFit'));

      responsiveObjectFit(this.backgroundImage, this.composer.options.get('sectionFit'));
      this.trigger('bgImageSetup', [this.backgroundImage], true);
    }
    /**
     * After background load
     */


    _onBgLoad() {
      this.trigger('bgImageLoad', [this], true);

      if (!this._bgLoaded) {
        this.readyTrigger.exec();
      }

      this._bgLoaded = true;

      if (this.autoHeight) {
        this.checkResize();
      }
    }

  }

  /*
   * anime.js v3.2.1
   * (c) 2020 Julian Garnier
   * Released under the MIT license
   * animejs.com
   */
  // Defaults
  var defaultInstanceSettings = {
    update: null,
    begin: null,
    loopBegin: null,
    changeBegin: null,
    change: null,
    changeComplete: null,
    loopComplete: null,
    complete: null,
    loop: 1,
    direction: 'normal',
    autoplay: true,
    timelineOffset: 0
  };
  var defaultTweenSettings = {
    duration: 1000,
    delay: 0,
    endDelay: 0,
    easing: 'easeOutElastic(1, .5)',
    round: 0
  };
  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d']; // Caching

  var cache = {
    CSS: {},
    springs: {}
  }; // Utils

  function minMax(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function stringContains(str, text) {
    return str.indexOf(text) > -1;
  }

  function applyArguments(func, args) {
    return func.apply(null, args);
  }

  var is = {
    arr: function (a) {
      return Array.isArray(a);
    },
    obj: function (a) {
      return stringContains(Object.prototype.toString.call(a), 'Object');
    },
    pth: function (a) {
      return is.obj(a) && a.hasOwnProperty('totalLength');
    },
    svg: function (a) {
      return a instanceof SVGElement;
    },
    inp: function (a) {
      return a instanceof HTMLInputElement;
    },
    dom: function (a) {
      return a.nodeType || is.svg(a);
    },
    str: function (a) {
      return typeof a === 'string';
    },
    fnc: function (a) {
      return typeof a === 'function';
    },
    und: function (a) {
      return typeof a === 'undefined';
    },
    nil: function (a) {
      return is.und(a) || a === null;
    },
    hex: function (a) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
    },
    rgb: function (a) {
      return /^rgb/.test(a);
    },
    hsl: function (a) {
      return /^hsl/.test(a);
    },
    col: function (a) {
      return is.hex(a) || is.rgb(a) || is.hsl(a);
    },
    key: function (a) {
      return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
    }
  }; // Easings

  function parseEasingParameters(string) {
    var match = /\(([^)]+)\)/.exec(string);
    return match ? match[1].split(',').map(function (p) {
      return parseFloat(p);
    }) : [];
  } // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


  function spring(string, duration) {
    var params = parseEasingParameters(string);
    var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
    var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
    var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
    var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
    var w0 = Math.sqrt(stiffness / mass);
    var zeta = damping / (2 * Math.sqrt(stiffness * mass));
    var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    var a = 1;
    var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

    function solver(t) {
      var progress = duration ? duration * t / 1000 : t;

      if (zeta < 1) {
        progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
      }

      if (t === 0 || t === 1) {
        return t;
      }

      return 1 - progress;
    }

    function getDuration() {
      var cached = cache.springs[string];

      if (cached) {
        return cached;
      }

      var frame = 1 / 6;
      var elapsed = 0;
      var rest = 0;

      while (true) {
        elapsed += frame;

        if (solver(elapsed) === 1) {
          rest++;

          if (rest >= 16) {
            break;
          }
        } else {
          rest = 0;
        }
      }

      var duration = elapsed * frame * 1000;
      cache.springs[string] = duration;
      return duration;
    }

    return duration ? solver : getDuration;
  } // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


  function steps(steps) {
    if (steps === void 0) steps = 10;
    return function (t) {
      return Math.ceil(minMax(t, 0.000001, 1) * steps) * (1 / steps);
    };
  } // BezierEasing https://github.com/gre/bezier-easing


  var bezier = function () {
    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    function A(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1) {
      return 3.0 * aA1;
    }

    function calcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    function getSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide(aX, aA, aB, mX1, mX2) {
      var currentX,
          currentT,
          i = 0;

      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;

        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

      return currentT;
    }

    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < 4; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);

        if (currentSlope === 0.0) {
          return aGuessT;
        }

        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }

      return aGuessT;
    }

    function bezier(mX1, mY1, mX2, mY2) {
      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        return;
      }

      var sampleValues = new Float32Array(kSplineTableSize);

      if (mX1 !== mY1 || mX2 !== mY2) {
        for (var i = 0; i < kSplineTableSize; ++i) {
          sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
      }

      function getTForX(aX) {
        var intervalStart = 0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }

        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= 0.001) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      }

      return function (x) {
        if (mX1 === mY1 && mX2 === mY2) {
          return x;
        }

        if (x === 0 || x === 1) {
          return x;
        }

        return calcBezier(getTForX(x), mY1, mY2);
      };
    }

    return bezier;
  }();

  var penner = function () {
    // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
    var eases = {
      linear: function () {
        return function (t) {
          return t;
        };
      }
    };
    var functionEasings = {
      Sine: function () {
        return function (t) {
          return 1 - Math.cos(t * Math.PI / 2);
        };
      },
      Circ: function () {
        return function (t) {
          return 1 - Math.sqrt(1 - t * t);
        };
      },
      Back: function () {
        return function (t) {
          return t * t * (3 * t - 2);
        };
      },
      Bounce: function () {
        return function (t) {
          var pow2,
              b = 4;

          while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}

          return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
        };
      },
      Elastic: function (amplitude, period) {
        if (amplitude === void 0) amplitude = 1;
        if (period === void 0) period = .5;
        var a = minMax(amplitude, 1, 10);
        var p = minMax(period, .1, 2);
        return function (t) {
          return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
        };
      }
    };
    var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
    baseEasings.forEach(function (name, i) {
      functionEasings[name] = function () {
        return function (t) {
          return Math.pow(t, i + 2);
        };
      };
    });
    Object.keys(functionEasings).forEach(function (name) {
      var easeIn = functionEasings[name];
      eases['easeIn' + name] = easeIn;

      eases['easeOut' + name] = function (a, b) {
        return function (t) {
          return 1 - easeIn(a, b)(1 - t);
        };
      };

      eases['easeInOut' + name] = function (a, b) {
        return function (t) {
          return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
        };
      };

      eases['easeOutIn' + name] = function (a, b) {
        return function (t) {
          return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
        };
      };
    });
    return eases;
  }();

  function parseEasings(easing, duration) {
    if (is.fnc(easing)) {
      return easing;
    }

    var name = easing.split('(')[0];
    var ease = penner[name];
    var args = parseEasingParameters(easing);

    switch (name) {
      case 'spring':
        return spring(easing, duration);

      case 'cubicBezier':
        return applyArguments(bezier, args);

      case 'steps':
        return applyArguments(steps, args);

      default:
        return applyArguments(ease, args);
    }
  } // Strings


  function selectString(str) {
    try {
      var nodes = document.querySelectorAll(str);
      return nodes;
    } catch (e) {
      return;
    }
  } // Arrays


  function filterArray(arr, callback) {
    var len = arr.length;
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    var result = [];

    for (var i = 0; i < len; i++) {
      if (i in arr) {
        var val = arr[i];

        if (callback.call(thisArg, val, i, arr)) {
          result.push(val);
        }
      }
    }

    return result;
  }

  function flattenArray(arr) {
    return arr.reduce(function (a, b) {
      return a.concat(is.arr(b) ? flattenArray(b) : b);
    }, []);
  }

  function toArray(o) {
    if (is.arr(o)) {
      return o;
    }

    if (is.str(o)) {
      o = selectString(o) || o;
    }

    if (o instanceof NodeList || o instanceof HTMLCollection) {
      return [].slice.call(o);
    }

    return [o];
  }

  function arrayContains(arr, val) {
    return arr.some(function (a) {
      return a === val;
    });
  } // Objects


  function cloneObject(o) {
    var clone = {};

    for (var p in o) {
      clone[p] = o[p];
    }

    return clone;
  }

  function replaceObjectProps(o1, o2) {
    var o = cloneObject(o1);

    for (var p in o1) {
      o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
    }

    return o;
  }

  function mergeObjects(o1, o2) {
    var o = cloneObject(o1);

    for (var p in o2) {
      o[p] = is.und(o1[p]) ? o2[p] : o1[p];
    }

    return o;
  } // Colors


  function rgbToRgba(rgbValue) {
    var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
    return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
  }

  function hexToRgba(hexValue) {
    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var hex = hexValue.replace(rgx, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(rgb[1], 16);
    var g = parseInt(rgb[2], 16);
    var b = parseInt(rgb[3], 16);
    return "rgba(" + r + "," + g + "," + b + ",1)";
  }

  function hslToRgba(hslValue) {
    var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
    var h = parseInt(hsl[1], 10) / 360;
    var s = parseInt(hsl[2], 10) / 100;
    var l = parseInt(hsl[3], 10) / 100;
    var a = hsl[4] || 1;

    function hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }

      if (t > 1) {
        t -= 1;
      }

      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }

      if (t < 1 / 2) {
        return q;
      }

      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }

      return p;
    }

    var r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
  }

  function colorToRgb(val) {
    if (is.rgb(val)) {
      return rgbToRgba(val);
    }

    if (is.hex(val)) {
      return hexToRgba(val);
    }

    if (is.hsl(val)) {
      return hslToRgba(val);
    }
  } // Units


  function getUnit(val) {
    var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

    if (split) {
      return split[1];
    }
  }

  function getTransformUnit(propName) {
    if (stringContains(propName, 'translate') || propName === 'perspective') {
      return 'px';
    }

    if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
      return 'deg';
    }
  } // Values


  function getFunctionValue(val, animatable) {
    if (!is.fnc(val)) {
      return val;
    }

    return val(animatable.target, animatable.id, animatable.total);
  }

  function getAttribute(el, prop) {
    return el.getAttribute(prop);
  }

  function convertPxToUnit(el, value, unit) {
    var valueUnit = getUnit(value);

    if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
      return value;
    }

    var cached = cache.CSS[value + unit];

    if (!is.und(cached)) {
      return cached;
    }

    var baseline = 100;
    var tempEl = document.createElement(el.tagName);
    var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
    parentEl.appendChild(tempEl);
    tempEl.style.position = 'absolute';
    tempEl.style.width = baseline + unit;
    var factor = baseline / tempEl.offsetWidth;
    parentEl.removeChild(tempEl);
    var convertedUnit = factor * parseFloat(value);
    cache.CSS[value + unit] = convertedUnit;
    return convertedUnit;
  }

  function getCSSValue(el, prop, unit) {
    if (prop in el.style) {
      var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
      return unit ? convertPxToUnit(el, value, unit) : value;
    }
  }

  function getAnimationType(el, prop) {
    if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || is.svg(el) && el[prop])) {
      return 'attribute';
    }

    if (is.dom(el) && arrayContains(validTransforms, prop)) {
      return 'transform';
    }

    if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
      return 'css';
    }

    if (el[prop] != null) {
      return 'object';
    }
  }

  function getElementTransforms(el) {
    if (!is.dom(el)) {
      return;
    }

    var str = el.style.transform || '';
    var reg = /(\w+)\(([^)]*)\)/g;
    var transforms = new Map();
    var m;

    while (m = reg.exec(str)) {
      transforms.set(m[1], m[2]);
    }

    return transforms;
  }

  function getTransformValue(el, propName, animatable, unit) {
    var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
    var value = getElementTransforms(el).get(propName) || defaultVal;

    if (animatable) {
      animatable.transforms.list.set(propName, value);
      animatable.transforms['last'] = propName;
    }

    return unit ? convertPxToUnit(el, value, unit) : value;
  }

  function getOriginalTargetValue(target, propName, unit, animatable) {
    switch (getAnimationType(target, propName)) {
      case 'transform':
        return getTransformValue(target, propName, animatable, unit);

      case 'css':
        return getCSSValue(target, propName, unit);

      case 'attribute':
        return getAttribute(target, propName);

      default:
        return target[propName] || 0;
    }
  }

  function getRelativeValue(to, from) {
    var operator = /^(\*=|\+=|-=)/.exec(to);

    if (!operator) {
      return to;
    }

    var u = getUnit(to) || 0;
    var x = parseFloat(from);
    var y = parseFloat(to.replace(operator[0], ''));

    switch (operator[0][0]) {
      case '+':
        return x + y + u;

      case '-':
        return x - y + u;

      case '*':
        return x * y + u;
    }
  }

  function validateValue(val, unit) {
    if (is.col(val)) {
      return colorToRgb(val);
    }

    if (/\s/g.test(val)) {
      return val;
    }

    var originalUnit = getUnit(val);
    var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;

    if (unit) {
      return unitLess + unit;
    }

    return unitLess;
  } // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
  // adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCircleLength(el) {
    return Math.PI * 2 * getAttribute(el, 'r');
  }

  function getRectLength(el) {
    return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
  }

  function getLineLength(el) {
    return getDistance({
      x: getAttribute(el, 'x1'),
      y: getAttribute(el, 'y1')
    }, {
      x: getAttribute(el, 'x2'),
      y: getAttribute(el, 'y2')
    });
  }

  function getPolylineLength(el) {
    var points = el.points;
    var totalLength = 0;
    var previousPos;

    for (var i = 0; i < points.numberOfItems; i++) {
      var currentPos = points.getItem(i);

      if (i > 0) {
        totalLength += getDistance(previousPos, currentPos);
      }

      previousPos = currentPos;
    }

    return totalLength;
  }

  function getPolygonLength(el) {
    var points = el.points;
    return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
  } // Path animation


  function getTotalLength(el) {
    if (el.getTotalLength) {
      return el.getTotalLength();
    }

    switch (el.tagName.toLowerCase()) {
      case 'circle':
        return getCircleLength(el);

      case 'rect':
        return getRectLength(el);

      case 'line':
        return getLineLength(el);

      case 'polyline':
        return getPolylineLength(el);

      case 'polygon':
        return getPolygonLength(el);
    }
  }

  function setDashoffset(el) {
    var pathLength = getTotalLength(el);
    el.setAttribute('stroke-dasharray', pathLength);
    return pathLength;
  } // Motion path


  function getParentSvgEl(el) {
    var parentEl = el.parentNode;

    while (is.svg(parentEl)) {
      if (!is.svg(parentEl.parentNode)) {
        break;
      }

      parentEl = parentEl.parentNode;
    }

    return parentEl;
  }

  function getParentSvg(pathEl, svgData) {
    var svg = svgData || {};
    var parentSvgEl = svg.el || getParentSvgEl(pathEl);
    var rect = parentSvgEl.getBoundingClientRect();
    var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
    var width = rect.width;
    var height = rect.height;
    var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
    return {
      el: parentSvgEl,
      viewBox: viewBox,
      x: viewBox[0] / 1,
      y: viewBox[1] / 1,
      w: width,
      h: height,
      vW: viewBox[2],
      vH: viewBox[3]
    };
  }

  function getPath(path, percent) {
    var pathEl = is.str(path) ? selectString(path)[0] : path;
    var p = percent || 100;
    return function (property) {
      return {
        property: property,
        el: pathEl,
        svg: getParentSvg(pathEl),
        totalLength: getTotalLength(pathEl) * (p / 100)
      };
    };
  }

  function getPathProgress(path, progress, isPathTargetInsideSVG) {
    function point(offset) {
      if (offset === void 0) offset = 0;
      var l = progress + offset >= 1 ? progress + offset : 0;
      return path.el.getPointAtLength(l);
    }

    var svg = getParentSvg(path.el, path.svg);
    var p = point();
    var p0 = point(-1);
    var p1 = point(+1);
    var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
    var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;

    switch (path.property) {
      case 'x':
        return (p.x - svg.x) * scaleX;

      case 'y':
        return (p.y - svg.y) * scaleY;

      case 'angle':
        return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
    }
  } // Decompose value


  function decomposeValue(val, unit) {
    // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
    // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
    var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation

    var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
    return {
      original: value,
      numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
      strings: is.str(val) || unit ? value.split(rgx) : []
    };
  } // Animatables


  function parseTargets(targets) {
    var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
    return filterArray(targetsArray, function (item, pos, self) {
      return self.indexOf(item) === pos;
    });
  }

  function getAnimatables(targets) {
    var parsed = parseTargets(targets);
    return parsed.map(function (t, i) {
      return {
        target: t,
        id: i,
        total: parsed.length,
        transforms: {
          list: getElementTransforms(t)
        }
      };
    });
  } // Properties


  function normalizePropertyTweens(prop, tweenSettings) {
    var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

    if (/^spring/.test(settings.easing)) {
      settings.duration = spring(settings.easing);
    }

    if (is.arr(prop)) {
      var l = prop.length;
      var isFromTo = l === 2 && !is.obj(prop[0]);

      if (!isFromTo) {
        // Duration divided by the number of tweens
        if (!is.fnc(tweenSettings.duration)) {
          settings.duration = tweenSettings.duration / l;
        }
      } else {
        // Transform [from, to] values shorthand to a valid tween value
        prop = {
          value: prop
        };
      }
    }

    var propArray = is.arr(prop) ? prop : [prop];
    return propArray.map(function (v, i) {
      var obj = is.obj(v) && !is.pth(v) ? v : {
        value: v
      }; // Default delay value should only be applied to the first tween

      if (is.und(obj.delay)) {
        obj.delay = !i ? tweenSettings.delay : 0;
      } // Default endDelay value should only be applied to the last tween


      if (is.und(obj.endDelay)) {
        obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
      }

      return obj;
    }).map(function (k) {
      return mergeObjects(k, settings);
    });
  }

  function flattenKeyframes(keyframes) {
    var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
      return Object.keys(key);
    })), function (p) {
      return is.key(p);
    }).reduce(function (a, b) {
      if (a.indexOf(b) < 0) {
        a.push(b);
      }

      return a;
    }, []);
    var properties = {};

    var loop = function (i) {
      var propName = propertyNames[i];
      properties[propName] = keyframes.map(function (key) {
        var newKey = {};

        for (var p in key) {
          if (is.key(p)) {
            if (p == propName) {
              newKey.value = key[p];
            }
          } else {
            newKey[p] = key[p];
          }
        }

        return newKey;
      });
    };

    for (var i = 0; i < propertyNames.length; i++) loop(i);

    return properties;
  }

  function getProperties(tweenSettings, params) {
    var properties = [];
    var keyframes = params.keyframes;

    if (keyframes) {
      params = mergeObjects(flattenKeyframes(keyframes), params);
    }

    for (var p in params) {
      if (is.key(p)) {
        properties.push({
          name: p,
          tweens: normalizePropertyTweens(params[p], tweenSettings)
        });
      }
    }

    return properties;
  } // Tweens


  function normalizeTweenValues(tween, animatable) {
    var t = {};

    for (var p in tween) {
      var value = getFunctionValue(tween[p], animatable);

      if (is.arr(value)) {
        value = value.map(function (v) {
          return getFunctionValue(v, animatable);
        });

        if (value.length === 1) {
          value = value[0];
        }
      }

      t[p] = value;
    }

    t.duration = parseFloat(t.duration);
    t.delay = parseFloat(t.delay);
    return t;
  }

  function normalizeTweens(prop, animatable) {
    var previousTween;
    return prop.tweens.map(function (t) {
      var tween = normalizeTweenValues(t, animatable);
      var tweenValue = tween.value;
      var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
      var toUnit = getUnit(to);
      var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
      var previousValue = previousTween ? previousTween.to.original : originalValue;
      var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
      var fromUnit = getUnit(from) || getUnit(originalValue);
      var unit = toUnit || fromUnit;

      if (is.und(to)) {
        to = previousValue;
      }

      tween.from = decomposeValue(from, unit);
      tween.to = decomposeValue(getRelativeValue(to, from), unit);
      tween.start = previousTween ? previousTween.end : 0;
      tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
      tween.easing = parseEasings(tween.easing, tween.duration);
      tween.isPath = is.pth(tweenValue);
      tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
      tween.isColor = is.col(tween.from.original);

      if (tween.isColor) {
        tween.round = 1;
      }

      previousTween = tween;
      return tween;
    });
  } // Tween progress


  var setProgressValue = {
    css: function (t, p, v) {
      return t.style[p] = v;
    },
    attribute: function (t, p, v) {
      return t.setAttribute(p, v);
    },
    object: function (t, p, v) {
      return t[p] = v;
    },
    transform: function (t, p, v, transforms, manual) {
      transforms.list.set(p, v);

      if (p === transforms.last || manual) {
        var str = '';
        transforms.list.forEach(function (value, prop) {
          str += prop + "(" + value + ") ";
        });
        t.style.transform = str;
      }
    }
  }; // Set Value helper

  function setTargetsValue(targets, properties) {
    var animatables = getAnimatables(targets);
    animatables.forEach(function (animatable) {
      for (var property in properties) {
        var value = getFunctionValue(properties[property], animatable);
        var target = animatable.target;
        var valueUnit = getUnit(value);
        var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
        var unit = valueUnit || getUnit(originalValue);
        var to = getRelativeValue(validateValue(value, unit), originalValue);
        var animType = getAnimationType(target, property);
        setProgressValue[animType](target, property, to, animatable.transforms, true);
      }
    });
  } // Animations


  function createAnimation(animatable, prop) {
    var animType = getAnimationType(animatable.target, prop.name);

    if (animType) {
      var tweens = normalizeTweens(prop, animatable);
      var lastTween = tweens[tweens.length - 1];
      return {
        type: animType,
        property: prop.name,
        animatable: animatable,
        tweens: tweens,
        duration: lastTween.end,
        delay: tweens[0].delay,
        endDelay: lastTween.endDelay
      };
    }
  }

  function getAnimations(animatables, properties) {
    return filterArray(flattenArray(animatables.map(function (animatable) {
      return properties.map(function (prop) {
        return createAnimation(animatable, prop);
      });
    })), function (a) {
      return !is.und(a);
    });
  } // Create Instance


  function getInstanceTimings(animations, tweenSettings) {
    var animLength = animations.length;

    var getTlOffset = function (anim) {
      return anim.timelineOffset ? anim.timelineOffset : 0;
    };

    var timings = {};
    timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.duration;
    })) : tweenSettings.duration;
    timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.delay;
    })) : tweenSettings.delay;
    timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
      return getTlOffset(anim) + anim.duration - anim.endDelay;
    })) : tweenSettings.endDelay;
    return timings;
  }

  var instanceID = 0;

  function createNewInstance(params) {
    var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
    var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
    var properties = getProperties(tweenSettings, params);
    var animatables = getAnimatables(params.targets);
    var animations = getAnimations(animatables, properties);
    var timings = getInstanceTimings(animations, tweenSettings);
    var id = instanceID;
    instanceID++;
    return mergeObjects(instanceSettings, {
      id: id,
      children: [],
      animatables: animatables,
      animations: animations,
      duration: timings.duration,
      delay: timings.delay,
      endDelay: timings.endDelay
    });
  } // Core


  var activeInstances = [];

  var engine = function () {
    var raf;

    function play() {
      if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
        raf = requestAnimationFrame(step);
      }
    }

    function step(t) {
      // memo on algorithm issue:
      // dangerous iteration over mutable `activeInstances`
      // (that collection may be updated from within callbacks of `tick`-ed animation instances)
      var activeInstancesLength = activeInstances.length;
      var i = 0;

      while (i < activeInstancesLength) {
        var activeInstance = activeInstances[i];

        if (!activeInstance.paused) {
          activeInstance.tick(t);
          i++;
        } else {
          activeInstances.splice(i, 1);
          activeInstancesLength--;
        }
      }

      raf = i > 0 ? requestAnimationFrame(step) : undefined;
    }

    function handleVisibilityChange() {
      if (!anime.suspendWhenDocumentHidden) {
        return;
      }

      if (isDocumentHidden()) {
        // suspend ticks
        raf = cancelAnimationFrame(raf);
      } else {
        // is back to active tab
        // first adjust animations to consider the time that ticks were suspended
        activeInstances.forEach(function (instance) {
          return instance._onDocumentVisibility();
        });
        engine();
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return play;
  }();

  function isDocumentHidden() {
    return !!document && document.hidden;
  } // Public Instance


  function anime(params) {
    if (params === void 0) params = {};
    var startTime = 0,
        lastTime = 0,
        now = 0;
    var children,
        childrenLength = 0;
    var resolve = null;

    function makePromise(instance) {
      var promise = window.Promise && new Promise(function (_resolve) {
        return resolve = _resolve;
      });
      instance.finished = promise;
      return promise;
    }

    var instance = createNewInstance(params);
    makePromise(instance);

    function toggleInstanceDirection() {
      var direction = instance.direction;

      if (direction !== 'alternate') {
        instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
      }

      instance.reversed = !instance.reversed;
      children.forEach(function (child) {
        return child.reversed = instance.reversed;
      });
    }

    function adjustTime(time) {
      return instance.reversed ? instance.duration - time : time;
    }

    function resetTime() {
      startTime = 0;
      lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
    }

    function seekChild(time, child) {
      if (child) {
        child.seek(time - child.timelineOffset);
      }
    }

    function syncInstanceChildren(time) {
      if (!instance.reversePlayback) {
        for (var i = 0; i < childrenLength; i++) {
          seekChild(time, children[i]);
        }
      } else {
        for (var i$1 = childrenLength; i$1--;) {
          seekChild(time, children[i$1]);
        }
      }
    }

    function setAnimationsProgress(insTime) {
      var i = 0;
      var animations = instance.animations;
      var animationsLength = animations.length;

      while (i < animationsLength) {
        var anim = animations[i];
        var animatable = anim.animatable;
        var tweens = anim.tweens;
        var tweenLength = tweens.length - 1;
        var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

        if (tweenLength) {
          tween = filterArray(tweens, function (t) {
            return insTime < t.end;
          })[0] || tween;
        }

        var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
        var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
        var strings = tween.to.strings;
        var round = tween.round;
        var numbers = [];
        var toNumbersLength = tween.to.numbers.length;
        var progress = void 0;

        for (var n = 0; n < toNumbersLength; n++) {
          var value = void 0;
          var toNumber = tween.to.numbers[n];
          var fromNumber = tween.from.numbers[n] || 0;

          if (!tween.isPath) {
            value = fromNumber + eased * (toNumber - fromNumber);
          } else {
            value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
          }

          if (round) {
            if (!(tween.isColor && n > 2)) {
              value = Math.round(value * round) / round;
            }
          }

          numbers.push(value);
        } // Manual Array.reduce for better performances


        var stringsLength = strings.length;

        if (!stringsLength) {
          progress = numbers[0];
        } else {
          progress = strings[0];

          for (var s = 0; s < stringsLength; s++) {
            strings[s];
            var b = strings[s + 1];
            var n$1 = numbers[s];

            if (!isNaN(n$1)) {
              if (!b) {
                progress += n$1 + ' ';
              } else {
                progress += n$1 + b;
              }
            }
          }
        }

        setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
        anim.currentValue = progress;
        i++;
      }
    }

    function setCallback(cb) {
      if (instance[cb] && !instance.passThrough) {
        instance[cb](instance);
      }
    }

    function countIteration() {
      if (instance.remaining && instance.remaining !== true) {
        instance.remaining--;
      }
    }

    function setInstanceProgress(engineTime) {
      var insDuration = instance.duration;
      var insDelay = instance.delay;
      var insEndDelay = insDuration - instance.endDelay;
      var insTime = adjustTime(engineTime);
      instance.progress = minMax(insTime / insDuration * 100, 0, 100);
      instance.reversePlayback = insTime < instance.currentTime;

      if (children) {
        syncInstanceChildren(insTime);
      }

      if (!instance.began && instance.currentTime > 0) {
        instance.began = true;
        setCallback('begin');
      }

      if (!instance.loopBegan && instance.currentTime > 0) {
        instance.loopBegan = true;
        setCallback('loopBegin');
      }

      if (insTime <= insDelay && instance.currentTime !== 0) {
        setAnimationsProgress(0);
      }

      if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
        setAnimationsProgress(insDuration);
      }

      if (insTime > insDelay && insTime < insEndDelay) {
        if (!instance.changeBegan) {
          instance.changeBegan = true;
          instance.changeCompleted = false;
          setCallback('changeBegin');
        }

        setCallback('change');
        setAnimationsProgress(insTime);
      } else {
        if (instance.changeBegan) {
          instance.changeCompleted = true;
          instance.changeBegan = false;
          setCallback('changeComplete');
        }
      }

      instance.currentTime = minMax(insTime, 0, insDuration);

      if (instance.began) {
        setCallback('update');
      }

      if (engineTime >= insDuration) {
        lastTime = 0;
        countIteration();

        if (!instance.remaining) {
          instance.paused = true;

          if (!instance.completed) {
            instance.completed = true;
            setCallback('loopComplete');
            setCallback('complete');

            if (!instance.passThrough && 'Promise' in window) {
              resolve();
              makePromise(instance);
            }
          }
        } else {
          startTime = now;
          setCallback('loopComplete');
          instance.loopBegan = false;

          if (instance.direction === 'alternate') {
            toggleInstanceDirection();
          }
        }
      }
    }

    instance.reset = function () {
      var direction = instance.direction;
      instance.passThrough = false;
      instance.currentTime = 0;
      instance.progress = 0;
      instance.paused = true;
      instance.began = false;
      instance.loopBegan = false;
      instance.changeBegan = false;
      instance.completed = false;
      instance.changeCompleted = false;
      instance.reversePlayback = false;
      instance.reversed = direction === 'reverse';
      instance.remaining = instance.loop;
      children = instance.children;
      childrenLength = children.length;

      for (var i = childrenLength; i--;) {
        instance.children[i].reset();
      }

      if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
        instance.remaining++;
      }

      setAnimationsProgress(instance.reversed ? instance.duration : 0);
    }; // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)


    instance._onDocumentVisibility = resetTime; // Set Value helper

    instance.set = function (targets, properties) {
      setTargetsValue(targets, properties);
      return instance;
    };

    instance.tick = function (t) {
      now = t;

      if (!startTime) {
        startTime = now;
      }

      setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
    };

    instance.seek = function (time) {
      setInstanceProgress(adjustTime(time));
    };

    instance.pause = function () {
      instance.paused = true;
      resetTime();
    };

    instance.play = function () {
      if (!instance.paused) {
        return;
      }

      if (instance.completed) {
        instance.reset();
      }

      instance.paused = false;
      activeInstances.push(instance);
      resetTime();
      engine();
    };

    instance.reverse = function () {
      toggleInstanceDirection();
      instance.completed = instance.reversed ? false : true;
      resetTime();
    };

    instance.restart = function () {
      instance.reset();
      instance.play();
    };

    instance.remove = function (targets) {
      var targetsArray = parseTargets(targets);
      removeTargetsFromInstance(targetsArray, instance);
    };

    instance.reset();

    if (instance.autoplay) {
      instance.play();
    }

    return instance;
  } // Remove targets from animation


  function removeTargetsFromAnimations(targetsArray, animations) {
    for (var a = animations.length; a--;) {
      if (arrayContains(targetsArray, animations[a].animatable.target)) {
        animations.splice(a, 1);
      }
    }
  }

  function removeTargetsFromInstance(targetsArray, instance) {
    var animations = instance.animations;
    var children = instance.children;
    removeTargetsFromAnimations(targetsArray, animations);

    for (var c = children.length; c--;) {
      var child = children[c];
      var childAnimations = child.animations;
      removeTargetsFromAnimations(targetsArray, childAnimations);

      if (!childAnimations.length && !child.children.length) {
        children.splice(c, 1);
      }
    }

    if (!animations.length && !children.length) {
      instance.pause();
    }
  }

  function removeTargetsFromActiveInstances(targets) {
    var targetsArray = parseTargets(targets);

    for (var i = activeInstances.length; i--;) {
      var instance = activeInstances[i];
      removeTargetsFromInstance(targetsArray, instance);
    }
  } // Stagger helpers


  function stagger(val, params) {
    if (params === void 0) params = {};
    var direction = params.direction || 'normal';
    var easing = params.easing ? parseEasings(params.easing) : null;
    var grid = params.grid;
    var axis = params.axis;
    var fromIndex = params.from || 0;
    var fromFirst = fromIndex === 'first';
    var fromCenter = fromIndex === 'center';
    var fromLast = fromIndex === 'last';
    var isRange = is.arr(val);
    var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
    var val2 = isRange ? parseFloat(val[1]) : 0;
    var unit = getUnit(isRange ? val[1] : val) || 0;
    var start = params.start || 0 + (isRange ? val1 : 0);
    var values = [];
    var maxValue = 0;
    return function (el, i, t) {
      if (fromFirst) {
        fromIndex = 0;
      }

      if (fromCenter) {
        fromIndex = (t - 1) / 2;
      }

      if (fromLast) {
        fromIndex = t - 1;
      }

      if (!values.length) {
        for (var index = 0; index < t; index++) {
          if (!grid) {
            values.push(Math.abs(fromIndex - index));
          } else {
            var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
            var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
            var toX = index % grid[0];
            var toY = Math.floor(index / grid[0]);
            var distanceX = fromX - toX;
            var distanceY = fromY - toY;
            var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (axis === 'x') {
              value = -distanceX;
            }

            if (axis === 'y') {
              value = -distanceY;
            }

            values.push(value);
          }

          maxValue = Math.max.apply(Math, values);
        }

        if (easing) {
          values = values.map(function (val) {
            return easing(val / maxValue) * maxValue;
          });
        }

        if (direction === 'reverse') {
          values = values.map(function (val) {
            return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
          });
        }
      }

      var spacing = isRange ? (val2 - val1) / maxValue : val1;
      return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
    };
  } // Timeline


  function timeline(params) {
    if (params === void 0) params = {};
    var tl = anime(params);
    tl.duration = 0;

    tl.add = function (instanceParams, timelineOffset) {
      var tlIndex = activeInstances.indexOf(tl);
      var children = tl.children;

      if (tlIndex > -1) {
        activeInstances.splice(tlIndex, 1);
      }

      function passThrough(ins) {
        ins.passThrough = true;
      }

      for (var i = 0; i < children.length; i++) {
        passThrough(children[i]);
      }

      var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
      insParams.targets = insParams.targets || params.targets;
      var tlDuration = tl.duration;
      insParams.autoplay = false;
      insParams.direction = tl.direction;
      insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
      passThrough(tl);
      tl.seek(insParams.timelineOffset);
      var ins = anime(insParams);
      passThrough(ins);
      children.push(ins);
      var timings = getInstanceTimings(children, params);
      tl.delay = timings.delay;
      tl.endDelay = timings.endDelay;
      tl.duration = timings.duration;
      tl.seek(0);
      tl.reset();

      if (tl.autoplay) {
        tl.play();
      }

      return tl;
    };

    return tl;
  }

  anime.version = '3.2.1';
  anime.speed = 1; // TODO:#review: naming, documentation

  anime.suspendWhenDocumentHidden = true;
  anime.running = activeInstances;
  anime.remove = removeTargetsFromActiveInstances;
  anime.get = getOriginalTargetValue;
  anime.set = setTargetsValue;
  anime.convertPx = convertPxToUnit;
  anime.path = getPath;
  anime.setDashoffset = setDashoffset;
  anime.stagger = stagger;
  anime.timeline = timeline;
  anime.easing = parseEasings;
  anime.penner = penner;

  anime.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  class View extends Emitter {
    constructor() {
      super(); //  list of added sections

      this.sections = [];
      this.sectionsCount = 0;
      this._index = 0;
      this.indexes = [];
      this.currentSection = null;
      this.eventPrefix = 'view';
      this._loop = false;
    }
    /**
     * Gets current index
     */


    get index() {
      return this._index;
    }
    /**
     * Sets current index
     */


    set index(value) {
      if (value === this._index) {
        return;
      }

      this._index = value;
      this.currentSection = this.sections[value];
      this.trigger('indexChange', [value], true);
    }
    /**
     * Gets loop value
     */


    get loop() {
      return this._loop;
    }
    /**
     * Sets new loop value
     */


    set loop(value) {
      if (this._loop !== value) {
        this._loop = value;
        this.update();
      }
    }
    /**
     * Gets the total number of added sections
     */


    get count() {
      return this.sectionsCount;
    }
    /**
     * Appends new section to the sections list
     * @param {MSSection} section New section instance
     * @param {Boolean} update Whether call view update method
     */


    appendSection(section, update = true) {
      this.sections.push(section);

      this._afterSectionAdd(section, update);
    }
    /**
     * Prepends new section to the sections list
     * @param {MSSection} section Mew section instance
     * @param {Boolean} update Whether call view update method
     */


    prependSection(section, update = true) {
      this.sections.unshift(section);

      this._afterSectionAdd(section, update);
    }
    /**
     * Inserts new section after given section
     * @param {MSSection} section Mew section instance
     * @param {MSSection} afterSection Target section instance
     * @param {Boolean} update Whether call view update method
     */


    insertSectionAfter(section, afterSection, update = true) {
      this.insertSectionAt(section, this.sections.indexOf(afterSection), update);
    }
    /**
     * Inserts new section after given index
     * @param {MSSection} section Mew section instance
     * @param {Number} index Target index
     * @param {Boolean} update Whether call view update method
     */


    insertSectionAt(section, index, update = true) {
      if (index < 0) {
        return;
      }

      this.sections.splice(index, 0, section);

      this._afterSectionAdd(section, update);
    }
    /**
     * Removes section from view
     * @param {MSSection} section
     * @param {Boolean} update Whether call view update method
     */


    removeSection(section, update = true) {
      return this.removeSectionByIndex(this.section.indexOf(section), update);
    }
    /**
     * Removes the section at given index
     * @param {Number} index section id
     * @param {Boolean} update Whether call view update method
     */


    removeSectionByIndex(index, update = true) {
      if (index < 0) {
        return false;
      }

      const removedSection = this.sections.splice(index, 1);
      removedSection.unmount();
      this.trigger('sectionRemove', removedSection);

      if (update) {
        this.update();
      }

      return removedSection[0];
    }
    /**
     * Update view
     */


    update() {
      this.trigger('update', null, true);
    }
    /**
     * Updates sections index number
     */


    updateSectionsIndex() {
      this.sections.forEach((section, index) => {
        section.index = index;
      });
    }
    /**
     * Updates sections count and calls section mount method
     * @private
     * @param {MSSection} section
     * @param {Boolean} update Whether call view update method
     */


    _afterSectionAdd(section, update) {
      this.sectionsCount = this.sections.length;
      section.mount(this);
      this.updateSectionsIndex();

      if (update) {
        this.update();
      }

      this.trigger('sectionAdd', [section]);
    }

  }

  /**
   * This class extends View and adds and manages view element plus adding
   * and removing section elements to the dom.
   */

  class DomView extends View {
    constructor() {
      super();
      this.element = document.createElement('div');
      this.element.classList.add(`${prefix}-view`);
      this.sectionsContainer = document.createElement('div');
      this.sectionsContainer.classList.add(`${prefix}-sections`);
      this.element.appendChild(this.sectionsContainer);
    }
    /**
     * Reads element dimension values and updates the properties
     */


    resize() {
      const width = this.element.offsetWidth;
      const height = this.element.offsetHeight;

      if (width === this.width && height === this.height) {
        return false;
      }

      this.width = width;
      this.height = height;
      this.trigger('resize', [width, height], true);
      return true;
    }
    /**
     * Appends the view element to the given target element
     * @param {Element} target Target element
     */


    appendTo(target) {
      target.appendChild(this.element);
      this.resize();
      this.trigger('elementAppend', [target], true);
    }
    /**
     * Appends new section to the sections list
     * @param {MSSection} section New section instance
     */


    appendSection(section) {
      this.sectionsContainer.appendChild(section.element);
      super.appendSection(section);
    }
    /**
     * Prepends new section to the sections list
     * @param {MSSection} section Mew section instance
     */


    prependSection(section) {
      if (this.sectionsContainer.hasChildNodes) {
        this.sectionsContainer.insertBefore(section.element, this.sectionsContainer.firstChild);
      } else {
        this.sectionsContainer.appendChild(section.element);
      }

      super.prependSection(section);
    }
    /**
     * Inserts new section after given index
     * @param {MSSection} section Mew section instance
     * @param {Number} index Target index
     */


    insertSectionAt(section, index) {
      if (index < 0) {
        return;
      }

      this.sectionsContainer.insertBefore(section.element, this.sectionsContainer.childNodes[index]);
      super.insertSectionAt(section, index);
    }
    /**
     * Removes the section at given index
     * @param {Number} index section id
     */


    removeSectionByIndex(index) {
      if (index < 0) {
        return false;
      }

      this.sections[index].element.remove();
      return super.removeSectionByIndex(index);
    }

  }

  /**
   * This class calculates section positions relative to the scroll position value
   */

  class ScrollView extends DomView {
    constructor() {
      super();
      this.activeEnteringSection = false;
      this.activeFactor = 0.5; // Index of visible sections in view, it may different from view index

      this.visibleIndex = 0;
      this.visibleIndexes = [];
      this.scrollable = true; // privates

      this._size = 0;
      this._position = 0;
      this._length = 0;
    }
    /**
     * Gets the current position
     */


    get position() {
      return this._position;
    }
    /**
     * Sets new position
     */


    set position(value) {
      if (this._position === value) {
        return;
      } // find scroll direction


      this.scrollDirection = value > this._position ? 'forward' : 'backward';

      if (this._loop) {
        this._position = this.normalizePosition(value);
      } else {
        this._position = value;
      } // update view


      this.update(false);
      this.trigger('scroll', [this._position]);
    }
    /**
     * Gets length value
     */


    get length() {
      return this._length;
    }
    /**
     * Gets the view size
     */


    get size() {
      return this._size;
    }
    /**
     * Sets the view size
     */


    set size(value) {
      if (this._size !== value) {
        const changeRatio = this._size ? value / this._size : 1;
        this._size = value; // update position location after resize

        let spaces = 0;
        this.sections.some((section, index) => {
          if (index < this.visibleIndex) {
            spaces += section.space;
            return false;
          }

          return true;
        });
        this._position = (this._position - spaces) * changeRatio + spaces;
        this.update();
      }
    }
    /**
     * Arranges sections in view
     */


    arrange() {
      const lastLength = this._length;
      this._length = 0;
      this.sections.forEach((section, index) => {
        section.index = index;
        section.position = this._length;
        section.offset = this._length;
        section.calculateSize();
        this._length += section.size;
      }); // remove last section space from length

      if (this._sectionsCount && !this._loop) {
        this._length -= this.sections[this._sectionsCount - 1].space;
      }

      this.trigger('arrange', null, true);

      if (this._length !== lastLength) {
        this.trigger('lengthChange', [this._length], this);
      }
    }
    /**
     * Locates sections in a loop based on current position value
     */


    locateInLoop() {
      if (!this._loop) {
        return;
      } // calculates new offsets if loop is enabled


      let before = 0;
      let balanceLength = -1;
      let backwardStart = 0;
      let backwardsLength = 0;
      let startSection;
      this.sections.some(section => {
        if (section.inRangeTest(this._position)) {
          startSection = section;
          return true;
        }

        return false;
      });

      for (let i = 0; i !== this._sectionsCount; i += 1) {
        const section = this.sections[(i + startSection.index) % this._sectionsCount];
        section.offset = startSection.position + before;
        before += section.size; // finds last section in view size and calculates the balance length

        if (balanceLength === -1 && section.inRangeTest((this._position + this._size) % this._length)) {
          balanceLength = (this._length - before) / 2;
        } // finds the last section at balance length and calculates backward sections start index and their length


        if (balanceLength !== -1 && section.inRangeTest((this._position + balanceLength + this._size) % this._length)) {
          backwardStart = (i + 1 + startSection.index) % this._sectionsCount;
          backwardsLength = this._sectionsCount - (i + 1);
          break;
        }
      }

      before = 0; // calculates the backward sections offset

      for (let i = backwardsLength - 1; i >= 0; i -= 1) {
        const section = this.sections[(i + backwardStart) % this._sectionsCount];
        before += section.size;
        section.offset = startSection.position - before;
      }

      this.trigger('loopUpdate', null, true);
    }
    /**
     * Updates sections offset and position values
     */


    update(arrange = true) {
      this._sectionsCount = this.sections.length;

      if (arrange) {
        this.arrange();
      }

      this.locateInLoop();
      this.updateStatusAndIndex();
      this.trigger('update', [this._position], true);
    }
    /**
     * Updates view index and sections status value
     */


    updateStatusAndIndex() {
      let indexes = [];
      let visibleIndexes = [];
      let visibleIndex;
      const pos = Math.round(this._position);
      this.sections.forEach(section => {
        let status = 'in';

        if (section.offset + section.size <= pos) {
          status = 'passed';
        } else if (section.offset < pos) {
          status = this.scrollDirection === 'forward' ? 'leaving' : 'entering';
        } else if (section.offset - section.space >= pos + this._size) {
          status = 'pending';
        } else if (section.offset + section.size - section.space > pos + this._size) {
          status = this.scrollDirection !== 'forward' ? 'leaving' : 'entering';
        }

        if (section.inRangeTest(pos)) {
          visibleIndex = section.index;
        }

        if (status !== 'passed' && status !== 'pending') {
          visibleIndexes.push(section.index);
        }

        section.status = status;
        const startOffset = section.offset - pos;
        const endOffset = section.offset + section.size - section.space - pos - this._size;
        section.pendingOffset = startOffset <= 0 ? startOffset : Math.max(0, endOffset);

        if (this.activeEnteringSection) {
          const factorPos = section.size * this.activeFactor;
          section.active = section.offset + factorPos >= pos && section.offset + section.size - factorPos <= pos + this._size + section.space;
        } else {
          section.active = status === 'in';
        }

        if (section.active) {
          indexes.push(section.index);
        }
      });
      visibleIndexes = visibleIndexes.sort((a, b) => this.sections[a].offset - this.sections[b].offset);

      if (this.visibleIndexes.toString() !== visibleIndexes.toString()) {
        this.visibleIndexes = visibleIndexes;
        this.trigger('visibleIndexesChange', [this.visibleIndexes], true);
      }

      if (this.visibleIndex !== visibleIndex) {
        this.visibleIndex = visibleIndex;
        this.trigger('visibleIndexChange', [this.visibleIndex], true);
      }

      indexes = indexes.sort((a, b) => this.sections[a].offset - this.sections[b].offset);

      if (this.indexes.toString() !== indexes.toString()) {
        this.indexes = indexes;
        this.trigger('indexesChange', [this.indexes]);
      }

      const index = this.indexes[0];

      if (this.index !== index) {
        this.index = index;
        this.trigger('indexChange', [this.index]);
      }
    }

    normalizePositionByDirection(position, direction = 'auto') {
      if (this._loop) {
        position = this.normalizePosition(position);
      } else {
        position = Math.min(position, this._length - this._size);
      }

      let change = 0;

      if (this._loop && direction !== 'off') {
        const current = this._position;
        const target = position;
        const forward = current < target ? target - current : this._length - current + target;
        const backward = current < target ? target - this._length - current : target - current;

        switch (direction) {
          case 'auto':
            change = Math.abs(backward) < Math.abs(forward) ? backward : forward;
            break;

          case 'backward':
            change = backward;
            break;

          default:
            change = forward;
            break;
        }

        return this._position + change;
      }

      return position;
    }
    /**
     * Scrolls to the target position
     * @param {Number} position Target position
     * @param {Boolean} animate Whether animate or not
     * @param {Number} duration Animation duration in seconds
     * @param {String} direction Specifies the direction of scrolling (Only affective when loop is enabled)
     * @param {Object} animParams TweenLite anim params
     */


    scrollTo(position, animate = true, duration = 1, direction = 'auto', animParams) {
      this.killScrollAnimation();
      position = this.normalizePositionByDirection(position, direction);

      if (animate) {
        animParams = _objectSpread2(_objectSpread2({
          easing: 'easeOutExpo',
          duration: duration * 1000
        }, animParams), {}, {
          complete: () => {
            this.animating = false;
            this.trigger('scrollToAnimationEnd', undefined, true);
          }
        });
        animParams.position = position;
        this.animating = true;
        anime(_objectSpread2({
          targets: this
        }, animParams));
      } else {
        this.position = position;
      }
    }
    /**
     * Kills the scroll to animation tween object
     */


    killScrollAnimation() {
      if (this.animating) {
        anime.remove(this);
        this.animating = false;
      }
    }
    /**
     * Scrolls to the target section
     * @param {MSSection} section Target section
     * @param {Boolean} animate Whether animate or not
     * @param {Number} duration Animation duration in seconds
     * @param {String} direction Specifies the direction of scrolling (Only affective when loop is enabled)
     * @param {Object} animParams TweenLite anim params
     */


    goToSection(section, animate = true, duration = 1, direction = 'auto', animParams) {
      this.scrollTo(section.position, animate, duration, direction, animParams);
    }
    /**
     * Scrolls to the target index
     * @param {Number} section Target index
     * @param {Boolean} animate Whether animate or not
     * @param {Number} duration Animation duration in seconds
     * @param {String} direction Specifies the direction of scrolling (Only affective when loop is enabled)
     * @param {Object} animParams TweenLite anim params
     */


    goToIndex(index, animate = true, duration = 1, direction = 'auto', animParams) {
      if (index >= this.sectionsCount) {
        return;
      }

      this.goToSection(this.sections[index], animate, duration, direction, animParams);
    }
    /**
     * @param {Number} position
     * @returns {Number} Section index at given position
     */


    getIndexAtPosition(position) {
      if (this._loop) {
        position = this.normalizePosition(position);
      }

      position %= this._length;
      let returnIndex = -1;
      this.sections.some((section, index) => {
        if (!this.activeEnteringSection) {
          if (section.inRangeTest(position)) {
            returnIndex = index;
            return true;
          }
        } else if (section.position + section.size * this.activeFactor >= position) {
          returnIndex = index;
          return true;
        }

        return false;
      });

      if (returnIndex === -1) {
        return this._loop ? 0 : this.sectionsCount - 1;
      }

      return returnIndex;
    }
    /**
     * @param {Number} position
     * @returns {Array} Section indexes between given position and view size
     */


    getIndexesAtPosition(position) {
      if (this._loop) {
        position = this.normalizePosition(position);
      } else {
        position = Math.min(position, this._length - this._size);
      }

      const startIndex = this.getIndexAtPosition(position);
      const indexes = [];

      for (let i = 0; i !== this._sectionsCount; i += 1) {
        let section;

        if (this._loop) {
          section = this.sections[(i + startIndex) % this._sectionsCount];
        } else {
          if (i + startIndex >= this._sectionsCount) {
            return indexes;
          }

          section = this.sections[i + startIndex];
        }

        indexes.push(section.index);

        if (!this.activeEnteringSection) {
          if (section.inRangeTest((position + this._size) % this._length)) {
            return indexes;
          }
        } else if (section.inRangeTest((position + this._size) % this._length)) {
          if (section.position + section.size - section.size * this.activeFactor < (position + this._size) % this._length) {
            return indexes;
          }

          indexes.pop();
          return indexes;
        }
      }

      return indexes;
    }
    /**
     * Recalculates the value base on length and moves it to the valid range
     * @param {Number} value Scroll position
     */


    normalizePosition(value) {
      value %= this._length;

      if (value < 0) {
        value += this.length;
      }

      return value;
    }

  }

  class Observable {
    constructor() {
      // @private
      this._options = {};
      this._defaults = {};
      this._observers = {};
      this._aliases = {};
      this._waitings = {};
    }
    /**
     * Injects values to options
     * @param {Object} options Plan object of options
     */


    inject(options) {
      Object.keys(options).forEach(name => {
        if (this._options[name] instanceof Observable) {
          this._options[name].inject(options[name]);
        } else if (!this.set(name, options[name], true)) {
          this._waitings[name] = options[name];
        }
      });
    }
    /**
     * Registers new option, if the option is already exists, updates the option
     * @param {String|Object}  name Option name or an object of multiple options and values
     * @param {*}       defaultValue Option default value
     */


    register(name, defaultValue) {
      if (typeof name === 'object') {
        const names = Object.keys(name);
        names.forEach(optionName => {
          this.register(optionName, name[optionName]);
        });
        return names;
      }

      if (!Array.isArray(defaultValue) && typeof defaultValue === 'object') {
        this._options[name] = new Observable();

        this._options[name].register(defaultValue);
      } else {
        this._defaults[name] = defaultValue;
      }

      this._checkWaitingList(name);

      return name;
    }
    /**
     * Chains an observable instance object to an other nested observable
     * @param {String} name Target option name
     * @param {Observable} observableObject Observable instance object
     */


    chain(name, observableObject) {
      if (this._aliases[name]) {
        name = this._aliases[name];
      }

      const nested = this._isNested(name);

      if (nested) {
        nested.options.chain(nested.name, observableObject);
        return;
      }

      if (this._options[name] instanceof Observable) {
        const val = this._options[name];
        Object.assign(observableObject._aliases, val._aliases);
        Object.assign(observableObject._waitings, val._waitings);
        Object.assign(observableObject._defaults, val._defaults);
        Object.keys(val._observers).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(observableObject._observers, key)) {
            observableObject._observers[key].concat(val._observers[key]);
          } else {
            observableObject._observers[key] = val._observers[key];
          }
        });
        Object.keys(val._options).forEach(key => {
          if (val._options[key] instanceof Observable && observableObject._options[key]) {
            val.chain(key, observableObject._options[key]);
          } else {
            observableObject._options[key] = val._options[key];
          }
        });
        observableObject.register(observableObject._defaults);
      }

      this._options[name] = observableObject;
    }
    /**
     * Creates a new alias for an existing option
     * @param  {String} alias Alias name
     * @param  {String} option Target option name
     */


    alias(alias, option) {
      if (this.has(alias)) {
        throw new Error(`"${alias}" is already an option.`);
      }

      if (this._aliases[alias]) {
        throw new Error(`"${alias}" is already created.`);
      }

      if (!this.has(option)) {
        throw new Error(`"${alias}" is not registered. Register the option before defining any alias.`);
      }

      this._aliases[alias] = option;

      this._checkWaitingList(alias);
    }
    /**
     * Checks for option existence
     * @param  {String} name Option name
     */


    has(name) {
      const nested = this._isNested(name);

      if (nested) {
        return nested.options.has(nested.name);
      }

      return has$1.call(this._options, name) || has$1.call(this._defaults, name);
    }
    /**
     * Checks whether option is equal to given value or not
     * @param {String} name Option name
     * @param {*} value Test value
     */


    is(name, value) {
      return this.get(name) === value;
    }
    /**
     * Gets option value(s)
     * @param  {String|array} name Option name(s)
     */


    get(name) {
      if (Array.isArray(name)) {
        const values = {};
        name.forEach(key => {
          values[key] = this.get(key);
        });
        return values;
      }

      if (this._aliases[name]) {
        name = this._aliases[name];
      }

      const nested = this._isNested(name);

      if (nested) {
        return nested.options.get(nested.name);
      }

      if (has$1.call(this._options, name)) {
        return this._options[name];
      }

      return this._defaults[name];
    }
    /**
     * Sets new value to the option
     * @param {String|Object}  name Option name or an object of option and values
     * @param {*}       value Option value
     * @param {Boolean} internal Whether call observers or not
     */


    set(name, value, internal = false) {
      if (typeof name === 'object') {
        Object.keys(name).forEach(optionName => this.set(optionName, name[optionName], internal));
        return true;
      }

      if (this._aliases[name]) {
        name = this._aliases[name];
      }

      const nested = this._isNested(name);

      if (nested) {
        return nested.options.set(nested.name, value, internal);
      }

      if (!this.has(name)) {
        return false;
      }

      if (typeof value === 'object' && this._options[name] instanceof Observable) {
        this._options[name].set(value);
      } else {
        this._options[name] = value;
      }

      if (!this._internalChange && !internal) {
        if (this._observers[name]) {
          this._observers[name].forEach(callback => callback(name, value));
        }

        if (this._observers['*']) {
          this._observers['*'].forEach(callback => callback('*', value));
        }
      }

      return true;
    }
    /**
     * Observes option changes
     * @param  {String|Array}   name Option name(s)
     * @param  {Function} callback Observer function
     */


    observe(name, callback) {
      if (Array.isArray(name)) {
        name.forEach(optionName => this.observe(optionName, callback));
        return;
      }

      if (name !== '*' && !this.has(name)) {
        throw new Error(`This option: "${name}" is not registered.`);
      }

      const nested = this._isNested(name);

      if (nested) {
        nested.options.observe(nested.name, callback);
        return;
      }

      const value = this.get(name);

      if (value instanceof Observable) {
        value.observe('*', callback);
      }

      if (!this._observers[name]) {
        this._observers[name] = [];
      }

      this._observers[name].push(callback);
    }
    /**
     * Removes observer of an option
     * @param  {String|Array}   name Option name(s)
     * @param  {Function} callback Observer callback
     */


    dontObserve(name, callback) {
      if (Array.isArray(name)) {
        name.forEach(optionName => this.dontObserve(optionName, callback));
        return;
      }

      const nested = this._isNested(name);

      if (nested) {
        nested.options.dontObserve(nested.name, callback);
        return;
      }

      const observers = this._observers[name];

      if (observers.length) {
        observers.splice(observers.indexOf(callback), 1);
      }
    }
    /**
     * Stops observers
     */


    internalChange() {
      this._internalChange = true;
    }
    /**
     * Starts observers
     */


    endInternalChange() {
      this._internalChange = false;
    }
    /**
     * Gets aliases of given option
     * @param  {String} option Option name
     */


    aliasesOf(option) {
      return Object.keys(this._aliases).filter(alias => this._aliases[alias] === option);
    }
    /**
     * Resets the option value to its default
     * @param  {Name} name Option name
     * @param  {Boolean} internal  Whether call observers or not
     */


    reset(name, internal) {
      if (name === '*') {
        Object.keys(this._options).forEach(optionName => this.reset(optionName, internal));
        return;
      }

      this._internalChange = internal;

      const nested = this._isNested(name);

      if (nested) {
        nested.options.reset(nested.name, internal);
        return;
      }

      const value = this._options[name];

      if (value !== undefined) {
        if (value instanceof Observable) {
          value.reset('*', internal);
        } else {
          this.set(name, this._defaults[name]);
        }
      }

      this._internalChange = false;
    }
    /**
     * Returns all options as an object
     */


    toObject() {
      const obj = {};
      Object.keys(_objectSpread2(_objectSpread2({}, this._defaults), this._options)).forEach(name => {
        if (this._options[name] instanceof Observable) {
          obj[name] = this._options[name].toObject();
        } else {
          obj[name] = this.get(name);
        }
      });
      return obj;
    }
    /**
     * Get a list of all option and their info
     */


    list() {
      const list = [];
      Object.keys(_objectSpread2(_objectSpread2({}, this._defaults), this._options)).forEach(name => {
        if (this._options[name] instanceof Observable) {
          list.push({
            name,
            value: this._options[name].list()
          });
        } else {
          list.push({
            name,
            value: this._options[name],
            default: this._defaults[name],
            aliases: this.aliasesOf(name).toString(),
            observers: this._observers[name]
          });
        }
      });
      return list;
    }
    /**
     * Checks the waiting list for new option
     * @private
     */


    _checkWaitingList(name) {
      if (this._waitings[name] !== undefined) {
        this.set(name, this._waitings[name], true);
        this._waitings[name] = undefined;
      }
    }
    /**
     * Checks whether name is nested or not
     * @param {String} name Option name
     * @private
     */


    _isNested(name) {
      const dotIndex = name.indexOf('.');

      if (dotIndex !== -1) {
        const optionVal = this.get(name.slice(0, dotIndex));
        return optionVal instanceof Observable ? {
          name: name.slice(dotIndex + 1),
          options: optionVal
        } : false;
      }

      return false;
    }

  }

  /**
   * An abstract class defines a single interface to navigate in view
   * Do not make direct instance from this class
   */

  class Navigator extends Emitter {
    /**
     * Constructs new Navigator
     * @param {MSScrollView} view
     * @param {Object} options Navigator options
     */
    constructor(view, options) {
      super();
      this.view = view;
      this.options = new Observable();
      this.options.register({
        animate: true,
        duration: 1,
        paginate: false,
        easing: undefined,
        start: 0,
        checkLoop: true
      });
      this.options.inject(options);
      this.currentIndex = 0;
      this.targetIndex = 0;
      this.count = -1;
      this.currentSectionIndex = 0;
      this.targetSectionIndex = 0;
      this.currentSectionIndexes = [];
      this.targetSectionIndexes = []; // this.view.on('sectionAdd', this.updateCurrentPosition, this);
      // this.view.on('sectionRemove', this.updateCurrentPosition, this);
      // changes to start index

      if (this.options.get('start')) {
        this.goToIndex(this.options.get('start'), {
          animate: false
        }, true);
      }
    }
    /**
     * Navigates to the next section
     * @param {Object} params Navigation params, it overrides default options
     */


    next(params) {
      params = _objectSpread2(_objectSpread2({}, this.options.toObject()), params);

      if (this.targetIndex + 1 >= this.count) {
        if (params.checkLoop && this.view.options.get('loop')) {
          this.goToIndex(0, params);
        } else {
          this.trigger('nextBlock');
        }
      } else {
        this.goToIndex(this.targetIndex + 1, params);
      }
    }
    /**
     * Navigates to the previous section
     * @param {Object} params Navigation params, it overrides default options
     */


    previous(params) {
      params = _objectSpread2(_objectSpread2({}, this.options.toObject()), params);

      if (this.targetIndex - 1 < 0) {
        if (params.checkLoop && this.view.options.get('loop')) {
          this.goToIndex(this.count - 1, params);
        } else {
          this.trigger('previousBlock');
        }
      } else {
        this.goToIndex(this.targetIndex - 1, params);
      }
    }
    /**
     * Navigates to the given index
     * @param {Number} index Target index
     * @param {Object} params Navigation params, it overrides default options
     * @param {Boolean} force Whether skip index change check or not
     */


    goToIndex(index, params, force) {}
    /**
     * Updates the navigator manually
     */


    update() {
      this.updateTargetIndex(this.view.index);
      this.updateCurrentIndex();
    }
    /**
     * Checks whether index is in correct range
     * @param {Number} index
     * @param {Boolean} normalize Whether return in range index or not
     */


    checkIndex(index, normalize = true) {
      if (this.count === -1) {
        this.updateCount();
      }

      if (normalize) {
        return Math.max(0, Math.min(index, this.count - 1));
      }

      return index >= 0 && index < this.count;
    }
    /**
     * Calculates total page or section number
     */


    updateCount() {}
    /**
     * Updates target index
     * @param {Number} index Target index
     */


    updateTargetIndex(index) {
      [this.targetSectionIndex] = this.targetSectionIndexes;

      if (this.targetIndex !== index) {
        this.targetIndex = index;
        this.trigger('changeStart', [this.targetIndex]);
        this.trigger('targetIndexChange', [this.targetIndex]);
      }
    }
    /**
     * Updates current index
     */


    updateCurrentIndex() {
      this.currentSectionIndex = this.view.index;
      this.currentSectionIndexes = this.view.indexes;

      if (this.targetIndex !== this.currentIndex) {
        this.currentIndex = this.targetIndex;
        this.trigger('changeEnd', [this.currentIndex]);
        this.trigger('currentIndexChange', [this.currentIndex]);
      }
    }
    /**
     * Updates current position whenever a section adds to or removes from the view
     */
    // updateCurrentPosition() {
    //    let index = this.targetIndex;
    //    if (index >= this.view.count) {
    //       index = this.view.count - 1;
    //    }
    //    this.goToIndex(index, { animate: false }, true);
    // }


  }

  /*!
   * Copyright 2018 Averta
   * Friction and Spring classes are implemented based on Ralph Thomas's physics modules
   *
   * -------------------------------------------------------------------------
   * Copyright 2014 Ralph Thomas
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Friction {
    constructor(drag) {
      this._drag = drag;
      this._dragLog = Math.log(drag);
      this._x = 0;
      this._v = 0;
      this._startTime = 0;
    }

    set(x, v) {
      this._x = x;
      this._v = v;
      this._startTime = Date.now();
    }

    x(dt) {
      if (dt === undefined) {
        dt = (Date.now() - this._startTime) / 1000;
      }

      return this._x + this._v * this._drag ** dt / this._dragLog - this._v / this._dragLog;
    }

    dx() {
      const dt = (Date.now() - this._startTime) / 1000;
      return this._v * this._drag ** dt;
    }

    done() {
      return Math.abs(this.dx()) < 1;
    }

  }
  const epsilon = 0.001;

  function almostEqual(a, b, e) {
    return a > b - e && a < b + e;
  }

  function almostZero(a, e) {
    return almostEqual(a, 0, e);
  }
  /** *
   * Simple Spring implementation -- this implements a damped spring using a symbolic integration
   * of Hooke's law: F = -kx - cv. This solution is significantly more performant and less code than
   * a numerical approach such as Facebook Rebound which uses RK4.
   *
   * This physics textbook explains the model:
   *  http://www.stewartcalculus.com/data/CALCULUS%20Concepts%20and%20Contexts/upfiles/3c3-AppsOf2ndOrders_Stu.pdf
   *
   * A critically damped spring has: damping*damping - 4 * mass * springConstant === 0. If it's greater than zero
   * then the spring is overdamped, if it's less than zero then it's underdamped.
   */


  class Spring {
    constructor(mass, springConstant, damping) {
      this._m = mass;
      this._k = springConstant;
      this._c = damping;
      this._solution = null;
      this._endPosition = 0;
      this._startTime = 0;
    }

    _solve(initial, velocity) {
      const c = this._c;
      const m = this._m;
      const k = this._k; // Solve the quadratic equation; root = (-c +/- sqrt(c^2 - 4mk)) / 2m.

      const cmk = c * c - 4 * m * k;

      if (cmk === 0) {
        // The spring is critically damped.
        // x = (c1 + c2*t) * e ^(-c/2m)*t
        const r = -c / (2 * m);
        const c1 = initial;
        const c2 = velocity / (r * initial);
        return {
          x(t) {
            return (c1 + c2 * t) * Math.E ** (r * t);
          },

          dx(t) {
            const pow = Math.E ** (r * t);
            return r * (c1 + c2 * t) * pow + c2 * pow;
          }

        };
      }

      if (cmk > 0) {
        // The spring is overdamped; no bounces.
        // x = c1*e^(r1*t) + c2*e^(r2t)
        // Need to find r1 and r2, the roots, then solve c1 and c2.
        const r1 = (-c - Math.sqrt(cmk)) / (2 * m);
        const r2 = (-c + Math.sqrt(cmk)) / (2 * m);
        const c2 = (velocity - r1 * initial) / (r2 - r1);
        const c1 = initial - c2;
        return {
          x(t) {
            return c1 * Math.E ** (r1 * t) + c2 * Math.E ** (r2 * t);
          },

          dx(t) {
            return c1 * r1 * Math.E ** (r1 * t) + c2 * r2 * Math.E ** (r2 * t);
          }

        };
      } // The spring is underdamped, it has imaginary roots.
      // r = -(c / 2*m) +- w*i
      // w = sqrt(4mk - c^2) / 2m
      // x = (e^-(c/2m)t) * (c1 * cos(wt) + c2 * sin(wt))


      const w = Math.sqrt(4 * m * k - c * c) / (2 * m);
      const r = -(c / 2 * m);
      const c1 = initial;
      const c2 = (velocity - r * initial) / w;
      return {
        x(t) {
          return Math.E ** (r * t) * (c1 * Math.cos(w * t) + c2 * Math.sin(w * t));
        },

        dx(t) {
          const power = Math.E ** (r * t);
          const cos = Math.cos(w * t);
          const sin = Math.sin(w * t);
          return power * (c2 * w * cos - c1 * w * sin) + r * power * (c2 * sin + c1 * cos);
        }

      };
    }

    x(dt) {
      if (dt === undefined) dt = (Date.now() - this._startTime) / 1000.0;
      return this._solution ? this._endPosition + this._solution.x(dt) : 0;
    }

    dx(dt) {
      if (dt === undefined) dt = (Date.now() - this._startTime) / 1000.0;
      return this._solution ? this._solution.dx(dt) : 0;
    }

    setEnd(x, velocity, t) {
      if (!t) t = Date.now();
      if (x === this._endPosition && almostZero(velocity, epsilon)) return;
      velocity = velocity || 0;
      let position = this._endPosition;

      if (this._solution) {
        // Don't whack incoming velocity.
        if (almostZero(velocity, epsilon)) velocity = this._solution.dx((t - this._startTime) / 1000.0);
        position = this._solution.x((t - this._startTime) / 1000.0);
        if (almostZero(velocity, epsilon)) velocity = 0;
        if (almostZero(position, epsilon)) position = 0;
        position += this._endPosition;
      }

      if (this._solution && almostZero(position - x, epsilon) && almostZero(velocity, epsilon)) {
        return;
      }

      this._endPosition = x;
      this._solution = this._solve(position - this._endPosition, velocity);
      this._startTime = t;
    }

    snap(x) {
      this._startTime = Date.now();
      this._endPosition = x;
      this._solution = {
        x() {
          return 0;
        },

        dx() {
          return 0;
        }

      };
    }

    done(t) {
      return almostEqual(this.x(), this._endPosition, epsilon) && almostZero(this.dx(), epsilon);
    }

    springConstant() {
      return this._k;
    }

    damping() {
      return this._c;
    }

  }

  /* eslint-disable import/prefer-default-export */
  class FrictionMotion {
    constructor(drag) {
      this._drag = drag;
      this._x = 0;
      this._startTime = 0;
    }

    set(x, end) {
      this._x = x;
      this._end = end;
    }

    x(dt) {
      if (dt) {
        return this._end;
      }

      this._x += (this._end - this._x) * this._drag;
      return this._x;
    }

    dx() {
      return this._x - this._end;
    }

    done() {
      return Math.abs(this.dx()) < 1;
    }

  }

  /**
   * This class is useful for creating interactive and interruptive UI animations
   * It animates the position value by adding friction to value changes over time.
   * Moreover, this class supports constraints which are useful to constraint
   * position changes at specific value ranges
   *
   * @author Averta [averta.net]
   */

  class Slicker extends Emitter {
    /**
     * Creates new Slicker instance
     * @param {Number} friction Specifies the friction of value changes
     */
    constructor(friction = 0.01) {
      super();
      this._position = 0;
      this.animating = false;
      this._constraints = [];
      this._friction = new Friction(friction);
      this._frictionVal = friction;
      this.startPosition = null;
      this._tickerId = null;
      this._tick = this._tick.bind(this);
      this.eventPrefix = 'slicker';
    }
    /**
     * Gets the friction value
     */


    get friction() {
      return this._frictionVal;
    }
    /**
     * Sets the friction value
     */


    set friction(value) {
      if (value !== this._frictionVal) {
        this._friction = new Friction(value);
        this._frictionVal = value;
      }
    }
    /**
     * Gets the current position value
     */


    get position() {
      return this._position;
    }
    /**
     * Sets the position value
     */


    set position(value) {
      if (value === this._position) {
        return;
      }

      if (this.startPosition === null) {
        this.startPosition = value;
      }

      this._currentConstraint = this.findConstraint(value);

      this._updatePosition(value);
    }

    moveToPosition(position, friction = 0.5) {
      if (this._position === position) {
        return;
      }

      if (this.startPosition === null) {
        this.startPosition = position;
      }

      this._velocity = NaN;
      this._activeMotion = new FrictionMotion(friction);

      this._activeMotion.set(this._position, position);

      this._startAnimation();
    }
    /**
     * Gets current velocity
     */


    get velocity() {
      if (this._activeMotion) {
        return this._activeMotion.dx();
      }

      return 0;
    }
    /**
     * Sets new velocity
     */


    set velocity(value) {
      if (this._velocity === value) {
        return;
      }

      this._velocity = value;

      this._friction.set(this._position, this._velocity);

      this._activeMotion = this._friction;

      const endPosition = this._friction.x(120);

      this._targetConstraint = this.findConstraint(endPosition) || null;

      if (this._targetConstraint) {
        this._currentConstraint = null;

        this._animToConstraint(this._targetConstraint, this._position, endPosition, this._velocity);

        this.startPosition = null;
        return;
      }

      this._startAnimation();

      this.trigger('push', [this._velocity], true);
    }
    /**
     * Stops the animation
     */


    stop() {
      this.startPosition = this._position;
      this.animating = false;

      this._tick();

      this.trigger('motionInterrupt', null, true);
    }
    /**
     * Animates to constraint if any found at current position
     */


    release(fast) {
      if (this._currentConstraint) {
        if (fast) {
          this._goToConstraint(this._currentConstraint, this._position, null, this._velocity);
        } else {
          this._animToConstraint(this._currentConstraint, this._position, null, this._velocity);

          this.trigger('motionToConstraint', null, true);
        }
      }
    }
    /**
     * Adds new constraint
     * @param {Constraint} constraint
     */


    addConstraint(constraint) {
      constraint.slicker = this;

      this._constraints.push(constraint);
    }
    /**
     * Removes given constraint
     * @param {Constraint} constraint
     */


    removeConstraint(constraint) {
      const index = this._constraints.indexOf(constraint);

      if (index === -1) {
        return;
      }

      this._constraints = this._constraints.splice(index, 1);
    }

    removeConstraints() {
      this._currentConstraint = null;
      this._constraints = [];
    }
    /**
     * Returns all active constrains at given position
     * @param {Number} position
     */


    findConstraint(position) {
      if (!this._constraints.length) {
        return false;
      }

      const violations = this._constraints.filter(constraint => constraint.isActive(this._position, position, this.velocity));

      if (!violations.length) {
        return false;
      }

      return violations.sort((a, b) => {
        const bp = b.getPriority(this._position, position, this.velocity);
        const ap = a.getPriority(this._position, position, this.velocity);

        if (bp === 'important') {
          return 1;
        }

        if (ap === 'important') {
          return -1;
        }

        return b.priority - a.priority;
      })[0];
    }
    /**
     * Updates position
     * @private
     * @param {Number} value
     */


    _updatePosition(value) {
      const delta = value - this._position;
      this._position = value;

      if (this._currentConstraint) {
        this._position -= (1 - this._currentConstraint.activeFactor) * delta;
      }

      this.trigger('positionChange', [this._position], true);
    }
    /**
     * Starts the animation
     */


    _startAnimation() {
      if (this.animating) {
        return;
      }

      this.animating = true;
      this.trigger('animationStart', null, true);

      if (this._activeMotion !== this._friction) {
        this.trigger('constraintAnimationStart', null, true);
      }

      const endPos = Math.round(this._activeMotion.x(120) * 100) / 100;

      if (this.endPosition !== endPos) {
        this.trigger('endPositionChange', [endPos], true);
      }

      this._tick();
    }
    /**
     * The animation ticker function
     */


    _tick() {
      if (this.animating) {
        if (this._activeMotion.done()) {
          this.animating = false;

          this._updatePosition(Math.round(this._position * 100) / 100);

          this._tick();

          this.trigger('animationEnd', null, true);

          if (this._activeMotion !== this._friction) {
            this.trigger('constraintAnimationEnd', null, true);
          }

          return;
        }

        this._updatePosition(this._activeMotion.x());

        this._tickerId = requestAnimationFrame(this._tick);
      } else {
        cancelAnimationFrame(this._tickerId);
        this._velocity = 0;
        this._targetConstraint = null;
        this._currentConstraint = this.findConstraint(this._position);
      }
    }
    /**
     * Animates to constraint
     * @param {Constraint} constraint
     * @param {Number} position
     * @param {Number} endPosition
     * @param {Number} velocity
     */


    _animToConstraint(constraint, position, endPosition, velocity) {
      constraint.set(this.startPosition, position, endPosition, velocity);
      this._activeMotion = constraint.motion;

      this._startAnimation();
    }
    /**
     * Instantly changes to constraint
     * @param {Constraint} constraint
     * @param {Number} position
     * @param {Number} endPosition
     * @param {Number} velocity
     */


    _goToConstraint(constraint, position, endPosition, velocity) {
      constraint.set(this.startPosition, position, endPosition, velocity);
      const endPos = Math.round(constraint.motion.x(120) * 100) / 100;
      this.trigger('endPositionChange', [endPos], true);
      this.position = endPos;
      this.trigger('animationEnd', null, true);
    }

  }

  /**
   * This class creates a constraint that checks the value by specifies operator
   */

  class OperatorConstraint {
    /**
     * Creates new operator constraint instance
     * @param {String} operator Operator
     * @param {Number} value Active position value
     * @param {Object} options Constraint options including spring parameters
     */
    constructor(operator, value, options = {}) {
      this.value = value;
      this.operator = operator;
      this.activeFactor = 0.5;
      this.priority = 10;
      options = _objectSpread2({
        mass: 1,
        constant: 90,
        damping: 20,
        criticalDamping: false
      }, options);

      if (options.criticalDamping) {
        options.damping = Math.sqrt(4 * options.mass * options.constant);
      }

      this.spring = new Spring(options.mass, options.constant, options.damping);
    }
    /**
     * Gets the spring object
     */


    get motion() {
      return this.spring;
    }
    /**
     * Checks whether this constraint is active or not
     * @param {Number} position
     */


    isActive(position, endPosition) {
      switch (this.operator) {
        case '<=':
          return endPosition <= this.value;

        case '>=':
          return endPosition >= this.value;

        case '<':
          return endPosition < this.value;

        case '>':
        default:
          return endPosition > this.value;
      }
    }
    /**
     * Sets values to spring
     * @param {Number} startPosition
     * @param {Number} position
     * @param {Number} endPosition
     * @param {Number} velocity
     */


    set(startPosition, position, endPosition, velocity) {
      this.spring.snap(position);
      this.spring.setEnd(this.value, velocity);
    }

    getPriority() {
      return this.priority;
    }

  }

  /**
   * This class creates snapping constraint on slicker
   * When slicker moves inside snapping area it snaps to the closest point.
   * It also supports looped snapping area.
   */

  class SnappingConstraint {
    /**
     * New snapping constraint instance
     * @param {Array} points A 2D array containing snap points and their size [snap point, snap size]
     * @param {Object} options Snapping constraint options
     */
    constructor(points = [], options = {}) {
      this.activeFactor = 1;
      this.priority = 20;
      this.points = points;
      this._activeRange = null;
      this.options = _objectSpread2({
        mass: 1,
        constant: 90,
        damping: 20,
        criticalDamping: false,
        paginate: true,
        loop: false
      }, options);
      options = _objectSpread2({}, options);

      if (options.criticalDamping) {
        options.damping = Math.sqrt(4 * options.mass * options.constant);
      }

      this.spring = new Spring(options.mass, options.constant, options.damping);
    }
    /**
     * Gets the active range
     */


    get activeRange() {
      return this._activeRange;
    }
    /**
     * Sets the active range
     */


    set activeRange(value) {
      this._activeRange = value;
      this.length = value[1] - value[0];
    }
    /**
     * Gets the spring object
     */


    get motion() {
      return this.spring;
    }
    /**
     * Finds the closest snap point to the given position
     * @param {Number} position
     */


    findPoint(position) {
      position = this.normalizePosition(position);
      let index = -1;
      this.points.some((point, i) => {
        index = i;

        if (i !== this.points.length - 1) {
          return Math.abs(position - this.points[i + 1][0]) > Math.abs(position - point[0]);
        }

        return true;
      });

      if (this.options.loop && index === this.points.length - 1) {
        return Math.abs(position - this.activeRange[1]) > Math.abs(position - this.points[index][0]) ? index : 'end';
      }

      return index;
    }
    /**
     * Recalculates the value base on length and moves it to the valid range
     * @param {Number} value Scroll position
     */


    normalizePosition(value) {
      if (this.options.loop) {
        value %= this.length || 1;

        if (value < 0) {
          value += this.length;
        }
      } else {
        value = Math.max(0, Math.min(value, this.length));
      }

      return value;
    }
    /**
     * Whether this constraint is active or not by considering the current position and end position of motion
     * @param {Number} position
     * @param {Number} endPosition
     */


    isActive(position, endPosition) {
      if (!this.activeRange) {
        return false;
      }

      if (this.options.loop) {
        return true;
      }

      return Math.max(position, endPosition) > this._activeRange[0] && Math.min(position, endPosition) < this._activeRange[1];
    }
    /**
     * Returns the priority of this constraint
     */


    getPriority() {
      return this.priority;
    }
    /**
     * Sets the constraint motion params
     * @param {Number} startPosition
     * @param {Number} position
     * @param {Number} endPosition
     * @param {Number} velocity
     */


    set(startPosition, position, endPosition, velocity) {
      let cycles = 0;

      if (endPosition === null) {
        endPosition = position;
      }

      if (this.options.paginate && velocity !== 0) {
        let pointIndex = this.findPoint(startPosition);

        if (!this.options.loop) {
          startPosition = this.normalizePosition(startPosition);
        } else {
          cycles = Math.floor(startPosition / this.length);

          if (pointIndex === 'end') {
            pointIndex = 0;
            cycles += 1;
          }
        }

        const point = this.points[pointIndex];

        if (velocity > 0) {
          endPosition = cycles * this.length + point[0] + point[1];
        } else if (velocity < 0) {
          let prevPointIndex = pointIndex - 1;

          if (prevPointIndex === -1) {
            prevPointIndex = this.points.length - 1;
          }

          endPosition = cycles * this.length + point[0] - this.points[prevPointIndex][1];
        }

        if (!this.options.loop) {
          endPosition = this.normalizePosition(endPosition);
        }
      } else {
        let targetPoint = this.findPoint(endPosition);

        if (this.options.loop) {
          cycles = Math.floor(endPosition / this.length);

          if (targetPoint === 'end') {
            targetPoint = 0;
            cycles += 1;
          }
        } else {
          endPosition = this.normalizePosition(endPosition);
        }

        endPosition = cycles * this.length + this.points[targetPoint][0];
      }

      this.spring.snap(position);
      this.spring.setEnd(endPosition, velocity);
    }

  }

  /**
   * This class creates an interface to navigate trough section in a scroll view
   */

  class ScrollNavigator extends Navigator {
    /**
     * Constructs new ScrollNavigator
     * @param {MSScrollView} view
     * @param {Object} options Navigator options
     */
    constructor(view, options = {}) {
      super(view, options);
      this.options.register({
        direction: 'auto',
        slicker: true,
        slickerFriction: 0.01,
        slickType: 'slide',
        // scroll, snap, slide
        updateIndexOnDrag: 'auto',
        boundariesSpring: {
          mass: 1,
          constant: 90,
          damping: 20,
          criticalDamping: false
        },
        snappingSpring: {
          mass: 1,
          constant: 90,
          damping: 20,
          criticalDamping: true
        }
      });
      this.options.inject(options);
      this.updateTargetIndex = this.updateTargetIndex.bind(this);
      this.updateCurrentIndex = this.updateCurrentIndex.bind(this);
      this.updateCount = this.updateCount.bind(this);
      this.view.on('arrange', this.updateCount, this);
      this.options.observe('paginate', this.updateCount);
      this.updateCount();
      this.setupSlicker();
    }

    setupSlicker() {
      if (!this.options.get('slicker')) {
        return;
      }

      this.updateSlicker = this.updateSlicker.bind(this);
      this.slicker = new Slicker();
      this.slicker.on('positionChange', this._onSlickerUpdate, this);
      this.slicker.on('endPositionChange', this._updateIndexBySlicker, this);
      this.slicker.on('animationEnd', this.updateCurrentIndex, this);
      this.slicker.on('push', () => this.trigger('externalEffect'));
      this.slicker.on('motionInterrupt', () => this.trigger('externalEffect')); // update slicker on option changes or on view sections update

      this.options.observe(['slickType', 'boundariesSpring', 'snappingSpring', 'paginate'], this.updateSlicker);
      this.options.observe('slickerFriction', (name, value) => {
        this.slicker.friction = value;
      });
      this.view.options.observe('loop', this.updateSlicker);
      this.view.on('resize, sectionAdd, sectionRemove, lengthChange', this.updateSlicker);
      this.view.on('scrollToAnimationEnd', this.updateCurrentIndex, this);
      this.updateSlicker();
    }
    /**
     * Navigates to the next section
     * @param {Object} params Navigation params, it overrides default options
     */


    next(params) {
      super.next(_objectSpread2({
        direction: 'forward'
      }, params));
    }
    /**
     * Navigates to the previous section
     * @param {Object} params Navigation params, it overrides default options
     */


    previous(params) {
      super.previous(_objectSpread2({
        direction: 'backward'
      }, params));
    }
    /**
     * Drags the slicker by given value
     * @param {Number} value
     */


    drag(value) {
      this.view.killScrollAnimation();

      if (this.slicker) {
        this.slicker.position += value;

        if (this._updateIndexesOnDrag) {
          this._updateIndexBySlicker(null, this.slicker.position);

          this.updateCurrentIndex();
        }
      }
    }
    /**
     * Adds velocity slicker
     * @param {Number} velocity
     */


    push(velocity) {
      this.view.killScrollAnimation();

      if (this.slicker) {
        this.slicker.velocity = velocity;
      }
    }
    /**
     * Releases the slicer, it checks and moves to the related constraint if available
     */


    release(fast) {
      this.view.killScrollAnimation();

      if (this.slicker) {
        this.slicker.position = this.view.position;
        this.slicker.release(fast);
      }
    }
    /**
     * Holds the slicker animation
     */


    hold() {
      this.view.killScrollAnimation();

      if (this.slicker) {
        this.slicker.stop();
      }
    }
    /**
     * Navigates to the given index
     * @param {Number} index Target index
     * @param {Object} params Navigation params, it overrides default options
     * @param {Boolean} force Whether skip index change check or not
     */


    goToIndex(index, params, force = false) {
      index = this.checkIndex(index);

      if (!force && index === this.targetIndex) {
        return;
      }

      params = _objectSpread2(_objectSpread2({}, this.options.get(['animate', 'direction', 'duration', 'paginate', 'easing'])), params);
      const animParams = {};

      if (params.easing) {
        animParams.easing = params.easing;
      }

      const position = this.options.get('paginate') ? index * this.view.size : this.view.sections[index].position;
      this.updateTargetIndex(index, position);
      this.view.scrollTo(position, params.animate, params.duration, params.direction, animParams);

      if (!params.animate) {
        this.updateCurrentIndex();
      }
    }

    goToPosition(position, params) {
      const index = this.checkIndex(this.view.getIndexAtPosition(position));
      params = _objectSpread2(_objectSpread2({}, this.options.get(['animate', 'direction', 'duration', 'paginate', 'ease'])), params);
      const animParams = {};

      if (params.ease) {
        animParams.ease = params.ease;
      }

      this.updateTargetIndex(index, position);

      if (params.useFriction) {
        this.slicker.position = this.view.normalizePositionByDirection(this.view.position);
        this.slicker.moveToPosition(this.view.normalizePositionByDirection(position), params.friction);
        return;
      }

      this.view.scrollTo(position, params.animate, params.duration, params.direction, animParams);

      if (!params.animate) {
        this.updateCurrentIndex();
      }
    }
    /**
     * Updates the navigator manually
     */


    update() {
      this.updateSlicker();
      this.updateTargetIndex(this.view.index, this.slicker.position);
      this.updateCurrentIndex();
    }
    /**
     * Updates target index
     * @param {Number} index Target index
     * @param {Number} position Current scroll view position
     */


    updateTargetIndex(index, position) {
      this.targetSectionIndexes = this.view.getIndexesAtPosition(position);
      super.updateTargetIndex(index);
    }
    /**
     * Updates current index
     */


    updateCurrentIndex() {
      if (this.slicker) {
        this.slicker.position = this.view.position;
      }

      super.updateCurrentIndex();
    }
    /**
     * Calculates total page or section number
     */


    updateCount() {
      const count = this.options.get('paginate') ? Math.ceil(this.view.length / this.view.size) : this.view.count;

      if (count !== this.count) {
        this.count = count;
        this.trigger('countChange', [this.count]);
      }
    }
    /**
     * Updates slicker based on options
     */


    updateSlicker() {
      const params = this.options.get(['slickType', 'slickerFriction', 'boundariesSpring', 'snappingSpring', 'paginate', 'updateIndexOnDrag']);
      const loop = this.view.options.get('loop'); // removes already added constraints

      this.slicker.stop();
      this.slicker.removeConstraints(); // update friction

      this.slicker.friction = params.slickerFriction; // update on drag

      this._updateIndexesOnDrag = params.updateIndexOnDrag;

      if (this._updateIndexesOnDrag === 'auto') {
        this._updateIndexesOnDrag = params.slickType === 'scroll';
      } // define snapping constraint


      if (params.slickType !== 'scroll') {
        let points = [];
        let activeRange;

        if (params.paginate) {
          activeRange = [0, this.count * this.view.size];

          for (let i = 0; i !== this.count; i += 1) {
            points.push([i * this.view.size, this.view.size]);
          }
        } else if (loop) {
          activeRange = [0, this.view.length];
          points = this.view.sections.map(section => [section.position, section.size]);
        } else {
          activeRange = [0, this.view.length - this.view.size];
          this.view.sections.some(section => {
            if (section.position < this.view.length - this.view.size) {
              points.push([section.position, section.size]);
              return false;
            }

            points.push([this.view.length - this.view.size, this.view.size]);
            return true;
          });
        }

        const snappingParams = _objectSpread2({
          loop,
          paginate: params.slickType === 'slide'
        }, params.snappingSpring.toObject());

        const snappingConstraint = new SnappingConstraint(points, snappingParams);
        snappingConstraint.activeRange = activeRange;
        this.slicker.addConstraint(snappingConstraint);
      }

      if (!loop) {
        const boundariesSpring = params.boundariesSpring.toObject();
        const startConstraint = new OperatorConstraint('<', 0, boundariesSpring);
        const endPoint = params.paginate ? (this.count - 1) * this.view.size : this.view.length - this.view.size;
        const endConstraint = new OperatorConstraint('>', endPoint, boundariesSpring);
        this.slicker.addConstraint(startConstraint);
        this.slicker.addConstraint(endConstraint);
      }

      this.release(true);
    }
    /**
     * On slicker position change listener
     * @private
     */


    _onSlickerUpdate() {
      // update view position
      this.view.position = this.slicker.position;
    }
    /**
     * Updates the target index when end position changes in slicker
     * @private
     * @param {String} name Action name
     * @param {Number} value Target position value
     */


    _updateIndexBySlicker(name, value) {
      let targetIndex;

      if (this.options.get('paginate')) {
        targetIndex = Math.ceil(Math.round(value / this.view.size)) % this.count;
      } else {
        targetIndex = this.view.getIndexAtPosition(value);
      }

      this.updateTargetIndex(targetIndex, value);
    }

  }

  const viewClasses = {};
  const addonClasses = {};
  const controlClasses = {};
  /**
   * Composer class is responsible to gather all required parts and setups them in correct order.
   */

  class Composer extends Emitter {
    /**
     * Registers new view to the composer
     * @param {String} name View name
     * @param {Class} viewClass View class
     */
    static registerView(name, viewClass) {
      if (has$1.call(viewClasses, name)) {
        throw new Error(`${name} is already registered.`);
      } else {
        viewClasses[name] = viewClass;
      }
    }
    /**
     * Registers new addon to the composer
     * @param {String} name Addon name
     * @param {Class} addonClass Addon class
     */


    static registerAddon(name, addonClass) {
      if (has$1.call(addonClasses, name)) {
        throw new Error(`${name} is already registered.`);
      } else {
        addonClasses[name] = addonClass;
      }
    }
    /**
     * Registers new control to the composer
     * @param {String} name Control name
     * @param {Class} controlClass Control class
     */


    static registerControl(name, controlClass) {
      if (has$1.call(controlClasses, name)) {
        throw new Error(`${name} is already registered.`);
      } else {
        controlClasses[name] = controlClass;
      }
    }
    /**
     * List of all registered views classes
     */


    static get views() {
      return viewClasses;
    }
    /**
     * List of all registered addons classes
     */


    static get addons() {
      return addonClasses;
    }
    /**
     * List of all registered controls classes
     */


    static get controls() {
      return controlClasses;
    }
    /**
     * Setups the composer
     * @param {String|Element} element The composer main element or single selector
     * @param {Object} options Composer options
     */


    setup(element, options = {}) {
      this.element = element;
      this.element.classList.add(`${prefix}-content-composer`);
      this.options = new Observable();
      this.options.register({
        sectionSelector: `.${prefix}-section`,
        excludeAddons: [],
        navigator: {},
        viewOptions: {},
        view: 'basic',
        sectionFit: 'cover'
      });
      this.trigger('beforeOptions', [options]);
      this.options.inject(options);
      this.initTrigger = new ActionTrigger(this._init.bind(this));
      this.readyTrigger = new ActionTrigger(this._ready.bind(this));
      this.element.classList.add(`${prefix}-on-setup`);

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this._domReady.bind(this));
      } else {
        this._domReady();
      }
    }
    /**
     * Finds the composer element and setups addons after dom ready
     * @private
     */


    _domReady() {
      this.trigger('beforeDomReady');
      const {
        element
      } = this; // find element

      if (typeof element === 'object' && element.nodeName) {
        this.element = element;
      } else if (typeof element === 'string') {
        this.element = document.querySelector(element);
      }

      if (!this.element) {
        return;
      }

      this._domReady = true;
      this.trigger('domReady', [this.element]);

      this._setupAddons();

      this.element.classList.remove(`${prefix}-on-setup`);
      this.element.classList.add(`${prefix}-dom-ready`);
      this.initTrigger.exec();
    }
    /**
     * Setups view, layout controller and sections
     * @private
     */


    _init() {
      this.trigger('beforeInit');

      this._setupView();

      this._setupLayout();

      this._setupNavigator();

      this._setupSections();

      this.trigger('init');
      this.element.classList.add(`${prefix}-init`);
      this.readyTrigger.exec();
    }
    /**
     * Adds ready class name to the composer element
     * @private
     */


    _ready() {
      this.element.classList.add(`${prefix}-ready`);
    }
    /**
     * Setups all registered addons except those are excluded by options
     * @private
     */


    _setupAddons() {
      this.addons = {};
      const excludes = this.options.get('excludeAddons');
      this.trigger('beforeSetupAddons');
      Object.keys(addonClasses).forEach(addonName => {
        if (excludes.indexOf(addonName) === -1) {
          this.addons[addonName] = new addonClasses[addonName](this);
        }
      });
      this.trigger('afterSetupAddons');
    }
    /**
     * Setups the view
     * @private
     */


    _setupView() {
      this.trigger('beforeViewSetup');
      const ViewClass = viewClasses[this.options.get('view')];
      this.view = new ViewClass();
      this.options.chain('viewOptions', this.view.options);
      this.view.parentEmitter = this;
      this.view.appendTo(this.element);
      this.trigger('viewSetup', [this.view]);
    }
    /**
     * Setups layout controller
     * @private
     */


    _setupLayout() {
      this.trigger('beforeLayoutSetup');
      this.layoutController = new LayoutController(this, this.view, this.options);
      this.layoutController.parentEmitter = this;
      this.trigger('layoutSetup', [this.layoutController]);
    }
    /**
     * Setups the navigator
     * @private
     */


    _setupNavigator() {
      this.trigger('beforeNavigatorSetup');

      if (this.view instanceof ScrollView) {
        // Scroll view setup
        this.hasScrollView = true;
        this.navigator = new ScrollNavigator(this.view);
        this.options.chain('navigator', this.navigator.options);
        this.navigator.parentEmitter = this;
      }

      this.trigger('navigatorSetup', [this.navigator]);
    }
    /**
     * Finds all section in markup and append them to the view
     * @private
     */


    _setupSections() {
      this.trigger('beforeSectionsSetup');
      const sectionSelector = this.options.get('sectionSelector');
      this.element.querySelectorAll(`:scope > ${sectionSelector}`).forEach(element => {
        const section = new Section(element, this);
        section.parentEmitter = this;
        this.view.appendSection(section, false);
      });

      if (this.view.sections.length) {
        this.view.update();
        this.navigator.update();
      }

      this.trigger('sectionsSetup');
    }

  }

  // Idea given from x-tag project
  // https://github.com/x-tag
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
  const dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
  const toJS = {
    moz: 'Moz',
    webkit: 'Webkit',
    o: 'O',
    ms: 'ms'
  };
  var CSSPrefix = {
    dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: toJS[pre]
  };

  /**
   * This view locates sections in a row vertically or horizontally
   */

  class PlaneView extends ScrollView {
    constructor() {
      super();
      this.options = new Observable();
      this.readOptions = this.readOptions.bind(this);
      this.options.observe(this.options.register({
        dir: 'h',
        reverse: false,
        space: 5,
        loop: false,
        instantActive: true
      }), this.readOptions);
      this.readOptions();
    }
    /**
     * Reads option values and updates view
     */


    readOptions() {
      const lastPositionProp = this._positionProp;
      const reverse = this.options.get('reverse');
      this._space = this.options.get('space');
      this._loop = this.options.get('loop');
      this._reverseFactor = reverse ? 1 : -1;
      this.activeEnteringSection = this.options.get('instantActive');

      if (this.options.get('dir') === 'h') {
        this._sizeProp = 'width';
        this._offsetProp = 'offsetWidth';
        this._positionProp = reverse ? 'right' : 'left';
        this._transformProp = 'X';
      } else {
        this._sizeProp = 'height';
        this._offsetProp = 'offsetHeight';
        this._transformProp = 'Y';
        this._positionProp = reverse ? 'bottom' : 'top';
      } // update sections space value and reset location


      this.sections.forEach(section => {
        if (!section.hasCustomSpace) {
          section.space = this._space;
        }

        section.element.style[lastPositionProp] = '';
        section.sizeReference = this._offsetProp;
      }); // update size value

      this._size = this[this._sizeProp];
      this.update();
    }
    /**
     * Reads element dimension values and updates the properties
     */


    resize() {
      const isResized = super.resize();

      if (isResized) {
        this.size = this[this._sizeProp];
      }

      return isResized;
    }
    /**
     * Updates sections offset and position values
     */


    update(arrange = true) {
      super.update(arrange);

      if (this._paintScheduled) {
        return;
      }

      this._paintScheduled = true;
      requestAnimationFrame(() => {
        this.sections.forEach(section => this.locateSection(section));
        this.sectionsContainer.style[`${CSSPrefix.js}Transform`] = 'translate' + this._transformProp + '(' + this._position * this._reverseFactor + 'px)';
        this._paintScheduled = false;
      });
    }
    /**
     * Locates the section in view element
     * @param {NSSection} section
     */


    locateSection(section) {
      section.element.style[this._positionProp] = `${section.offset}px`;
    }
    /**
     * Updates section properties
     * @private
     * @param {MSSection} section
     */


    _afterSectionAdd(section) {
      if (!section.customSpace) {
        section.space = this._space;
      }

      super._afterSectionAdd(section);
    }

  } // Register view in the composer

  Composer.registerView('basic', PlaneView);

  const defaultViewOptions = {
    transform: {
      translateX: [0, 0],
      translateY: [0, 0],
      translateZ: [0, 0],
      rotateX: [0, 0],
      rotateY: [0, 0],
      rotateZ: [0, 0],
      scale: [1, 1],
      skewX: [0, 0],
      skewY: [0, 0]
    },
    opacity: [1, 1],
    limitDistance: false,
    limitOpacity: false,
    ease: null
  };
  const transformUnits = {
    translateX: 'px',
    translateY: 'px',
    translateZ: 'px',
    rotateX: 'deg',
    rotateY: 'deg',
    rotateZ: 'deg',
    skewY: 'deg',
    skewX: 'deg'
  };

  const getSectionTransformStyles = (distance, transformOptions) => {
    const options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultViewOptions), transformOptions), {}, {
      transform: _objectSpread2(_objectSpread2({}, defaultViewOptions.transform), transformOptions.transform)
    });

    let absDistance = Math.abs(distance);
    let transformString = '';

    if (options.limitDistance) {
      absDistance = Math.min(absDistance, 1);
    }

    const d = distance < 0 ? 0 : 1;
    let opacity = 1;
    Object.entries(options.transform).forEach(([prop, value]) => {
      const unit = transformUnits[prop] || '';

      if (prop === 'scale') {
        if (value[d] !== 1) {
          const scaleNormalize = Math.abs(value[d] ** absDistance);
          transformString += 'scale(' + scaleNormalize + ') ';
        }
      } else if (value[d]) {
        transformString += prop + '(' + absDistance * value[d] + unit + ') ';
      }
    });

    if (options.opacity[d] < 1) {
      if (options.limitOpacity && absDistance > 1) {
        opacity = 0;
      } else {
        opacity = 1 - Math.min(absDistance, 1 - options.opacity[d]);
      }
    }

    return {
      opacity,
      transform: transformString
    };
  };

  const presets = {
    fadeBasic: {
      className: `${prefix}-fade-basic-view`,
      opacity: [0.4, 0.4]
    },
    wave: {
      className: `${prefix}-wave-view`,
      transform: {
        translateZ: [-300, -300]
      }
    },
    fadeWave: {
      className: `${prefix}-fade-wave-view`,
      opacity: [0.6, 0.6],
      transform: {
        scale: [0.875, 0.875]
      }
    },

    flow(options) {
      return {
        className: `${prefix}-flow-view`,
        transform: _objectSpread2(_objectSpread2(_objectSpread2({}, options.dir === 'h' && {
          rotateY: [-30, 30]
        }), options.dir === 'v' && {
          rotateX: [-30, 30]
        }), {}, {
          translateZ: [-600, -600]
        })
      };
    },

    fadeFlow(options) {
      return {
        className: `${prefix}-fade-flow-view`,
        opacity: [0.6, 0.6],
        transform: _objectSpread2(_objectSpread2(_objectSpread2({}, options.dir === 'h' && {
          rotateY: [-50, 50]
        }), options.dir === 'v' && {
          rotateX: [-50, 50]
        }), {}, {
          translateZ: [-100, 100]
        })
      };
    }

  };
  /**
   * This view locates sections in a row vertically or horizontally and applies transform object to each section
   */

  class TransFormView extends PlaneView {
    constructor() {
      super();
      this.options.register({
        transformStyle: 'flow'
      });
      this.on('elementAppend', () => {
        const options = this.options.toObject();
        this.transformOptions = typeof presets[options.transformStyle] === 'function' ? presets[options.transformStyle](options) : presets[options.transformStyle];
        this.element.classList.add(`${prefix}-transform-view`);
        this.element.classList.add(this.transformOptions.className);
      });
    }
    /**
     * Locates the section in view element
     * @param {NSSection} section
     */


    locateSection(section) {
      section.element.style[this._positionProp] = `${section.offset}px`;
      const styles = getSectionTransformStyles(section.pendingOffset / this.size, this.transformOptions);
      section.element.style.transform = styles.transform;
      section.element.style.opacity = styles.opacity;
    }

  } // Register view in the composer

  Composer.registerView('transform', TransFormView);

  /**
   * This view locates sections over each other and applies transform object to each section
   */

  class BaseStackView extends PlaneView {
    update(arrange = true) {
      this._sectionsCount = this.sections.length;

      if (arrange) {
        this.arrange();
      }

      this.locateInLoop();
      this.updateStatusAndIndex();
      this.trigger('update', [this._position], true);
      this._paintScheduled = true;
      requestAnimationFrame(() => {
        this.sections.forEach(section => this.locateSection(section));
        this._paintScheduled = false;
      });
    }
    /**
     * Locates the section in view element and adds z-index
     * @param {NSSection} section
     */


    locateSection(section) {
      section.element.style.zIndex = this.count - Math.abs(Math.ceil(section.pendingOffset / this.size));
    }

  } // Register view in the composer

  Composer.registerView('baseStack', BaseStackView);

  /**
   * This view locates sections over each other and applies transform object to each section
   */

  class StackView extends BaseStackView {
    constructor() {
      super();
      this.element.classList.add(`${prefix}-stack-view`);
      this.options.register({
        scaleFactor: 0.2
      });
      this.on('elementAppend', () => {
        this.scaleFactor = this.options.get('scaleFactor');
      });
    }
    /**
     * Locates the section in view element and adds z-index
     * @param {NSSection} section
     */


    locateSection(section) {
      const distance = section.pendingOffset / this.size;
      const absDistance = Math.abs(distance);
      super.locateSection(section);

      if (absDistance < 1) {
        section.element.style.visibility = '';

        if (distance < 0) {
          section.element.style.transform = 'scale(' + (1 - absDistance * this.scaleFactor) + ')';
        } else {
          section.element.style.transform = `translate${this._transformProp}(${-absDistance * this.size}px)`;
          section.element.style.zIndex = 1000;
        }

        section.element.classList.remove(`${prefix}-section-hidden`);
      } else {
        section.element.classList.add(`${prefix}-section-hidden`);
      }
    }

  } // Register view in the composer

  Composer.registerView('stack', StackView);

  /**
   * This view locates sections over each other and fades each section
   */

  class FadeView extends BaseStackView {
    constructor() {
      super();
      this.element.classList.add(`${prefix}-fade-view`);
    }
    /**
     * Locates the section in view element and adds z-index
     * @param {NSSection} section
     */


    locateSection(section) {
      const distance = section.pendingOffset / this.size;
      const absDistance = Math.abs(distance);
      super.locateSection(section);

      if (absDistance < 1) {
        section.element.style.opacity = 1 - absDistance;
        section.element.classList.remove(`${prefix}-section-hidden`);
      } else {
        section.element.classList.add(`${prefix}-section-hidden`);
      }
    }

  } // Register view in the composer

  Composer.registerView('fade', FadeView);

  /**
   * This view locates sections over each other and applies transform object to each section
   */

  class MaskView extends BaseStackView {
    constructor() {
      super();
      this.element.classList.add(`${prefix}-mask-view`);
      this.options.register({
        maskParallax: 0.8
      });
      this.on('elementAppend', () => {
        this.maskParallax = this.options.get('maskParallax');
      });
      this.on('sectionAdd', this._wrapSection.bind(this));
    }

    _wrapSection(action, section) {
      const sectionMask = document.createElement('div');
      sectionMask.classList.add(`${prefix}-section-mask`);
      section.element.parentElement.insertBefore(sectionMask, section.element);
      sectionMask.appendChild(section.element);
      section.maskElement = sectionMask;
    }
    /**
     * Locates the section in view element and adds z-index
     * @param {NSSection} section
     */


    locateSection(section) {
      const distance = section.pendingOffset / this.size;
      const absDistance = Math.abs(distance);
      super.locateSection(section);

      if (absDistance < 1) {
        section.element.style.visibility = '';
        section.maskElement.style.transform = `translate${this._transformProp}(${-distance * this.size}px)`;
        section.element.style.transform = `translate${this._transformProp}(${distance * this.size * this.maskParallax}px)`;
        section.element.classList.remove(`${prefix}-section-hidden`);
      } else {
        section.element.classList.add(`${prefix}-section-hidden`);
      }
    }

  } // Register view in the composer

  Composer.registerView('mask', MaskView);

  /**
   * This view locates sections over each other and applies transform object to each section
   */

  class CubeView extends BaseStackView {
    constructor() {
      super();
      this.element.classList.add(`${prefix}-cube-view`);
      this.options.register({
        shadow: 0.8,
        dolly: 500
      });
      this.on('elementAppend', () => {
        this._rotateAxis = this.options.get('dir') === 'h' ? 'rotateY' : 'rotateX';
        this._rotateDir = this.options.get('dir') === 'h' ? -1 : 1;
        this._shadow = this.options.get('shadow');
        this._dolly = this.options.get('dolly');
      });
    }

    update(arrange = true) {
      this._sectionsCount = this.sections.length;

      if (arrange) {
        this.arrange();
      }

      this.locateInLoop();
      this.updateStatusAndIndex();
      this.trigger('update', [this._position], true);
      this._paintScheduled = true;
      requestAnimationFrame(() => {
        this.sections.forEach(section => this.locateSection(section));
        this._paintScheduled = false;
      });
    }
    /**
     * Locates the section in view element and adds z-index
     * @param {NSSection} section
     */


    locateSection(section) {
      const distance = section.pendingOffset / this.size;
      const absDistance = Math.abs(distance);
      super.locateSection(section);

      if (absDistance < 1) {
        section.element.style.visibility = '';
        section.element.style.transform = this._rotateAxis + '(' + distance * this._rotateDir * 90 + 'deg)';
        section.element.style.transformOrigin = '50% 50% -' + this.size / 2 + 'px';
        if (this._shadow) section.element.style.filter = `brightness(${1 - absDistance * this._shadow})`;
        section.element.classList.remove(`${prefix}-section-hidden`);

        if (this._dolly && distance > 0) {
          this.sectionsContainer.style.transform = `translateZ(${-this._dolly / 2 + Math.abs(absDistance - 0.5) * this._dolly}px)`;
        }
      } else {
        section.element.classList.add(`${prefix}-section-hidden`);
      }
    }

  } // Register view in the composer

  Composer.registerView('cube', CubeView);

  const layerClasses = {};
  /**
   * Layers class holds and setups layers.
   * It appends layers element depends on their wrap and position type to main, wrap or fixed layers containers.
   */

  class Layers extends Emitter {
    /**
     * Registers new layer to the layers
     * @param {String} name Addon name
     * @param {Class} layerClass Addon class
     */
    static registerLayer(name, layerClass) {
      if (has$1.call(layerClasses, name)) {
        throw new Error(`This layer (${name}) is already registered.`);
      } else {
        layerClasses[name] = layerClass;
      }
    }
    /**
     * The list of all registered layer classes
     */


    static get layers() {
      return layerClasses;
    }
    /**
     * Creates new Layers instance
     * @param {*} holder The layer holder object
     * @param {String} wrapperWidth Wrapper width
     */


    constructor(holder, wrapperWidth) {
      super();
      this.holder = holder;
      this.holder.layersController = this;
      this.wrapperWidth = wrapperWidth; // the list of added layers

      this.layers = [];
    }
    /**
     * Finds all layer elements in given target element and setups them
     * @param {Element} targetElement
     * @param {Boolean} suppressFixed
     */


    setupLayers(targetElement, suppressFixed) {
      this._initLayers(targetElement, null, suppressFixed);

      responsiveHelper.on('breakpointChange', this._updateWrapperSize, this);
      this.trigger('layersSetup', [this]);
    }
    /**
     * Finds all layer elements in the given scope and create layer instance for each one based on the type\
     * @private
     * @param  {Element} scope The scope that the query should be called
     * @param  {Element} layerContainer The expected container that layers should be appended to, if it does not set, main layers container will considered
     * @param  {Boolean} suppressFixed Whether suppressing checking fixed positioning type on layers or not
     * @param  {Layer} parentLayer Parent layer instance
     */


    _initLayers(scope, layerContainer, suppressFixed, parentLayer) {
      scope.querySelectorAll(`:scope > .${prefix}-layer, :scope > a > .${prefix}-layer`).forEach((layerElement, index) => {
        let linkedLayer = false; // check for linked layer

        if (layerElement.parentNode.nodeName === 'A') {
          linkedLayer = true;
        }

        let layerType = layerElement.getAttribute('data-type') || 'custom';

        if (!has$1.call(layerClasses, layerType)) {
          layerType = 'custom';
        }

        const LayerClass = layerClasses[layerType];

        if (LayerClass) {
          const layer = new LayerClass(layerElement, this, this.holder, index, linkedLayer, parentLayer);
          const wrap = layerElement.getAttribute('data-wrap') !== 'false';
          layer.positionType = layerElement.getAttribute('data-position');

          if (layer.positionType === 'static') {
            layer.frame.classList.add(`${prefix}-static`);
          } else {
            layer.isFixed = suppressFixed !== true && layer.positionType === 'fixed';
          } // append layer


          if (layer.isFixed) {
            this._appendToFixedContainer(layer, wrap);
          } else if (layerContainer) {
            layerContainer.appendChild(layer.frame);
          } else {
            this._appendToLayersContainer(layer, wrap);
          } // init the layer


          layer.init();
          this.layers.push(layer); // check for nested layers

          if (layer.nestable) {
            this._initLayers(layer.element, layer.element, true, layer);
          }
        }
      });

      if (this.hasFixedLayers) {
        // add section status class names to the fixed layers too
        this.holder.on('statusChange, activated, deactivated', this._setFixedContainerClass, this);
      }

      this._updateWrapperSize();
    }
    /**
     * @private
     */


    _updateWrapperSize() {
      const width = getResponsiveValue(this.wrapperWidth);
      if (this.wrapper) this.wrapper.style.maxWidth = width + 'px';
      if (this.fixedWrapper) this.fixedWrapper.style.maxWidth = width + 'px';
    }
    /**
     * Adds section status class names to the fixed layers container
     * @private
     */


    _setFixedContainerClass(action, section, currentStatus, lastStatus) {
      if (action === 'activated') {
        this.fixedContainer.classList.add(`${prefix}-active`);
      } else if (action === 'deactivated') {
        this.fixedContainer.classList.remove(`${prefix}-active`);
      } else {
        this.fixedContainer.classList.add(`${prefix}-${currentStatus}`);

        if (lastStatus) {
          this.fixedContainer.classList.remove(`${prefix}-${lastStatus}`);
        }
      }
    }
    /**
     * Appends layer to layers container
     * @private
     * @param {Layer} layer
     * @param {Boolean} wrap
     */


    _appendToLayersContainer(layer, wrap) {
      if (!this.container) {
        this.hasLayers = true; // create the container and wrapper

        this.container = document.createElement('div');
        this.container.classList.add(`${prefix}-layers-container`); // wrapper element wraps layers in a specific area
        // and folds the layers fold by given space value in options

        this.layersFold = document.createElement('div');
        this.layersFold.classList.add(`${prefix}-layers-fold`);
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add(`${prefix}-layers-wrapper`);
        this.container.appendChild(this.wrapper);
        this.wrapper.appendChild(this.layersFold);
        this.wrapper.style.maxWidth = this.wrapperWidth + 'px';
      }

      if (wrap) {
        this.layersFold.appendChild(layer.frame);
      } else {
        this.container.appendChild(layer.frame);
      }
    }
    /**
     * Appends layer to fixed layers container
     * @private
     * @param {Layer} layer
     * @param {Boolean} wrap
     */


    _appendToFixedContainer(layer, wrap) {
      if (!this.hasFixedLayers) {
        this.hasFixedLayers = true; // create the container and wrapper

        this.fixedContainer = document.createElement('div');
        this.fixedContainer.classList.add(`${prefix}-layers-container`);
        this.fixedContainer.classList.add(`${prefix}-fixed`); // wrapper element wraps layers in a specific area
        // and folds the layers fold by given space value in options

        this.fixedLayersFold = document.createElement('div');
        this.fixedLayersFold.classList.add(`${prefix}-layers-fold`);
        this.fixedWrapper = document.createElement('div');
        this.fixedWrapper.classList.add(`${prefix}-layers-wrapper`);
        this.fixedWrapper.style.maxWidth = this.wrapperWidth‌ + 'px';
        this.fixedContainer.appendChild(this.fixedWrapper);
        this.fixedWrapper.appendChild(this.fixedLayersFold);
      }

      if (wrap) {
        this.fixedLayersFold.appendChild(layer.frame);
      } else {
        this.fixedContainer.appendChild(layer.frame);
      }
    }

  }

  /**
   * This class setups Layers for each section in composer
   */

  class LayersAdapter {
    /**
     * Creates new layers adapter
     * @param {Composer} composer
     */
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        fadeLayers: false
      });
      this.composer.on('beforeSectionsSetup', this._init, this);
    }
    /**
     * Before setting up sections in the composer
     */


    _init() {
      this.wrapperWidth = this.composer.options.get('width');

      if (this.composer.options.get('fadeLayers')) {
        this.composer.element.classList.add(`${prefix}-fade-layers`);
      }

      this.composer.on('sectionBeforeMount', this.readLayers, this);
    }
    /**
     * Setups layers over the section
     * @param {String} name Emitter action name
     * @param {Section} section Target section
     */


    readLayers(name, section) {
      if (section.layersController) {
        return;
      } // hold section (holder) auto loading content to let layers prepare assets to load


      section.loadTrigger.hold(); // read the section wrapper width

      if (section.element.dataset.wrapperWidth) {
        this.wrapperWidth = section.element.dataset.wrapperWidth.split(',');
      }

      const layersController = new Layers(section, this.wrapperWidth);
      layersController.composer = this.composer;
      layersController.parentEmitter = this.composer;
      section.layersController = layersController;
      layersController.setupLayers(section.element);

      if (layersController.hasLayers) {
        section.element.appendChild(layersController.container);
      }

      if (layersController.hasFixedLayers) {
        if (!this.composer.fixedLayersContainer) {
          const fixedLayersContainer = document.createElement('div');
          fixedLayersContainer.classList.add(`${prefix}-fixed-layers`);
          this.composer.view.element.appendChild(fixedLayersContainer);
          this.composer.fixedLayersContainer = fixedLayersContainer;
          this.composer.trigger('fixedLayersContainer');
        }

        this.composer.fixedLayersContainer.appendChild(layersController.fixedContainer);
      } // call start loading


      section.loadTrigger.exec();
    }

  }
  Composer.registerAddon('layersAdapter', LayersAdapter);

  /**
   * Layers surface is just like a section but it only contains layers.
   * This class is useful to create overlay layers
   */

  class LayersSurface extends Emitter {
    /**
     * Creates new layer surface instance
     * @param {Composer} composer
     * @param {Element} element
     */
    constructor(composer, element) {
      super();
      this.composer = composer;
      this.eventPrefix = 'layersSurface';
      this.element = element;
      this.loadTrigger = new ActionTrigger(this.loadStart.bind(this));
      this.readyTrigger = new ActionTrigger(this.ready.bind(this));
    }
    /**
     * Setups the surface and read layer attributes related to show on and hide on sections
     */


    setup() {
      this.trigger('beforeSetup', [this], true); // set isOverlay flag on each layers added as overlay on slider

      this.layersController.layers.forEach(layer => {
        layer.isOnSurface = true;

        if (layer.element.hasAttribute('data-show-on-section')) {
          layer.showOnSections = layer.element.getAttribute('data-show-on-section').replace(/\s+/g, '').split(',');
        }

        if (layer.element.hasAttribute('data-hide-on-section')) {
          layer.hideOnSections = layer.element.getAttribute('data-hide-on-section').replace(/\s+/g, '').split(',');
        }
      }, this);
      this.loadTrigger.exec(); // trigger resize event

      this.composer.on('resize', () => this.trigger('resize', [this], true), this);
    }
    /**
     * Shows or hides the layer based on current section in the composer
     */


    _changeLayersState() {
      this.layersController.layers.forEach(layer => {
        if (this._checkForShow(layer)) {
          layer.show();
        } else {
          layer.hide();
        }
      });
    }
    /**
     * Triggers loading start event, this event listen by layers to start loading their containing assets
     */


    loadStart() {
      this.trigger('loadingStart', [this], true);
      this.readyTrigger.exec();
    }
    /**
     * Calls after loading all assets done
     */


    ready() {
      this.element.classList.add(`${prefix}-ready`); // Added active class name to fade all layers after they loaded

      this.element.classList.add(`${prefix}-active`);
      this.composer.on('changeStart, init', this._changeLayersState, this);
      this.trigger('ready', [this], true);
    }
    /**
     * Checks wether given layer should be visible over current section in composer or not.
     * @private
     * @param {Layer} layer
     */


    _checkForShow(layer) {
      const index = this.composer.navigator.targetSectionIndex;
      const sectionId = this.composer.view.sections[index].id;
      const layerHideOn = layer.hideOnSections;
      const layerShowOn = layer.showOnSections;

      if (layerShowOn) {
        return !!sectionId && layerShowOn.indexOf(sectionId) !== -1;
      }

      return !sectionId || !layerHideOn || layerHideOn.length && layerHideOn.indexOf(sectionId) === -1;
    }

  }

  /**
   * Creates overlay layers by layers controller and layer surface over the composer
   */

  class OverlayLayersAdapter {
    /**
     * Creates new layers adapter
     * @param {Composer} composer
     */
    constructor(composer) {
      this.composer = composer;
      this.composer.on('beforeSectionsSetup', this._init, this);
    }
    /**
     * Before setting up sections in the composer
     */


    _init() {
      this.wrapperWidth = this.composer.options.get('width');
      this.layersContainer = this.composer.element.querySelector(`.${prefix}-overlay-layers`);

      if (!this.layersContainer) {
        return;
      }

      this.layersSurface = new LayersSurface(this.composer, this.layersContainer);
      this.layersSurface.parentEmitter = this.composer;
      this.composer.view.element.appendChild(this.layersContainer);
      const layersController = new Layers(this.layersSurface, this.wrapperWidth);
      layersController.parentEmitter = this.composer;
      layersController.composer = this.composer;
      this.layersController = layersController;
      layersController.setupLayers(this.layersContainer);

      if (layersController.hasLayers) {
        this.layersSurface.element.appendChild(layersController.container);
      }

      this.composer.overlayLayers = this.layersSurface;
      this.layersSurface.setup();
    }

  }
  Composer.registerAddon('overlayLayersAdapter', OverlayLayersAdapter);

  /**
   * CSS Transform Interface, this class adds the possibility of controlling element transform by
   * adding, updating or removing transform functions without interrupting other transform parts.
   *
   * @author Averta [www.averta.net]
   * @license MIT
   */
  class TransformInterface {
    /**
     * Constructor
     * @param {Element} element
     */
    constructor(element, prefix = '') {
      this.element = element;
      this.segments = [];
      this.transform = prefix.length ? `${prefix}Transform` : 'transform';
      this._id = 0;
    }
    /**
     * Add new transform section to the element
     * A segment in transform can contain any transform function
     * @param {String} transform    Initial transform section value
     * @param {Number} depth        Specifies the location of adding segment in transform, higher value means
     *                              after other sections
     *
     * @returns {Number} The segment ID, this ID is required to update ore remove the section
     */


    add(transform, depth = 0) {
      this._id += 1;
      this.segments.push({
        transform,
        depth,
        id: this._id
      });

      this._sort();

      if (transform && transform.length) {
        this._apply();
      }

      return this._id;
    }
    /**
     * Update the segment
     * @param  {String} transform Transform string
     * @param  {Number} segment     Segment ID
     * @param  {Number} depth       Depth [Optional]
     */


    update(transform, segment, depth) {
      const segmentIndex = this._find(segment);

      if (segmentIndex === -1) {
        return;
      }

      if (depth !== undefined) {
        this.segments[segmentIndex].depth = depth;

        this._sort();
      }

      if (transform !== null) {
        this.segments[segmentIndex].transform = transform;

        this._apply();
      }
    }
    /**
     * Remove transform segment
     * @param  {Number} segment    Segment ID
     */


    remove(segment) {
      const segmentIndex = this._find(segment);

      if (segmentIndex === -1) {
        return;
      }

      this.segments.splice(segmentIndex, 1);

      this._apply();
    }
    /* ------------------------------------------------------------------------------ */

    /**
     * Apply transform to the element
     */


    _apply() {
      if (this.segments.length === 0) {
        this.element.style[this.transform] = '';
        return;
      }

      let transformStr = '';
      this.segments.forEach(segment => {
        if (segment.transform) {
          transformStr += segment.transform + ' ';
        }
      });
      this.element.style[this.transform] = transformStr;
    }
    /**
     * Sort transform segments by depth value
     */


    _sort() {
      this.segments.sort((a, b) => a.depth - b.depth);
    }
    /**
     * Find segment object by segment ID
     * @param  {Number} segmentId
     */


    _find(segmentId) {
      let i = -1;
      this.segments.some((segment, index) => {
        i = index;
        return segmentId === segment.id;
      });
      return i;
    }

  }

  const boxProperties = ['width', 'height', 'padding-bottom', 'padding-top', 'padding-left', 'padding-right']; // Resize typography style properties

  const typographyProperties = ['font-size'];
  /**
   * This class resizes the absolute positioned layer
   */

  class AbsoluteResize {
    /**
     * Creates new absolute resize handler instance
     * @param {Layer} layer Target layer
     * @param {AbsolutePosition} positionHandler Absolute position handler
     */
    constructor(layer, positionHandler) {
      this.layer = layer;
      this.positionHandler = positionHandler;
      this.resizeType = layer.element.getAttribute('data-resize-type') || 'scale-relocate';
      this.resetResize = layer.element.getAttribute('data-reset-resize') !== 'false';
      this.scaleType = layer.element.getAttribute('data-scale-type') || 'scale';
      this.upscale = layer.element.getAttribute('data-upscale') === 'true';
      this.scale = this.resizeType.indexOf('scale') !== -1;
      this.relocate = this.resizeType.indexOf('relocate') !== -1;
      this._firstLocate = true;

      if (this.scale) {
        if (this.scaleType === 'scale') {
          this.scaleTransform = layer.frameTransform.add(null, 100);
        } else {
          this.layerInlineStyle = this.layer.element.getAttribute('style');
        }

        this.updateBaseStyle();
      }
    }
    /* ------------------------------------------------------------------------------ */

    /**
     * Reads layer's base styles
     */


    updateBaseStyle() {
      const scaleType = this.scaleType.toLowerCase();

      if (scaleType === 'scale') {
        return;
      }

      let props;

      switch (scaleType) {
        case 'box':
        default:
          props = boxProperties;
          break;

        case 'typography-box':
          props = [].concat(boxProperties, typographyProperties);
          break;

        case 'typography':
          props = typographyProperties;
      }

      this.baseStyle = {}; // reset style attribute value

      this.layer.element.setAttribute('style', this.layerInlineStyle);
      props.forEach(property => {
        const value = getComputedStyle(this.layer.element)[property];
        this.baseStyle[property] = value;
      });
    }
    /**
     * Resizes the layer
     */


    update() {
      const breakpointSize = !responsiveHelper.activeBreakpoint ? getResponsiveValue(this.layer.composer.options.get('width')) : responsiveHelper.activeBreakpointSize;
      let scaleFactor = window.innerWidth / breakpointSize;

      if (this.scale) {
        if (!this.upscale) {
          scaleFactor = Math.min(1, scaleFactor);
        }

        if (this.scaleType === 'scale') {
          this.layer.frameTransform.update(`scale(${scaleFactor})`, this.scaleTransform);
        } else {
          const {
            positionHandler
          } = this;
          Object.keys(this.baseStyle).forEach(property => {
            // do not resize layer size if it's not fixed value
            if ((property !== 'width' || !positionHandler.floatWidth) && (property !== 'height' || !positionHandler.floatHeight)) {
              this.layer.element.style[property] = parseFloat(this.baseStyle[property]) * scaleFactor + 'px';
            }
          });
        }
      } // update layer position


      if (this.relocate) {
        const {
          activeOffset
        } = this.positionHandler;
        const origin = activeOffset.origin || 'tl';
        let locateFactor = scaleFactor;
        const {
          frame
        } = this.layer;

        if (!this.upscale) {
          locateFactor = Math.min(1, locateFactor);
        }

        if (activeOffset.x.indexOf('%') === -1) {
          const x = parseInt(activeOffset.x, 10) * locateFactor;

          switch (origin.charAt(1)) {
            case 'l':
            default:
              frame.style.left = x + 'px';
              break;

            case 'r':
              frame.style.right = x + 'px';
              break;

            case 'c':
              frame.style.left = x === 0 ? '50%' : 'calc( 50% + ' + x + 'px )';
          }
        }

        if (activeOffset.y.indexOf('%') === -1) {
          const y = parseInt(activeOffset.y, 10) * locateFactor;

          switch (origin.charAt(0)) {
            case 't':
            default:
              frame.style.top = y + 'px';
              break;

            case 'b':
              frame.style.bottom = y + 'px';
              break;

            case 'm':
              frame.style.top = y === 0 ? '50%' : 'calc( 50% + ' + y + 'px )';
          }
        }
      }
    }

  }

  const originToTransformOrigin = {
    t: 'top',
    m: 'center',
    b: 'bottom',
    l: 'left',
    r: 'right',
    c: 'center'
  };
  /**
   * Layer absolute positioning class
   * This class locates the layer based on offset data attribute values and resizes the layer by delegation resizing to AbsoluteResizing class.
   */

  class AbsolutePosition {
    /**
     * Creates new absolute position handler instance
     * @param {Layer} layer Target layer
     */
    constructor(layer) {
      this.layer = layer;
      layer.frame.classList.add(`${prefix}-pos-absolute`);
      this.layer.frame.style.zIndex = this.layer.index + 10; // read offsets

      const offsets = _objectSpread2({
        none: {
          x: '0px',
          y: '0px',
          origin: 'tl'
        }
      }, getAttrValues(layer.element, 'offset')); // parse offset values


      Object.keys(offsets).forEach(key => {
        if (typeof offsets[key] === 'string') {
          offsets[key] = this._getOffsetObject(offsets[key]);
        }
      });
      this.layer.offsets = offsets;

      if (this.layer.element.getAttribute('data-resize') !== 'false' && !this.layer.nested) {
        this.resizeHandler = new AbsoluteResize(this.layer, this);
        this.layer.holder.on('resize', this.resizeHandler.update, this.resizeHandler);
      }

      responsiveHelper.on('breakpointChange', this.locate, this);
    }
    /**
     * Locates the layer
     */


    locate() {
      const {
        frame
      } = this.layer;
      const offset = getResponsiveValue(this.layer.offsets);
      this.activeOffset = offset;

      if (offset.width !== undefined) {
        if (offset.width.indexOf('%') === -1) {
          this.layer.element.style.width = offset.width;
          frame.classList.remove(`${prefix}-float-width`);
          this.floatWidth = false;
        } else {
          frame.style.width = offset.width;
          frame.classList.add(`${prefix}-float-width`);
          this.floatWidth = true;
        }
      }

      if (offset.height !== undefined) {
        if (offset.height.indexOf('%') === -1) {
          this.layer.element.style.height = offset.height;
          frame.classList.remove(`${prefix}-float-height`);
          this.floatHeight = false;
        } else {
          frame.style.height = offset.height;
          frame.classList.add(`${prefix}-float-height`);
          this.floatHeight = true;
        }
      }

      frame.style[`${CSSPrefix.js}Transform`] = ''; // reset position styles

      this.layer.frameTransform.update('', this._transformSegment);
      frame.style.top = '';
      frame.style.left = '';
      frame.style.bottom = '';
      frame.style.right = '';
      const origin = offset.origin || 'tl';
      const vOrigin = origin.charAt(0);
      const hOrigin = origin.charAt(1);
      let transformStr = ''; // set transform origin

      frame.style[`${CSSPrefix.js}TransformOrigin`] = originToTransformOrigin[vOrigin] + ' ' + originToTransformOrigin[hOrigin];

      switch (vOrigin) {
        case 't':
        default:
          frame.style.top = offset.y;
          break;

        case 'b':
          frame.style.bottom = offset.y;
          break;

        case 'm':
          if (offset.y === '0') {
            offset.y = '0px';
          }

          transformStr = 'translateY(-50%)';
          frame.style.top = `calc(50% + ${offset.y})`;
      }

      switch (hOrigin) {
        case 'l':
        default:
          frame.style.left = offset.x;
          break;

        case 'r':
          frame.style.right = offset.x;
          break;

        case 'c':
          if (offset.x === '0') {
            offset.x = '0px';
          }

          frame.style.left = `calc(50% + ${offset.x})`;
          transformStr += ' translateX(-50%)';
      }

      this.layer.frameTransform.update(transformStr, this.layer.transformSegment);

      if (this.resizeHandler) {
        this.resizeHandler.updateBaseStyle();
        this.resizeHandler.update();
      }
    }
    /**
     * Convert the offset string the offset object
     * @param  {String} offsetString
     */


    _getOffsetObject(offsetString) {
      const offsetObj = {};
      offsetString.replace(/\s/g, '').split(';').forEach(property => {
        property = property.split(':'); // eslint-disable-next-line prefer-destructuring

        offsetObj[property[0]] = property[1];
      });
      return offsetObj;
    }

  }

  /*!
   * With thanks to Roko C. Buljan
   * https://stackoverflow.com/questions/9518956/javascript-convert-css-style-string-into-js-object
   */
  function cssToObject(css) {
    if (!css || css.length === 0) {
      return {};
    }

    const obj = {};
    const s = css.toLowerCase().replace(/-(.)/g, (m, g) => g.toUpperCase()).replace(/;\s?$/g, '').split(/:|;/g);

    for (let i = 0; i < s.length; i += 2) obj[s[i].replace(/\s/g, '')] = s[i + 1].replace(/^\s+|\s+$/g, '');

    return obj;
  }

  /**
   * Adds and removes styles to the target element based on active breakpoint
   */

  class BreakpointStyle {
    /**
     * Creates new Breakpoint Style class
     * @param {Element} element Target element
     * @param {Object} styles [Optional] The object containing styles of each breakpoint.
     */
    constructor(element, styles) {
      this.element = element;

      if (!styles) {
        styles = getAttrValues(element, 'style');
      }

      const dataLen = Object.keys(styles).length;

      if (dataLen === 0 || dataLen === 1 && has$1.call(styles, 'none')) {
        return;
      } // convert data


      Object.keys(styles).forEach(key => {
        if (key !== 'none') {
          styles[key] = cssToObject(styles[key]);
        }
      });
      styles.none = {};
      this.styles = styles;
      responsiveHelper.on('breakpointChange', this.update, this);
      this.lastActivePoint = 'none';
      this.updateBaseStyle();
      this.update();
    }
    /**
     * Reads and updates base styles from target element
     */


    updateBaseStyle() {
      this.baseStyle = cssToObject(this.element.getAttribute('style'));
    }
    /**
     * Updates the element styles based on active breakpoint
     */


    update() {
      const resetStyle = {};

      if (this.lastActivePoint !== 'none') {
        Object.keys(this.lastStyle).forEach(key => {
          if (this.baseStyle[key]) {
            resetStyle[key] = this.baseStyle[key];
          } else {
            resetStyle[key] = '';
          }
        });
      }

      this.lastActivePoint = responsiveHelper.activeBreakpoint;
      let style = getResponsiveValue(this.styles, this.lastActivePoint);
      this.lastStyle = style;
      style = _objectSpread2(_objectSpread2({}, resetStyle), style);
      requestAnimationFrame(() => {
        Object.keys(style).forEach(property => {
          this.element.style[property] = style[property];
        });
      });
    }

  }
  /* ------------------------------------------------------------------------------ */

  /**
   * Sets new class names based on active breakpoint
   */

  class BreakpointClass {
    /**
     * Creates new Breakpoint Class
     * @param {Element} element Target element
     * @param {Object} styles [Optional] The object containing classes of each breakpoint.
     */
    constructor(element, classNames) {
      this.element = element;

      if (!classNames) {
        classNames = getAttrValues(this.element, 'class');
      }

      const dataLen = Object.keys(classNames).length;

      if (dataLen === 0 || dataLen === 1 && has$1.call(classNames, 'none')) {
        return;
      } // convert data


      Object.keys(classNames).forEach(key => {
        if (key !== 'none') {
          classNames[key] = classNames[key].replace(/(\s\s)+/g, ' ').split(' ');
        }
      });
      this.classNames = classNames;
      this.classNames.none = [];
      responsiveHelper.on('breakpointChange', this.update, this);
      this.lastActivePoint = 'none';
      this.update();
    }
    /**
     * Updates class names of element based on active breakpoint
     */


    update() {
      if (this.lastActivePoint !== 'none') {
        this.lastClasses.forEach(className => this.element.classList.remove(className));
      }

      this.lastActivePoint = responsiveHelper.activeBreakpoint;
      const classes = getResponsiveValue(this.classNames, this.lastActivePoint);
      this.lastClasses = classes;
      classes.forEach(className => this.element.classList.add(className));
    }

  }

  /**
   * It create a layer object.
   * Each layer type should extend this class to add further functionality.
   * Please do not make direct instance from this class
   */

  class Layer extends Emitter {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super();
      this.element = element;
      this.controller = controller;
      this.holder = holder;
      this.index = index;
      this.isLinked = isLinked;
      this.parent = parent;
      this.composer = this.controller.composer;
      this.id = element.id;

      if (!this.composer.layersById) {
        this.composer.layersById = {};
      }

      if (this.id) {
        this.composer.layersById[this.id] = this;
      }

      this.parentEmitter = controller;
      this.eventPrefix = 'layer';

      if (isLinked) {
        this.linkElement = element.parentElement;
      }

      if (this.parent) {
        this.nested = true;
      } // the frame element is wraps the layer element to make the positioning more reliable
      // it also can be used for creating mask or parallax effect


      this.frame = document.createElement('div');
      this.frame.classList.add(`${prefix}-layer-frame`);

      if (this.element.hasAttribute('data-frame-class')) {
        this.frame.classList.add(this.element.getAttribute('data-frame-class'));
      }

      if (this.element.hasAttribute('data-frame-id')) {
        this.frame.classList.add(this.element.getAttribute('data-frame-id'));
      }

      if (this.element.hasAttribute('data-frame-style')) {
        this.frame.setAttribute('style', this.element.getAttribute('data-frame-style'));
      } // setup query class and styles on layer element


      this.elementBreakpointStyle = new BreakpointStyle(this.element);
      this.elementBreakpointClass = new BreakpointClass(this.element); // setup query class and styles on layer frame

      this.frameBreakpointStyle = new BreakpointStyle(this.frame, getAttrValues(this.element, 'frame-style'));
      this.frameBreakpointClass = new BreakpointClass(this.frame, getAttrValues(this.element, 'frame-class')); // consider link element

      if (this.isLinked) {
        this.frame.appendChild(this.linkElement);
      } else {
        this.frame.appendChild(this.element);
      }

      this.readyTrigger = new ActionTrigger(this._ready.bind(this));
      this.offsets = {};
      this.trigger('create', [this], true);
    }
    /**
     * Inits the layer
     * @param {Boolean} suppressEvents
     */


    init(suppressEvents) {
      if (!suppressEvents) {
        this.trigger('beforeInit', [this], true);
      }

      if (this.element.hasAttribute('data-id')) {
        this.id = this.element.getAttribute('data-id');
        this.frame.classList.add(`${prefix}-id-${this.id}`);
      } // create transform interface for the frame element
      // It's necessary for controlling the element transform from other add-ons like parallax effect


      this.frameTransform = new TransformInterface(this.frame, CSSPrefix.js);
      this.transformSegment = this.frameTransform.add();

      if (!this.disablePositionHandler && (!this.element.hasAttribute('data-position-handler') || this.element.getAttribute('data-position-handler') === 'absolute')) {
        this.positionHandler = new AbsolutePosition(this);
      }

      const hideOnBps = this.element.getAttribute('data-hide-on');
      this.bpVisible = true;

      if (hideOnBps) {
        addHideOn(this.element, hideOnBps.split(','), hidden => {
          this.bpVisible = !hidden;
          this.trigger('visibilityChange', [this, hidden], true);
        }, `${prefix}-layer-hidden`);
      }

      this._setupContent();

      if (!suppressEvents) {
        this.trigger('afterInit', [this], true);
        this.readyTrigger.exec();
      }
    }
    /**
     * Manipulates layer content
     * Overrides by layer types
     */


    _setupContent() {}
    /**
     * This layer is ready to appear
     */


    _ready() {
      this.ready = true;

      if (this.positionHandler) {
        this.positionHandler.locate();
      }

      this.trigger('ready', [this], true);
    }

  }

  /**
   * Custom layer type, it can contain any HTML content
   */

  class CustomLayer$3 extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'custom';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }

  }
  Layers.registerLayer('custom', CustomLayer$3);

  /**
   * Custom layer type, it can contain any HTML content
   */

  class CustomLayer$2 extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'text';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }

  }
  Layers.registerLayer('text', CustomLayer$2);

  /**
   * Custom layer type, it can contain any HTML content
   */

  class CustomLayer$1 extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'button';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }

  }
  Layers.registerLayer('button', CustomLayer$1);

  /**
   * Custom layer type, it can contain any shape content
   */

  class ShapeLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'shape';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }

    _setupContent() {
      var _this$element$querySe;

      (_this$element$querySe = this.element.querySelector('svg')) === null || _this$element$querySe === void 0 ? void 0 : _this$element$querySe.setAttribute('preserveAspectRatio', 'none');
    }

  }
  Layers.registerLayer('shape', ShapeLayer);

  /**
   * Image layer type
   */

  class ImageLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'image';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }
    /**
     * Manipulates layer content
     */


    _setupContent() {
      if (this.element.nodeName === 'IMG') {
        this.img = this.element;
      } else {
        this.img = this.element.querySelector('img');
      }

      if (!this.img) {
        return;
      }

      this.holder.readyTrigger.hold();
      this.holder.on('loadingStart', this._loadImage, this);
    }
    /**
     * Start loading image
     */


    _loadImage() {
      loadImage(this.img, this._loaded.bind(this), this._error.bind(this));
    }
    /**
     * Image is loaded
     */


    _loaded() {
      this.img.classList.add(`${prefix}-loaded`);
      this.holder.readyTrigger.exec();
    }
    /**
     * Image loading failed
     */


    _error() {
      this.holder.readyTrigger.exec();
    }

  }
  Layers.registerLayer('image', ImageLayer);

  const players = {};
  const loadingList = {};
  const alreadyAddedScripts = [];
  const has = Object.prototype.hasOwnProperty;
  class VideoElement {
    /**
     * Registers new player api adapter class
     * @param {String} name Player name
     * @param {Class} playerClass Player api adapter class
     */
    static registerPlayer(name, playerClass) {
      // is it already exists
      if (has.call(players, name)) {
        return;
      }

      players[name] = playerClass;
    }

    static get players() {
      return players;
    }
    /**
     * Creates new video element
     * @param {String|Element} source Video source
     */


    constructor(source) {
      this.type = 'custom';

      if (typeof source === 'string') {
        this.videoSourceType = 'embed';
        this.type = this._getTypeBySrc(source);

        if (has.call(players, this.type)) {
          this.player = new players[this.type](this);
        }

        this.element = this._generateIframe(source);
        this.source = this.element;
      } else if (source.tagName === 'IFRAME') {
        this.videoSourceType = 'embed';
        this.type = this._getTypeBySrc(source.getAttribute('src'));
        this.element = source;
        this.source = source;

        if (has.call(players, this.type)) {
          this.player = new players[this.type](this);
        }
      } else if (source.tagName === 'VIDEO') {
        this.videoSourceType = 'self-hosted';
        this.element = source;
        this.source = source;
        const type = source.getAttribute('data-player-type') || 'native';

        if (has.call(players, type)) {
          this.type = type;
          this.player = new players[this.type](this);
        }
      }
    }
    /**
     * Setup the video player api
     * @param {Function} readyCallback It calls right after the api gets ready
     */


    setup(readyCallback, errorCallback) {
      if (this.type === 'custom') {
        return;
      }

      this._readyCallback = readyCallback;
      this._errorCallback = errorCallback;
      this.player.init();
    }
    /**
     * Calls by the player to tell the video element that the api is ready to use
     */


    playerIsReady() {
      this.ready = true;

      if (this._readyCallback) {
        this._readyCallback();
      }
    }
    /**
     * Loads the api script file, each player can use this method to load the script in the page
     * @param  {String} src Script src
     * @param  {Function} callback Calls after loading the script in the page
     */


    loadScript(src, callback) {
      if (loadingList[`${this.type}_isLoaded`]) {
        callback();
        return;
      }

      if (!loadingList[this.type]) {
        loadingList[this.type] = [callback];
      } else {
        loadingList[this.type].push(callback);
      }

      if (alreadyAddedScripts.indexOf(src) === -1) {
        alreadyAddedScripts.push(src);
      } else {
        return;
      }

      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.type = 'text/javascript';

      script.onload = () => {
        loadingList[this.type].forEach(cb => cb());
        loadingList[`${this.type}_isLoaded`] = true;
      };

      script.onreadystatechange = script.onload;

      if (this._errorCallback) {
        script.onerror = this._errorCallback;
      }

      script.src = src;
      head.appendChild(script);
    }
    /**
     * Reads the src value and validates it by all registered players to find the right player
     * @private
     * @param  {String} src
     */


    _getTypeBySrc(src) {
      let type = 'custom';
      Object.keys(players).some(playerName => {
        const playerInstance = players[playerName];

        if (playerInstance.iframeEmbed && playerInstance.validate(src)) {
          type = playerName;
          return true;
        }

        return false;
      });
      return type;
    }
    /**
     * Generates an iframe for embedding video if is needed
     * @private
     * @param  {String} src
     */


    _generateIframe(src) {
      if (this.player && this.player.beforeIframe) {
        src = this.player.beforeIframe(src);
      }

      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowfullscreen', '');

      if (this.player && this.player.afterIframe) {
        src = this.player.afterIframe(src);
      }

      return iframe;
    }

  }

  class MediaElementJS {
    constructor(videoElement) {
      this.ve = videoElement;
    }

    init() {
      if (!window.MediaElementPlayer) {
        throw new Error('MediaElementJS not found.');
      }

      this.api = new window.MediaElementPlayer(this.ve.element, {
        success: () => {
          setTimeout(this._apiReady.bind(this), 0);
        }
      });
      this.ve.element = this.api.container;
    }

    setupInterface() {
      Object.assign(this.ve, {
        play: this.api.play.bind(this.api),
        pause: this.api.pause.bind(this.api),
        mute: () => {
          this.api.setMuted(true);
        },
        unmute: () => {
          this.api.setMuted(false);
        },
        stop: () => {
          this.api.setCurrentTime(0);
          this.api.pause();
        },
        on: this.on.bind(this),
        off: this.off.bind(this)
      });
    }

    on(type, listener) {
      if (type === 'play') {
        type = 'playing';
      }

      this.ve.source.addEventListener(type, listener, false);
    }

    off(type, listener) {
      this.ve.source.removeEventListener(type, listener, false);
    }

    _apiReady() {
      this.setupInterface();
      this.ve.playerIsReady(this.api);
    }

  }

  VideoElement.registerPlayer('mejs', MediaElementJS);

  class NativePlayer {
    constructor(videoElement) {
      this.ve = videoElement;
    }

    init() {
      this.api = this.ve.element;
      this.setupInterface();
      this.ve.playerIsReady(this.api);
    }

    setupInterface() {
      Object.assign(this.ve, {
        play: this.api.play.bind(this.api),
        pause: this.api.pause.bind(this.api),
        mute: () => {
          this.api.muted = true;
        },
        unmute: () => {
          this.api.muted = false;
        },
        stop: () => {
          this.api.currentTime = 0;
          this.api.pause();
        },
        on: this.on.bind(this),
        off: this.off.bind(this)
      });
    }

    on(type, listener) {
      this.ve.element.addEventListener(type, listener, false);
    }

    off(type, listener) {
      this.ve.element.removeEventListener(type, listener, false);
    }

  }

  VideoElement.registerPlayer('native', NativePlayer);

  const apiScript$1 = 'https://player.vimeo.com/api/player.js';
  const validateRx$1 = /http(?:s?):\/\/(?:www\.)?\w*.?vimeo.com/;
  const IDMatch$1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/;

  class Vimeo {
    static validate(src) {
      return validateRx$1.test(src);
    }

    static get iframeEmbed() {
      return true;
    }

    constructor(videoElement) {
      this.ve = videoElement;
    }

    beforeIframe(src) {
      if (src.indexOf('/video/') === -1) {
        return `https://player.vimeo.com/video/${src.match(IDMatch$1)[1]}`;
      }

      return src;
    }

    init() {
      if (window.Vimeo) {
        this.api = new window.Vimeo.Player(this.ve.element);
        this.setupInterface();
        this.ve.playerIsReady(this.api);
      } else {
        this.ve.loadScript(apiScript$1, () => {
          this.init();
        });
      }
    }

    setupInterface() {
      Object.assign(this.ve, {
        play: this.api.play.bind(this.api),
        pause: this.api.pause.bind(this.api),
        mute: () => {
          this._currentVol = this.api.getVolume();
          this.api.setVolume(0);
        },
        unmute: () => {
          this.api.setVolume(this._currentVol);
        },
        stop: () => {
          this.api.setCurrentTime(0);
          this.api.pause();
        },
        on: this.api.on.bind(this.api),
        off: this.api.off.bind(this.api)
      });
    }

  }

  VideoElement.registerPlayer('vimeo', Vimeo);

  const apiScript = 'https://www.youtube.com/iframe_api';
  const validateRx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com|\.be\/)/;
  const IDMatch = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;

  class YouTube {
    static validate(src) {
      return validateRx.test(src);
    }

    static get iframeEmbed() {
      return true;
    }

    constructor(videoElement) {
      this.ve = videoElement;
      this._apiReady = this._apiReady.bind(this);
      this._onStateChange = this._onStateChange.bind(this);
      this._listeners = {};
      this.ve.element.src = this.checkSrc(this.ve.element.src);
    }

    checkSrc(src) {
      if (src.indexOf('/embed/') === -1) {
        src = `https://www.youtube.com/embed/${src.match(IDMatch)[1]}`;
      }

      if (src.indexOf('enablejsapi') === -1) {
        src += `${src.indexOf('?') === -1 ? '?' : '&'}enablejsapi=1`;
      }

      return src;
    }

    beforeIframe(src) {
      return this.checkSrc(src);
    }

    init(afterLoad) {
      if (window.YT && window.YT.Player) {
        this.api = new window.YT.Player(this.ve.element);
        this.api.addEventListener('onReady', this._apiReady, false);
      } else if (afterLoad) {
        let superCallback;

        if (window.onYouTubeIframeAPIReady) {
          superCallback = window.onYouTubeIframeAPIReady;
        }

        window.onYouTubeIframeAPIReady = () => {
          if (superCallback) {
            superCallback();
          }

          this.init();
        };
      } else {
        this.ve.loadScript(apiScript, () => {
          this.init(true);
        });
      }
    }

    setupInterface() {
      Object.assign(this.ve, {
        play: this.api.playVideo.bind(this.api),
        pause: this.api.pauseVideo.bind(this.api),
        mute: this.api.mute.bind(this.api),
        unmute: this.api.unMute.bind(this.api),
        stop: () => {
          this.api.seekTo(0);
          this.api.pauseVideo();
        },
        on: this.on.bind(this),
        off: this.off.bind(this)
      });
    }

    on(type, listener) {
      if (!this._eventAdded) {
        this._eventAdded = true;
        this.api.addEventListener('onStateChange', this._onStateChange, false);
      }

      if (!this._listeners[type]) {
        this._listeners[type] = [listener];
      } else {
        this._listeners[type].push(listener);
      }
    }

    off(type, listener) {
      if (this._listeners[type]) {
        const index = this._listeners[type].indexOf(listener);

        if (index !== -1) {
          this._listeners[type].splice(index, 1);
        }
      }
    }

    _apiReady() {
      this.setupInterface();
      this.ve.playerIsReady(this.api);
      this.api.removeEventListener('onReady', this._apiReady, false);
    }

    _onStateChange(e) {
      let type;

      switch (e.data) {
        case 0:
          type = 'ended';
          break;

        case 1:
          type = 'play';
          break;

        case 2:
          type = 'pause';
          break;

        default:
          return;
      }

      if (this._listeners[type]) {
        this._listeners[type].forEach(listener => {
          listener();
        });
      }
    }

  }

  VideoElement.registerPlayer('youtube', YouTube);

  class Plyr {
    constructor(videoElement) {
      this.ve = videoElement;
    }

    init() {
      if (!window.plyr) {
        throw new Error('Plyr not found.');
      }

      [this.api] = window.plyr.setup(this.ve.element);
      this.setupInterface();
      this.ve.playerIsReady(this.api);
      this.ve.element = this.api.getContainer();
    }

    setupInterface() {
      Object.assign(this.ve, {
        play: this.api.play.bind(this.api),
        pause: this.api.pause.bind(this.api),
        stop: this.api.stop.bind(this.api),
        on: this.api.on.bind(this.api),
        // off:  this.api.off.bind(this.api),
        mute: () => {
          if (!this.api.isMuted()) {
            this.api.toggleMute();
          }
        },
        unmute: () => {
          if (this.api.isMuted()) {
            this.api.toggleMute();
          }
        }
      });
    }

  }

  VideoElement.registerPlayer('plyr', Plyr);

  /**
   * Video layer type class
   */

  class VideoLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'video';
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
      this.playVideo = this.playVideo.bind(this);
      this._videoState = 'initial';
      this.holder.hasVideoLayer = true; // change default scale type to box resize
      // if (!this.element.hasAttribute('data-scale-type')) {
      //    this.element.setAttribute('data-scale-type', 'box');
      // }
    }
    /**
     * Start playing the video
     */


    playVideo(e) {
      if (!this.holder.active || this.holder.status === 'leaving' || this._videoState === 'playing' || !this.videoElement.ready || !this.bpVisible) {
        return;
      }

      if (e) {
        this.trigger('playByBtn', [this], true);
      }

      this.videoElement.play();
      this.element.classList.add(`${prefix}-playing`);
    }
    /**
     * Stop the video
     */


    stopVideo() {
      if (this._videoState === 'stopped' || !this.videoElement.ready) {
        return;
      }

      if (this.autoPause) {
        this.videoElement.pause();
      } else {
        this.videoElement.stop();
      }

      this.element.classList.remove(`${prefix}-playing`);
    }
    /**
     * Manipulates layer content
     */


    _setupContent() {
      this.coverImage = this.element.querySelector('img');
      this.videoSource = this.element.querySelector('iframe, video');
      this.autoplay = this.element.getAttribute('data-autoplay') === 'true';
      this.autoPause = this.element.getAttribute('data-auto-pause') === 'true'; // this.waitForAnimEnd = this.element.getAttribute( 'data-wait-for-anim' ) !== 'false';

      if (!this.videoSource) {
        return;
      }

      if (this.videoSource.tagName === 'IFRAME') {
        // make sure the iframe video does not have any autoplay parameter
        this.videoSource.src = this.videoSource.src.replace('autoplay=1', '');
      } else if (this.videoSource.tagName === 'VIDEO' && !this.videoSource.hasAttribute('data-player-type')) {
        const fitMode = this.videoSource.getAttribute('data-object-fit') || 'cover';
        this.videoSource.style.objectFit = fitMode;
        this.videoSource.setAttribute('data-object-fit', fitMode);

        if (this.videoSource.hasAttribute('data-object-position')) {
          const fitFrom = this.videoSource.getAttribute('data-object-position');
          this.videoSource.style.objectPosition = fitFrom;
        }

        this.videoSource.setAttribute('playsinline', '');
        this.videoSource.setAttribute('webkit-playsinline', '');
      }

      this.videoElement = new VideoElement(this.videoSource);
      this.videoElement.setup(this._videoControllerReady.bind(this)); // add class name to the video player element

      this.videoElement.element.classList.add(`${prefix}-video-player`); // make media element responsive

      if (this.videoElement.type === 'mejs') {
        this.videoElement.player.api.options.stretching = 'responsive';
      }

      if (this.coverImage) {
        this.playBtn = document.createElement('div');
        this.playBtn.classList.add(`${prefix}-video-btn`);
        this.playBtn.addEventListener('click', this.playVideo, false);
        this.element.appendChild(this.playBtn); // hold for loading the cover image

        this.holder.readyTrigger.hold();
      }

      if (this.autoplay) {
        this.holder.on('activated', this.playVideo, this);
      }

      this.holder.on('deactivated', this.stopVideo, this);
      this.holder.on('loadingStart', this._startLoading, this);
      this.on('visibilityChange', (action, layer, hidden) => {
        if (!hidden && (this.autoplay || this.wasPlaying)) {
          this.playVideo();
        } else if (hidden) {
          this.wasPlaying = this._videoState === 'playing';
          this.stopVideo();
        }
      });
    }
    /**
     * On video player API
     */


    _videoControllerReady() {
      this._onVideoPlay = this._onVideoPlay.bind(this);
      this._onVideoPause = this._onVideoPause.bind(this);
      this._onVideoEnded = this._onVideoEnded.bind(this);
      this.videoElement.on('play', this._onVideoPlay);
      this.videoElement.on('pause', this._onVideoPause);
      this.videoElement.on('ended', this._onVideoEnded);

      if (window.objectFitPolyfill) {
        window.objectFitPolyfill(this.videoSource);
      }

      if (this.autoplay) {
        this.playVideo();
      }
    }
    /**
     * Start loading the image by replacing the src
     */


    _startLoading() {
      if (this.coverImage) {
        loadImage(this.coverImage, this._loaded.bind(this), this._error.bind(this));
      }
    }
    /**
     * Image is loaded
     */


    _loaded() {
      this.coverImage.classList.add(`${prefix}-loaded`);
      this.holder.readyTrigger.exec();
    }
    /**
     * Image loading failed
     */


    _error() {
      this.holder.readyTrigger.exec();
    }
    /**
     * On video play event listener
     */


    _onVideoPlay() {
      this._videoState = 'playing';
      this.trigger('videoPlay', [this], true);
    }
    /**
     * On video pause event listener
     */


    _onVideoPause() {
      this._videoState = 'stopped';
      this.trigger('videoPause', [this], true);
    }
    /**
     * On video ended event listener
     */


    _onVideoEnded() {
      this._videoState = 'ended';
      this.trigger('videoEnded', [this], true);
    }

  }

  Layers.registerLayer('video', VideoLayer);

  // It can be overwritten by adding .ms-hotspot-pont-template element as a direct child of composer

  const defaultPointMarkup = `<div class="${prefix}-hotspot-point ${prefix}-tooltip-point">
                                <div class="${prefix}-point-center"></div>
                                <div class="${prefix}-point-border"></div>
                            </div>`;
  let pointMarkup;
  /**
   * Hotspot layer type class
   * It shows a hotspot point when user rolls over the point a tooltip appears
   */

  class HotspotLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'hotspot';
      this._hidden = true;
      this.frame.classList.add(`${prefix}-${this.type}-layer`);

      if (!pointMarkup) {
        const template = controller.composer.element.querySelector(`.${prefix}-hotspot-point-template`);

        if (template) {
          pointMarkup = template.outerHTML;
          template.remove();
        } else {
          pointMarkup = defaultPointMarkup;
        }
      }
    }
    /**
     * Manipulates layer content
     */


    _setupContent() {
      this._mouseX = 0;
      this._mouseY = 0; // read data attributes from element

      this.align = this.element.getAttribute('data-align') || 'top';
      this.tooltipWidth = parseInt(this.element.getAttribute('data-width'), 10) || 200;
      this.transparent = this.element.getAttribute('data-transparent') === 'true'; // search for custom point markup in the layer markup

      let hotspotPoint = this.element.querySelector(`.${prefix}-hotspot-point`);

      if (hotspotPoint) {
        // exclude it from the tooltip content
        hotspotPoint.parentElement.removeChild(hotspotPoint);
      }

      this.content = this.element.innerHTML;
      this.element.innerHTML = '';

      if (!this.transparent) {
        if (hotspotPoint) {
          this.element.appendChild(hotspotPoint);
        } else {
          this.element.innerHTML = pointMarkup;
          hotspotPoint = this.element.querySelector(`.${prefix}-hotspot-point`);
        }
      } else {
        hotspotPoint = this.element;
      }

      this._mouseInteraction = this._mouseInteraction.bind(this);
      hotspotPoint.addEventListener('mouseenter', this._mouseInteraction, false);
      hotspotPoint.addEventListener('mouseleave', this._mouseInteraction, false); // generate tooltip markup

      const tooltip = document.createElement('div');
      tooltip.classList.add(`${prefix}-hotspot-tooltip`);
      tooltip.classList.add(`${prefix}-align-${this.align}`);

      if (this.element.hasAttribute('data-tooltip-class')) {
        this.element.getAttribute('data-tooltip-class').split(' ').forEach(className => {
          tooltip.classList.add(className);
        });
      }

      this.tooltipContainer = document.createElement('div');
      this.tooltipContainer.classList.add(`${prefix}-tooltip-cont`);
      this.tooltipContainer.innerHTML = this.content;
      this.tooltipContainer.style.width = this.tooltipWidth + 'px';

      if (this.element.getAttribute('data-stay-hover') === 'true') {
        this._tooltipMouseInteraction = this._tooltipMouseInteraction.bind(this);
        this.tooltipContainer.addEventListener('mouseenter', this._tooltipMouseInteraction, false);
        this.tooltipContainer.addEventListener('mouseleave', this._tooltipMouseInteraction, false);
      }

      tooltip.appendChild(this.tooltipContainer);
      this.holder.composer.layoutController.primaryContainer.appendChild(tooltip);
      this.tooltip = tooltip;
      this.hotspotPoint = hotspotPoint;
    }
    /**
     * Mouse interaction listener on hotspot point element
     * @param  {MouseEvent} event
     */


    _mouseInteraction(event) {
      switch (event.type) {
        case 'mouseenter':
          this._mouseX = event.clientX;
          this._mouseY = event.clientY;

          this._locateTooltip();

          setTimeout(this._showTooltip.bind(this), 1);
          break;

        case 'mouseleave':
        default:
          this._hideTooltip();

      }
    }
    /**
     * Mouse interaction listener on tooltip element
     * @param  {MouseEvent} event
     */


    _tooltipMouseInteraction(event) {
      switch (event.type) {
        case 'mouseenter':
          if (this._hidden) {
            return;
          }

          this._showTooltip();

          break;

        case 'mouseleave':
        default:
          this._hideTooltip();

      }
    }
    /**
     * Show tooltip
     */


    _showTooltip() {
      clearTimeout(this._hideTimeout);

      if (this._hidden) {
        this.tooltip.classList.add(`${prefix}-tooltip-active`);
        this._hidden = false;
      }
    }
    /**
     * Hide tooltip
     */


    _hideTooltip() {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = setTimeout(() => {
        this._hidden = true;
        this.tooltip.classList.remove(`${prefix}-tooltip-active`);
      }, 200);
    }
    /**
     * Checks tooltip location in the page based on the given alignment value, if tooltip does not fit correctly,
     * returns alternative alignment
     * @param  {String} align
     */


    _alignPolicy(align) {
      const tooltipHeight = this.tooltip.offsetHeight;

      switch (align) {
        case 'top':
        default:
          if (this.pointY - tooltipHeight < 0) {
            return 'bottom';
          }

          break;

        case 'right':
          if (this.pointX + this.tooltipWidth > window.innerWidth) {
            return 'bottom';
          }

          break;

        case 'left':
          if (this.pointX - this.tooltipWidth < 0) {
            return 'bottom';
          }

      }

      return null;
    }
    /**
     * Locate tooltip in the page based on alignment and hotspot position
     * @param  {String} align
     */


    _locateTooltip(align) {
      align = align || this.align;
      let pointX;
      let pointY;
      const margin = 20; // Add space to left or right side of tooltip if it is near to the window

      const rect = this.frame.getBoundingClientRect();
      pointX = rect.left + window.pageXOffset;
      pointY = rect.top + window.pageYOffset;

      if (this.transparent) {
        pointX += this._mouseX - rect.left;
        pointY += this._mouseY - rect.top;
      }

      const posX = pointX; // localize

      pointX -= this.composer.element.offsetLeft + this.composer.element.scrollLeft;
      pointY -= this.composer.element.offsetTop + this.composer.element.scrollTop;
      this.pointX = pointX;
      this.pointY = pointY;
      this.tooltipContainer.style.left = '';
      this.tooltipContainer.style.right = '';
      this.tooltipContainer.width = this.tooltipWidth + 'px';
      this.tooltip.classList.add(`${prefix}-no-transition`);

      if (this._lastAlign) {
        this.tooltip.classList.remove(`${prefix}-align-${this._lastAlign}`);
      }

      this.tooltip.classList.add(`${prefix}-align-${align}`);
      this._lastAlign = align;

      if (align === 'bottom' || align === 'top') {
        let width = this.tooltipWidth;

        if (this.tooltipWidth >= window.innerWidth) {
          this.tooltipContainer.style.width = window.innerWidth - margin * 2 + 'px';
          width = window.innerWidth - margin * 2;
        } else {
          this.tooltipContainer.style.width = width + 'px';
        }

        let rightSpace = window.innerWidth - width / 2 - posX;

        if (rightSpace < 0) {
          rightSpace -= margin;
          this.tooltipContainer.style.right = -rightSpace + 'px';
        } else {
          let leftSpace = posX - width / 2;
          leftSpace -= margin;

          if (leftSpace < 0) {
            this.tooltipContainer.style.left = -leftSpace + 'px';
          }
        }
      }

      const alignPolicy = this._alignPolicy(align);

      if (alignPolicy) {
        this._locateTooltip(alignPolicy);

        return;
      }

      this.tooltip.style.left = pointX + 'px';
      this.tooltip.style.top = pointY + 'px';
      this.tooltip.classList.remove(`${prefix}-no-transition`);
    }

  }

  Layers.registerLayer('hotspot', HotspotLayer);

  /**
   * Custom layer type, it can contain any HTML content
   */

  class CustomLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'group';
      this.nestable = true;
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
    }

  }
  Layers.registerLayer('group', CustomLayer);

  /**
   * Flex layer type, it can contain any HTML content
   */

  class FlexLayer extends Layer {
    /**
     * Creates new layer
     * @param {Element} element Layer element
     * @param {Layers} controller Layer controller
     * @param {*} holder The layers holder object for sections layers, it is the section object
     * @param {Number} index Layer index number
     * @param {Boolean} isLinked Whether the layer is linked or not
     * @param {Layer} parent Layer's parent layer
     */
    constructor(element, controller, holder, index, isLinked, parent) {
      super(element, controller, holder, index, isLinked, parent);
      this.type = 'flex';
      this.nestable = true;
      this.frame.classList.add(`${prefix}-${this.type}-layer`);
      this.disablePositionHandler = true;
    }

  }
  Layers.registerLayer('flex', FlexLayer);

  /**
   * Always returns the value between 0 and given max value, useful when you need to find value in a loop
   * @param {Number} value Current value
   * @param {Number} max Max value value
   */
  /**
   * Whether element has the attribute(s) or not
   * @param {Element} element Target element
   * @param {RegExp} pattern The attribute regex pattern
   */

  function hasAttribute(element, pattern) {
    let result = false;
    [].some.call(element.attributes, attribute => {
      result = pattern.test(attribute.name);
      return result;
    });
    return result;
  }

  const _excluded = ["type"];
  /**
   * Creates in and out animations and adds animation control methods to the target object
   */

  class InOutAnimation {
    /**
     * Whether the element supports animation in or animation out
     * @param {Element} element
     */
    static isAnimative(element) {
      return hasAttribute(element, /^(data(-\w+)*-animation-(in|out))$/g);
    }
    /**
     * Creates new instance
     * @param {Object|Layer} target Target element holder
     * @param {Element} targetElement Target element that has the animation attributes
     */


    constructor(target, targetElement) {
      this.target = target;
      this.element = targetElement;
      this.sourceElement = target.element;
      const inAttributes = getAttrValues(this.sourceElement, 'animation-in') || {};
      const outAttributes = getAttrValues(this.sourceElement, 'animation-out') || {};
      this.animationsData = ['none', ...breakpointNames].map(breakpoint => {
        const activeInAnimData = getResponsiveValue(inAttributes, breakpoint);
        const activeOutAnimData = getResponsiveValue(outAttributes, breakpoint);
        const animationIn = activeInAnimData ? this.parseAnimationData(activeInAnimData) : false;
        const animationOut = activeOutAnimData ? this.parseAnimationData(activeOutAnimData) : false;
        return {
          animationIn,
          animationOut
        };
      });
      responsiveHelper.on('breakpointChange', this.setAnimator, this);
      this.setAnimator();
      /**
       * Go to and play related animation based on given type
       * @param {String} phase "in" or "out"
       */

      target.animateInOut = (phase, restart = false) => {
        if (['in', 'out'].includes(phase)) {
          this.startAnimation(phase, restart);
        }
      };

      target.show = () => target.animateInOut('in');

      target.hide = () => target.animateInOut('out');
      /**
       * Changes the target animation progress value based on given type
       * @param {Number} progress Between 0 and 1
       * @param {String} phase "in" or "out"
       */


      target.progressInOut = (progress, phase) => {
        if (['in', 'out'].includes(phase)) {
          this.progressAnimation(phase, progress);
        }
      };
    }

    parseAnimationData(data) {
      const jsonStrData = data.replace(/'/g, '"');
      let dataObject = '';

      try {
        dataObject = JSON.parse(jsonStrData);
      } catch (e) {
        console.warn('Given animation data value is not a valid JSON, animation skipped. \n ' + jsonStrData);
        return '';
      }

      return dataObject;
    }

    _animationBegin(phase) {
      this.status = phase + '-start';
      this.target.trigger(phase === 'in' ? 'animationInStart' : 'animationOutStart', [this.target, this.status], true);
    }

    _animationEnd(phase) {
      this.status = phase + '-end';
      this.target.trigger(phase === 'in' ? 'animationInEnd' : 'animationOutEnd', [this.target, this.status], true);

      if (phase === 'in') {
        // remove animation in after it ends
        this.removeActiveAnimator();
      }
    }

    removeActiveAnimator() {
      if (this.activeAnimator) {
        this.activeAnimator.reset();
        this.activeAnimator = null;
      }
    }

    generateNewAnimator(phase) {
      const animationData = getResponsiveValue(this.animationsData);

      if (!this.hasAnimation(phase, animationData)) {
        return null;
      }

      const _animationData = animationData[phase === 'in' ? 'animationIn' : 'animationOut'],
            {
        type
      } = _animationData,
            params = _objectWithoutProperties(_animationData, _excluded);

      const newAnimator = animator__default["default"].animate(type, this.element, phase, params, null, {
        autoplay: false,
        begin: () => this._animationBegin(phase),
        complete: () => this._animationEnd(phase)
      });
      this.status = phase + '-init';
      this.activePhase = phase;
      return newAnimator;
    }

    startAnimation(phase, restart = false) {
      if (phase !== this.activePhase || !this.activeAnimator) {
        this.removeActiveAnimator();
        this.activeAnimator = this.generateNewAnimator(phase);
      }

      if (!this.activeAnimator) {
        return;
      }

      const {
        timeline
      } = this.activeAnimator;

      if (restart || phase === 'in' && this.status === 'in-init' || phase === 'out' && this.status === 'out-init') {
        timeline.seek(0);
        timeline.play();
      }
    }

    progressAnimation(phase, progress) {
      if (phase !== this.activePhase || !this.activeAnimator) {
        this.removeActiveAnimator();
        this.activeAnimator = this.generateNewAnimator(phase);
      }

      if (!this.activeAnimator) {
        return;
      }

      const {
        timeline
      } = this.activeAnimator;
      timeline.seek(timeline.duration * progress);
    }
    /**
     * Changes element animation based on current active breakpoint
     */


    setAnimator() {
      if (this.status === 'in-end') {
        return;
      }

      let startProgress = 0;
      let lastAnimatorWasActive = false;

      if (!this.activePhase) {
        this.activePhase = 'in';
      }

      if (this.activeAnimator) {
        const {
          timeline
        } = this.activeAnimator;
        startProgress = timeline.progress;
        lastAnimatorWasActive = timeline.began && !timeline.paused;
        this.removeActiveAnimator();
      }

      this.activeAnimator = this.generateNewAnimator(this.activePhase);

      if (!this.activeAnimator) {
        // we set in-end even if the active phase is out to remove the out animation footprint since the out animation is not set for the current breakpoint
        this.status = 'in-end';
        return;
      }

      const {
        timeline: newTimeline
      } = this.activeAnimator;

      if (startProgress) {
        newTimeline.seek(newTimeline.duration * (startProgress / 100));
      }

      if (lastAnimatorWasActive) {
        newTimeline.play();
      }
    }
    /**
     * Whether animation in or out is available or not
     * @param {String} phase "in" or "out"
     */


    hasAnimation(phase, animationData) {
      return phase === 'in' ? !!animationData.animationIn : !!animationData.animationOut;
    }

  }

  /**
   * Wraps the layer element with an animation wrap container
   * @param {Element} layerElement
   */

  function wrapLayerElement(layerElement) {
    if (layerElement.parentElement.classList.contains(`.${prefix}-animation-wrap`)) {
      return layerElement.parentElement;
    }

    const animationWrap = document.createElement('div');
    animationWrap.classList.add(`${prefix}-animation-wrap`);
    layerElement.parentElement.insertBefore(animationWrap, layerElement);
    animationWrap.appendChild(layerElement);
    return animationWrap;
  }
  /**
   * Section status listener, it plays animation in or out on section get activated or deactivated
   * @param {String} action
   */


  function checkSectionLayerStatus(action, layer) {
    if (action === 'readyAndActivated') {
      if (!layer.waitForAction) {
        layer.animateInOut('in');
      }
    } else if (action === 'readyAndDeactivated') {
      if (layer.autoAnimateOut) {
        layer.animateInOut('out');
      }
    }
  }
  /**
   * Changes the animation progress value based on section pendingOffset value
   * @param {String} action
   * @param {Section} holder
   * @param {Number} offset
   * @param {Number} progress
   */


  function progressInOutAnimation(action, layer, holder, offset, progress, inIsActive, outIsActive) {
    if (progress >= 0 && inIsActive) {
      layer.progressInOut(Math.max(0, 1 - progress), 'in');
    } else if (progress < 0 && outIsActive) {
      layer.progressInOut(Math.min(1, -progress), 'out');
    }
  }
  /**
   * Sets animation in and out to the layer and controls its playback relative to the active sections in composer
   * @param {Layer} layer Target layer
   * @param {Composer} composer
   */


  function setInOutAnimation(layer, composer) {
    layer.inOutAnimation = new InOutAnimation(layer, layer.animationWrap);
    layer.interactiveAnimationIn = layer.element.getAttribute('data-animation-in-interactive');
    layer.interactiveAnimationOut = layer.element.getAttribute('data-animation-out-interactive');
    layer.waitForAction = layer.element.getAttribute('data-wait-for-action') === 'true';
    layer.waitOnAnimationOut = layer.element.getAttribute('data-animation-out-wait') !== 'false';
    layer.autoAnimateOut = layer.element.getAttribute('data-animation-out-on-change') === 'true' || composer.options.get('hideLayers');
    const isOnSurface = layer.holder instanceof LayersSurface;
    /**
     * isOnSurface flag specifies the layer is located over an isolated area or not. These layers are not relative to sections like overlay layers
     */

    if (!layer.waitForAction && !isOnSurface) {
      controlAnimationInOut(layer);
    } // call animation out async to let the timeline passes the pause


    layer.on('animationInEnd', () => setTimeout(() => {
      if (!layer.waitOnAnimationOut && !layer.disableAutoAnimateOut) {
        layer.animateInOut('out');
      }
    }));
  }

  function controlAnimationInOut(layer) {
    const onSectionStatusChange = action => checkSectionLayerStatus(action, layer);

    let onSectionOffsetChange;

    const switchMode = args => {
      const [interactiveIn, interactiveOut] = args.map(arg => arg === 'true');

      if (onSectionOffsetChange) {
        layer.holder.off('pendingOffsetChange', onSectionOffsetChange);
      }

      if (interactiveIn || interactiveOut) {
        onSectionOffsetChange = (action, holder, offset, progress) => {
          progressInOutAnimation(action, layer, holder, offset, progress, interactiveIn, interactiveOut);
        };

        layer.disableAutoAnimateOut = true;
        layer.holder.on('pendingOffsetChange', onSectionOffsetChange);

        if (layer.holder.active) {
          layer.holder.triggerPendingOffsetChange();
        }
      } else {
        layer.disableAutoAnimateOut = false;
      }

      if (!interactiveIn) {
        if (layer.holder.active) {
          onSectionStatusChange('readyAndActivated');
        }

        layer.holder.on('readyAndActivated', onSectionStatusChange);
      } else {
        layer.holder.off('readyAndActivated', onSectionStatusChange);
      }

      if (!interactiveOut) {
        // if (!layer.holder.active) {
        //    onSectionStatusChange('readyAndDeactivated');
        // }
        layer.holder.on('readyAndDeactivated', onSectionStatusChange);
      } else {
        layer.holder.off('readyAndDeactivated', onSectionStatusChange);
      }
    };

    watchMultipleResponsiveValues([layer.interactiveAnimationIn, layer.interactiveAnimationOut], switchMode);
  } // /**
  //  * Controls steps animation of the layer on view's index change or scrolls
  //  * @param {Layer} layer Target layer
  //  * @param {Composer} composer
  //  */
  // function setStepAnimation(layer, composer) {
  //    layer.stepAnimation = new StepAnimation(
  //       layer,
  //       layer.animationWrap,
  //       composer.layoutController,
  //       composer.view.sectionsCount
  //    );
  //    layer.hasStepAnimation = true;
  //    layer.interactiveAnimation = layer.element.getAttribute('data-interactive-animation') === 'true';
  //    const { view } = composer;
  //    if (!layer.interactiveAnimation) {
  //       composer.on('targetIndexChange', (action, index) => layer.animateToStep(index));
  //    } else {
  //       composer.on('scroll', () => {
  //          if (view.visibleIndex === undefined) {
  //             return;
  //          }
  //          const targetIndex = view.visibleIndex;
  //          const unitProgress = 1 / view.sectionsCount;
  //          const targetSection = view.sections[targetIndex];
  //          layer.progressStep(
  //             unitProgress * targetSection.index +
  //                Math.abs(targetSection.pendingOffset / targetSection.size) * unitProgress
  //          );
  //       });
  //    }
  // }

  /**
   * Layer animation adapter class
   * It reads animation data attributes from the layer element and applies them to the layer animation wrapper element
   */


  class AnimationAdapter {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        hideLayers: true
      });
      this._stepAnimationLayers = [];
      composer.on('layerBeforeInit', this._checkLayer, this); // composer.on('sectionsSetup', this._checkStepAnimationLayers, this);
    }
    /**
     * Checks the layer for whether is has animation or not
     * @param {String} action
     * @param {Layer} layer
     */


    _checkLayer(action, layer) {
      if (InOutAnimation.isAnimative(layer.element)) {
        layer.animationWrap = wrapLayerElement(layer.element);
        setInOutAnimation(layer, this.composer);
      } // if (StepAnimation.isAnimative(layer.element)) {
      //    layer.animationWrap = wrapLayerElement(layer.element);
      //    v;
      //    this._stepAnimationLayers.push(layer);
      // }

    } // _checkStepAnimationLayers() {
    //    this._stepAnimationLayers.forEach((layer) => {
    //       setStepAnimation(layer, this.composer);
    //    });
    // }


  }

  Composer.registerAddon('layerAnimationAdapter', AnimationAdapter);

  // ---------------------------------------------------------------------------------------------
  // constants
  const te = ('ontouchstart' in document);
  const pe = window.PointerEvent;
  const mpe = window.MSPointerEvent;
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  /* eslint-disable */

  const startEvent = pe ? 'pointerdown' : mpe ? 'MSPointerDown' : te ? 'touchstart' : 'mousedown'; // prettier-ignore

  const endEvent = pe ? 'pointerup' : mpe ? 'MSPointerUp' : te ? 'touchend' : 'mouseup'; // prettier-ignore

  const moveEvent = pe ? 'pointermove' : mpe ? 'MSPointerMove' : te ? 'touchmove' : 'mousemove'; // prettier-ignore

  const cancelEvent = pe ? 'pointercancel' : mpe ? 'MSPointerCancel' : te ? 'touchcancel' : ''; // prettier-ignore

  /* eslint-enable */
  // ---------------------------------------------------------------------------------------------

  class Swipe {
    constructor(element) {
      this.element = element;
      this._direction = 'horizontal';
      this.noSwipeSelector = ''; // input, textarea, button, .no-swipe, .ms-no-swipe';

      this.preventDefault = 'auto';
      this._lastStatus = {};
      this._touchStart = this._touchStart.bind(this);
      this._touchEnd = this._touchEnd.bind(this);
      this._touchMove = this._touchMove.bind(this);
      this._touchCancel = this._touchCancel.bind(this);
      this._reset = this._reset.bind(this);
      this.enable();
    }

    get direction() {
      return this._direction;
    }

    set direction(value) {
      this._direction = value;
      let touchAction = 'pan-x pan-y';

      if (value !== 'both') {
        touchAction = value === 'horizontal' ? 'pan-y' : 'pan-x';
      }

      this.element.style.msTouchAction = touchAction;
      this.element.style.touchAction = touchAction;
    }
    /**
     * Detects the swipe direction
     * @param  {Number} newX
     * @param  {Number} newY
     */


    _getDirection(newX, newY) {
      switch (this._direction) {
        case 'horizontal':
          return newX <= this.startX ? 'left' : 'right';

        case 'vertical':
          return newY <= this.startY ? 'up' : 'down';

        case 'both':
        default:
          if (Math.abs(newX - this.startX) > Math.abs(newY - this.startY)) {
            return newX <= this.startX ? 'left' : 'right';
          }

          return newY <= this.startY ? 'up' : 'down';
      }
    }
    /**
     * Event default preventing helper. It checks the movement with the desired direction
     * @param  {Number} newX
     * @param  {Number} newY
     * @return {Boolean}
     */


    _preventDefaultEvent(newX, newY) {
      if (this.preventDefault !== 'auto') {
        return this.preventDefault;
      }

      if (this._preventLock) {
        return true;
      }

      const horizontal = Math.abs(newX - this.startX) > Math.abs(newY - this.startY);
      this._preventLock = this._direction === 'horizontal' && horizontal || this._direction === 'vertical' && !horizontal;
      return this._preventLock;
    }
    /**
     * Generates the status object, this object passes to the onSwipe callback that contains useful info about swipe gesture
     * @param  {Event} event
     * @return {Object} Status object
     */


    _createStatusObject(event) {
      const status = {};
      const tempX = this._lastStatus.distanceX || 0;
      const tempY = this._lastStatus.distanceY || 0;
      status.timeStamp = Date.now();
      status.distanceX = event.pageX - this.startX;
      status.distanceY = event.pageY - this.startY;
      status.moveX = status.distanceX - tempX;
      status.moveY = status.distanceY - tempY;
      let dt = status.timeStamp - this._lastStatus.timeStamp || 0;
      dt /= 1000;
      status.dt = dt; // calculate the velocityX

      if (dt === 0 || status.moveX === 0 && (event.pageX <= 2 || event.pageX >= window.screen.width - 2)) {
        status.velocityX = this._lastStatus.velocityX;
      } else {
        status.velocityX = status.moveX / dt;
      } // calculate the velocityY


      if (dt === 0 || status.moveY === 0 && (event.pageY <= 2 || event.pageY >= window.screen.height - 2)) {
        status.velocityY = this._lastStatus.velocityY;
      } else {
        status.velocityY = status.moveY / dt;
      }

      status.duration = status.timeStamp - this.startTime;
      status.direction = this._getDirection(event.pageX, event.pageY);
      return status;
    }
    /* ------------------------------------------------------------------------------ */
    // event listeners

    /**
     * Touch start event listener function
     * @param  {Event} event
     */


    _touchStart(event) {
      if (!this.enabled && this.touchStarted && event.target.closest(this.noSwipeSelector, this.element)) {
        return;
      }

      if (event.pointerType && event.pointerType === 'mouse') {
        event.preventDefault();
      }

      const swipeEvent = event.type === 'touchstart' ? event.touches[0] : event;
      this.startX = swipeEvent.pageX;
      this.startY = swipeEvent.pageY;
      this.startTime = Date.now();
      document.addEventListener(endEvent, this._touchEnd, false);

      if (!iOS) {
        document.addEventListener(moveEvent, this._touchMove, {
          passive: false
        });
      }

      if (cancelEvent.length) {
        document.addEventListener(cancelEvent, this._touchCancel, false);
      }

      const status = this._createStatusObject(swipeEvent);

      status.phase = 'start';
      this.onSwipe(status);
      this._lastStatus = status;
      this.touchStarted = true;
    }
    /**
     * Touch move event listener function
     * @param  {Event} event
     */


    _touchMove(event) {
      if (!this.touchStarted) {
        return;
      }

      const swipeEvent = event.type === 'touchmove' ? event.touches[0] : event;

      const status = this._createStatusObject(swipeEvent);

      if (this._preventDefaultEvent(swipeEvent.pageX, swipeEvent.pageY)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } else {
        return;
      }

      clearTimeout(this._autoResetTimeout);
      this._autoResetTimeout = setTimeout(this._reset, 60, swipeEvent);
      status.phase = 'move';
      this._lastStatus = status;
      this.onSwipe(status);
    }
    /**
     * Touch end event listener
     * @param  {Event} event
     */


    _touchEnd(event) {
      const status = this._lastStatus;
      event.preventDefault();
      document.removeEventListener(endEvent, this._touchEnd, false);

      if (!iOS) {
        document.addEventListener(moveEvent, this._touchMove, {
          passive: false
        });
      }

      if (cancelEvent.length) {
        document.removeEventListener(cancelEvent, this._touchCancel, false);
      }

      clearTimeout(this._autoResetTimeout);
      this._autoResetTimeout = setTimeout(this._reset, 60);

      if (Date.now() - status.timeStamp > 200) {
        status.velocityX = 0;
        status.velocityY = 0;
      }

      status.phase = 'end';
      this.touchStarted = false;
      this.onSwipe(status);
    }
    /**
     * Touch cancel event listener
     * @param  {Event} event
     */


    _touchCancel(event) {
      this._touchEnd(event);
    }
    /* ------------------------------------------------------------------------------ */

    /**
     * Resets the touch swipe properties
     * @param  {Event} event
     */


    _reset(event) {
      this.reset = false;
      this._lastStatus = {};
      this.startTime = Date.now();

      if (event) {
        this.startX = event.pageX;
        this.startY = event.pageY;
      } else {
        this.startX = null;
        this.startY = null;
      }

      this._preventLock = false;
    }
    /* ------------------------------------------------------------------------------ */

    /**
     * Enable touch swipe detection
     */


    enable() {
      if (this.enabled) {
        return;
      }

      this.enabled = true;

      if (iOS) {
        document.addEventListener(moveEvent, this._touchMove, {
          passive: false
        });
      }

      this.element.addEventListener(startEvent, this._touchStart, {
        passive: false
      }); // add touch action style

      this.direction = this._direction;
    }
    /**
     * Disable touch swipe detection
     */


    disable() {
      if (!this.enabled) {
        return;
      }

      this.element.style.msTouchAction = '';
      this.element.style.touchAction = '';
      this.enabled = false;
      this.element.removeEventListener(startEvent, this._touchStart, false);
      document.removeEventListener(endEvent, this._touchEnd, false);
      document.removeEventListener(moveEvent, this._touchMove, false);

      if (cancelEvent.length) {
        document.removeEventListener(cancelEvent, this._touchCancel, false);
      }
    }

  }

  /**
   * This handler adds swipe gesture navigation support
   */

  class SwipeHandler {
    /**
     * Creates new swipe hander
     * @param {MSNavigator} navigator
     */
    constructor(navigator) {
      this.navigator = navigator;
      this.swipe = new Swipe(navigator.view.element);
      this._updateDirection = this._updateDirection.bind(this);
      this.navigator.view.options.observe('dir', this._updateDirection);
      this.navigator.view.options.observe('reverse', this._updateDirection);

      this._updateDirection();

      this._scrollNavigatorAdapter = this._scrollNavigatorAdapter.bind(this);
      this.swipe.onSwipe = this._scrollNavigatorAdapter;
    }
    /**
     * Enables swipe events
     */


    enable() {
      this.swipe.enable();
    }
    /**
     * Disables swipe events
     */


    disable() {
      this.swipe.disable();
    }
    /**
     * Updates touch swipe direction
     * @private
     */


    _updateDirection() {
      const value = this.navigator.view.options.get('dir');
      const reverse = this.navigator.view.options.get('reverse');
      this._reverseFactor = reverse ? 1 : -1;
      this.direction = value;

      if (value === 'h') {
        this._movement = 'moveX';
        this._velocity = 'velocityX';
        this.swipe.direction = 'horizontal';
      } else {
        this._movement = 'moveY';
        this._velocity = 'velocityY';
        this.swipe.direction = 'vertical';
      }
    }
    /**
     * Swipe adapter function for scroll navigator
     * @param {Object} status
     */


    _scrollNavigatorAdapter(status) {
      switch (status.phase) {
        case 'start':
          this.navigator.hold();
          this.navigator.trigger('swipeStart', [this.navigator, this]);
          break;

        case 'move':
          this.navigator.drag(status[this._movement] * this._reverseFactor);
          this.navigator.trigger('swipeMove', [this.navigator, this]);
          break;

        case 'end':
        case 'cancel':
        default:
          if (status[this._velocity]) {
            this.navigator.push(status[this._velocity] * this._reverseFactor);
          } else {
            this.navigator.release();
          }

          this.navigator.trigger('swipeEnd', [this.navigator, this]);
      }
    }

  }

  /**
   * Swipe handler adapter addon
   */

  class SwipeGesture {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.observe(this.composer.options.register({
        mouse: true,
        swipe: true
      }), this.checkOptions.bind(this));
      this.composer.options.alias('touch', 'swipe');
      this.composer.once('navigatorSetup', (action, navigator) => {
        this.swipeHandler = new SwipeHandler(navigator);
        this.enable = this.swipeHandler.enable.bind(this.swipeHandler);
        this.disable = this.swipeHandler.disable.bind(this.swipeHandler);
        this.checkOptions();
      });
    }
    /**
     * Checks options and disables or enables the swipe handler
     */


    checkOptions() {
      const options = this.composer.options.get(['mouse', 'swipe']);

      if (options.swipe && (isTouch || options.mouse)) {
        this.enable();
      } else {
        this.disable();
      }
    }

  }
  Composer.registerAddon('swipeGesture', SwipeGesture);

  class AutoHeight {
    constructor(composer) {
      this.composer = composer;
      this.composer.on('init', this._setup, this);
    }

    update() {
      let height = 0;
      this.composer.view.indexes.forEach(index => {
        height = Math.max(this.composer.view.sections[index].element.offsetHeight, height);
      });
      this.composer.view.element.style.height = `${height}px`;
    }

    _setup() {
      this.composer.options.observe('autoHeight', this._checkOption.bind(this));

      this._checkOption(null, this.composer.options.get('autoHeight'));

      let scrollbarWidth = document.body.clientWidth - window.innerWidth;
      this.composer.view.element.addEventListener('transitionend', event => {
        // we check the page vertical scrollbar width to make sure that changing view height does not make horizontal scroll
        const newScrollbarWidthCheck = document.body.clientWidth - window.innerWidth;

        if (event.target === this.composer.view.element && event.propertyName === 'height' && scrollbarWidth !== newScrollbarWidthCheck) {
          scrollbarWidth = newScrollbarWidthCheck;
          this.composer.layoutController.update();
        }
      });
    }

    _checkOption(name, active) {
      if (name) {
        // call layout controller update only if it called by an observer
        this.composer.layoutController.update();
      }

      this.composer.element.classList[active ? 'add' : 'remove'](`${prefix}-auto-height`);
      this.composer[active ? 'on' : 'off']('indexesChange, sectionResize, resize', this.update, this);

      if (active) {
        this.update();
      } else {
        this.composer.view.element.style.height = '';
      }
    }

  }
  Composer.registerAddon('autoHeight', AutoHeight);

  /**
   * Slide background video controller.
   * It search for .ms-bg-video element and sets it as video background
   */

  class BackgroundVideoController {
    constructor(section) {
      const videoSource = section.element.querySelector(`.${prefix}-bg-video`);
      section.hasBackgroundVideo = !!videoSource;

      if (!section.hasBackgroundVideo) {
        return;
      }

      this.videoSource = videoSource;
      this.section = section;
      this.composer = section.composer; // bg video is loop and muted by default

      this.looped = videoSource.getAttribute('data-loop') !== 'false';
      videoSource.muted = videoSource.getAttribute('data-muted') !== 'false'; // whether go to next section after video complete or not

      this.goNext = videoSource.getAttribute('data-goto-next') === 'true';
      this.autoPause = videoSource.getAttribute('data-auto-pause') === 'true';
      this.videoContainer = document.createElement('div');
      this.videoContainer.classList.add('ms-bg-video-container');
      this.videoContainer.appendChild(videoSource);
      section.element.appendChild(this.videoContainer); // set object fit
      // objectFit(videoSource, 'cover');

      responsiveObjectFit(videoSource, 'cover'); // iOS plays inline attribute

      videoSource.setAttribute('playsinline', '');
      videoSource.setAttribute('webkit-playsinline', ''); // waite for video ready
      // section.readyTrigger.hold()

      this._videoReady = this._videoReady.bind(this);
      videoSource.addEventListener('loadstart', this._videoReady, false);
      videoSource.addEventListener('loadedmetadata', this._videoReady, false);

      if (videoSource.readyState > 0) {
        this._videoReady();
      }

      section.on('activated, deactivated', this._sectionStateChange, this);
    }
    /**
     * On video player api ready
     */


    _videoReady() {
      if (this.videoReady) {
        return;
      }

      this.videoReady = true;
      this._videoStateChange = this._videoStateChange.bind(this);
      this.videoSource.addEventListener('play', this._videoStateChange, false);
      this.videoSource.addEventListener('pause', this._videoStateChange, false);
      this.videoSource.addEventListener('ended', this._videoStateChange, false);

      if (window.objectFitPolyfill) {
        window.objectFitPolyfill(this.videoSource);
      }

      if (this.section.active) {
        this.videoSource.play();
      } else {
        this.videoSource.pause();
        this.videoSource.currentTime = 0;
      } // this.section.readyTrigger.exec();

    }
    /**
     * On video state change including play, pause and ended
     * @param  {Event} event
     */


    _videoStateChange(event) {
      switch (event.type) {
        case 'play':
        default:
          this.videoState = 'playing';
          this.section.trigger('backgroundVideoPlay', [this.section], true);
          break;

        case 'pause':
          this.videoState = 'stopped';
          this.section.trigger('backgroundVideoPause', [this.section], true);
          break;

        case 'ended':
          this.videoState = 'ended';
          this.section.trigger('backgroundVideoEnded', [this.section], true);

          if (this.goNext) {
            this.composer.navigator.next();
          } else if (this.looped) {
            this.videoSource.play();
          }

      }
    }
    /**
     * On section select state change
     * @param  {String} action - select or deselect actions
     * @param  {MSSlide} section
     */


    _sectionStateChange(action) {
      if (!this.videoReady) {
        return;
      }

      switch (action) {
        case 'activated':
        default:
          this.videoSource.play();
          break;

        case 'deactivated':
          this.videoSource.pause();

          if (!this.autoPause) {
            this.videoSource.currentTime = 0;
          }

      }
    }

  }
  /* ------------------------------------------------------------------------------ */

  /**
   * Section background video addon
   */


  class SectionBackgroundVideo {
    constructor(composer) {
      this.composer = composer;
      this.activeSlides = [];
      this.composer.on('sectionBeforeMount', this._checkSection, this);
    }
    /**
     * After setting up each section, it checks the section element content for section video source
     * @param  {String} action
     * @param  {MSSlide} section
     */


    _checkSection(action, section) {
      if (!section.firstMount) {
        return;
      }

      section.backgroundVideoController = new BackgroundVideoController(section);

      if (section.hasBackgroundVideo) {
        return;
      }

      this.activeSlides.push(section);
    }

  }

  Composer.registerAddon('sectionBackgroundVideo', SectionBackgroundVideo);

  /**
   * This addon ready loading and section loading elements from markup and adds them in proper location
   */

  class Loading {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        sectionLoading: 'auto' // Specifies the type of sections loading, `auto` reads the markup for `ms-section-loading` then 'ms-loading-container'. `off` does not add any loading for sections

      });
      this.loadingElement = composer.element.querySelector(`.${prefix}-loading-container`); // create loading if it's not added in the markup

      if (!this.loadingElement) {
        this.loadingElement = document.createElement('div');
        this.loadingElement.classList.add(`${prefix}-loading-container`);
        const loadingSymbol = document.createElement('div');
        loadingSymbol.classList.add(`${prefix}-loading`);
        this.loadingElement.appendChild(loadingSymbol);
        this.composer.element.appendChild(this.loadingElement);
      }

      this.composer.on('init', this._afterInit, this);
    }
    /**
     * Add loading to sections after composer init
     */


    _afterInit() {
      if (this.composer.options.get('sectionLoading') !== 'off') {
        this.sectionLoadingTemplate = this.composer.element.querySelector(`.${prefix}-section-loading`) || this.loadingElement.cloneNode(true);
        this.sectionLoadingTemplate.remove();
        this.composer.view.sections.forEach(this._setupLoadingOnSection, this);
      }
    }
    /**
     * Adds loading element to section
     * @param {Section} section
     */


    _setupLoadingOnSection(section) {
      if (section.isReady) {
        return;
      }

      const loadingElement = this.sectionLoadingTemplate.cloneNode(true);
      section.element.appendChild(loadingElement);
    }

  }

  Composer.registerAddon('loading', Loading);

  /**
   * This addon disables click events over content while user starts swiping
   */

  class DisableClicks {
    constructor(composer) {
      this.composer = composer;
      this.actions = composer.actions;
      this.composer.on('init', this._init, this);
    }
    /**
     * Initialize the addon and check for swipe enabled on composer to add required actions
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */


    _init() {
      this._checkClick = this._checkClick.bind(this);
      this.composer.view.element.addEventListener('click', this._checkClick, false);
      this.composer.on('swipeStart', this._swipeInteraction, this);
      this.composer.on('swipeMove', this._swipeInteraction, this);
      this.composer.on('swipeEnd', this._swipeInteraction, this);
    }
    /**
     * Check swipe status and disable links if required
     */


    _swipeInteraction(action) {
      clearTimeout(this._to);

      if (action === 'swipeStart') {
        this._clickDisabled = true;
        this._hadMove = false;
      } else if (action === 'swipeMove') {
        this._hadMove = true;
      } else if (this._hadMove) {
        this._hadMove = false;
        this._to = setTimeout(() => {
          this._clickDisabled = false;
        }, 5);
      } else {
        this._clickDisabled = false;
      }
    }
    /**
     * Disable link on click
     */


    _checkClick(e) {
      if (this._clickDisabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

  }

  Composer.registerAddon('disableClicks', DisableClicks);

  /**
   * Smart loading  addon
   * It adds the `preload` option to the composer which can be used to control the procedure of loading assets.
   * The `preload` options has three types of functionality, first load assets of sections in sequence, second, load all assets then show the composer
   * and load only nearby sections
   */

  class SmartLoader {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        preload: 0 // Specifies number of sections which will be loaded by composer. 0 value means the composer loads sections in sequence.

      });
      this.composer.on('init', this._start, this, 100);
      this.composer.on('sectionBeforeMount', (action, section) => section.loadTrigger.hold(), this, 100);
      this.composer.on('layersSurfaceBeforeSetup', this._checkSurfaceLayers, this);
    }
    /**
     * Starts loading content
     */


    _start() {
      const preloadMode = this.composer.options.get('preload');

      if (preloadMode === 0) {
        this._loadSectionsInSequence();
      } else if (preloadMode === 'all') {
        this._waitForAllSections();
      } else if (typeof preloadMode === 'number') {
        this._loadNearby = preloadMode;
      } // add preload mode class name


      this.composer.element.classList.add(`${prefix}-preload-${preloadMode}`);
      this.composer.on('targetIndexChange', this._checkCurrentSection, this);

      this._checkCurrentSection();
    }
    /**
     * Prevents composer to load before all surface layers (overlay layers) get loaded
     * @param {String} action
     * @param {LayersSurface} surface
     */


    _checkSurfaceLayers(action, surface) {
      const preloadMode = this.composer.options.get('preload');

      if (preloadMode === 'all') {
        surface.loadTrigger.hold();
        this.composer.readyTrigger.hold();
        surface.on('ready', () => this.composer.readyTrigger.exec(), this);
        surface.loadTrigger.exec();
      }
    }
    /**
     * Starts loading current section and its nearby sections
     */


    _checkCurrentSection() {
      this.composer.navigator.targetSectionIndexes.forEach(index => {
        this.composer.view.sections[index].loadTrigger.exec();

        if (this._loadNearby) {
          this._loadNearbySections(index, this._loadNearby);
        }
      });
    }
    /**
     * Starts loading nearby sections of given index
     * @param  {Number} index
     * @param  {Number} num The number of sections that are considered as nearby
     */


    _loadNearbySections(index, num) {
      let targetIndex;
      const {
        sections
      } = this.composer.view;
      const {
        loop
      } = this.composer.view;
      const len = sections.length;

      for (let i = 1; i !== num + 1; i += 1) {
        targetIndex = index + i;

        if (targetIndex >= len) {
          if (loop) {
            targetIndex %= len;
            sections[targetIndex].loadTrigger.exec();
          }
        } else {
          sections[targetIndex].loadTrigger.exec();
        }

        targetIndex = index - i;

        if (targetIndex < 0) {
          if (loop) {
            targetIndex += len;
            sections[targetIndex].loadTrigger.exec();
          }
        } else {
          sections[targetIndex].loadTrigger.exec();
        }
      }
    }
    /**
     * Starts loading sections in sequence
     */


    _loadSectionsInSequence(index) {
      if (index === this.composer.view.sections.length) {
        return;
      }

      if (index === undefined) {
        index = 0;
      }

      const section = this.composer.view.sections[index];

      if (!section.isReady) {
        section.on('ready', () => {
          this._loadSectionsInSequence(index + 1);
        }, this);
        section.loadTrigger.exec();
      } else {
        this._loadSectionsInSequence(index + 1);
      }
    }
    /**
     * Prevents content to appear before all assets get loaded
     */


    _waitForAllSections() {
      this.composer.readyTrigger.charge(this.composer.view.sections.length);
      this.composer.view.sections.forEach(section => {
        if (section.isReady) {
          this.composer.readyTrigger.exec();
        } else {
          section.on('ready', () => this.composer.readyTrigger.exec(), this);
          section.loadTrigger.exec();
        }
      });
    }

  }

  Composer.registerAddon('smartLoader', SmartLoader);

  /**
   * Section video controller class, it creates video element on section and controls its playback.
   */

  class SectionVideoController {
    constructor(section) {
      let videoSource = section.element.querySelector('.ms-section-video, a[data-type="video"]');

      if (!videoSource) {
        this.noSource = true;
        return;
      }

      this.section = section;
      this.composer = section.composer;
      section.videoController = this;
      this.autoplay = videoSource.getAttribute('data-autoplay') === 'true';
      this.goNext = videoSource.getAttribute('data-goto-next') === 'true';

      if (videoSource.tagName === 'A') {
        const src = videoSource.getAttribute('href');
        videoSource.remove();
        videoSource = src;
      } else if (videoSource.tagName === 'VIDEO' && !videoSource.hasAttribute('data-player-type')) {
        if (videoSource.hasAttribute('data-object-fit')) {
          videoSource.style.objectFit = videoSource.getAttribute('data-object-fit');
        }

        if (videoSource.hasAttribute('data-object-position')) {
          videoSource.style.objectPosition = videoSource.getAttribute('data-object-position');
        }
      }

      this._videoElementReady = this._videoElementReady.bind(this);
      this.videoElement = new VideoElement(videoSource);
      this.videoElement.setup(this._videoElementReady); // make media element responsive

      if (this.videoElement.type === 'mejs') {
        this.videoElement.player.api.options.stretching = 'responsive';
      } // remove the class name from source


      this.videoElement.source.classList.remove('ms-section-video'); // add the class name to the player container

      this.videoElement.element.classList.add('ms-section-video'); // if the video is added by an A element;

      if (typeof videoSource === 'string') {
        section.element.appendChild(this.videoElement.element);
      } // add play and close button


      this.playBtn = document.createElement('div');
      this.playBtn.classList.add('ms-section-video-btn');
      this.playBtn.addEventListener('click', this.playVideo.bind(this), false);
      section.element.appendChild(this.playBtn);
      this.closeBtn = document.createElement('div');
      this.closeBtn.classList.add('ms-section-video-close-btn');
      this.closeBtn.addEventListener('click', this.closeVideo.bind(this), false);
      section.element.appendChild(this.closeBtn);
      section.on('activated, deactivated', this._sectionStateChange, this);
    }
    /**
     * Start playing section video
     */


    playVideo() {
      if (this.videoElement.ready) {
        this.videoElement.play();
      }

      this.section.element.classList.add(`${prefix}-video-open`);
      this.section.trigger('videoOpen', [this.section, this], true);
    }
    /**
     * Stop the section video and close it
     */


    closeVideo() {
      if (this.videoElement.ready) {
        this.videoElement.stop();
      }

      this.section.element.classList.remove(`${prefix}-video-open`);
      this.section.trigger('videoClose', [this.section, this], true);
    }
    /**
     * On video player api ready
     */


    _videoElementReady() {
      if (this.section.active && this.autoplay) {
        this.playVideo();
      }

      this._onVideoPlay = this._onVideoPlay.bind(this);
      this._onVideoPause = this._onVideoPause.bind(this);
      this._onVideoEnded = this._onVideoEnded.bind(this);
      this.videoElement.on('play', this._onVideoPlay);
      this.videoElement.on('pause', this._onVideoPause);
      this.videoElement.on('ended', this._onVideoEnded);
    }
    /**
     * Video play event listener
     */


    _onVideoPlay() {
      this._videoState = 'playing';
      this.section.trigger('videoPlay', [this.section, this], true);
    }
    /**
     * Video pause event listener
     */


    _onVideoPause() {
      this._videoState = 'stopped';
      this.section.trigger('videoPause', [this.section, this], true);
    }
    /**
     * Video ended event listener
     */


    _onVideoEnded() {
      this._videoState = 'ended';
      this.section.trigger('videoEnded', [this.section, this], true);

      if (this.goNext && this.composer.next) {
        this.composer.next();
      }
    }
    /**
     * On section select state change
     * @param  {Section} section
     */


    _sectionStateChange(action) {
      switch (action) {
        case 'select':
        default:
          if (this.autoplay) {
            this.playVideo();
          }

          break;

        case 'deselect':
          this.closeVideo();
      }
    }

  }
  /* ------------------------------------------------------------------------------ */


  class SectionVideo {
    constructor(composer) {
      this.composer = composer;
      this.actions = composer.actions;
      this.options = composer.options;
      this.activeSections = [];
      this.composer.on('init', () => {
        this.composer.view.sections.forEach(this._checkSection, this);
      });
    }
    /**
     * After setting up each section, it checks the section element content for section video source
     * @param  {String} action
     * @param  {Section} section
     */


    _checkSection(section) {
      const sectionVideoController = new SectionVideoController(section);

      if (sectionVideoController.noSource) {
        return;
      }

      this.activeSections.push(section);
    }

  }

  Composer.registerAddon('sectionVideo', SectionVideo);

  const classNameMatchTest = new RegExp(`${prefix}-hide-on-(tablet|desktop|phone)`, 'g');
  /**
   * This addon ready loading and section loading elements from markup and adds them in proper location
   */

  class HideOn {
    constructor(composer) {
      var _this$composerElement, _this$hideBreakpoints, _this$hideBreakpoints2;

      this.composer = composer;
      this.composerElement = this.composer.element;
      this.hideBreakpoints = (_this$composerElement = this.composerElement.getAttribute('class').match(classNameMatchTest)) === null || _this$composerElement === void 0 ? void 0 : _this$composerElement.map(className => className.split('-').slice(-1)[0]);

      if ((_this$hideBreakpoints = this.hideBreakpoints) !== null && _this$hideBreakpoints !== void 0 && _this$hideBreakpoints.includes(findBreakpoint().name || 'desktop')) {
        this._contentIsOnHold = true;
        this.composer.isHidden = true;
        composer.initTrigger.hold();
      }

      if ((_this$hideBreakpoints2 = this.hideBreakpoints) !== null && _this$hideBreakpoints2 !== void 0 && _this$hideBreakpoints2.length) {
        responsiveHelper.on('breakpointChange', this.update, this);
      }
    }

    update(action, breakpoint) {
      var _this$hideBreakpoints3;

      if ((_this$hideBreakpoints3 = this.hideBreakpoints) !== null && _this$hideBreakpoints3 !== void 0 && _this$hideBreakpoints3.includes(breakpoint)) {
        this.composer.isHidden = true;
        this.composer.trigger('visibilityChange', [true]);
      } else {
        this.composer.isHidden = false;

        if (this._contentIsOnHold) {
          this._contentIsOnHold = false;
          this.composer.initTrigger.exec();
        }

        this.composer.trigger('visibilityChange', [false]);
      }
    }

  }

  Composer.registerAddon('hideOn', HideOn);

  /**
   * This addon ready loading and section loading elements from markup and adds them in proper location
   */

  class KeyboardNav {
    constructor(composer) {
      this.composer = composer;
      this.composerElement = this.composer.element;
      this.composer.options.register({
        keyboard: false
      });
      this.composer.on('init', this.setup, this);
    }

    setup() {
      const keyboardOptions = this.composer.options.get('keyboard');
      const defaultOptions = {
        checkLoop: false,
        activeOnHover: false
      };

      if (keyboardOptions) {
        this.activeOptions = _objectSpread2(_objectSpread2({}, defaultOptions), typeof keyboardOptions === 'object' ? keyboardOptions : undefined);
        this._onKeydown = this._onKeydown.bind(this);

        if (this.activeOptions.activeOnHover) {
          this.composerElement.tabIndex = 0;
          this._mouseInteraction = this._mouseInteraction.bind(this);
          this.composerElement.addEventListener('mouseenter', this._mouseInteraction, false);
          this.composerElement.addEventListener('mouseleave', this._mouseInteraction, false);
        } else {
          document.addEventListener('keydown', this._onKeydown);
        }
      }
    }

    _mouseInteraction(event) {
      switch (event.type) {
        case 'mouseenter':
          this.composerElement.focus();
          this.composerElement.addEventListener('keydown', this._onKeydown, false);
          break;

        case 'mouseleave':
          this.composerElement.blur();
          this.composerElement.removeEventListener('keydown', this._onKeydown, false);
          break;
      }
    }

    _onKeydown(event) {
      const {
        which
      } = event;
      const {
        checkLoop
      } = this.activeOptions;

      if (which === 37 || which === 40) {
        this.composer.navigator.previous({
          checkLoop
        });
      } else if (which === 38 || which === 39) {
        this.composer.navigator.next({
          checkLoop
        });
      }
    }

  }

  Composer.registerAddon('keyboardNav', KeyboardNav);

  // more info: https://github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js

  const LINE_HEIGHT = 40; // delay between effective wheel events

  const WHEEL_THRESHOLD = 300; // minimum valid delta amount to slide

  const SLIDE_MIN_DELTA = 20;
  /**
   * This addon ready loading and section loading elements from markup and adds them in proper location
   */

  class MouseWheelNav {
    constructor(composer) {
      this.composer = composer;
      this.composerElement = this.composer.element;
      this.composer.options.register({
        mouseWheel: false
      });
      this.composer.on('init', this.setup, this);
    }

    setup() {
      const mouseWheelOptions = this.composer.options.get('mouseWheel');
      const defaultOptions = {
        activeOnAppear: true,
        preventDefault: 'auto',
        friction: 0.09
      };
      this._slideByWheel = this._slideByWheel.bind(this);
      this._scrollByWheel = this._scrollByWheel.bind(this);
      this._wheelDeltaBuffer = 0;
      this._lastWheelTime = 0;

      if (mouseWheelOptions) {
        this.options = _objectSpread2(_objectSpread2({}, defaultOptions), typeof mouseWheelOptions === 'object' ? mouseWheelOptions : undefined);
        const slickType = this.composer.options.get('navigator.slickType');
        this.view = this.composer.view;

        if (slickType === 'scroll') {
          this._readViewPosition = true;
          this.loop = this.composer.options.get('viewOptions.loop');
          this.composer.navigator.on('externalEffect', () => {
            this._readViewPosition = true;
          });
          this.composerElement.addEventListener('wheel', this._scrollByWheel, false);
        } else {
          this.composerElement.addEventListener('wheel', this._slideByWheel, false);
        }
      }
    }
    /**
     * Checks the slider element bounding values to ensure it's located in the browser view
     * @param  {Number} direction - Direction of scrolling
     * @return {Boolean} The true value means the slider is not in the view and page needs to scroll
     */


    _checkContentLocation(direction) {
      const bounding = this.composerElement.getBoundingClientRect();

      if (direction < 0 && bounding.top < 0) {
        return true;
      }

      if (direction > 0 && bounding.bottom > window.innerHeight) {
        return true;
      }

      return false;
    }
    /**
     * Navigates between slides by mouse wheel
     * @param  {WheelEvent} event
     */


    _slideByWheel(event) {
      let delta = event.deltaY;

      if (this.options.activeOnAppear && this._checkContentLocation(delta)) {
        return;
      }

      if (this.options.preventDefault === 'auto' && (this.composer.navigator.currentIndex === this.composer.navigator.count - 1 && delta > 1 || this.composer.navigator.currentIndex === 0 && delta < 1)) {
        return;
      }

      if (this.options.preventDefault) {
        event.preventDefault();
      }

      if (event.timeStamp - this._lastWheelTime < WHEEL_THRESHOLD) {
        return;
      } // delta in LINE units


      if (event.deltaMode === 1) {
        delta *= LINE_HEIGHT;
      }

      if (Math.abs(delta) < SLIDE_MIN_DELTA) {
        return;
      }

      if (delta < 0) {
        this.composer.navigator.previous();
      } else {
        this.composer.navigator.next();
      }

      this._lastWheelTime = event.timeStamp;
    }
    /**
     * Scroll between slides by wheel
     * @param  {WheelEvent} event
     */


    _scrollByWheel(event) {
      let delta = event.deltaY;

      if (this.options.activeOnAppear && this._checkContentLocation(delta)) {
        return;
      } // delta in LINE units


      if (event.deltaMode === 1) {
        delta *= LINE_HEIGHT;
      } // reached to the last slide ?


      if (this.targetScrollPosition >= this.view.length - this.view.size && delta > 1) {
        if (this.options.preventDefault === 'auto' || !this.options.preventDefault) {
          return;
        }
      } // is at first slide ?


      if (this.targetScrollPosition <= 0 && delta < 1) {
        if (this.options.preventDefault === 'auto' || !this.options.preventDefault) {
          return;
        }
      } // auto or true


      if (this.options.preventDefault) {
        event.preventDefault();
      }

      if (this._readViewPosition) {
        this._readViewPosition = false;
        this.targetScrollPosition = this.view.position;
      }

      this.targetScrollPosition += delta;

      if (!this.loop || this.options.preventDefault === 'auto') {
        this.targetScrollPosition = Math.max(Math.min(this.view.length - this.view.size, this.targetScrollPosition), 0);
      }

      this.composer.navigator.goToPosition(this.targetScrollPosition, {
        useFriction: this.options.friction !== 0,
        friction: this.options.friction
      });
      this._lastWheelTime = event.timeStamp;
    }

  }

  Composer.registerAddon('mouseWheelNav', MouseWheelNav);

  /**
   * This addon adds grab and grabbing cursors on the composer element
   */

  class GrabCursor {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        useGrabCursor: true
      });
      this.composer.on('init', this._afterInit, this);
    }
    /**
     * Add cursor class names to the composer element
     */


    _afterInit() {
      if (this.composer.options.get('useGrabCursor')) {
        const {
          element
        } = this.composer;
        element.classList.add(`${prefix}-cursor-grab`);
        this.composer.on('swipeStart', () => element.classList.add(`${prefix}-cursor-grabbing`));
        this.composer.on('swipeEnd', () => element.classList.remove(`${prefix}-cursor-grabbing`));
      }
    }

  }

  Composer.registerAddon('grabCursor', GrabCursor);

  const list = [];
  let isStopped = true;

  const tick = () => {
    if (isStopped) return;
    list.forEach(item => item());
    requestAnimationFrame(tick);
  };

  const start = () => {
    if (!isStopped) return;
    isStopped = false;
    tick();
  };
  const stop = () => {
    isStopped = true;
  };
  const add = listener => {
    list.push(listener);

    if (list.length === 1) {
      start();
    }

    return list.length;
  };
  const remove = listener => {
    list.splice(list.indexOf(listener), 1);

    if (list.length === 0) {
      stop();
    }
  };

  class Timer {
    constructor(delay, autoStart) {
      this.delay = delay;
      this.currentCount = 0;
      this.paused = false;
      this.onTimer = null;
      if (autoStart) this.start();
      this.update = this.update.bind(this);
    }

    start() {
      this.paused = false;
      this.lastTime = Date.now();
      add(this.update);
    }

    stop() {
      this.paused = true;
      remove(this.update);
    }

    reset() {
      this.currentCount = 0;
      this.paused = true;
      this.lastTime = Date.now();
    }

    update() {
      if (this.paused || Date.now() - this.lastTime < this.delay) return;
      this.currentCount += 1;
      this.lastTime = Date.now();
      if (this.onTimer) this.onTimer(this.getTime());
    }

    getTime() {
      return this.delay * this.currentCount;
    }

  }

  const defaultOptions = {
    autostart: false,
    duration: 3,
    // Global value for section duration. Used when section duration is not set for section(s).
    autoStartAfterVideo: true,
    // Don't start timer until background video starts
    pauseOnHover: true,
    // Pause autoPlay timer when mouse is over composer
    resetTimerOnBlur: true,
    // Resets Timer after mouse leaves the composer
    pauseAtEnd: 'auto',
    // Pauses composer timer after showing last section.
    navigatorParams: {
      animate: true,
      duration: 1.5,
      easing: 'easeOutExpo'
    }
  };

  class Slideshow {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        slideshow: false
      });
      this.timer = new Timer(100);
      this.timer.onTimer = this._onTimer.bind(this);
      this.mouseEntered = false;
      this.composer.on('init', this.setup, this, 100);
    }
    /**
     * Starts loading content
     */


    setup() {
      const slideshowOptions = this.composer.options.get('slideshow');
      this.options = _objectSpread2(_objectSpread2({}, defaultOptions), typeof slideshowOptions === 'object' ? slideshowOptions : {
        autostart: !!slideshowOptions
      }); // add required methods to the API

      this._registerAutoPlayMethods(); // Set default duration and then check for section duration


      this._readSectionSlideshowDataAttrs();

      this.loop = this.composer.view.options.get('loop');

      if (this.options.autostart) {
        this._start();

        this._waitForVideo();
      } else {
        // hard pause
        // it prevents the auto play starts with internal actions
        this.composer.slideshow.pause();
      }

      this.composer.on('changeStart', this._reset, this);
      this.composer.on('swipeStart', this._reset, this);
      this.composer.on('changeEnd', this._onChangeEnd, this); // Check if mouse interactions enabled

      if (this.options.pauseOnHover) {
        this._mouseInteraction = this._mouseInteraction.bind(this);
        this.composer.element.addEventListener('mouseover', this._mouseInteraction, false);
        this.composer.element.addEventListener('mouseenter', this._mouseInteraction, false);
        this.composer.element.addEventListener('mouseleave', this._mouseInteraction, false);
      } //  Pause timer when section video has opened


      this.composer.on('sectionVideoOpen', this._pause, this);
      this.composer.on('sectionVideoClose', this._start, this);
    }
    /**
     * Registers methods in the composer API
     */


    _registerAutoPlayMethods() {
      this.composer.slideshow = {
        currentTime: () => this.durationProgress,
        // Start timer
        resume: () => {
          this._hardPause = false;
          this.composer.paused = false;

          this._start();
        },
        // Pause timer
        pause: () => {
          this._hardPause = true;
          this.composer.paused = true;

          this._pause();
        },
        // Reset timer
        reset: () => this._reset,
        // isPaused flag
        isPaused: () => this._hardPause
      };
    }
    /**
     * Updates section duration (duration) for current section
     */


    _readSectionSlideshowDataAttrs() {
      this.duration = this.options.duration;
      const {
        slideshowDuration,
        slideshowPause
      } = this.composer.view.currentSection.element.dataset;

      if (slideshowDuration) {
        this.duration = slideshowDuration;
      }

      if (slideshowPause) {
        this.composer.slideshow.pause();
      }

      this.duration *= 1000;
    }
    /**
     * Starts section timer
     */


    _start() {
      if (this._hardPause) {
        return;
      }

      this._isPaused = false;
      this.timer.start();
      this.composer.trigger('slideshowStart');
    }
    /**
     * Pauses section timer
     */


    _pause() {
      this._isPaused = true;
      this.timer.stop();
      this.composer.trigger('slideshowPaused');
    }
    /**
     * Resets section timer and progress
     */


    _reset() {
      this.timer.reset();
      this.durationProgress = 0;
      this.composer.trigger('slideshowTimerUpdate', [this.durationProgress]);
      this.composer.trigger('slideshowTimerReset');
    }
    /**
     * Runs after changing section
     * Get section duration, check for mouse interaction, add section video actions
     */


    _onChangeEnd() {
      if ((this.options.pauseAtEnd === 'auto' && !this.loop || this.options.pauseAtEnd === true) && this.composer.navigator.targetIndex === this.composer.navigator.count - 1) {
        this.composer.slideshow.pause();
        return;
      }

      this._readSectionSlideshowDataAttrs();

      if (!this.mouseEntered) {
        this._start();

        this._waitForVideo();
      }
    }
    /**
     * Runs continuously
     * Change section after section duration
     * Calculates section progress
     */


    _onTimer() {
      if (this.timer.getTime() >= this.duration) {
        this.composer.navigator.next(this.options.navigatorParams);
      }

      this.durationProgress = this.timer.getTime() / this.duration * 100;
      this.composer.trigger('slideshowTimerUpdate', [this.durationProgress]);
    }
    /**
     * Checks mouse interaction to pause/resume/reset timer
     */


    _mouseInteraction(event) {
      switch (event.type) {
        case 'mouseenter':
        case 'mouseover':
          this.mouseEntered = true;

          this._pause();

          break;

        case 'mouseleave':
          this.mouseEntered = false;

          if (this.options.resetTimerOnBlur) {
            this._reset();
          }

          this._start();
      }
    }
    /**
     * Checks for existing video and related option to start timer after starting video
     */


    _waitForVideo() {
      const waitForVideo = this.options.autoStartAfterVideo;
      const {
        view: {
          currentSection: {
            backgroundVideoController,
            hasBackgroundVideo
          }
        }
      } = this.composer;

      if (waitForVideo && hasBackgroundVideo && backgroundVideoController.videoState !== 'playing') {
        this._reset();

        this.composer.on('sectionBackgroundVideoPlay', this._start, this);
        this.composer.on('sectionBackgroundVideoPlay', console.log, this);
      }
    }

  }

  Composer.registerAddon('slideshow', Slideshow);

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
  var smoothscroll = createCommonjsModule(function (module, exports) {
    (function () {

      function polyfill() {
        // aliases
        var w = window;
        var d = document; // return if scroll behavior is supported and polyfill is not forced

        if ('scrollBehavior' in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
          return;
        } // globals


        var Element = w.HTMLElement || w.Element;
        var SCROLL_TIME = 468; // object gathering original scroll methods

        var original = {
          scroll: w.scroll || w.scrollTo,
          scrollBy: w.scrollBy,
          elementScroll: Element.prototype.scroll || scrollElement,
          scrollIntoView: Element.prototype.scrollIntoView
        }; // define timing method

        var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;
        /**
         * indicates if a the current browser is made by Microsoft
         * @method isMicrosoftBrowser
         * @param {String} userAgent
         * @returns {Boolean}
         */

        function isMicrosoftBrowser(userAgent) {
          var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];
          return new RegExp(userAgentPatterns.join('|')).test(userAgent);
        }
        /*
         * IE has rounding bug rounding down clientHeight and clientWidth and
         * rounding up scrollHeight and scrollWidth causing false positives
         * on hasScrollableSpace
         */


        var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
        /**
         * changes scroll position inside an element
         * @method scrollElement
         * @param {Number} x
         * @param {Number} y
         * @returns {undefined}
         */

        function scrollElement(x, y) {
          this.scrollLeft = x;
          this.scrollTop = y;
        }
        /**
         * returns result of applying ease math function to a number
         * @method ease
         * @param {Number} k
         * @returns {Number}
         */


        function ease(k) {
          return 0.5 * (1 - Math.cos(Math.PI * k));
        }
        /**
         * indicates if a smooth behavior should be applied
         * @method shouldBailOut
         * @param {Number|Object} firstArg
         * @returns {Boolean}
         */


        function shouldBailOut(firstArg) {
          if (firstArg === null || typeof firstArg !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') {
            // first argument is not an object/null
            // or behavior is auto, instant or undefined
            return true;
          }

          if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
            // first argument is an object and behavior is smooth
            return false;
          } // throw error when behavior is not supported


          throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
        }
        /**
         * indicates if an element has scrollable space in the provided axis
         * @method hasScrollableSpace
         * @param {Node} el
         * @param {String} axis
         * @returns {Boolean}
         */


        function hasScrollableSpace(el, axis) {
          if (axis === 'Y') {
            return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
          }

          if (axis === 'X') {
            return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
          }
        }
        /**
         * indicates if an element has a scrollable overflow property in the axis
         * @method canOverflow
         * @param {Node} el
         * @param {String} axis
         * @returns {Boolean}
         */


        function canOverflow(el, axis) {
          var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
          return overflowValue === 'auto' || overflowValue === 'scroll';
        }
        /**
         * indicates if an element can be scrolled in either axis
         * @method isScrollable
         * @param {Node} el
         * @param {String} axis
         * @returns {Boolean}
         */


        function isScrollable(el) {
          var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
          var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
          return isScrollableY || isScrollableX;
        }
        /**
         * finds scrollable parent of an element
         * @method findScrollableParent
         * @param {Node} el
         * @returns {Node} el
         */


        function findScrollableParent(el) {
          while (el !== d.body && isScrollable(el) === false) {
            el = el.parentNode || el.host;
          }

          return el;
        }
        /**
         * self invoked function that, given a context, steps through scrolling
         * @method step
         * @param {Object} context
         * @returns {undefined}
         */


        function step(context) {
          var time = now();
          var value;
          var currentX;
          var currentY;
          var elapsed = (time - context.startTime) / SCROLL_TIME; // avoid elapsed times higher than one

          elapsed = elapsed > 1 ? 1 : elapsed; // apply easing to elapsed time

          value = ease(elapsed);
          currentX = context.startX + (context.x - context.startX) * value;
          currentY = context.startY + (context.y - context.startY) * value;
          context.method.call(context.scrollable, currentX, currentY); // scroll more if we have not reached our destination

          if (currentX !== context.x || currentY !== context.y) {
            w.requestAnimationFrame(step.bind(w, context));
          }
        }
        /**
         * scrolls window or element with a smooth behavior
         * @method smoothScroll
         * @param {Object|Node} el
         * @param {Number} x
         * @param {Number} y
         * @returns {undefined}
         */


        function smoothScroll(el, x, y) {
          var scrollable;
          var startX;
          var startY;
          var method;
          var startTime = now(); // define scroll context

          if (el === d.body) {
            scrollable = w;
            startX = w.scrollX || w.pageXOffset;
            startY = w.scrollY || w.pageYOffset;
            method = original.scroll;
          } else {
            scrollable = el;
            startX = el.scrollLeft;
            startY = el.scrollTop;
            method = scrollElement;
          } // scroll looping over a frame


          step({
            scrollable: scrollable,
            method: method,
            startTime: startTime,
            startX: startX,
            startY: startY,
            x: x,
            y: y
          });
        } // ORIGINAL METHODS OVERRIDES
        // w.scroll and w.scrollTo


        w.scroll = w.scrollTo = function () {
          // avoid action when no arguments are passed
          if (arguments[0] === undefined) {
            return;
          } // avoid smooth behavior if not required


          if (shouldBailOut(arguments[0]) === true) {
            original.scroll.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : w.scrollX || w.pageXOffset, // use top prop, second argument if present or fallback to scrollY
            arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : w.scrollY || w.pageYOffset);
            return;
          } // LET THE SMOOTHNESS BEGIN!


          smoothScroll.call(w, d.body, arguments[0].left !== undefined ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== undefined ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
        }; // w.scrollBy


        w.scrollBy = function () {
          // avoid action when no arguments are passed
          if (arguments[0] === undefined) {
            return;
          } // avoid smooth behavior if not required


          if (shouldBailOut(arguments[0])) {
            original.scrollBy.call(w, arguments[0].left !== undefined ? arguments[0].left : typeof arguments[0] !== 'object' ? arguments[0] : 0, arguments[0].top !== undefined ? arguments[0].top : arguments[1] !== undefined ? arguments[1] : 0);
            return;
          } // LET THE SMOOTHNESS BEGIN!


          smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
        }; // Element.prototype.scroll and Element.prototype.scrollTo


        Element.prototype.scroll = Element.prototype.scrollTo = function () {
          // avoid action when no arguments are passed
          if (arguments[0] === undefined) {
            return;
          } // avoid smooth behavior if not required


          if (shouldBailOut(arguments[0]) === true) {
            // if one number is passed, throw error to match Firefox implementation
            if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
              throw new SyntaxError('Value could not be converted');
            }

            original.elementScroll.call(this, // use left prop, first number argument or fallback to scrollLeft
            arguments[0].left !== undefined ? ~~arguments[0].left : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft, // use top prop, second argument or fallback to scrollTop
            arguments[0].top !== undefined ? ~~arguments[0].top : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop);
            return;
          }

          var left = arguments[0].left;
          var top = arguments[0].top; // LET THE SMOOTHNESS BEGIN!

          smoothScroll.call(this, this, typeof left === 'undefined' ? this.scrollLeft : ~~left, typeof top === 'undefined' ? this.scrollTop : ~~top);
        }; // Element.prototype.scrollBy


        Element.prototype.scrollBy = function () {
          // avoid action when no arguments are passed
          if (arguments[0] === undefined) {
            return;
          } // avoid smooth behavior if not required


          if (shouldBailOut(arguments[0]) === true) {
            original.elementScroll.call(this, arguments[0].left !== undefined ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== undefined ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
            return;
          }

          this.scroll({
            left: ~~arguments[0].left + this.scrollLeft,
            top: ~~arguments[0].top + this.scrollTop,
            behavior: arguments[0].behavior
          });
        }; // Element.prototype.scrollIntoView


        Element.prototype.scrollIntoView = function () {
          // avoid smooth behavior if not required
          if (shouldBailOut(arguments[0]) === true) {
            original.scrollIntoView.call(this, arguments[0] === undefined ? true : arguments[0]);
            return;
          } // LET THE SMOOTHNESS BEGIN!


          var scrollableParent = findScrollableParent(this);
          var parentRects = scrollableParent.getBoundingClientRect();
          var clientRects = this.getBoundingClientRect();

          if (scrollableParent !== d.body) {
            // reveal element inside parent
            smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top); // reveal parent in viewport unless is fixed

            if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
              w.scrollBy({
                left: parentRects.left,
                top: parentRects.top,
                behavior: 'smooth'
              });
            }
          } else {
            // reveal element in viewport
            w.scrollBy({
              left: clientRects.left,
              top: clientRects.top,
              behavior: 'smooth'
            });
          }
        };
      }

      {
        // commonjs
        module.exports = {
          polyfill: polyfill
        };
      }
    })();
  });

  smoothscroll.polyfill();
  /* ------------------------------------------------------------------------------ */
  // actions list

  const actions = composer => ({
    openURL(url, target) {
      window.open(url, target);
    },

    slideshow(action) {
      if (['resume', 'pause', 'reset'].includes(action)) {
        var _composer$slideshow$a, _composer$slideshow;

        (_composer$slideshow$a = (_composer$slideshow = composer.slideshow)[action]) === null || _composer$slideshow$a === void 0 ? void 0 : _composer$slideshow$a.call(_composer$slideshow);
      }
    },

    gotoSlide(to) {
      if (['next', 'previous'].includes(to)) {
        var _composer$navigator$t, _composer$navigator;

        (_composer$navigator$t = (_composer$navigator = composer.navigator)[to]) === null || _composer$navigator$t === void 0 ? void 0 : _composer$navigator$t.call(_composer$navigator);
      } else if (!Number.isNaN(to)) {
        composer.navigator.gotoIndex(to);
      } else {
        const targetSectionIndex = composer.view.sections.findIndex(section => section.id === to);

        if (targetSectionIndex >= 0) {
          composer.navigator.gotoIndex(targetSectionIndex);
        }
      }
    },

    scrollTo(to) {
      if (to === 'below') {
        window.scrollTo({
          top: window.scrollY + composer.element.getBoundingClientRect().bottom,
          behavior: 'smooth'
        });
      } else {
        var _document$querySelect;

        (_document$querySelect = document.querySelector(to)) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },

    backgroundVideo(action) {
      var _composer$view$curren, _composer$view$curren2;

      const bgVideo = (_composer$view$curren = composer.view.currentSection) === null || _composer$view$curren === void 0 ? void 0 : (_composer$view$curren2 = _composer$view$curren.backgroundVideoController) === null || _composer$view$curren2 === void 0 ? void 0 : _composer$view$curren2.videoSource;

      if (!bgVideo) {
        return;
      }

      try {
        switch (action) {
          case 'mute':
            bgVideo.muted = true;
            break;

          case 'unmute':
            bgVideo.muted = false;
            break;

          case 'toggleSound':
            bgVideo.muted = !bgVideo.muted;
            break;

          case 'toggle':
            if (bgVideo.paused) {
              bgVideo.play();
            } else {
              bgVideo.pause();
            }

            break;

          case 'stop':
            bgVideo.pause();
            bgVideo.currentTime = 0;
            break;

          case 'play':
            bgVideo.play();
            break;

          case 'pause':
            bgVideo.pause();
            break;

          case 'restart':
            bgVideo.play();
            bgVideo.currentTime = 0;
            break;

          default:
        } // eslint-disable-next-line no-empty

      } catch (e) {}
    },

    elements(target, action) {
      var _targetLayer$inOutAni, _targetLayer$inOutAni2;

      const targetLayer = composer.layersById[target];

      if (!targetLayer) {
        return;
      }

      switch (action) {
        case 'show':
          targetLayer === null || targetLayer === void 0 ? void 0 : targetLayer.animateInOut('in', true);
          break;

        case 'hide':
          targetLayer === null || targetLayer === void 0 ? void 0 : targetLayer.animateInOut('out', true);
          break;

        case 'toggle':
          if ((targetLayer === null || targetLayer === void 0 ? void 0 : (_targetLayer$inOutAni = targetLayer.inOutAnimation) === null || _targetLayer$inOutAni === void 0 ? void 0 : _targetLayer$inOutAni.activePhase) === 'in') {
            targetLayer === null || targetLayer === void 0 ? void 0 : targetLayer.animateInOut('out', true);
          }

          if ((targetLayer === null || targetLayer === void 0 ? void 0 : (_targetLayer$inOutAni2 = targetLayer.inOutAnimation) === null || _targetLayer$inOutAni2 === void 0 ? void 0 : _targetLayer$inOutAni2.activePhase) === 'out') {
            targetLayer === null || targetLayer === void 0 ? void 0 : targetLayer.animateInOut('in', true);
          }

          break;
      }
    }

  });

  const domEvents = ['click', 'mouseenter', 'mouseleave'];

  const assignActions = (actionFunctions, htmlElement, from) => {
    const actionsData = htmlElement.dataset.actions;

    if (!actionsData) {
      return;
    }

    let actionsList = [];

    try {
      actionsList = JSON.parse(actionsData.replace(/'/g, '"')); // eslint-disable-next-line no-empty
    } catch (e) {}

    actionsList.forEach(([actionName, actionEvent, actionDelay, ...actionParams]) => {
      if (domEvents.includes(actionEvent)) {
        htmlElement.addEventListener(actionEvent, () => callAction(actionFunctions[actionName], actionParams, actionDelay));
      } else {
        from.on(actionEvent, () => callAction(actionFunctions[actionName], actionParams, actionDelay));
      }
    });
  };

  const callAction = (actionCallback, actionParams, delay = 0) => {
    if (delay) {
      setTimeout(() => {
        actionCallback === null || actionCallback === void 0 ? void 0 : actionCallback.apply(null, actionParams);
      }, delay);
    } else {
      actionCallback === null || actionCallback === void 0 ? void 0 : actionCallback.apply(null, actionParams);
    }
  };
  /**
   * This addon ready loading and section loading elements from markup and adds them in proper location
   */


  class Actions {
    constructor(composer) {
      this.composer = composer;
      this.composer.on('init', this._afterInit, this);
      this.composer.on('layerCreate', this._setLayerActions, this);
      this.composer.actions = actions(composer);
    }
    /**
     * Add loading to sections after composer init
     */


    _afterInit() {
      this.composer.view.sections.forEach(section => assignActions(this.composer.actions, section.element, section));
    }

    _setLayerActions(action, layer) {
      assignActions(this.composer.actions, layer.element, layer);
    }
    /**
     * Adds loading element to section
     * @param {Section} section
     */


    _setupLoadingOnSection(section) {
      if (section.isReady) {
        return;
      }

      const loadingElement = this.sectionLoadingTemplate.cloneNode(true);
      section.element.appendChild(loadingElement);
    }

  }

  Composer.registerAddon('actions', Actions);

  /**
   * This addon adds the proper revert styles class name to the composer
   */

  class RevertStyles {
    constructor(composer) {
      this.composer = composer;
      this.composer.options.register({
        useRevertStyles: true
      });
      this.composer.on('init', this._afterInit, this);
    }
    /**
     * Add cursor class names to the composer element
     */


    _afterInit() {
      if (this.composer.options.get('useRevertStyles')) {
        var _window, _window$CSS;

        if ((_window = window) !== null && _window !== void 0 && (_window$CSS = _window.CSS) !== null && _window$CSS !== void 0 && _window$CSS.supports('all', 'revert')) {
          this.composer.element.classList.add(`${prefix}-modern-revert-styles`);
        } else {
          this.composer.element.classList.remove(`${prefix}-modern-revert-styles`);
          this.composer.element.classList.add(`${prefix}-legacy-revert-styles`);
        }
      }
    }

  }

  Composer.registerAddon('revertStyles', RevertStyles);

  /**
   * Master Slider main class
   * Each instance of this class creates new slider
   */

  class MasterSlider extends Composer {
    static setup(selector, options) {
      const targetElement = document.querySelector(selector);

      if (!targetElement) {
        return undefined;
      }

      const slider = new MasterSlider();
      slider.setup(targetElement, options);
      MasterSlider.instances.push(slider);
      return slider;
    }

    setup(element, options = {}) {
      super.setup(element, options); // update composer default values and register new options

      this.options.register({});
    }

  }

  _defineProperty(MasterSlider, "instances", []);

  return MasterSlider;

}));
//# sourceMappingURL=masterslider.js.map
