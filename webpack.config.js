var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require("compression-webpack-plugin");

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
  }, plugins: [

    // Added as the last plugin
    // Not sure if it's worth gzipping index.html - no harm no foul

    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })

  ]
};

module.exports = config;