
process.env.NODE_ENV='production';
process.chdir(__dirname);
process.chdir('../')

const webpack = require('webpack');
const config = require(process.cwd() + '/webpack.config.js');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
// const createDevServerConfig = require('../config/webpackDevServer.config');

const devServer = new WebpackDevServer(config, {
});

