import React, { Component } from 'react'
import create from 'gql0'

import { GRAPH_URL as url } from '../contants'
import { onLogin } from '../Main'

class Login extends Component {
  state = {
    name: '',
    password: '',
  }

  handleInputChange = forField => e =>
    this.setState({ [forField]: e.target.value })

  login = async () => {
    const gql = create({ url })
    const { name, password } = this.state

    const query = gql`
      mutation login($name: String!, $password: String!) {
        login(name: $name, password: $password) {
          token
          user {
            id
            name
            followers {
              id
              name
            }
            following {
              id
              name
            }
            posts {
              id
              title
              description
            }
          }
        }
      }
    `

    try {
      const { login } = await query.call({ name, password })

      window.localStorage.setItem('token', login.token)
      window.localStorage.setItem('user', JSON.stringify(login.user))

      onLogin()
    } catch (error) {
      alert('Error, login error')
    }
  }

  register = async () => {
    const gql = create({ url })
    const { name, password } = this.state

    const query = gql`
      mutation register($name: String!, $password: String!) {
        register(name: $name, password: $password) {
          id
          name
        }
      }
    `

    try {
      await query.call({ name, password })
      alert('Register OK, Now login ;-)')
    } catch (error) {
      alert('Error, register error')
    }
  }

  render() {
    const { name, password } = this.state

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage:
            'url(https://cdn-images-1.medium.com/max/1920/1*WDUINHChN0akH8AFevrNcA.jpeg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <form
          style={{
            padding: '20px 50px',
            backgroundColor: '#78909cdd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: 5,
          }}
          onSubmit={e => e.preventDefault()}
        >
          <h1 style={{ color: '#fff', margin: 0 }}>Login view</h1>
          <input
            type="text"
            className="uk-input"
            style={{ maxWidth: 250 }}
            placeholder="Name"
            onChange={this.handleInputChange('name')}
            value={name}
          />
          <input
            type="password"
            className="uk-input"
            style={{ maxWidth: 250, marginTop: 5 }}
            placeholder="Enter password"
            onChange={this.handleInputChange('password')}
            value={password}
          />
          <div className="uk-button-group" style={{ marginTop: 10 }}>
            <button
              className="uk-button uk-button-primary"
              disabled={!name || !password}
              onClick={this.register}
            >
              Register
            </button>
            <button
              className="uk-button uk-button-primary"
              disabled={!name || !password}
              onClick={this.login}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
