const path = require('path');
const webpack = require('webpack');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  __DEV__: true,
};

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  noInfo: true,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.HotModuleReplacementPlugin(),
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
