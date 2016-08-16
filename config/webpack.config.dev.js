import webpack from 'webpack'
import path from 'path'
import config from './webpack.config'

const baseUrl = path.join(__dirname, '..')

const webpackConfigDev = {
  debug: true,
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  noInfo: false,
  entry: [
    'babel-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
    path.join(baseUrl, 'src', 'index')
  ],
  output: {
    path: path.join(baseUrl, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

export default Object.assign(config, webpackConfigDev)
