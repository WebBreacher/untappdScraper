#!/usr/bin/python
'''
    Author: Micah Hoffman (@WebBreacher)
    Purpose: To look up a user on Untappd and provide drinking profile
    TODO -
        1 - These pages only show so much without authentication.
        	Auth then pass cookies? Then page every 25 records? (See Burp)
'''

import argparse
import re
import sys
import urllib2

####
# Variables
####

# Parse command line input
parser = argparse.ArgumentParser(description="Grab Untappd user activity")
parser.add_argument('-u', '--user', required=True, help='Username to research')
#parser.add_argument('-o', '--outfile', help='[OPTIONAL] Output file for all content')
args = parser.parse_args()

def GetDataFromUntappd(url):
    # Setting up and Making the Web Call
    try:
        user_agent = 'Mozilla/5.0 (Windows NT 12.0; WOW64) AppleWebKit/537.46 (KHTML, like Gecko) Chrome/47.0.2454.88 Safari/537.46'
        headers = {'User-Agent': user_agent}
        req = urllib2.Request(url, headers = headers)
        response = urllib2.urlopen(req, timeout=20)
        print '[+]     Response from Untappd received'
        return response

    except Exception, e:
        print '[!]   ERROR - Untappd issue: %s' % str(e)
        exit(1)


def GetUserData(passed_user):
    # Parsing user information
    user = []
    url = 'https://untappd.com/user/%s' % passed_user
    print "\n[ ] Requesting %s" % url
    resp = GetDataFromUntappd(url)
    for line in resp.readlines():
        matchUserObj = re.match('.*<span class="stat">([0-9,]+)</span>', line)
        if matchUserObj:
            user.append(matchUserObj.group(1))

    if user:
        return user
    

def GetFriendData(passed_user):
    friends = []
    # Parsing user friend information
    url = 'https://untappd.com/user/%s/friends' % passed_user
    print "\n[ ] Requesting %s" % url
    resp = GetDataFromUntappd(url)
    for line in resp.readlines():
        matchNamesObj = re.match('.*<a href="/user/(.+)">(.+)</a>.*', line)
        if matchNamesObj:
            friend_acct = matchNamesObj.group(1)
            friend_name = matchNamesObj.group(2)
            friends.append({'acct':friend_acct,'name':friend_name})
    if friends:
        return friends


def GetVenueData(passed_user):
    # Parsing user friend information
    url = 'https://untappd.com/user/%s/venue' % passed_user
    resp = GetDataFromUntappd(url)
    
    # Do something with the responses


def GetBeersData(passed_user):
    beers_drank = []
    # Parsing user beer information
    url = 'https://untappd.com/user/%s/beers' % passed_user
    print "\n[ ] Requesting %s" % url
    resp = GetDataFromUntappd(url)
    for line in resp.readlines():
        matchObj = re.match('.*recentCheckin.+date-time">(.+?)<', line)
        if matchObj:
            beer_drank = matchObj.group(1)
            beers_drank.append(beer_drank)
    if beers_drank:
        return beers_drank
          
    

###########################
# Start
###########################

# Get Beer Drinking dates/times
when = GetBeersData(args.user)
days_of_week = []
days_of_month = []
hours_of_day = []

if when:
    for beer_date_time in when:
        # Need to separate all pieces of the date
        # get day of week and count
        #     then do a histogram
        # get day of the month (number)
        #     then do histogram
        # get number of times per day 09 Oct 2016
        #     then do histogram
        # get hours of day
        #     then do a histogram
        # do analysis of binge drinker
        # Average number of drinks per day
        # average number of drinks per month
        
        dates = beer_date_time.split()
        days_of_week.append(dates[0].strip(','))
        days_of_month.append(dates[1])
        hours_min_sec = dates[4].split(':')
        hours_of_day.append(hours_min_sec[0])

        #print '[+]     %s' % beer_date_time
    for d in days_of_week:
        print d, days_of_week[d]*'|"'

    print days_of_month
    print months_of_year
    print hours_of_day
    print '[+]     %s checked in %s beers' % (args.user, len(when))
else:
	print '[-]     No recent checkin dates/times found' 
''' debug
# Get friends of target
friends = GetFriendData(args.user)
if friends:
    print '[ ]     Friends of %s:' % args.user
    print '            Acct Name ------ Name'
    print '            --------------------'
    for friend in friends:
        print '[+]         %s ------ %s' % (friend['acct'], friend['name'])
else:
	print '[-]     No friends found'

# Get User info
user = GetUserData(args.user)
if user:
	print '[ ]     User info for %s:' % args.user
    	print '[+]         Total Beers:   %s' % user[0]
    	print '[+]         Total Unique:  %s' % user[1]
    	print '[+]         Total Badges:  %s' % user[2]
    	print '[+]         Total Friends: %s' % user[3]
'''