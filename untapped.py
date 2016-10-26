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
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36'
        headers = {'User-Agent': user_agent}
        req = urllib2.Request(url, headers)
        response = urllib2.urlopen(req, timeout=20)
        print '[+]     Response from Untappd received'
        return response

    except Exception, e:
        print '[!]   ERROR - Untappd issue: %s' % str(e)
        exit(1)


def GetUserData(passed_user):
    # Parsing user information
    url = 'https://untappd.com/user/%s' % passed_user
    resp = GetDataFromUntappd(url)
    
    # Do something with the responses
    

def GetFriendData(passed_user):
    friends = []
    # Parsing user friend information
    url = 'https://untappd.com/user/%s/friends' % passed_user
    print "\n[-] Requesting %s" % url
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
    print "\n[-] Requesting %s" % url
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
if when:
    for beer_date_time in when:
        #Do something with this info
        print '[+]     %s' % beer_date_time
    print '[+]     %s checked in %s beers' % (args.user, len(when))
else:
	print '[-]     No recent checkin dates/times found' 

# Get friends of target
friends = GetFriendData(args.user)
if friends:
    print '[+] Friends of %s:' % args.user
    for friend in friends:
        print '[+]     NAME: %s  --->  ACCT: %s' % (friend['name'], friend['acct'])
else:
	print '[-]     No friends found'