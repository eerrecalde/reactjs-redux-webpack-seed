import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'
const baseUrl = path.join(__dirname, '..')

console.log('WEBPACKCONFIG DEV-SRVR')

config.name = 'server'

config.host = 'localhost'
config.port = 3000
config.devtool = 'source-map'
config.entry = [
  'webpack-hot-middleware/client',
  path.join(baseUrl, 'client', 'index')
]

config.output = {
  path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
  publicPath: '/',
  filename: 'bundle.js'
}

let plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]

config.plugins = (config.plugins ? config.plugins.concat(plugins) : plugins)

export default config
