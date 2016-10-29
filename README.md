# untappdScraper
I noticed that many people on Twitter [publish when they use the Untappd.com](https://www.google.com/search?num=100&newwindow=1&q=untappd+%22i+just+earned%22+site%3Atwitter.com&oq=untappd+%22i+just+earned%22+site%3Atwitter.com&gs_l=serp.3...4164.7850.0.8239.9.9.0.0.0.0.140.679.6j2.8.0....0...1c.1.64.serp..1.3.259...33i160k1j33i21k1.7lDTNQbSBAk) application. This app allows a user to "check-in" when they drink beer. They get badges, they dates and times of their drinking is noted, and many times the geographic location of where they drank is also available.....all with no authentication! Woohoo!

So I wondered if I could patch together some Python to scrape the [Untappd.com](http://untappd.com) web site for a given user and then do some analytics on their drinking habits. Stuff like:
* What time of day do they drink most often?
* What day of the week do they drink most often?
* What day of the month do they drink most often?
* Who do they drink with?
* Where do they drink?
* Are they "binge" drinking?

# Caveat
Since this script scrapes the public pages (private Untappd profiles are not scraped) without using the Untappd API and without requiring login, it only has access to the last 25 beers a target has consumed. While this doesn't sound like a lot, we can learn many things from 25 beers. And what if you ran this script every week (or day!)? Could you store all the data about a specific person on a rolling basis? Yup!

# Usage
Grab the code for this and you should be good (no 3rd party libraries for running).

```
$  python untapped.py -h
usage: untapped.py [-h] -u USER

Grab Untappd user activity

optional arguments:
  -h, --help            show this help message and exit
  -u USER, --user USER  Username to research
```

# Example

```
$  python untapped.py -u nvrhapy

[ ] USER DATA: Requesting https://untappd.com/user/nvrhapy
        Total Beers:    2,263
        Total Unique:   1,138
        Total Badges:     396
        Total Friends:     15

[ ] FRIEND DATA: Requesting https://untappd.com/user/nvrhapy/friends
        Account               Name
        ----------------------------------
        jv34682               John V.
        tommasocamilleri2     Tommaso C.
        Joeheredia            Joe H.
        beerhere89            stephany d.
        Jwilson126            Jason W.
        fernicus              Adam F.
        1MattyG               Matty G.
        traceyann83           Tracey N.
        Fatabird              Fatima F.
        greencape             Jay M.
        crispix               Christina Z.
        Redpac                Dan S.
        pinatax               Tall S.
        sprout1880            russell u.
        1rar3br33d            Matt

[ ] BEER CONSUMPTION DATA: Requesting https://untappd.com/user/nvrhapy/beers
[*]  Drinking Patterns (Last 25 beers) - Days of Week
         Day ( #) : HISTOGRAM
        ---------------------------------
         Mon ( 0) :
         Tue ( 0) :
         Wed ( 0) :
         Thu ( 1) : x
         Fri ( 1) : x
         Sat (14) : xxxxxxxxxxxxxx
         Sun ( 9) : xxxxxxxxx

[*]  Drinking Patterns (Last 25 beers) - Hours of Day
         Hour  ( #) : HISTOGRAM
      ---------------------------------
         06:00 ( 0) :
         07:00 ( 0) :
         08:00 ( 0) :
         09:00 ( 0) :
         10:00 ( 1) : x
         11:00 ( 1) : x
         12:00 ( 0) :
         13:00 ( 2) : xx
         14:00 ( 0) :
         15:00 ( 0) :
         16:00 ( 2) : xx
         17:00 ( 0) :
         18:00 ( 0) :
         19:00 ( 2) : xx
         20:00 ( 4) : xxxx
         21:00 ( 6) : xxxxxx
         22:00 ( 3) : xxx
         23:00 ( 4) : xxxx
         00:00 ( 0) :
         01:00 ( 0) :
         02:00 ( 0) :
         03:00 ( 0) :
         04:00 ( 0) :
         05:00 ( 0) :

[*]  Drinking Patterns (Last 25 beers) - Day of Month
       Day (#) : HISTOGRAM
      ---------------------------------
       00  ( 0) :
       01  ( 1) : x
       02  ( 0) :
       03  ( 3) : xxx
       04  ( 1) : x
       05  ( 0) :
       06  ( 0) :
       07  ( 0) :
       08  ( 1) : x
       09  ( 3) : xxx
       10  ( 1) : x
       11  ( 0) :
       12  ( 0) :
       13  ( 0) :
       14  ( 1) : x
       15  ( 3) : xxx
       16  ( 2) : xx
       17  ( 1) : x
       18  ( 2) : xx
       19  ( 0) :
       20  ( 0) :
       21  ( 0) :
       22  ( 5) : xxxxx
       23  ( 1) : x
       24  ( 0) :
       25  ( 0) :
       26  ( 0) :
       27  ( 0) :
       28  ( 0) :
       29  ( 0) :
       30  ( 0) :
       31  ( 0) :

[!] *ALERT - Due to drinking 5 beers on day 22, user may be a "Binge Drinker"
[!]          Examine the times they drank these beers below. If 5+ drinks in < 2 hours, then binge.
[!]            23:51:43
[!]            21:54:11
[!]            21:31:33
[!]            21:22:04
[!]            20:29:19
[!]      * This script does not examine the amount of time between drinks, which is important.
[!]      * https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking

[ ] VENUE DATA: Requesting https://untappd.com/user/nvrhapy/venues?type=&sort=highest_checkin
      Checkins   Name, Address
        633      shorts house, IL
        218      steve and christinas, IL
        106      Redpac's Cocktail Lounge and Beer Bar, 2145 calistoga ave New Lenox, IL
         57      sprout's brew haus, IL
         42      The Beer Dungeon, IL
         32      Steger Wildcat Football, IL
         31      halsted & joe orr rd, IL
         31      One Trick Pony, 17933 Chappel Ave Lansing, IL
         29      Peaceful Acres Resort, Larch Rd Ludington, MI
         26      Evil Horse Brewing Company, 1336 Main St Crete, IL
         24      Lassen's Sports Bar & Grill, 2131 183rd St Homewood, IL
         23      Chicagoland Speedway, 500 Speedway Blvd Joliet, IL
         20      Flossmoor Station Restaurant & Brewery, 1035 Sterling Ave Flossmoor, IL
         19      Smokey Jo's Real Pit BBQ & Old Town Tap, 475 W Burville Rd Crete, IL
         18      MountainLoft Resort, 110 Mountainloft Dr Gatlinburg, TN
         17      Matts place, IL
         17      Steger Baseball (Veterans Park), 3599 Phillips Ave Steger, IL
         16      Crown Brewing, 211 S East St Crown Point, IN
         16      Road America, N7390 Highway 67 Elkhart Lake, WI
         14      Richard D. Irwin Park, IL
         13      City of Chicago Heights, IL
         13      The Open Bottle, 7101 183rd St Ste 105 Tinley Park, IL
         13      Rock Bottom Restaurant & Brewery, 16156 S La Grange Rd Orland Park, IL
         12      Prairie State College, 202 S Halsted St Chicago Heights, IL
         12      Eastview School,
```

# To Do
* Triangulate where the person lives by using the places they most frequent and some fancy geolocation
* Webify this so that it looks better and easy to access
* See if I can get more than just the last 25 beers somehow (aside from API use)
* Use an internal DB (sqlite?) to track users over time
