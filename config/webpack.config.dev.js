import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
const baseUrl = path.join(__dirname, '..')

const env = process.env.NODE_ENV || 'production'

config.name = 'server'
config.debug = true
config.target = 'web'
config.devtool = 'cheap-module-eval-source-map'
config.noInfo = false
config.host = 'localhost'
config.port = 3000
config.entry = [
  'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
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
