import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'
import fs from 'fs'

// GLOBALS to tell react to work on prod mode.
const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
}

const baseUrl = path.join(__dirname, '..')

const webpackConfig = {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  // Server rendering
  entry: [
    'babel-polyfill',
    path.join(baseUrl, 'src', 'index')
  ],
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
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}

export default Object.assign(config, webpackConfig)
