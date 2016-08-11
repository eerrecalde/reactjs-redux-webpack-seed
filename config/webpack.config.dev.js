import webpack from 'webpack'
import path from 'path'
import config from './webpack.config'

const baseUrl = path.join(__dirname, '..')

const webpackConfigDev = {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  noInfo: false,
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
    path.join(baseUrl, 'src', 'index')
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

export default Object.assign(config, webpackConfigDev)
