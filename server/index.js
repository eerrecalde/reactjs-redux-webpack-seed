import React from 'react'
import { RouterContext, match } from 'react-router'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { syncHistoryWithStore } from 'react-router-redux'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import routes from '../src/routes'
import configureStore from '../src/store/configureStore'
import initialState from '../src/reducers/initialState'
import AppContainer from '../src/AppContainer'
import {loadCourses} from '../src/actions/courseActions'
import {loadAuthors} from '../src/actions/authorActions'

const reactApp = (req, res) => {
  // Tip: https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    // Creates an in-memory history object that does not interact with the browser URL (For server side rendering)
    // https://github.com/reactjs/react-router/blob/master/docs/API.md#creatememoryhistoryoptions
    const memoryHistory = createMemoryHistory(req.url)

    // Set up the store by providing the initialState and the history.
    const store = configureStore(initialState, memoryHistory)

    // Get the component tree
    const components = renderProps.components

    // Extract our page component
    const Comp = components[components.length - 1].WrappedComponent

    // Extract `fetchData` if exists
    const fetchData = (Comp && Comp.fetchData) || (() => Promise.resolve())

    // Create an enhanced history that syncs navigation events with the store
    // https://github.com/reactjs/react-router-redux#tutorial
    const history = syncHistoryWithStore(memoryHistory, store, {
      selectLocationState: (state) => state.router
    })

    const css = [] // CSS for all rendered React components
    const context = { insertCss: (styles) => css.push(styles._getCss()) }

    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const { location, params } = renderProps
      fetchData({ store, location, params, history })
      .then(() => {
        const HTML = '<!DOCTYPE html>' +
          renderToStaticMarkup(
            <html>
              <head>
                <title>Isomorphic Web App</title>
                <style type="text/css">${css.join('')}</style>
                <script dangerouslySetInnerHTML={{__html: `___INITIAL_STATE__ = ${JSON.stringify(store.getState())}`}}></script>
              </head>
              <body>
                <div id="app">
                  <AppContainer
                    store={store}
                    history={history}
                    routes={routes}
                  />
                </div>
                <script type="application/javascript" src="/bundle.js"></script>
              </body>
            </html>
          )

        res.status(200).send(HTML)
      })
      .catch((err) => {
        console.log('ERROR!!', err)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
}

export default reactApp
