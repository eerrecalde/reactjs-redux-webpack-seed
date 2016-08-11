import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import cssnano from 'cssnano'

// GLOBALS to tell react to work on prod mode.
const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
}

const baseUrl = path.join(__dirname, '..')

let PATHS_TO_TREAT_AS_CSS_MODULES = [
  path.join(baseUrl, 'src').replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
]

const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES})`)

const webpackConfigProd = {
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
  entry: path.join(baseUrl, 'src', 'index'),
  target: 'web',
  output: {
    path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  // Change the serving files directory from src to dist
  devServer: {
    // contentBase: './src'
    contentBase: path.join(baseUrl, 'dist')
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
      {test: /\.js$/, include: path.join(baseUrl, 'src'), loaders: ['babel']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  }
}

if (isUsingCSSModules) {
  const cssModulesLoader = [
    'css?sourceMap&-minimize',
    'modules',
    'importLoaders=1',
    'localIdentName=[name]-[local]-[hash:base64:5]'
  ].join('&')

  webpackConfigProd.module.loaders.push({
    test: /\.scss$/,
    include: cssModulesRegex,
    loaders: [
      'simple-universal-style',
      cssModulesLoader,
      'postcss',
      'sass?sourceMap'
    ]
  })

  webpackConfigProd.module.loaders.push({
    test: /\.css$/,
    include: cssModulesRegex,
    loaders: [
      'simple-universal-style',
      cssModulesLoader,
      'postcss'
    ]
  })
}

// Loaders for files that should not be treated as CSS modules.
const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false
webpackConfigProd.module.loaders.push({
  test: /\.scss$/,
  exclude: excludeCSSModules,
  loaders: [
    'simple-universal-style',
    'css?sourceMap&-minimize',
    'postcss',
    'sass?sourceMap'
  ]
})
webpackConfigProd.module.loaders.push({
  test: /\.css$/,
  exclude: excludeCSSModules,
  loaders: [
    'simple-universal-style',
    'css?sourceMap&-minimize',
    'postcss'
  ]
})

webpackConfigProd.postcss = [
  cssnano({
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true,
    sourcemap: true
  })
]

export default webpackConfigProd
