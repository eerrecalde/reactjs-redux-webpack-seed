import React from 'react'
import {Link} from 'react-router'
import Helmet from "react-helmet"

class HomePage extends React.Component {
  render () {
    return (
      <div className="jumbotron">
        <Helmet
          title="Starter kit | Home"
        />
        <h1>Pluralsight Administration</h1>
        <p>React, Redux, and React Router</p>
        <Link to="about" className="btn btn-primary btn-lg">Learn more</Link>
      </div>
    )
  }
}

export default HomePage
