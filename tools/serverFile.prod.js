import express from 'express'
import path from 'path'
import open from 'open'
import compression from 'compression'

/* eslint-disable no-console */

let env = process.env.NODE_ENV || 'production'
let baseDir = path.join(__dirname, '..', 'dist')

const port = 3000
const app = express()

console.log('>>>>>>>>>>>>>>>>>> SERVING FILES FROM DIST CLI')

app.use(compression())
app.use(express.static(baseDir))

app.get('*', function (req, res) {
  res.sendFile(path.join(baseDir, 'index.html'))
})

app.listen(port, function (err) {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
