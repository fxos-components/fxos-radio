/* jshint maxlen:120 */
/* global sinon, suite, setup, teardown, test, assert,
   a1, a2, a3, b1, b2, b3, b4 */

suite('fxos-radio', function() {
  'use strict';

  var accessibility = window['test-utils'].accessibility;

  /**
   * Test role and aria attributes are set correctly inside fxos-radio.
   * @param  {Element} gaiaRadio gaia radio to test
   * @param  {Boolean?} checked optional expected aria-checked value
   * @param  {Boolean?} disabled optional expected aria-disabled value
   */
  function testRadioAttributes(gaiaRadio, checked, disabled) {
    assert.equal(gaiaRadio.getAttribute('role'), 'radio');
    assert.equal(gaiaRadio.getAttribute('aria-checked') === 'true', checked);
    assert.equal(gaiaRadio.hasAttribute('aria-disabled'), disabled);
  }

  setup(function() {
    this.sandbox = sinon.sandbox.create();
    this.container = document.createElement('div');
    this.container.innerHTML = `
      <fxos-radio id="a1" name="a"></fxos-radio>
      <fxos-radio id="a2" name="a" checked ></fxos-radio>
      <fxos-radio id="a3" name="a"></fxos-radio>

      <label id="label" for="b1">B1 Label</label>
      <fxos-radio id="b1" name="b"></fxos-radio>
      <fxos-radio id="b2" name="b" checked></fxos-radio>
      <fxos-radio id="b3" name="b"></fxos-radio>
      <fxos-radio id="b4" name="b" disabled></fxos-radio>`;

    this.radios = this.container.querySelectorAll('fxos-radio');
    document.body.appendChild(this.container);
  });

  teardown(function() {
    this.sandbox.restore();
    document.body.removeChild(this.container);
    this.container = null;
  });

  test('It becomes `checked` when clicked', function() {
    a1.click();
    assert.isTrue(a1.hasAttribute('checked'));
  });

  test('It unchecks other radios in the group when checked', function() {
    a1.click();
    assert.isFalse(a2.hasAttribute('checked'));
  });

  test('It responds to clicks on linked <labels>', function(done) {
    // Timeout required as listeners are
    // bound in the next turn of the event loop
    setTimeout(function() {
      document.getElementById('label').click();
      assert.isTrue(b1.hasAttribute('checked'));
      done();
    });
  });

  test('It resonds to attribute changes', function() {
    a1.setAttribute('checked', '');
    assert.isFalse(a2.hasAttribute('checked'));
  });

  test('It responds to setting `.checked` property', function() {
    a1.checked = true;
    assert.isTrue(a1.hasAttribute('checked'));
    assert.isFalse(a2.hasAttribute('checked'));

    a3.checked = true;
    assert.isTrue(a3.hasAttribute('checked'));
    assert.isFalse(a1.hasAttribute('checked'));
  });

  test('Radio\'s checked state does not changed when it is clicked when ' +
    'disabled', function() {
    b4.click();
    assert.isTrue(b2.hasAttribute('checked'));
    assert.isFalse(b4.hasAttribute('checked'));
  });

  suite('accessibility', function() {
    /**
     * Accessibility test utils module tests the following things, amongst other
     * checks (all at once).:
     *  - ARIA attributes specific checks
     *  - accesskey uniqueness if applicable
     *  - Presence of alternative descriptions, labels and names
     *  - Color contrast
     *  - Markup is semantically correct from a11y standpoint
     *  - Heading order
     *  - Frame/document title and language
     *  - Landmarks if applicable
     *  - Keyboard focusability and tabindex
     *
     * Its checks are called at different stages and within different states of
     * the component.
     */

    setup(function(done) {
      // Accessibility attributes are set after the HTML has been parsed.
      setTimeout(done);
    });

    test('fxos-radios default states pass all accessibility checks mentioned ' +
      'above and have attributes correctly set',
      function(done) {
        [a2, b2].forEach(r => testRadioAttributes(r, true, false));
        [a1, a3, b1, b3].forEach(r => testRadioAttributes(r, false, false));
        testRadioAttributes(b4, false, true);
        accessibility.check(this.container).then(done, done);
      });

    test('fxos-radios pass all accessibility checks mentioned above when ' +
      'they are checked and unchecked', function(done) {
      b1.click();
      accessibility.check(this.container).then(() => {
        b3.click();
        return accessibility.check(this.container);
      }).then(() => {
        b2.setAttribute('checked', '');
        return accessibility.check(this.container);
      }).then(() => {
        b1.checked = true;
        return accessibility.check(this.container);
      }).then(() => {
        b4.click();
        return accessibility.check(this.container);
      }).then(done, done);
    });
  });
});
