import express from 'express'
import path from 'path'
import open from 'open'
import compression from 'compression'

import React from 'react'
// we'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../src/routes'
import {Provider} from 'react-redux'

require.extensions['.scss'] = function () { return null }

/* eslint-disable no-console */

let env = process.env.NODE_ENV || 'server'
let baseDir = path.join(__dirname, '..', 'dist')

const port = 3000
const app = express()

console.log('>>>>>>>>>>>>>>>>>> SERVING FILES FROM DIST SRVR')

app.use(compression())
app.use(express.static(baseDir))

import configureStore from '../src/store/configureStore.js'
import {loadCourses} from '../src/actions/courseActions'
import {loadAuthors} from '../src/actions/authorActions'

const store = configureStore()
store.dispatch(loadCourses())
store.dispatch(loadAuthors())

const getAssets = (localAssets = []) => (
  localAssets.map(asset => asset)
)

const getAssetsByExtension = (extension, localAssets = []) => (
  getAssets(localAssets).filter(asset => new RegExp('.(' + extension + ')$').test(asset))
)

const getScripts = (localAssets = []) => (
  getAssetsByExtension('js', localAssets)
)

const getStyles = (localAssets = []) => (
  getAssetsByExtension('css', localAssets)
)

app.get('*', (req, res) => {
  // match the routes to the url
  match({ routes: routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      throw err
    } else if (redirect) {
      // we haven't talked about `onEnter` hooks on routes, but before a
      // route is entered, it can redirect. Here we handle on the server.
      console.log('<><><> REDIRECT')
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      props.store = store
      console.log('<><><> GOT PROPS', getStyles(['styles.css']))
      // if we got props then we matched a route and can render
      const appHtml = renderToString(
        <Provider store={store}>
          <RouterContext {...props} />
        </Provider>
      )
      res.send("<!DOCTYPE html>" +
        renderToString(
          Provider({store: store}, RouterContext(props))
        )
      )
    } else {
      console.log('<><><> 404')
      // no errors, no redirect, we just didn't match anything
      res.status(404).send('Not Found')
    }
  })
})

function renderPage (appHtml) {
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
