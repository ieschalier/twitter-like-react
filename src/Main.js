import React, { Component } from 'react'
import Login from './Login'
import App from './App'

let appLogin

class Main extends Component {
  state = {
    token: null,
    user: null,
  }

  componentDidMount = () => {
    appLogin = this.onLogin
    this.onLogin()
  }

  onLogin = async () => {
    const token = await window.localStorage.getItem('token')
    const user = await window.localStorage.getItem('user')

    if (token && user) {
      this.setState({ user, token })
    } else {
      this.setState({ user: null, token: null })
    }
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {this.state.token ? <App /> : <Login />}
      </div>
    )
  }
}

export const onLogin = () => appLogin && appLogin()

export default Main
