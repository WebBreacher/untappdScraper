#!/usr/bin/python
"""
    Author: Micah Hoffman (@WebBreacher)
    Purpose: To look up a user on Untappd.com and provide drinking profile
"""

import argparse
from bs4 import BeautifulSoup
import geocoder
import gmplot
import re
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import time


####
# Functions
####

def get_mean(lst):
    return float(sum(lst) / len(lst))


# Parse command line input
parser = argparse.ArgumentParser(description="Grab Untappd user activity")
parser.add_argument('-u', '--user', required=True, help='Username to research')
args = parser.parse_args()


def get_data_from_untappd(url):
    # Setting up and Making the Web Call
    try:
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0'
        headers = {'User-Agent': user_agent}
        # Make web request for that URL and don't verify SSL/TLS certs
        response = requests.get(url, headers=headers, verify=False)
        return response.text

    except Exception as e:
        print('[!]   ERROR - Untappd issue: {}'.format(str(e)))
        exit(1)


def get_user_data(passed_user):
    # Parsing user information
    url = 'https://untappd.com/user/{}'.format(passed_user)
    print("\n[ ] USER DATA: Requesting {}".format(url))
    resp = get_data_from_untappd(url)
    html_doc = BeautifulSoup(resp, "html.parser")
    user1 = html_doc.find_all('span', 'stat')

    if user1:
        return user1


def get_friend_data(passed_user):
    friends1 = []
    # Parsing user friend information
    url = 'https://untappd.com/user/{}/friends'.format(passed_user)
    print("\n[ ] FRIEND DATA: Requesting {}".format(url))
    resp = get_data_from_untappd(url)
    html_doc = BeautifulSoup(resp, "html.parser")
    user1 = html_doc.find_all('div', 'user')
    for u in user1:
        friends1.append(u.text.encode('ascii', 'ignore').strip())

    if friends1:
        return friends1


def get_beers_data(passed_user):
    beers_drank = []
    # Parsing user beer information
    url = 'https://untappd.com/user/{}/beers'.format(passed_user)
    print("\n[ ] BEER CONSUMPTION DATA: Requesting {}".format(url))
    resp = get_data_from_untappd(url)
    html_doc = BeautifulSoup(resp, "html.parser")
    beers = html_doc.find_all('abbr', 'date-time')
    for b in beers:
        beers_drank.append(b.text.strip())

    if beers_drank:
        return beers_drank


def get_venue_data(passed_user):
    # Parsing check-in location information
    drinkslatslongs = []
    drinkslatslongstitle = []
    url = 'https://untappd.com/user/{}/venues?type=&sort=highest_checkin'.format(passed_user)
    print("\n[ ] VENUE DATA: Requesting {}".format(url))
    resp = get_data_from_untappd(url)
    matchvenueobj = re.findall(
        'data-href=":view/name" href="/venue/([0-9]+)">(.+?)</a>.*?class="address">(.+?)</div>.*?Check-ins:</strong>.*?([0-9]+).*?</p>',
        resp, re.DOTALL)
    if matchvenueobj:
        print('      {:>4}   {}, {}'.format('Checkins', 'Name', 'Address'))
        for venue1 in matchvenueobj:
            place = '{}, {}'.format(venue1[1],
                                    venue1[2].replace('\t', '').replace('\n', ''))
            g = geocoder.google(place)  # geocoder works better than the gmap method
            print('       {:>4}      {}, {} {}'.format(
                venue1[3], venue1[1], 
                venue1[2].replace('\t', '').replace('\n', ''), g.latlng))
            if g:
                # Add the correct number of visits to the lat/lon list for weighting
                for num in range(int(venue1[3])):
                    drinkslatslongs.append(tuple(g.latlng))
            drinkslatslongstitle.append([g.latlng, venue1[3], venue1[1]])
    else:
        print('[-] No Venue data found')
    drink_lats, drink_longs = zip(*drinkslatslongs)

    # Compute the center Lat and Long to center the map
    center_lat = get_mean(drink_lats)
    center_long = get_mean(drink_longs)
    gmap = gmplot.GoogleMapPlotter(center_lat, center_long, 6)

    # Create the points/heatmap/circles on the map
    """for lat, lng in drinkslatslongs:
        gmap.circle(lat, lng, 8000)
    gmap.scatter(drink_lats, drink_longs, '#FFFFFF', 8000, marker=False)"""
    for latlng, num, title in drinkslatslongstitle:
        try:
            gmap.marker(latlng[0], latlng[1], title='{} beers logged at {}'.format(num, title))
        except:
            pass
    gmap.heatmap(drink_lats, drink_longs, 1, 100)
    gmap.scatter(drink_lats, drink_longs, '#333333', size=20, marker=False)
    gmap.plot(drink_lats, drink_longs, '#FF33FF', edge_width=3)

    outfile = 'untappd_map_{}_{}.html'.format(args.user, str(int(time.time())))
    gmap.draw(outfile)
    print("\n[ ] HTML output file named {} was written to disk.\n".format(outfile))


###########################
# Start
###########################

# Suppress HTTPS warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

###############
# Get User info
###############
user = get_user_data(args.user)
if user:
    print('        Total Beers:   {:>6}'.format(user[0].text))
    print('        Total Unique:  {:>6}'.format(user[1].text))
    print('        Total Badges:  {:>6}'.format(user[2].text))
    print('        Total Friends: {:>6}'.format(user[3].text))

###############
# Get friends of target
###############
friends = get_friend_data(args.user)
if friends:
    print('        Name Account Location')
    print('        ------------------------------------------')
    for friend in friends:
        print('        {:17}'.format(friend.decode('utf-8')))
else:
    print('[-]     No friends found')

###############
# Get Beer Drinking dates/times
###############
when = list(set(get_beers_data(args.user)))  # We need to remove duplicates from the list
days_of_week = []
days_of_month = []
hours_of_day = []

if when:
    for beer_date_time in when:
        dates = beer_date_time.split()
        days_of_week.append(dates[0].strip(','))
        days_of_month.append(dates[1])
        hours_min_sec = dates[4].split(':')
        hours_of_day.append(hours_min_sec[0])

    # Days of Week Analysis
    sun = days_of_week.count('Sun')
    mon = days_of_week.count('Mon')
    tue = days_of_week.count('Tue')
    wed = days_of_week.count('Wed')
    thu = days_of_week.count('Thu')
    fri = days_of_week.count('Fri')
    sat = days_of_week.count('Sat')

    print('[*]  Drinking Patterns (Last 25 beers) - Days of Week')
    print('         Day ( #) : HISTOGRAM')
    print('        ---------------------------------')
    print('         Mon ({:>2}) : {}'.format(mon, mon * 'x'))
    print('         Tue ({:>2}) : {}'.format(tue, tue * 'x'))
    print('         Wed ({:>2}) : {}'.format(wed, wed * 'x'))
    print('         Thu ({:>2}) : {}'.format(thu, thu * 'x'))
    print('         Fri ({:>2}) : {}'.format(fri, fri * 'x'))
    print('         Sat ({:>2}) : {}'.format(sat, sat * 'x'))
    print('         Sun ({:>2}) : {}'.format(sun, sun * 'x'))
    print('')

    # Hours of Day Analysis
    h6 = hours_of_day.count('06')
    h7 = hours_of_day.count('07')
    h8 = hours_of_day.count('08')
    h9 = hours_of_day.count('09')
    h10 = hours_of_day.count('10')
    h11 = hours_of_day.count('11')
    h12 = hours_of_day.count('12')
    h13 = hours_of_day.count('13')
    h14 = hours_of_day.count('14')
    h15 = hours_of_day.count('15')
    h16 = hours_of_day.count('16')
    h17 = hours_of_day.count('17')
    h18 = hours_of_day.count('18')
    h19 = hours_of_day.count('19')
    h20 = hours_of_day.count('20')
    h21 = hours_of_day.count('21')
    h22 = hours_of_day.count('22')
    h23 = hours_of_day.count('23')
    h0 = hours_of_day.count('00')
    h1 = hours_of_day.count('01')
    h2 = hours_of_day.count('02')
    h3 = hours_of_day.count('03')
    h4 = hours_of_day.count('04')
    h5 = hours_of_day.count('05')

    print('[*]  Drinking Patterns (Last 25 beers) - Hours of Day')
    print('         Hour  ( #) : HISTOGRAM')
    print('      ---------------------------------')
    print('         06:00 ({:>2}) : {}'.format(h6, h6 * 'x'))
    print('         07:00 ({:>2}) : {}'.format(h7, h7 * 'x'))
    print('         08:00 ({:>2}) : {}'.format(h8, h8 * 'x'))
    print('         09:00 ({:>2}) : {}'.format(h9, h9 * 'x'))
    print('         10:00 ({:>2}) : {}'.format(h10, h10 * 'x'))
    print('         11:00 ({:>2}) : {}'.format(h11, h11 * 'x'))
    print('         12:00 ({:>2}) : {}'.format(h12, h12 * 'x'))
    print('         13:00 ({:>2}) : {}'.format(h13, h13 * 'x'))
    print('         14:00 ({:>2}) : {}'.format(h14, h14 * 'x'))
    print('         15:00 ({:>2}) : {}'.format(h15, h15 * 'x'))
    print('         16:00 ({:>2}) : {}'.format(h16, h16 * 'x'))
    print('         17:00 ({:>2}) : {}'.format(h17, h17 * 'x'))
    print('         18:00 ({:>2}) : {}'.format(h18, h18 * 'x'))
    print('         19:00 ({:>2}) : {}'.format(h19, h19 * 'x'))
    print('         20:00 ({:>2}) : {}'.format(h20, h20 * 'x'))
    print('         21:00 ({:>2}) : {}'.format(h21, h21 * 'x'))
    print('         22:00 ({:>2}) : {}'.format(h22, h22 * 'x'))
    print('         23:00 ({:>2}) : {}'.format(h23, h23 * 'x'))
    print('         00:00 ({:>2}) : {}'.format(h0, h0 * 'x'))
    print('         01:00 ({:>2}) : {}'.format(h1, h1 * 'x'))
    print('         02:00 ({:>2}) : {}'.format(h2, h2 * 'x'))
    print('         03:00 ({:>2}) : {}'.format(h3, h3 * 'x'))
    print('         04:00 ({:>2}) : {}'.format(h4, h4 * 'x'))
    print('         05:00 ({:>2}) : {}'.format(h5, h5 * 'x'))
    print('')

    # Day of Month Analysis
    d0 = days_of_month.count('00')
    d1 = days_of_month.count('01')
    d2 = days_of_month.count('02')
    d3 = days_of_month.count('03')
    d4 = days_of_month.count('04')
    d5 = days_of_month.count('05')
    d6 = days_of_month.count('06')
    d7 = days_of_month.count('07')
    d8 = days_of_month.count('08')
    d9 = days_of_month.count('09')
    d10 = days_of_month.count('10')
    d11 = days_of_month.count('11')
    d12 = days_of_month.count('12')
    d13 = days_of_month.count('13')
    d14 = days_of_month.count('14')
    d15 = days_of_month.count('15')
    d16 = days_of_month.count('16')
    d17 = days_of_month.count('17')
    d18 = days_of_month.count('18')
    d19 = days_of_month.count('19')
    d20 = days_of_month.count('20')
    d21 = days_of_month.count('21')
    d22 = days_of_month.count('22')
    d23 = days_of_month.count('23')
    d24 = days_of_month.count('24')
    d25 = days_of_month.count('25')
    d26 = days_of_month.count('26')
    d27 = days_of_month.count('27')
    d28 = days_of_month.count('28')
    d29 = days_of_month.count('29')
    d30 = days_of_month.count('30')
    d31 = days_of_month.count('31')

    print('[*]  Drinking Patterns (Last 25 beers) - Day of Month')
    print('       Day (#) : HISTOGRAM')
    print('      ---------------------------------')
    print('       00  ({:>2}) : {}'.format(d0, d0 * 'x'))
    print('       01  ({:>2}) : {}'.format(d1, d1 * 'x'))
    print('       02  ({:>2}) : {}'.format(d2, d2 * 'x'))
    print('       03  ({:>2}) : {}'.format(d3, d3 * 'x'))
    print('       04  ({:>2}) : {}'.format(d4, d4 * 'x'))
    print('       05  ({:>2}) : {}'.format(d5, d5 * 'x'))
    print('       06  ({:>2}) : {}'.format(d6, d6 * 'x'))
    print('       07  ({:>2}) : {}'.format(d7, d7 * 'x'))
    print('       08  ({:>2}) : {}'.format(d8, d8 * 'x'))
    print('       09  ({:>2}) : {}'.format(d9, d9 * 'x'))
    print('       10  ({:>2}) : {}'.format(d10, d10 * 'x'))
    print('       11  ({:>2}) : {}'.format(d11, d11 * 'x'))
    print('       12  ({:>2}) : {}'.format(d12, d12 * 'x'))
    print('       13  ({:>2}) : {}'.format(d13, d13 * 'x'))
    print('       14  ({:>2}) : {}'.format(d14, d14 * 'x'))
    print('       15  ({:>2}) : {}'.format(d15, d15 * 'x'))
    print('       16  ({:>2}) : {}'.format(d16, d16 * 'x'))
    print('       17  ({:>2}) : {}'.format(d17, d17 * 'x'))
    print('       18  ({:>2}) : {}'.format(d18, d18 * 'x'))
    print('       19  ({:>2}) : {}'.format(d19, d19 * 'x'))
    print('       20  ({:>2}) : {}'.format(d20, d20 * 'x'))
    print('       21  ({:>2}) : {}'.format(d21, d21 * 'x'))
    print('       22  ({:>2}) : {}'.format(d22, d22 * 'x'))
    print('       23  ({:>2}) : {}'.format(d23, d23 * 'x'))
    print('       24  ({:>2}) : {}'.format(d24, d24 * 'x'))
    print('       25  ({:>2}) : {}'.format(d25, d25 * 'x'))
    print('       26  ({:>2}) : {}'.format(d26, d26 * 'x'))
    print('       27  ({:>2}) : {}'.format(d27, d27 * 'x'))
    print('       28  ({:>2}) : {}'.format(d28, d28 * 'x'))
    print('       29  ({:>2}) : {}'.format(d29, d29 * 'x'))
    print('       30  ({:>2}) : {}'.format(d30, d30 * 'x'))
    print('       31  ({:>2}) : {}'.format(d31, d31 * 'x'))
    print('')

    # Drinking Levels from https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking
    # Binge Drinking = 5+ drinks same day
    # Heavy Drinking = 5+ drinks on 5+ days per month
    #     Since we only get 25 total beers now, I'm changing this to 4 days per month ~=heavy drinker
    binge_drink_counter = 0
    for day in ["%02d" % i for i in range(32)]:
        if days_of_month.count(day) >= 5:
            print('[!] *ALERT - Due to drinking {} beers on day {}, user may be a "Binge Drinker"'.format(
                days_of_month.count(day), day))
            print('[!]          Examine times they drank the beers below. If 5+ drinks in < 2 hours, then binge.')
            # Cycle back through the data to pull out H:M:S for beers drank on a certain day
            for beer_date_time in when:
                dates = beer_date_time.split()
                if day == dates[1]:
                    print('[!]            {}'.format(dates[4]))

            binge_drink_counter += 1
    if binge_drink_counter >= 4:
        print(
            '[!] *ALERT = Due to {} days of Binge Drinking, user may be a "Heavy Drinker"'.format(binge_drink_counter))
    elif binge_drink_counter >= 1:
        print('[!]      * This script does not examine the amount of time between drinks, which is important.')
        print(
            '[!]      * https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking')

else:
    print('[-]     No recent check-in dates/times found')

###############
# Get Venue info
###############
venue = get_venue_data(args.user)
