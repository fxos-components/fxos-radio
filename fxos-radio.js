(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("fxosComponent"));
	else if(typeof define === 'function' && define.amd)
		define(["fxosComponent"], factory);
	else if(typeof exports === 'object')
		exports["FXOSRadio"] = factory(require("fxosComponent"));
	else
		root["FXOSRadio"] = factory(root["fxosComponent"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {


	/**
	 * Dependencies
	 */
	var component = __webpack_require__(1);

	/**
	 * Simple logger (toggle 0)
	 *
	 * @type {Function}
	 */
	var debug = 0 ? console.log.bind(console, '[fxos-radio]') : function() {};

	/**
	 * Exports
	 */
	module.exports = component.register('fxos-radio', {
	  created() {
	    this.setupShadowRoot();

	    // Elements
	    this.els = {
	      inner: this.shadowRoot.querySelector('.inner')
	    };

	    // Events
	    on(this, 'click', e => this.onClick(e));

	    // Properties
	    this.checked = this.getAttribute('checked');
	    this.disabled = this.getAttribute('disabled');
	    this.danger = this.getAttribute('danger');
	    this.name = this.getAttribute('name');

	    // Bind label listeners in the next turn
	    // to make sure that HTML has been parsed.
	    setTimeout(() => {
	    	this.makeAccessible();
	    	this.bindLabels();
	    });
	  },

	  /**
	   * Accessibility enhancements.
	   * Read fxos-radio as radio button.
	   * make it tabable
	   * read its checked and disabled state
	   */
	  makeAccessible() {
	    this.setAttribute('role', 'radio');

	    // Make tabable
	    this.tabIndex = 0;

	    this.setAttribute('aria-checked', this.checked || this.checked === '');
	    if (this.disabled) this.setAttribute('aria-disabled', true);
	  },

	  /**
	   * Known attribute property
	   * descriptors.
	   *
	   * These setters get called when matching
	   * attributes change on the element.
	   *
	   * @type {Object}
	   */
	  attrs: {
	    checked: {
	      get() { return this._checked; },
	      set(value) {
	        value = arguments.length ? value : !this.checked;
	        if (value || value === '') {
	          this.check();
	        } else {
	          this.uncheck();
	        }
	      }
	    },

	    danger: {
	      get() { return this._danger; },
	      set(value) {
	        debug('set danger', value);
	        if (value || value === '') {
	          this.els.inner.setAttribute('danger', value);
	        } else {
	          this.els.inner.removeAttribute('danger');
	        }
	        this._danger = value;
	      }
	    },

	    name: {
	      get() { return this._name; },
	      set(value) {
	        debug('set name', value);
	        if (value === null) {
	          this.els.inner.removeAttribute('name');
	        } else {
	          this.els.inner.setAttribute('name', value);
	        }
	        this._name = value;
	      }
	    },

	    disabled: {
	      get() { return this._disabled; },
	      set(value) {
	        value = !!(value || value === '');
	        if (this._disabled === value) { return; }
	        debug('set disabled', value);
	        this._disabled = value;
	        if (value) {
	          this.setAttribute('disabled', '');
	          this.setAttribute('aria-disabled', true);
	        } else {
	          this.removeAttribute('disabled');
	          this.removeAttribute('aria-disabled');
	        }
	      }
	    }
	  },

	 /**
	  * Handles a click event.
	  */
	  onClick(e) {
	    debug('click', e);
	    e.stopPropagation();
	    if (this.disabled) return;
	    this.checked = true;
	  },

	  bindLabels() {
	    if (!this.id) {
	      debug('no id provided to associate with a label');
	      return;
	    }

	    var els = document.querySelectorAll(`label[for="${this.id}"]`);
	    var labelledBy = '';

	    [].forEach.call(els, el => {
	      on(el, 'click', e => this.onClick(e));
	      if (el.id) labelledBy += ' ' + el.id;
	    });

	    this.setAttribute('aria-labelledby', labelledBy.trim());
	    debug('bound labels', els);
	  },

	  check() {
	    if (this.checked) return;
	    this.uncheckGroup();
	    this.setAttr('checked', '');
	    this.setAttribute('aria-checked', true);
	    this._checked = true;
	  },

	  uncheck() {
	    if (!this.checked) return;
	    this.removeAttr('checked');
	    this.setAttribute('aria-checked', false);
	    this._checked = false;
	  },

	  uncheckGroup() {
	    var selector = `fxos-radio[name="${this.name}"]`;
	    var els = document.querySelectorAll(selector);
	    [].forEach.call(els, el => el.checked = false);
	  },

	  template: `
	    <button class="inner" role="presentation"></button>
	    <style>
	      :host {
	        display: inline-block;
	        width: 22px;
	        height: 22px;
	        outline: 0;
	        cursor: pointer;
	      }

	      :host([disabled]) {
	        pointer-events: none;
	        opacity: 0.5;
	      }

	      .inner {
	        display: block;
	        position: relative;
	        width: 100%;
	        height: 100%;
	        margin: 0;
	        padding: 0;
	        background: none;
	        border-radius: 50%;
	        border: solid 2px;
	        color:
	          var(--fxos-radio-color,
	          var(--fxos-brand-color,
	          #00AACC));
	      }

	      [danger].inner {
	        color:
	          var(--fxos-radio-color-danger,
	          var(--fxos-color-danger,
	          #B90000));
	      }

	      [checked].inner:after {
	        content: "";
	        position: absolute;
	        top: calc(50% - 5px);
	        left: calc(50% - 5px);
	        display: block;
	        width: 10px;
	        height: 10px;
	        background: currentColor;
	        border-radius: 50%;
	      }
	    </style>`
	});

	/**
	 * Utils
	 */

	function on(el, name, fn) { el.addEventListener(name, fn); }


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;