/* global marionette, setup, test */

'use strict';

var assert = require('chai').assert;
marionette.plugin('helper', require('marionette-helper'));

marionette('fxos-radio', function() {
  var client = marionette.client({
    profile: {
      prefs: {
        // Disable first time run UI
        'browser.feeds.showFirstRunUI': false,
        // Disable default browser check
        'browser.shell.checkDefaultBrowser': false,
        // Disable UI tutorial
        'browser.uitour.enabled': false,
        // Enable chrome debugging
        'devtools.chrome.enabled': true,
        'devtools.debugger.remote-enabled': true,

        // Load integration test page on startup
        'startup.homepage_welcome_url': __dirname + '/test-integration.html',

        // Enable web components
        'dom.webcomponents.enabled': true,
        // Enable touch events
        'dom.w3c_touch_events.enabled': 1
      }
    },
    desiredCapabilities: {
      raisesAccessibilityExceptions: true
    }
  });

  var radios = [{
    selector: '#b1',
    checked: true,
    enabled: true
  }, {
    selector: '#b2',
    checked: false,
    enabled: true
  }, {
    selector: '#b3',
    checked: false,
    enabled: true
  }, {
    selector: '#b4',
    checked: false,
    enabled: false
  }];

  function isChecked(subject) {
    return subject.scriptWith(function(element) {
      return element.hasAttribute('checked');
    });
  }

  /**
   * Wait until makeAccessible method is called for all radios.
   * @return {[type]} [description]
   */
  function waitForRadiosReady() {
    client.waitFor(() => client.executeScript(function(selectors) {
      return selectors.reduce((prev, selector) =>
        prev && document.wrappedJSObject.querySelector(
          selector).hasAttribute('role'), true);
    }, [radios.map(radio => radio.selector)]));
  }

  /**
   * Perform a marionette operation and assert if an error is thrown.
   * @param  {Function} testFn operation to perform
   * @param  {String} message error message for the assert statement
   */
  function failOnA11yError(testFn, message) {
    try {
      testFn();
    } catch (err) {
      // Marionette raises an ElementNotAccessibleError exception when
      // raisesAccessibilityExceptions is set to true.
      assert(false, [message, err.message].join(' '));
    }
  }

  setup(function() {
    radios.forEach(function(radio) {
      radio.element = client.helper.waitForElement(radio.selector);
    });
    waitForRadiosReady();
  });

  test('fxos-radios present and visible to the assistive technology',
    function() {
      radios.forEach(function(radio) {
        // Element is found
        assert.ok(radio.element, radio.selector);
        // Element is visible to all (inlcuding assistive technology)
        failOnA11yError(function() {
          assert.isTrue(radio.element.displayed());
        }, 'fxos-radio element should be visible both normally and to ' +
          'assistive technology.');

        assert.equal(isChecked(radio.element), radio.checked, radio.selector);
      });
  });

  test('fxos-radio is accessible (no error thrown when clicking and tapping) ' +
    'when it is checked or unchecked', function() {
    ['click', 'tap'].forEach(function(action) {
      radios.forEach(function(radio) {
        // The following checks for control element will be performed on
        // tap/click:
        // * visible to the assistive technology
        // * enabled to the assistive technology
        // * not obstructed via pointer-events set to none
        // * focusable by the assistive technology
        // * named/labelled for the assistive technology
        // * support user actions (click/tap/etc) performed via assistive
        //   technology
        if (radio.enabled) {
          failOnA11yError(function() {
            radio.element[action]();
          }, 'fxos-radio should be clickable and tappable including via the ' +
            'assistive technology.');
          // Radio should be checked when it is clicked or tapped
          assert.equal(isChecked(radio.element), true, radio.selector);
        } else {
          try {
            radio.element[action]();
          } catch (err) {
            assert.equal(err.type, 'ElementNotAccessibleError', 'disabled ' +
              'fxos-radio button is not clickable or tappable and ' +
              'clicking/tapping will result in an ElementNotAccessibleError.');
            // Disabled radio should not be checked when it is clicked or tapped
            assert.equal(isChecked(radio.element), false, radio.selector);
          }
        }
      });
    });
  });
});
