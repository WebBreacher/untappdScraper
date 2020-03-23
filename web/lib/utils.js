import * as axios from 'axios'
import * as cheerio from 'cheerio'
import * as moment from 'moment-timezone'
import { Loader } from '@googlemaps/loader'

const baseUrl = 'https://cors-anywhere.herokuapp.com/https://untappd.com'

const getUserDom = async username => {
  const res = await axios.get(`${baseUrl}/user/${username}`)

  if (res.status !== 200) {
    throw new Error('Could not fetch user data.')
  }

  return cheerio.load(res.data)
}

const getFriendsDom = async username => {
  const res = await axios.get(`${baseUrl}/user/${username}/friends`)

  if (res.status !== 200) {
    throw new Error('Could not fetch friends data.')
  }

  return cheerio.load(res.data)
}

const getBeersDom = async username => {
  const res = await axios.get(`${baseUrl}/user/${username}/beers`)

  if (res.status !== 200) {
    throw new Error('Could not fetch beers data.')
  }

  return cheerio.load(res.data)
}

const getVenuesDom = async username => {
  const res = await axios.get(`${baseUrl}/user/${username}/venues?type=&sort=highest_checkin`)

  if (res.status !== 200) {
    throw new Error('Could not fetch venue data.')
  }

  return cheerio.load(res.data)
}

const parseNumber = num =>
  (num) ? parseInt(num.replace(/,/g, ''), 10) : NaN

const parseStats = $ => {
  const stats = {}
  const statElements = $('.stat')

  if (!statElements || statElements.length !== 4) {
    throw new Error('Could not parse stats data.')
  }

  const statsArray = []

  statElements.each((i, statElement) => {
    statsArray.push(parseNumber($(statElement).text()))
  })

  stats.totalBeers = statsArray[0]
  stats.totalUnique = statsArray[1]
  stats.totalBadges = statsArray[2]
  stats.totalFriends = statsArray[3]

  return stats
}

export const parseRecentActivity = $ => {
  const recentActivity = []
  const checkInElements = $('.checkin')

  try {
    checkInElements.each((i, checkInElement) => {
      const activity = {}
      const checkInTopText = $(checkInElement).find('.top .text')
      const checkInBottomLinks = $(checkInElement).find('.bottom a')

      if (!checkInTopText || !checkInBottomLinks || checkInBottomLinks.length === 0) {
        throw new Error('Could not parse check-in data.')
      }

      const checkInText = checkInTopText.text()
      const checkInTime = $(checkInBottomLinks[0]).text()

      if (!checkInTime) {
        throw new Error('Could not parse check-in time.')
      }

      activity.time = moment.utc(checkInTime)

      let parts = checkInText.split(' is drinking an ')

      if (parts.length === 1) {
        parts = checkInText.split(' is drinking a ')
      }

      if (parts.length === 1) {
        throw new Error('Could not parse check-in drink.')
      }

      parts = parts[1].split(' by ')
      activity.beer = parts[0]

      if (parts.length === 2) {
        parts = parts[1].split(' at ')

        activity.brewery = parts[0]

        if (parts.length === 2) {
          activity.location = parts[1]
        }
      }

      recentActivity.push(activity)
    })
  } catch (err) {
    throw new Error(err)
  }

  return recentActivity
}

const parseFriends = $ => {
  const friends = []
  const userElements = $('.user .info')

  userElements.each((i, userElement) => {
    const nameElement = $(userElement).find('h1', 'a')
    const usernameElement = $(userElement).find('.username')
    const locationElement = $(userElement).find('.location')

    if (!nameElement || !usernameElement || !locationElement) {
      throw new Error('Could not parse friend details data.')
    }

    friends.push({
      name: $(nameElement).text(),
      username: $(usernameElement).text(),
      location: $(locationElement).text()
    })
  })

  return friends
}

const updateDrinkHistogram = (beerData, drinkTime) => {
  const dayOfWeek = drinkTime.format('ddd')

  // eslint-disable-next-line no-prototype-builtins
  if (!beerData.dayOfWeek.hasOwnProperty(dayOfWeek)) {
    beerData.dayOfWeek[dayOfWeek] = 0
  }

  beerData.dayOfWeek[dayOfWeek]++

  const hourOfDay = parseNumber(drinkTime.format('H'))

  // eslint-disable-next-line no-prototype-builtins
  if (!beerData.hourOfDay.hasOwnProperty(hourOfDay)) {
    beerData.hourOfDay[hourOfDay] = 0
  }

  beerData.hourOfDay[hourOfDay]++

  const dayOfMonth = parseNumber(drinkTime.format('D'))

  // eslint-disable-next-line no-prototype-builtins
  if (!beerData.dayOfMonth.hasOwnProperty(dayOfMonth)) {
    beerData.dayOfMonth[dayOfMonth] = 0
  }

  beerData.dayOfMonth[dayOfMonth]++
}

const parseBeers = $ => {
  const beerData = {
    beers: [],
    dayOfWeek: {},
    hourOfDay: {},
    dayOfMonth: {}
  }

  const beerElements = $('.beer-item')

  beerElements.each((i, beerElement) => {
    const nameElement = $(beerElement).find('.name a')
    const breweryElement = $(beerElement).find('.brewery')
    const styleElement = $(beerElement).find('.style')
    const abvElement = $(beerElement).find('.abv')
    const ibuElement = $(beerElement).find('.ibu')
    const checkInsElement = $(beerElement).find('.check-ins')

    if (!nameElement || !breweryElement || !styleElement || !abvElement || !ibuElement) {
      throw new Error('Could not parse beer details data.')
    }

    const dateElements = $(beerElement).find('.date a .date-time')

    if (dateElements.length !== 2) {
      throw new Error('Could not parse beer dates.')
    }

    const firstDrinkTime = moment($(dateElements[0]).text())
    const lastDrinkTime = moment($(dateElements[1]).text())

    beerData.beers.push({
      name: $(nameElement).text(),
      brewery: $(breweryElement).text(),
      style: $(styleElement).text(),
      abv: $(abvElement).text(),
      ibu: $(ibuElement).text(),
      firstDrinkTime,
      lastDrinkTime,
      checkIns: parseNumber($(checkInsElement).text().split('Total: ')[1])
    })

    updateDrinkHistogram(beerData, firstDrinkTime)

    if (firstDrinkTime.diff(lastDrinkTime) !== 0) {
      updateDrinkHistogram(beerData, lastDrinkTime)
    }
  })

  return beerData
}

const parseVenues = $ => {
  const venues = []
  const venueElements = $('.venue-item')

  venueElements.each((i, venueElement) => {
    const venueDetailsElement = $(venueElement).find('.venue-details')

    if (!venueDetailsElement) {
      throw new Error('Could not parse venue data.')
    }

    const nameElement = $(venueDetailsElement).find('.name a')
    const addressElement = $(venueDetailsElement).find('.address')
    const checkInsElement = $(venueElement).find('.details .check-ins')
    const dateElements = $(venueElement).find('.date')

    if (!nameElement || !addressElement || !checkInsElement || !dateElements || dateElements.length === 0) {
      throw new Error('Could not parse venue details data.')
    }

    const address = addressElement.text().trim()
    const firstDateText = $(dateElements[0]).text()
    let firstVisitDate
    let lastVisitDate

    if (dateElements.length === 2) {
      firstVisitDate = firstDateText
      lastVisitDate = $(dateElements[1]).text()
    } else {
      lastVisitDate = firstDateText
    }

    venues.push({
      name: nameElement.text().trim(),
      address,
      checkIns: parseNumber(checkInsElement.text().split('Check-ins: ')[1]),
      firstVisitDate,
      lastVisitDate
    })
  })

  return venues
}

const geocodeAddress = async (geocoder, venue) => new Promise((resolve, reject) => {
  geocoder.geocode({
    address: venue.address
  }, function (results, status) {
    if (status !== 'OK') {
      if (status === 'OVER_QUERY_LIMIT') {
        // Retry after 1 second.
        setTimeout(() => {
          geocodeAddress(geocoder, venue)
            .then(resolve)
            .catch(reject)
        }, 1000)
      } else {
        reject(new Error(status))
      }
    } else {
      venue.geocode = results
      resolve()
    }
  })
})

const geocodeAddresses = async (googleMapsClient, venues) => {
  if (!googleMapsClient) {
    throw new Error('Must set the Google Maps API key prior to using this functionality.')
  }

  const geocoder = new googleMapsClient.maps.Geocoder()
  const promises = []

  for (const venue of venues) {
    promises.push(geocodeAddress(geocoder, venue))
  }

  await Promise.all(promises)
}

const displayGoogleMap = (googleMapsClient, venues) => {
  const latLngs = []
  const markers = []
  const heatmapData = []

  for (const venue of venues) {
    if (venue.geocode) {
      const latLng = {
        lat: venue.geocode[0].geometry.location.lat(),
        lng: venue.geocode[0].geometry.location.lng()
      }

      latLngs.push(latLng)

      markers.push(
        new googleMapsClient.maps.Marker({
          position: latLng,
          title: `${venue.checkIns} beers logged at ${venue.name}`
        })
      )

      heatmapData.push({
        location: new googleMapsClient.maps.LatLng(latLng.lat, latLng.lng),
        weight: venue.checkIns
      })
    }
  }

  const center = {
    lat: latLngs.map(latLng => latLng.lat).reduce((a, b) => a + b, 0) / latLngs.length,
    lng: latLngs.map(latLng => latLng.lng).reduce((a, b) => a + b, 0) / latLngs.length
  }

  const map = new googleMapsClient.maps.Map(document.getElementById('map'), {
    center,
    zoom: 4
  })

  for (const marker of markers) {
    marker.setMap(map)
  }

  // eslint-disable-next-line no-new
  new googleMapsClient.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map,
    dissipating: false
  })

  return map
}

export const getUntappdOsint = async (username, recentActivityOnly, googleMapsClient) => {
  const data = { username }

  const userDom = await getUserDom(username)
  data.stats = parseStats(userDom)
  data.recentActivity = parseRecentActivity(userDom)

  if (recentActivityOnly) {
    return data
  }

  const [friendsDom, beersDom, venuesDom] = await Promise.all([
    getFriendsDom(username),
    getBeersDom(username),
    getVenuesDom(username)
  ])

  data.friends = parseFriends(friendsDom)
  data.beerData = parseBeers(beersDom)
  console.log(data.beerData)
  data.venues = parseVenues(venuesDom)

  if (googleMapsClient) {
    await geocodeAddresses(googleMapsClient, data.venues)
    data.map = displayGoogleMap(googleMapsClient, data.venues)
  }

  return data
}

export const loadGoogleMapsClient = async (googleMapsApiKey) => {
  const loader = new Loader({
    apiKey: googleMapsApiKey,
    version: 'weekly',
    libraries: ['visualization']
  })

  await loader.load()
}
