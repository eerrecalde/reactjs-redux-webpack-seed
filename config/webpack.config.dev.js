import webpack from 'webpack'
import path from 'path'
import cssnano from 'cssnano'

const baseUrl = path.join(__dirname, '..')

let PATHS_TO_TREAT_AS_CSS_MODULES = [
  path.join(baseUrl, 'src').replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
]

const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES})`)
console.log('LALALA', isUsingCSSModules)

const webpackConfig = {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  noInfo: false,
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
    path.join(baseUrl, 'src', 'index')
  ],
  target: 'web',
  output: {
    path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(baseUrl, 'src')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
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

  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    include: cssModulesRegex,
    loaders: [
      'simple-universal-style',
      cssModulesLoader,
      'postcss',
      'sass?sourceMap'
    ]
  })

  webpackConfig.module.loaders.push({
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
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  exclude: excludeCSSModules,
  loaders: [
    'simple-universal-style',
    'css?sourceMap&-minimize',
    'postcss',
    'sass?sourceMap'
  ]
})
webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: excludeCSSModules,
  loaders: [
    'simple-universal-style',
    'css?sourceMap&-minimize',
    'postcss'
  ]
})

webpackConfig.postcss = [
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

export default webpackConfig
