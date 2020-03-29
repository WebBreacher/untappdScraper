import React from 'react'
import ReactTooltip from 'react-tooltip'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons'
import logoImg from './../assets/logos/logo.png'
import PropTypes from 'prop-types'

/**
 * Component related to top navigation with username entry input and google maps api input
 */
const TopMenu = (props) => {
    return (
    <menu className="navbar-menu">
          <img id="logoImg" src={logoImg}/>
          <div id="userForm">
            <form onSubmit={e => { props.getUntappdOsint(e) }} disabled={props.state.submitting}>
              <input className="text-input" placeholder="Username" type="text" value={props.state.username} onChange={e => { props.updateUsername(e) }} />
              <label>Recent Activity <strong>only</strong></label>
              <input type="checkbox" value={props.state.recentActivityOnly} onChange={e => { props.updateRecentActivityOnly(e) }} />
              <input className="button" type="submit" value="Scrape" disabled={props.state.submitting} />
              <FontAwesomeIcon data-for="scrape-submit" data-tip="Optionally, you can provide a valid Google Maps API key, which will enable the application to analyze the locations it finds. This key is never sent to any server other than the Google Maps API." icon={faQuestionCircle}/>
              <ReactTooltip id="scrape-submit" place="bottom" type="info"/>
            </form>
          </div>
          <div id="mapsAPIForm">
            <form onSubmit={e => { props.setupGoogleMapsClient(e) }}>
              {/* <p>Optionally, you can provide a valid Google Maps API key, which will enable the application to analyze the locations it finds. This key is never sent to any server other than the Google Maps API.</p> */}

               <input className="text-input" placeholder="Google Maps API Key" type="password" value={props.state.googleMapsApiKey} onChange={e => { props.updateGoogleMapsApiKey(e) }} readOnly={props.state.googleMapsClient} />
               <FontAwesomeIcon data-for="google-maps-tip" data-tip={"This might silently fail if the API key provided is invalid or for an account that does not have the Maps JavaScript API and Geocoding APIs enabled. Check the developer console if the Maps functionality does not work correctly after setting the API key."} icon={faQuestionCircle}/>
               <ReactTooltip id="google-maps-tip" place="bottom" type="info"/>

              <input className="button" type="submit" value="Set" disabled={props.state.loadingGoogleMapsClient || props.state.googleMapsClient} />

              
            </form>
          </div>
        </menu>
  )
}

TopMenu.propTypes = {
  state: PropTypes.object,
  getUntappdOsint: PropTypes.func,
  updateUsername: PropTypes.func,
  updateRecentActivityOnly: PropTypes.func,
  setupGoogleMapsClient: PropTypes.func,
  updateGoogleMapsApiKey: PropTypes.func
}

export default TopMenu