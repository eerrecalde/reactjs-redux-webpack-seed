import webpack from 'webpack'
import config from '../config/webpack.config.prod'
import reactApp from './index'
import express from 'express'
import path from 'path'
import compression from 'compression'

let baseDir = path.join(__dirname, '..', 'dist')

const app = express()

app.use(compression())

app.use(express.static(baseDir))

app.use(reactApp)

app.listen(config.port)

console.log(`Listening at http://${config.host}:${config.port}`)
