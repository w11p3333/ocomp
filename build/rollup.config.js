const buble = require('rollup-plugin-buble')

module.exports = {
  entry: 'middle/index.js',
  dest: 'dist/index.js',
  format: 'cjs',
  moduleName: 'Comp',
  plugins: [
    buble()
  ]
}