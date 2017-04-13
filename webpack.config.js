var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    main: path.resolve('./src/index.js')
  },
  output: {
    path: path.resolve('./dist/'),
    filename: 'before.js'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }
    ]
  }
 }
