import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createStore from '../src/store/configureStore'
import AppContainer from '../src/AppContainer'
import routes from '../src/routes'
import {loadCourses} from '../src/actions/courseActions'
import {loadAuthors} from '../src/actions/authorActions'

// ========================================================
// Browser History Setup
// ========================================================
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: ''
})

// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

console.log('CLIENT SIDE STORE')

let render = () => {
  ReactDOM.render(
    <AppContainer
      store={store}
      history={history}
      routes={routes}
    />,
    document.getElementById('app')
  )
}

// ========================================================
// Go!
// ========================================================
render()
