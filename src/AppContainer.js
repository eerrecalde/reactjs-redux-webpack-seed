import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import './styles/styles.scss'

class AppContainer extends React.Component {
  render () {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default AppContainer
