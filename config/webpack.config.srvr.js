import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'

console.log('WEBPACKCONFIG SRV')

// GLOBALS to tell react to work on prod mode.
const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('server')
}

const baseUrl = path.join(__dirname, '..')

let webpackConfig = {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  // Server rendering
  entry: [
    "babel-polyfill",
    path.join(baseUrl, 'src', 'index')
  ],
  output: {
    path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js',
    library: 'server',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  target: 'node',
  externals: fs.readdirSync(path.resolve(baseUrl, 'node_modules')).concat([
    'react-dom/server', 'react/addons'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),
  node: {
    __filename: true,
    __dirname: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}

export default Object.assign(config, webpackConfig)
