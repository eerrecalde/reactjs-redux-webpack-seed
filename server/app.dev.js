import webpack from 'webpack'
import WebpackDevMiddleware from 'webpack-dev-middleware'
import WebpackHotMiddleware from 'webpack-hot-middleware'
import config from '../config/webpack.config.dev'
import reactApp from './index'
import express from 'express'

const compiler = webpack(config)
const app = express()

// hot reload
app.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  reload: true,
  publicPath: config.output.publicPath
}))

app.use(WebpackHotMiddleware(compiler))

app.use(reactApp)

app.listen(config.port)
console.log(`Listening at http://${config.host}:${config.port}`)
