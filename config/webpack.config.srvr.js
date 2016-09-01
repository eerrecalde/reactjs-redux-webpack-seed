import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'
const baseUrl = path.join(__dirname, '..')

console.log('WEBPACKCONFIG SRV')

config.name = 'server'
config.target = 'node'
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
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('server')}),
  new ExtractTextPlugin('styles.css', {
    allChunks: true
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]

config.plugins = (config.plugins ? config.plugins.concat(plugins) : plugins)

export default config

// GLOBALS to tell react to work on prod mode.
// const GLOBALS = {
//   'process.env.NODE_ENV': JSON.stringify('server')
// }
//
// // const baseUrl = path.join(__dirname, '..')
//
// let webpackConfig = {
//   debug: true,
//   devtool: 'source-map',
//   noInfo: false,
//   // Server rendering
//   entry: [
//     "babel-polyfill",
//     path.join(baseUrl, 'client', 'index')
//   ],
//   output: {
//     filename: 'server.js',
//     path: path.join(baseUrl, 'dist'),
//     library: 'server',
//     libraryTarget: 'umd',
//     umdNamedDefine: true
//   },
//   target: 'node',
//   externals: fs.readdirSync(path.resolve(baseUrl, 'node_modules')).concat([
//     'react-dom/server', 'react/addons'
//   ]).reduce(function (ext, mod) {
//     ext[mod] = 'commonjs ' + mod
//     return ext
//   }, {}),
//   node: {
//     __filename: true,
//     __dirname: true
//   },
//   plugins: [
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.DefinePlugin(GLOBALS),
//     new ExtractTextPlugin('styles.css', {
//       allChunks: true
//     }),
//     new webpack.optimize.DedupePlugin(),
//     new webpack.optimize.UglifyJsPlugin()
//   ]
// }
//
// export default Object.assign(config, webpackConfig)
