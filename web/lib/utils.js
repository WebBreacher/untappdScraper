import * as axios from 'axios'
import * as cheerio from 'cheerio'
import * as moment from 'moment-timezone'
import { Loader } from '@googlemaps/loader'

export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const baseUrl = 'https://cors-anywhere.herokuapp.com/https://untappd.com'

const timeToMomentWithTimezone = (time) => {
  const offset = moment(time).format('Z')
  const timezoneNames = moment.tz.names()

  const timezoneName = timezoneNames.find(timezoneName =>
    offset === moment.tz(timezoneName).format('Z')
  )

  return moment.tz(time, timezoneName)
}

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

      activity.time = timeToMomentWithTimezone(checkInTime)

      let parts = checkInText.split(' is drinking an ')

      if (parts.length === 1) {
        parts = checkInText.split(' is drinking a ')
      }

      if (parts.length === 1) {
        parts = checkInText.split(' is drinking ')
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

const parseBeers = $ => {
  const beers = []

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

    beers.push({
      name: $(nameElement).text(),
      brewery: $(breweryElement).text(),
      style: $(styleElement).text(),
      abv: $(abvElement).text(),
      ibu: $(ibuElement).text(),
      firstDrinkTime: timeToMomentWithTimezone($(dateElements[0]).text()),
      lastDrinkTime: timeToMomentWithTimezone($(dateElements[1]).text()),
      checkIns: parseNumber($(checkInsElement).text().split('Total: ')[1])
    })
  })

  return beers
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

    if (firstVisitDate) {
      firstVisitDate = firstVisitDate.split('First Visit: ')[1]
    }

    if (lastVisitDate) {
      lastVisitDate = lastVisitDate.split('Last Visit: ')[1]
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

const updateDrinkHistogram = (beerAnalytics, drinkTime) => {
  const dayOfWeek = drinkTime.format('ddd')
  beerAnalytics.dayOfWeek[dayOfWeek]++

  const hourOfDay = parseNumber(drinkTime.format('H'))
  beerAnalytics.hourOfDay[hourOfDay]++

  const dayOfMonth = parseNumber(drinkTime.format('D'))
  beerAnalytics.dayOfMonth[dayOfMonth]++
}

const analyzeBeers = (beers, recentActivity) => {
  const beerAnalytics = {
    dayOfWeek: {},
    hourOfDay: {},
    dayOfMonth: {},
    binges: [],
    heavyUses: []
  }

  const uniqueDrinkTimes = []
  const uniqueDrinkUnixTimestamps = []

  for (const day of daysOfWeek) {
    beerAnalytics.dayOfWeek[day] = 0
  }

  for (let i = 0; i < 24; i++) {
    beerAnalytics.hourOfDay[i] = 0
  }

  for (let i = 1; i <= 31; i++) {
    beerAnalytics.dayOfMonth[i] = 0
  }

  for (const beer of beers) {
    uniqueDrinkTimes.push(beer.firstDrinkTime)
    uniqueDrinkUnixTimestamps.push(beer.firstDrinkTime.unix())
    updateDrinkHistogram(beerAnalytics, beer.firstDrinkTime)

    if (beer.firstDrinkTime.diff(beer.lastDrinkTime) !== 0) {
      uniqueDrinkTimes.push(beer.lastDrinkTime)
      uniqueDrinkUnixTimestamps.push(beer.lastDrinkTime.unix())
      updateDrinkHistogram(beerAnalytics, beer.lastDrinkTime)
    }
  }

  for (const activity of recentActivity) {
    const time = activity.time
    const timeUnix = time.unix()

    if (!uniqueDrinkUnixTimestamps.includes(timeUnix)) {
      uniqueDrinkTimes.push(time)
      uniqueDrinkUnixTimestamps.push(timeUnix)
      updateDrinkHistogram(beerAnalytics, time)
    }
  }

  const uniqueDrinkTimesSorted = uniqueDrinkTimes.sort((drinkTimeA, drinkTimeB) => {
    const drinkUnixA = drinkTimeA.unix()
    const drinkUnixB = drinkTimeB.unix()

    if (drinkUnixA < drinkUnixB) {
      return -1
    }

    if (drinkUnixA > drinkUnixB) {
      return 1
    }

    return 0
  })

  /*
  Drinking Levels from https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking
  Binge Drinking = 5+ drinks (men) / 4+ drinks (women) in < 2 hours
  Heavy Alcohol Use = 5+ instances of binge drinking in the past month
  */

  let potentialBinge = []

  for (const drinkTime of uniqueDrinkTimesSorted) {
    if (potentialBinge.length === 0) {
      potentialBinge = [drinkTime]
    } else if (drinkTime.diff(potentialBinge[potentialBinge.length - 1], 'hours') > 2) {
      if (potentialBinge.length >= 4) {
        beerAnalytics.binges.push(potentialBinge)
      }

      potentialBinge = [drinkTime]
    } else {
      potentialBinge.push(drinkTime)
    }
  }

  if (potentialBinge.length >= 4) {
    beerAnalytics.binges.push(potentialBinge)
  }

  let potentialHeavyUse = []
  const oneMonthSeconds = 60 * 60 * 24 * 30

  for (const binge of beerAnalytics.binges) {
    if (potentialHeavyUse.length === 0) {
      potentialHeavyUse = [binge]
    } else {
      const previousBinge = potentialBinge[potentialBinge.length - 1]

      if (binge[0].diff(previousBinge[previousBinge.length - 1]) > oneMonthSeconds) {
        if (potentialHeavyUse.length >= 5) {
          beerAnalytics.heavyUses.push(potentialHeavyUse)
        }

        potentialHeavyUse = [binge]
      } else {
        potentialHeavyUse.push(binge)
      }
    }
  }

  if (potentialHeavyUse.length >= 5) {
    beerAnalytics.heavyUses.push(potentialHeavyUse)
  }

  return beerAnalytics
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
  data.beers = parseBeers(beersDom)
  data.venues = parseVenues(venuesDom)

  data.beerAnalytics = analyzeBeers(data.beers, data.recentActivity)

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

export const formatHour = (hour) => {
  return moment(hour, 'H').format('h A')
}
