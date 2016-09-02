import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'
const baseUrl = path.join(__dirname, '..')

console.log('WEBPACKCONFIG SRV')

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
}

process.env.NODE_ENV = 'production'

config.name = 'server'
config.target = 'web'
config.externals = fs.readdirSync(path.join(baseUrl, 'node_modules'))
  .concat([
    'react-dom/server', 'react/addons'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {})

config.host = 'localhost'
config.port = 3000
config.devtool = 'source-map'
config.entry = [
  path.join(baseUrl, 'server', 'index')
]

config.output = {
  path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
  publicPath: '/',
  filename: 'bundle.js'
}

let plugins = [
  new ExtractTextPlugin('styles.css', {
    allChunks: true
  })
]

config.plugins = (config.plugins ? config.plugins.concat(plugins) : plugins)

export default config
