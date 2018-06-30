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
## Requirements
- Python 3.x
- Beautiful Soup (`pip install bs4`)

```
$  python untappd.py -h
usage: untappd.py [-h] -u USER

Grab Untappd user activity

optional arguments:
  -h, --help            show this help message and exit
  -u USER, --user USER  Username to research
```

# Example

```
$  python untappd.py -u nvrhapy

[ ] USER DATA: Requesting https://untappd.com/user/nvrhapy
        Total Beers:    2,454
        Total Unique:   1,217
        Total Badges:     569
        Total Friends:     16

[ ] FRIEND DATA: Requesting https://untappd.com/user/nvrhapy/friends
        Name Account Location
        ------------------------------------------
        Tight Lips Jimmy  yeoldstinkeye Chicago
        Joshua B. Supah_Set
        Tommaso C. tommasocamilleri2 Chicago Heights, Illinois
        Joe H. Joeheredia
        stephany d. beerhere89
        Jason W. Jwilson126
        Adam F. fernicus
        Matty G. 1MattyG Arlington Heights, IL
        Tracey N. traceyann83
        Fatima F. Fatabird
        Jay M. greencape
        Christina Z. crispix
        Dan S. Redpac New Lenox, IL
        Tall S. pinatax Chicago
        russell u. sprout1880 chicago hieghts
        Matt  1rar3br33d

[ ] BEER CONSUMPTION DATA: Requesting https://untappd.com/user/nvrhapy/beers
[*]  Drinking Patterns (Last 25 beers) - Days of Week
         Day ( #) : HISTOGRAM
        ---------------------------------
         Mon ( 0) :
         Tue ( 0) :
         Wed ( 5) : xxxxx
         Thu ( 3) : xxx
         Fri ( 3) : xxx
         Sat ( 6) : xxxxxx
         Sun (10) : xxxxxxxxxx

[*]  Drinking Patterns (Last 25 beers) - Hours of Day
         Hour  ( #) : HISTOGRAM
      ---------------------------------
         06:00 ( 0) :
         07:00 ( 0) :
         08:00 ( 0) :
         09:00 ( 0) :
         10:00 ( 0) :
         11:00 ( 0) :
         12:00 ( 1) : x
         13:00 ( 0) :
         14:00 ( 5) : xxxxx
         15:00 ( 1) : x
         16:00 ( 1) : x
         17:00 ( 4) : xxxx
         18:00 ( 3) : xxx
         19:00 ( 6) : xxxxxx
         20:00 ( 1) : x
         21:00 ( 1) : x
         22:00 ( 2) : xx
         23:00 ( 1) : x
         00:00 ( 1) : x
         01:00 ( 0) :
         02:00 ( 0) :
         03:00 ( 0) :
         04:00 ( 0) :
         05:00 ( 0) :

[*]  Drinking Patterns (Last 25 beers) - Day of Month
       Day (#) : HISTOGRAM
      ---------------------------------
       00  ( 0) :
       01  ( 0) :
       02  ( 0) :
       03  ( 0) :
       04  ( 1) : x
       05  ( 0) :
       06  ( 2) : xx
       07  ( 1) : x
       08  ( 0) :
       09  ( 0) :
       10  ( 0) :
       11  ( 1) : x
       12  ( 0) :
       13  ( 4) : xxxx
       14  ( 0) :
       15  ( 0) :
       16  ( 0) :
       17  ( 0) :
       18  ( 0) :
       19  ( 5) : xxxxx
       20  ( 1) : x
       21  ( 0) :
       22  ( 4) : xxxx
       23  ( 1) : x
       24  ( 0) :
       25  ( 1) : x
       26  ( 4) : xxxx
       27  ( 1) : x
       28  ( 0) :
       29  ( 0) :
       30  ( 0) :
       31  ( 1) : x

[!] *ALERT - Due to drinking 5 beers on day 19, user may be a "Binge Drinker"
[!]          Examine the times they drank these beers below. If 5+ drinks in < 2 hours, then binge.
[!]            18:09:01
[!]            16:22:59
[!]            20:10:21
[!]            17:38:35
[!]            14:47:53
[!]      * This script does not examine the amount of time between drinks, which is important.
[!]      * https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking

[ ] VENUE DATA: Requesting https://untappd.com/user/nvrhapy/venues?type=&sort=highest_checkin
      Checkins   Name, Address
        633      shorts house,  IL
        304      steve and christinas,  IL
        108      Redpac's Cocktail Lounge and Beer Bar,  2145 calistoga ave New Lenox, IL
         57      sprout's brew haus,  IL
         42      The Beer Dungeon,  IL
         40      Evil Horse Brewing Company ,  1338 Main St Crete, IL
         37      halsted & joe orr rd,  IL
         35      Peaceful Acres Resort,  Larch Rd Ludington, MI
         32      Steger Wildcat Football,  IL
         31      One Trick Pony,  17845 Chappel Ave Lansing, IL
         26      Flossmoor Station Restaurant & Brewery,  1035 Sterling Ave Flossmoor, IL
         24      Road America,  N7390 State Road 67 Elkhart Lake, WI
         24      Lassen's Sports Bar & Grill,  2131 183rd St Homewood, IL
         23      Chicagoland Speedway,  500 Speedway Blvd Joliet, IL
         22      Smokey Jo's Scratch Kitchen & Ale House,  475 W Burville Rd Crete, IL
         18      MountainLoft Resort,  110 Mountainloft Dr Gatlinburg, TN
         17      Rock Bottom Restaurant & Brewery,  16156 S La Grange Rd Orland Park, IL
         17      Matts place,  IL
         17      Steger Baseball (Veterans Park),  3599 Phillips Ave Steger, IL
         16      Crown Brewing,  211 S East St Crown Point, IN
         15      Northwoods Restaurant & Saloon,  968 E Steger Rd Crete, IL
         14      Richard D. Irwin Park,  IL
         13      The Open Bottle,  7101 183rd St, Unit 105 Tinley Park, IL
         13      City of Chicago Heights,  IL
         12      Eastview School,  IL
```

# To Do
* Triangulate where the person lives by using the places they most frequent and some fancy geolocation
* Webify this so that it looks better and easy to access
* See if I can get more than just the last 25 beers somehow (aside from API use)
* Use an internal DB (sqlite?) to track users over time
