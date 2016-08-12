import express from 'express'
import path from 'path'
import open from 'open'
import compression from 'compression'

import React from 'react'
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../src/routes'
require.extensions['.scss'] = function () {}
process.env.BROWSER = false

/* eslint-disable no-console */

let env = process.env.NODE_ENV || 'production'
let baseDir = (env === 'server') ? 'dist_server' : 'dist'

const port = 3000
const app = express()

console.log('>>>>>>>>>>>>>>>>>> SERVING FILES TO SERVER')

app.use(compression())
app.use(express.static(baseDir))

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '..', baseDir, 'index.html'))
// })

app.get('*', (req, res) => {
  // match the routes to the url
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      throw err
    }
    // `RouterContext` is the what `Router` renders. `Router` keeps these
    // `props` in its state as it listens to `browserHistory`. But on the
    // server our app is stateless, so we need to use `match` to
    // get these props before rendering.
    const appHtml = renderToString(<RouterContext {...props} />)

    // dump the HTML into a template, lots of ways to do this, but none are
    // really influenced by React Router, so we're just using a little
    // function, `renderPage`
    res.send(renderPage(appHtml))
  })
})

function renderPage (appHtml) {
  console.log('Render page: ', appHtml)
  return `
    <!doctype html public="storage">
    <html>
    <meta charset=utf-8/>
    <title>My First React Router App</title>
    <link rel=stylesheet href=/styles.css>
    <div id=app>${appHtml}</div>
    <script src="/bundle.js"></script>
   `
}

app.listen(port, function (err) {
  if (err) {
    console.log(err)
  } else {
    open(`http://localhost:${port}`)
  }
})
