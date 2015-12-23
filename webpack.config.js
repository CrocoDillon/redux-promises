'use strict';

const webpack = require('webpack');
const path = require('path');

const config = {
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    library: 'ReduxPromises',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }));
}

module.exports = config;
