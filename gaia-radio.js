/*globals define*/

(function(define){'use strict';define(function(require,exports,module){

/**
 * Dependencies
 */
var component = require('gaia-component');

/**
 * Simple logger (toggle 0)
 *
 * @type {Function}
 */
var debug = 0 ? console.log.bind(console) : function() {};

/**
 * Exports
 */
module.exports = component.register('gaia-radio', {
  created: function() {
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
      this.bindLabels();
      this.makeAccessible();
    });
  },

  /**
   * Accessibility enhancements.
   * Read gaia-radio as radio button.
   * make it tabable
   * read its checked and disabled state
   */
  makeAccessible: function() {
    this.setAttribute('role', 'radio');

    // Make tabable
    this.tabIndex = 0;

    this.setAttribute('aria-checked', this.checked || this.checked === '');
    if (this.disabled) {
      this.setAttribute('aria-disabled', true);
    }
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
      get: function() { return this._checked; },
      set: function(value) {
        value = arguments.length ? value : !this.checked;
        if (value || value === '') {
          this.check();
        } else {
          this.uncheck();
        }
      }
    },

    danger: {
      get: function() { return this._danger; },
      set: function(value) {
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
      get: function() { return this._name; },
      set: function(value) {
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
      get: function() { return this._disabled; },
      set: function(value) {
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
  onClick: function(e) {
    debug('click', e);
    e.stopPropagation();
    if (this.disabled) { return; }
    this.checked = true;
  },

  bindLabels: function() {
    if (!this.id) {
      debug('no id provided to associate with a label');
      return;
    }
    debug('binding a label to gaia-radio');
    var selector = `label[for="${this.id}"]`;
    var els = document.querySelectorAll(selector);
    debug(this.id, els.length, selector);
    [].forEach.call(els, el => on(el, 'click', e => this.onClick(e)));
  },

  check: function() {
    if (this.checked) { return; }
    this.uncheckGroup();
    this.setAttr('checked', '');
    this.setAttribute('aria-checked', true);
    this._checked = true;
  },

  uncheck: function() {
    if (!this.checked) { return; }
    this.removeAttr('checked');
    this.setAttribute('aria-checked', false);
    this._checked = false;
  },

  uncheckGroup: function() {
    var selector = `gaia-radio[name="${this.name}"]`;
    var els = document.querySelectorAll(selector);
    [].forEach.call(els, el => el.checked = false);
  },

  template: `
    <button class="inner" id="inner" role="presentation"></button>

    <style>

    :host {
      display: inline-block;
      width: 2.2rem;
      height: 2.2rem;
      outline: 0;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
    }

    /**
     * Inner
     */

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
      color: var(--color, #00AACC);
    }

    /**
     * danger
     */

    [danger].inner {
      color: var(--color-danger, #B90000);
    }

    /**
     * checked
     */

    [checked].inner:after {
      content: "";
      position: absolute;
      top: calc(50% - 0.5rem);
      left: calc(50% - 0.5rem);
      display: block;
      width: 1rem;
      height: 1rem;
      background: currentColor;
      border-radius: 50%;
    }

    </style>`
});

function on(el, name, fn) { el.addEventListener(name, fn); }

});})((function(n,w){'use strict';return typeof define=='function'&&define.amd?
define:typeof module=='object'?function(c){c(require,exports,module);}:
function(c){var m={exports:{}},r=function(n){return w[n];};
w[n]=c(r,m.exports,m)||m.exports;};})('gaia-radio',this));
