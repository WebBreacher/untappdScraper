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

    # Days of Week Analysis
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
    print '         Mon (%2d) : %s' % (mon, mon*'x')
    print '         Tue (%2d) : %s' % (tue, tue*'x')
    print '         Wed (%2d) : %s' % (wed, wed*'x')
    print '         Thu (%2d) : %s' % (thu, thu*'x')
    print '         Fri (%2d) : %s' % (fri, fri*'x')
    print '         Sat (%2d) : %s' % (sat, sat*'x')
    print '         Sun (%2d) : %s' % (sun, sun*'x')
    print ''

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

    print '[*]  Drinking Patterns (Last 25 beers) - Hours of Day'
    print '       Hour (#) : HISTOGRAM'
    print '      ---------------------------------'
    print '         06 (%2d) : %s' % (h6, h6*'x')
    print '         07 (%2d) : %s' % (h7, h7*'x')
    print '         08 (%2d) : %s' % (h8, h8*'x')
    print '         09 (%2d) : %s' % (h9, h9*'x')
    print '         10 (%2d) : %s' % (h10, h10*'x')
    print '         11 (%2d) : %s' % (h11, h11*'x')
    print '         12 (%2d) : %s' % (h12, h12*'x')
    print '         13 (%2d) : %s' % (h13, h13*'x')
    print '         14 (%2d) : %s' % (h14, h14*'x')
    print '         15 (%2d) : %s' % (h15, h15*'x')
    print '         16 (%2d) : %s' % (h16, h16*'x')
    print '         17 (%2d) : %s' % (h17, h17*'x')
    print '         18 (%2d) : %s' % (h18, h18*'x')
    print '         19 (%2d) : %s' % (h19, h19*'x')
    print '         20 (%2d) : %s' % (h20, h20*'x')
    print '         21 (%2d) : %s' % (h21, h21*'x')
    print '         22 (%2d) : %s' % (h22, h22*'x')
    print '         23 (%2d) : %s' % (h23, h23*'x')
    print '         00 (%2d) : %s' % (h0, h0*'x')
    print '         01 (%2d) : %s' % (h1, h1*'x')
    print '         02 (%2d) : %s' % (h2, h2*'x')
    print '         03 (%2d) : %s' % (h3, h3*'x')
    print '         04 (%2d) : %s' % (h4, h4*'x')
    print '         05 (%2d) : %s' % (h5, h5*'x')
    print ''

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

    print '[*]  Drinking Patterns (Last 25 beers) - Day of Month'
    print '       Day (#) : HISTOGRAM'
    print '      ---------------------------------'
    print '         00 (%2d) : %s' % (d0, d0*'x')
    print '         01 (%2d) : %s' % (d1, d1*'x')
    print '         02 (%2d) : %s' % (d2, d2*'x')
    print '         03 (%2d) : %s' % (d3, d3*'x')
    print '         04 (%2d) : %s' % (d4, d4*'x')
    print '         05 (%2d) : %s' % (d5, d5*'x')
    print '         06 (%2d) : %s' % (d6, d6*'x')
    print '         07 (%2d) : %s' % (d7, d7*'x')
    print '         08 (%2d) : %s' % (d8, d8*'x')
    print '         09 (%2d) : %s' % (d9, d9*'x')
    print '         10 (%2d) : %s' % (d10, d10*'x')
    print '         11 (%2d) : %s' % (d11, d11*'x')
    print '         12 (%2d) : %s' % (d12, d12*'x')
    print '         13 (%2d) : %s' % (d13, d13*'x')
    print '         14 (%2d) : %s' % (d14, d14*'x')
    print '         15 (%2d) : %s' % (d15, d15*'x')
    print '         16 (%2d) : %s' % (d16, d16*'x')
    print '         17 (%2d) : %s' % (d17, d17*'x')
    print '         18 (%2d) : %s' % (d18, d18*'x')
    print '         19 (%2d) : %s' % (d19, d19*'x')
    print '         20 (%2d) : %s' % (d20, d20*'x')
    print '         21 (%2d) : %s' % (d21, d21*'x')
    print '         22 (%2d) : %s' % (d22, d22*'x')
    print '         23 (%2d) : %s' % (d23, d23*'x')
    print '         24 (%2d) : %s' % (d24, d24*'x')
    print '         25 (%2d) : %s' % (d25, d25*'x')
    print '         26 (%2d) : %s' % (d26, d26*'x')
    print '         27 (%2d) : %s' % (d27, d27*'x')
    print '         28 (%2d) : %s' % (d28, d28*'x')
    print '         29 (%2d) : %s' % (d29, d29*'x')
    print '         30 (%2d) : %s' % (d30, d30*'x')
    print '         31 (%2d) : %s' % (d31, d31*'x')
else:
	print '[-]     No recent checkin dates/times found' 


# Get friends of target
friends = GetFriendData(args.user)
if friends:
    print '[ ]     Friends of %s:' % args.user
    print '            Acct Name ------ Name'
    print '            --------------------'
    for friend in friends:
        print '            %s ------ %s' % (friend['acct'], friend['name'])
else:
	print '[-]     No friends found'


# Get User info
user = GetUserData(args.user)
if user:
	print '[ ]     User info for %s:' % args.user
    	print '            Total Beers:   %6s' % user[0]
    	print '            Total Unique:  %6s' % user[1]
    	print '            Total Badges:  %6s' % user[2]
    	print '            Total Friends: %6s' % user[3]
