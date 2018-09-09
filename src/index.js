import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Main from './Main'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<Main />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./Main', () => {
    const NextApp = require('./Main').default
    ReactDOM.render(<NextApp />, document.getElementById('root'))
  })
}

registerServiceWorker()
