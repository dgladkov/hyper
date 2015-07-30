var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index'
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
};
