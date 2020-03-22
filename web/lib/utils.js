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

const parseStats = $ => {
  const stats = {}
  const statElements = $('.stat')

  if (!statElements || statElements.length !== 4) {
    throw new Error('Could not parse stats data.')
  }

  const statsArray = []

  statElements.each((i, statElement) => {
    statsArray.push(parseInt($(statElement).text().replace(/,/g, ''), 10))
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

  return recentActivity
}

const parseFriends = $ => {
  const friends = []
  const userElements = $('.user .info')

  userElements.each((i, userElement) => {
    const nameElement = $(userElement).find('h1', 'a')
    const usernameElement = $(userElement).find('.username')
    const locationElement = $(userElement).find('.location')

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

  venueElements.each((i, venueElement) => {
    const venueDetailsElement = $(venueElement).find('.venue-details')

    if (!venueDetailsElement) {
      throw new Error('Could not parse venue data.')
    }

    const nameElement = $(venueDetailsElement).find('.name a')
    const addressElement = $(venueDetailsElement).find('.address')
    const checkInsElement = $(venueElement).find('.details .check-ins')

    venues.push({
      name: nameElement.text().trim(),
      address: addressElement.text().trim(),
      checkIns: parseInt(checkInsElement.text().split('Check-ins: ')[1], 10)
    })
  })

  return venues
}

export const getUntappdOsint = async (username, recentActivityOnly) => {
  const data = {username}

  const userDom = await getUserDom(username)
  data.stats = parseStats(userDom)

  if (recentActivityOnly) {
    data.recentActivity = parseRecentActivity(userDom)
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

  return data
}
