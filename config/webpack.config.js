import webpack from 'webpack'
import path from 'path'
import cssnano from 'cssnano'
import ExtractTextPlugin from "extract-text-webpack-plugin"

const baseUrl = path.join(__dirname, '..')

require.extensions['.scss'] = () => { return }

const env = process.env.NODE_ENV || 'development'

let PATHS_TO_TREAT_AS_CSS_MODULES = [
  path.join(baseUrl, 'src', 'components').replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&') // eslint-disable-line
]

const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length
const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES})`)

const webpackConfig = {
  devServer: {
    contentBase: path.join(baseUrl, 'src')
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
          env: {
            production: {
              presets: ['react-optimize']
            }
          }
        }
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  },
  plugins: []
}

if (isUsingCSSModules) {
  const cssModulesLoader = [
    'css?sourceMap&-minimize',
    'modules',
    'importLoaders=1',
    'localIdentName=[local]'
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

if (env !== 'development') {
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const [first, ...rest] = loader.loaders
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    Reflect.deleteProperty(loader, 'loaders')
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  )
}

export default webpackConfig
