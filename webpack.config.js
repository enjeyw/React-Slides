var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'static/javascript');
var APP_DIR = path.resolve(__dirname, 'javascript');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  devtool: "#eval-source-map",
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;