import React, { Component } from 'react'
import { getUntappdOsint, loadGoogleMapsClient } from '../lib/utils'

export default class Index extends Component {
  constructor () {
    super()

    this.state = {
      username: '',
      recentActivityOnly: false,
      googleMapsApiKey: '',
      googleMapsClient: null,
      loadingGoogleMapsClient: false,
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

  updateGoogleMapsApiKey (e) {
    this.setState({
      googleMapsApiKey: e.target.value
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
    const googleMapsClient = this.state.googleMapsClient

    if (username) {
      try {
        const data = await getUntappdOsint(username, recentActivityOnly, googleMapsClient)

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
        error: 'Must provide a username.',
        submitting: false
      })
    }
  }

  async setupGoogleMapsClient (e) {
    e.preventDefault()

    this.setState({
      loadingGoogleMapsClient: true,
      submitting: true
    })

    const googleMapsApiKey = (this.state.googleMapsApiKey) ? this.state.googleMapsApiKey.trim() : undefined

    if (googleMapsApiKey) {
      try {
        await loadGoogleMapsClient(googleMapsApiKey)

        this.setState({
          // eslint-disable-next-line no-undef
          googleMapsClient: google,
          loadingGoogleMapsClient: false,
          submitting: false
        })
      } catch (err) {
        this.setState({
          error: err.toString(),
          loadingGoogleMapsClient: false,
          submitting: false
        })
      }
    } else {
      this.setState({
        error: 'Must provide a Google Maps API key.',
        loadingGoogleMapsClient: false
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

        {this.state.data && this.state.data.venues &&
          <div>
            <p>Venues:</p>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Check-ins</th>
                  <th>Address</th>
                  <th>First Visit Date</th>
                  <th>Last Visit Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.venues.map((venue, index) =>
                  <tr key={index}>
                    <td>{venue.name}</td>
                    <td>{venue.checkIns}</td>
                    <td>
                      {venue.address}
                      {venue.geocode &&
                        <div>({venue.geocode[0].geometry.location.lat()}, {venue.geocode[0].geometry.location.lng()})</div>
                      }
                    </td>
                    <td>{venue.firstVisitDate}</td>
                    <td>{venue.lastVisitDate}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }

        <div style={{ height: (this.state.data && this.state.data.map) ? '400px' : 0 }}>
          <div id="map"></div>
        </div>

        <form onSubmit={e => { this.getUntappdOsint(e) }} disabled={this.state.submitting}>
          <p>Username: <input type="text" value={this.state.username} onChange={e => { this.updateUsername(e) }} /></p>
          <p>Recent Activity Only: <input type="checkbox" value={this.state.recentActivityOnly} onChange={e => { this.updateRecentActivityOnly(e) }} /></p>
          <input type="submit" value="Get Untappd OSINT" disabled={this.state.submitting} />
        </form>

        <form onSubmit={e => { this.setupGoogleMapsClient(e) }}>
          <p>Optionally, you can provide a valid Google Maps API key, which will enable the application to analyze the locations it finds. This key is never sent to any server other than the Google Maps API.</p>

          <p>Google Maps API Key: <input type="password" value={this.state.googleMapsApiKey} onChange={e => { this.updateGoogleMapsApiKey(e) }} readOnly={this.state.googleMapsClient} /></p>

          <input type="submit" value="Set Google Maps API Key" disabled={this.state.loadingGoogleMapsClient || this.state.googleMapsClient} />

          <p><em>Note: This might silently fail if the API key provided is invalid or for an account that does not have the Maps JavaScript API and Geocoding APIs enabled. Check the developer console if the Maps functionality does not work correctly after setting the API key.</em></p>
        </form>
      </div>
    )
  }
}
