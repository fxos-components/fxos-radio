# &lt;gaia-radio&gt; ![](https://travis-ci.org/gaia-components/gaia-radio.svg)

## Installation

```bash
$ bower install gaia-components/gaia-radio

```

Then include folowing files in HTML

```html
<script src="bower_components/gaia-component/gaia-component.js"></script>
<script src="bower_components/gaia-sub-header/gaia-sub-header.js"></script>
```

## Examples

- [Example](http://gaia-components.github.io/gaia-radio/)

## Tests

1. Ensure Firefox Nightly is installed on your machine.
2. `$ npm install`
3. `$ npm run test-unit`

If you would like tests to run on file change use:

`$ npm run test-unit-dev`

If your would like run integration tests, use:

`$ export FIREFOX_NIGHTLY_BIN=/absolute/path/to/nightly/firefox-bin`
`$ npm run test-integration`

## Lint check

Run lint check with command:

`$ npm run test-lint`
