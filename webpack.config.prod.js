import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from "extract-text-webpack-plugin";

// GLOBALS to tell react to work on prod mode.
const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

export default {
  debug: true,
  // recommended prod dev tools.. source-map
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
  noInfo: false,
  // Removing hot reloading and polyfill for prod. We'll only leave the index file as you'll see below.
  // entry: [
  //   'eventsource-polyfill', // necessary for hot reloading with IE
  //   'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
  //   './src/index'
  // ],
  entry: './src/index',
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  // Change the serving files directory from src to dist
  devServer: {
    // contentBase: './src'
    contentBase: './dist'
  },
  // No need for these 2 plugins below:
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new webpack.NoErrorsPlugin()
  // ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract('css?sourceMap')},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  }
};
