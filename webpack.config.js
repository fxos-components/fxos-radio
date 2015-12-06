module.exports = {
  entry: './src/fxos-radio.js',
  output: {
    filename: 'fxos-radio.js',
    library: 'FXOSRadio',
    libraryTarget: 'umd'
  },

  externals: {
    "fxos-component": "fxosComponent"
  }
}
