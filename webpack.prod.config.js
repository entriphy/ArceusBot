const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: "cheap-source-map",
    entry: [
        './app/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders:
            [
                {
                    test: /.js?$/,
                    loader: 'babel-loader',
                    include: path.join(__dirname, 'app'),
                    exclude: /node_modules/,
                    query: {
                        presets: ['env', 'stage-1', 'react']
                    }
                }
            ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
    ]
};