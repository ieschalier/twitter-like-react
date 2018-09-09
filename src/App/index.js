import React, { Component } from 'react'
import create from 'gql0'

import { GRAPH_URL as url } from '../contants'
import { onLogin } from '../Main'

class App extends Component {
  state = {
    posts: [],
    token: '',
    user: undefined,
    description: '',
    title: '',
  }

  componentDidMount = async () => {
    const token = await window.localStorage.getItem('token')
    const user = JSON.parse(await window.localStorage.getItem('user'))

    this.setState({ token, user }, this.loadPosts)
  }

  loadPosts = async () => {
    const gql = create({ url, headers: { Authorization: this.state.token } })

    const query = gql`
      query posts {
        posts {
          id
          title
          description
          likes {
            id
          }
          user {
            id
            name
          }
        }
      }
    `

    try {
      const { posts } = await query.call()
      this.setState({ posts })
    } catch (error) {
      alert('Error, get posts')
    }
  }

  like = async postId => {
    const gql = create({ url, headers: { Authorization: this.state.token } })

    const query = gql`
      mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
          id
          title
          description
          likes {
            id
          }
          user {
            id
            name
          }
        }
      }
    `

    try {
      const { likePost } = await query.call({ postId })
      const { posts } = this.state

      const index = posts.findIndex(p => p.id === postId)
      this.setState({
        posts: [
          ...posts.slice(0, index),
          likePost,
          ...posts.slice(index + 1, posts.length),
        ],
      })
      // this.setState({ posts })
    } catch (error) {
      alert('Error, like post')
    }
  }

  unLike = async postId => {
    const gql = create({ url, headers: { Authorization: this.state.token } })

    const query = gql`
      mutation unLikePost($postId: ID!) {
        unLikePost(postId: $postId) {
          id
          title
          description
          likes {
            id
          }
          user {
            id
            name
          }
        }
      }
    `

    try {
      const { unLikePost } = await query.call({ postId })
      const { posts } = this.state

      const index = posts.findIndex(p => p.id === postId)
      this.setState({
        posts: [
          ...posts.slice(0, index),
          unLikePost,
          ...posts.slice(index + 1, posts.length),
        ],
      })
      // this.setState({ posts })
    } catch (error) {
      alert('Error, unlike post')
    }
  }

  handleInputChange = forField => e => {
    this.setState({ [forField]: e.target.value })
  }

  newPost = async () => {
    const gql = create({ url, headers: { Authorization: this.state.token } })
    const { title, description } = this.state

    const query = gql`
      mutation newPost($title: String!, $description: String!) {
        newPost(title: $title, description: $description) {
          id
          title
          description
          likes {
            id
          }
          user {
            id
            name
          }
        }
      }
    `

    try {
      const { newPost } = await query.call({ title, description, depth: 4 })
      const { posts } = this.state

      this.setState({ posts: [newPost, ...posts], title: '', description: '' })
    } catch (error) {
      alert('Error, tweet post')
    }
  }

  logout = async () => {
    await window.localStorage.removeItem('token')
    await window.localStorage.removeItem('user')
    onLogin()
  }

  render() {
    const { posts, user, title, description } = this.state

    return (
      <div
        style={{
          backgroundColor: '#fafafa',
          height: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <h1>A cool twitter like</h1>
        <button
          className="uk-button uk-button-danger uk-button-small"
          style={{ position: 'fixed', top: 10, right: 10 }}
          onClick={this.logout}
        >
          Logout
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#cfd8dc',
            padding: '15px 25px',
            maxWidth: 500,
            margin: 'auto',
            borderRadius: 2,
          }}
        >
          <input
            type="text"
            className="uk-input"
            style={{ maxWidth: 500 }}
            placeholder="Title"
            onChange={this.handleInputChange('title')}
            value={title}
          />
          <textarea
            className="uk-textarea"
            style={{
              marginTop: 5,
              maxWidth: 500,
              resize: 'none',
            }}
            placeholder="Description"
            onChange={this.handleInputChange('description')}
            value={description}
          />
          <button
            className="uk-button uk-button-primary uk-button-small"
            style={{
              marginTop: 10,
            }}
            disabled={!title || !description}
            onClick={this.newPost}
          >
            Send
          </button>
        </div>
        <div
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            height: 'calc(100% - 295px)',
          }}
        >
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                padding: '5px 20px',
                textAlign: 'left',
                margin: '20px 10px',
                backgroundColor: '#607d8bdd',
                position: 'relative',
                borderRadius: 3,
              }}
            >
              <h3 style={{ color: '#fff' }}>{post.title}</h3>
              <p style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
                {post.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}
              >
                <i
                  style={{
                    color: post.likes.find(l => l.id === user.id)
                      ? '#bbdefb'
                      : '#fff',
                    cursor: 'pointer',
                  }}
                  className="material-icons"
                  onClick={
                    post.likes.find(l => l.id === user.id)
                      ? () => this.unLike(post.id)
                      : () => this.like(post.id)
                  }
                >
                  thumb_up
                </i>
                <p style={{ color: '#bbdefb' }}>
                  {'\u00a0'}
                  {post.likes.length}
                </p>
              </div>
              <p
                className="uk-text-meta"
                style={{ color: '#fff', marginTop: 3 }}
              >
                @{post.user.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default App
