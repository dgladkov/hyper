const path = require('path');
const webpack = require('webpack');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false,
};

module.exports = {
  devtool: 'source-map',
  noInfo: true,
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
    ],
  },
};
