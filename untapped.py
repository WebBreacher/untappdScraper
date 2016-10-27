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
    sun = days_of_week.count('Sun')
    mon = days_of_week.count('Mon')
    tue = days_of_week.count('Tue')
    wed = days_of_week.count('Wed')
    thu = days_of_week.count('Thu')
    fri = days_of_week.count('Fri')
    sat = days_of_week.count('Sat')

    print '[*]  Drinking Patterns (Last 25 beers) - Days of Week'
    print '         Day (#) : HISTOGRAM'
    print '        ---------------------------------'
    print '         Mon (%s) : %s' % (mon, mon*'x')
    print '         Tue (%s) : %s' % (tue, tue*'x')
    print '         Wed (%s) : %s' % (wed, wed*'x')
    print '         Thu (%s) : %s' % (thu, thu*'x')
    print '         Fri (%s) : %s' % (fri, fri*'x')
    print '         Sat (%s) : %s' % (sat, sat*'x')
    print '         Sun (%s) : %s' % (sun, sun*'x')
    print ''
    

    print days_of_month
    print ''

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

    print '[*]  Drinking Patterns (Last 25 beers) - Hours of Day'
    print '       Hour (#) : HISTOGRAM'
    print '      ---------------------------------'
    print '         06 (%s) : %s' % (h6, h6*'x')
    print '         07 (%s) : %s' % (h7, h7*'x')
    print '         08 (%s) : %s' % (h8, h8*'x')
    print '         09 (%s) : %s' % (h9, h9*'x')
    print '         10 (%s) : %s' % (h10, h10*'x')
    print '         11 (%s) : %s' % (h11, h11*'x')
    print '         12 (%s) : %s' % (h12, h12*'x')
    print '         13 (%s) : %s' % (h13, h13*'x')
    print '         14 (%s) : %s' % (h14, h14*'x')
    print '         15 (%s) : %s' % (h15, h15*'x')
    print '         16 (%s) : %s' % (h16, h16*'x')
    print '         17 (%s) : %s' % (h17, h17*'x')
    print '         18 (%s) : %s' % (h18, h18*'x')
    print '         19 (%s) : %s' % (h19, h19*'x')
    print '         20 (%s) : %s' % (h20, h20*'x')
    print '         21 (%s) : %s' % (h21, h21*'x')
    print '         22 (%s) : %s' % (h22, h22*'x')
    print '         23 (%s) : %s' % (h23, h23*'x')
    print '         00 (%s) : %s' % (h0, h0*'x')
    print '         01 (%s) : %s' % (h1, h1*'x')
    print '         02 (%s) : %s' % (h2, h2*'x')
    print '         03 (%s) : %s' % (h3, h3*'x')
    print '         04 (%s) : %s' % (h4, h4*'x')
    print '         05 (%s) : %s' % (h5, h5*'x')
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