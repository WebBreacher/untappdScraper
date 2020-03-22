import React, { Component } from 'react'
import { getUntappdOsint } from '../lib/utils'

export default class Index extends Component {
  constructor () {
    super()

    this.state = {
      username: '',
      recentActivityOnly: false,
      data: null,
      error: null,
      submitting: false
    }
  }

  updateUsername (e) {
    this.setState({
      username: e.target.value
    })
  }

  updateRecentActivityOnly () {
    this.setState({
      recentActivityOnly: !this.state.recentActivityOnly
    })
  }

  async getUntappdOsint (e) {
    e.preventDefault()

    this.setState({
      data: null,
      error: null,
      submitting: true
    })

    const username = this.state.username.trim()
    const recentActivityOnly = this.state.recentActivityOnly

    if (username) {
      try {
        const data = await getUntappdOsint(username, recentActivityOnly)

        this.setState({
          data,
          username: '',
          submitting: false
        })
      } catch (err) {
        this.setState({
          error: err.toString(),
          submitting: false
        })
      }
    } else {
      this.setState({
        error: 'Must provide a username!',
        submitting: false
      })
    }
  }

  render () {
    return (
      <div>
        {this.state.error &&
          <strong>{this.state.error}</strong>
        }

        {this.state.data && this.state.data.stats &&
          <div>
            <p>User Stats for {this.state.data.username}:</p>

            <table>
              <tbody>
                <tr>
                  <td>Total Beers</td>
                  <td>{this.state.data.stats.totalBeers}</td>
                </tr>
                <tr>
                  <td>Total Unique</td>
                  <td>{this.state.data.stats.totalUnique}</td>
                </tr>
                <tr>
                  <td>Total Badges</td>
                  <td>{this.state.data.stats.totalBadges}</td>
                </tr>
                <tr>
                  <td>Total Friends</td>
                  <td>{this.state.data.stats.totalFriends}</td>
                </tr>
              </tbody>
            </table>
          </div>
        }

        {this.state.data && this.state.data.recentActivity &&
          <div>
            <p>Recent Activity:</p>

            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Beer</th>
                  <th>Brewery</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.recentActivity.map((activity, index) =>
                  <tr key={index}>
                    <td>{activity.time.format('DD MMM YY HH:mm:ss')}</td>
                    <td>{activity.beer}</td>
                    <td>{activity.brewery}</td>
                    <td>{activity.location}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }

        {this.state.data &&
          <div><br />{JSON.stringify(this.state.data)}</div>
        }

        <form onSubmit={e => { this.getUntappdOsint(e) }}>
          <p>Username: <input type="text" value={this.state.username} onChange={e => { this.updateUsername(e) }} /></p>
          <p>Recent Activity Only: <input type="checkbox" value={this.state.recentActivityOnly} onChange={e => { this.updateRecentActivityOnly(e) }} /></p>
          <input type="submit" value="Test" disabled={this.state.submitting} />
        </form>
      </div>
    )
  }
}
