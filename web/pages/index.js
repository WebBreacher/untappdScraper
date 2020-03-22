import React, { Component } from 'react'
import { getUntappdOsint } from '../lib/utils'

export default class Index extends Component {
  constructor () {
    super()

    this.state = {
      username: '',
      beersOnly: false,
      data: null
    }
  }

  async updateUsername (e) {
    this.setState({
      username: e.target.value
    })
  }

  async updateBeersOnly (e) {
    this.setState({
      beersOnly: e.target.value
    })
  }

  async getUntappdOsint (e) {
    e.preventDefault()
    const username = this.state.username.trim()
    const beersOnly = this.state.beersOnly

    if (username) {
      let data

      try {
        data = await getUntappdOsint(username, beersOnly)
      } catch (err) {
        data = err.toString()
      }

      this.setState({
        data,
        username: ''
      })
    } else {
      this.setState({
        data: 'Must provide a username!'
      })
    }
  }

  render () {
    return (
      <div>
        {this.state.data &&
          <div>{JSON.stringify(this.state.data)}</div>
        }

        <form onSubmit={e => { this.getUntappdOsint(e) }}>
          <p>Username: <input type="text" value={this.state.username} onChange={e => { this.updateUsername(e) }} /></p>
          <p>Beers Only: <input type="checkbox" value={this.state.beersOnly} onChange={e => { this.updateBeersOnly(e) }} /></p>
          <input type="submit" value="Test" />
        </form>
      </div>
    )
  }
}
