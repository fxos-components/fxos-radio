# &lt;fxos-radio&gt; ![](https://travis-ci.org/fxos-components/fxos-radio.svg)

## Installation

```bash
$ bower install fxos-components/fxos-radio

```

Then include folowing files in HTML

```html
<script src="bower_components/fxos-component/fxos-component.js"></script>
<script src="bower_components/fxos-radio/fxos-radio.js"></script>
```

## Examples

- [Example](http://fxos-components.github.io/fxos-radio/)

## Readiness

- [x] Accessibility ([@yzen](https://github.com/yzen))
- [ ] Test Coverage
- [ ] Performance
- [ ] Visual/UX
- [ ] RTL

## Tests

1. Ensure Firefox Nightly is installed on your machine.
2. To run unit tests you need npm >= 3 installed.
3. `$ npm install`
4. `$ npm run test-unit`

If you would like tests to run on file change use:

`$ npm run test-unit-dev`

If your would like run integration tests, use:

`$ export FIREFOX_NIGHTLY_BIN=/absolute/path/to/nightly/firefox-bin`
`$ npm run test-integration`

## Lint check

Run lint check with command:

`$ npm run test-lint`
