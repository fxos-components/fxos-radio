
suite('GaiaRadio', function() {

  setup(function() {
    this.sandbox = sinon.sandbox.create();
    this.container = document.createElement('div');
    this.container.innerHTML = [
      '<gaia-radio name="a"></gaia-radio>',
      '<gaia-radio checked name="a"></gaia-radio>',
      '<gaia-radio name="a"></gaia-radio>',

      '<label id="label" for="b1"></label>',
      '<gaia-radio id="b1" name="b"></gaia-radio>',
      '<gaia-radio checked name="b"></gaia-radio>',
      '<gaia-radio name="b"></gaia-radio>'
    ].join('');

    this.radios = this.container.querySelectorAll('gaia-radio');
    document.body.appendChild(this.container);
  });

  teardown(function() {
    this.sandbox.restore();
    document.body.removeChild(this.container);
    this.container = null;
  });

  test('It becomes `checked` when clicked', function() {
    this.radios[0].inner.click();
    assert.isTrue(this.radios[0].hasAttribute('checked'));
  });

  test('It unchecks other radios in the group when checked', function() {
    this.radios[0].inner.click();
    assert.isFalse(this.radios[1].hasAttribute('checked'));
  });

  test('It responds to clicks on linked <labels>', function(done) {
    var label = document.getElementById('label');
    var b1 = document.getElementById('b1');

    // Timeout required as listeners are
    // bound in the next turn of the event loop
    setTimeout(function() {
      label.click();
      assert.isTrue(b1.hasAttribute('checked'));
      done();
    });
  });

  test('It resonds to attribute changes', function() {
    this.radios[0].setAttribute('checked', '');
    assert.isFalse(this.radios[1].hasAttribute('checked'));
  });

  test('It responds to setting `.checked` property', function() {
    this.radios[0].checked = true;
    assert.isTrue(this.radios[0].hasAttribute('checked'));
    assert.isFalse(this.radios[1].hasAttribute('checked'));

    this.radios[2].checked = true;
    assert.isTrue(this.radios[2].hasAttribute('checked'));
    assert.isFalse(this.radios[0].hasAttribute('checked'));
  });
});