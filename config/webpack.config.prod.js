import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config from './webpack.config'

console.log('WEBPACKCONFIG PRD')

// GLOBALS to tell react to work on prod mode.
const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
}

const baseUrl = path.join(__dirname, '..')

const webpackConfig = {
  debug: true,
  target: 'web',
  devtool: 'source-map',
  noInfo: false,
  entry: path.join(baseUrl, 'client', 'index'),
  output: {
    path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('server')}),
    new ExtractTextPlugin('styles.css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}

export default Object.assign(config, webpackConfig)
