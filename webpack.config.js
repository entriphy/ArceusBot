const webpack = require('webpack');
const path = require('path');
const cfg = require("./config");

module.exports = {
    entry: {
        app: ['webpack-hot-middleware/client?path=//localhost:' + cfg.port + '/__webpack_hmr', './app/index.js'],
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/'
    },
    devServer: {
        contentBase: '../app',
        publicPath: 'http://localhost:8080/'
    },
    module: {
        loaders:
            [
                {
                    test: /\.js?$/,
                    loader: 'babel-loader',
                    include: path.join(__dirname, 'app'),
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'stage-1', 'react']
                    }
                }
            ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};