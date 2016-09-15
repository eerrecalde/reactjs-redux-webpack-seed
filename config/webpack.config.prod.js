import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'
const baseUrl = path.join(__dirname, '..')
var nodeExternals = require("webpack-node-externals")

config.name = 'server'
config.target = 'node'
config.externals = [nodeExternals()]

config.host = 'localhost'
config.port = 3000
config.devtool = 'source-map'
config.entry = [
  path.join(baseUrl, 'server', 'index')
]

config.output = {
  path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
  publicPath: '/',
  filename: `[name].[hash].js`
}

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin()
]

config.plugins = (config.plugins ? config.plugins.concat(plugins) : plugins)

export default config
