var express = require('express');
var path = require('path');
var process = require('process');
var fs = require('fs');
var app = express();
var cfg = require("./Config")

if (process.env.NODE_ENV === "development") {
    console.warn("Development environment detected - using middleware");
    var webpack = require('webpack');
    var webpackDev = webpack(require('./webpack.config'));
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");

    app.use(webpackDevMiddleware(webpackDev));
    app.use(webpackHotMiddleware(webpackDev));
}

// Send index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './app/index.html'));
});

// Send bundle.js
app.get('/bundle.js', function(req, res) {
    res.sendFile(path.join(__dirname, './dist/bundle.js'));
});

console.log("App listening on http://localhost:" + cfg.port);
app.listen(cfg.port);