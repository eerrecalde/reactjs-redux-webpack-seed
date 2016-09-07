import React from 'react'
import Helmet from "react-helmet"

class AboutPage extends React.Component {
  render () {
    return (
      <div>
        <Helmet
          title="Starter kit | About"
        />
        <h1>About</h1>
        <p>This is app uses React, Redux, and React Redux.</p>
      </div>
    )
  }
}

export default AboutPage
