import * as axios from 'axios'
import * as cheerio from 'cheerio'
import * as moment from 'moment'

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
  parseInt(num.replace(/,/g, ''), 10)

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

const parseBeers = $ => {
  return null
}

const parseVenues = $ => {
  const venues = []
  const venueElements = $('.venue-item')

  venueElements.each(async (i, venueElement) => {
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
      reject(new Error(status))
    } else {
      venue.geocode = results
      resolve()
    }
  })
})

const geocodeAddresses = async (googleMapsClient, venues) => {
  if (!googleMapsClient) {
    reject(new Error('Must set the Google Maps API key prior to using this functionality.'))
    return
  }

  const geocoder = new googleMapsClient.maps.Geocoder()

  /*
  Google Maps allows 10 queries per second:
  https://developers.google.com/maps/premium/previous-licenses/articles/usage-limits#throttle
  */
  const batchSize = 10
  let i = 0

  while (i < venues.length) {
    const batch = venues.slice(i, i + batchSize)
    const promises = []

    for (let venue of batch) {
      promises.push(geocodeAddress(geocoder, venue))
    }

    await Promise.all(promises)

    i += batchSize

    if (i < venues.length) {
      await new Promise(resolve => {
        // The query limit appears to take much longer to reset than 1 second. Wait 10.
        setTimeout(resolve, 10000)
      })
    }
  }
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

  if (googleMapsClient) {
    await geocodeAddresses(googleMapsClient, data.venues)
  }

  return data
}
