# untappdScraper
I noticed that many people on Twitter [publish when they use the Untappd.com](https://www.google.com/search?num=100&newwindow=1&q=untappd+%22i+just+earned%22+site%3Atwitter.com&oq=untappd+%22i+just+earned%22+site%3Atwitter.com&gs_l=serp.3...4164.7850.0.8239.9.9.0.0.0.0.140.679.6j2.8.0....0...1c.1.64.serp..1.3.259...33i160k1j33i21k1.7lDTNQbSBAk) application. This app allows a user to "check-in" when they drink beer. They get badges, they dates and times of their drinking is noted, and many times the geographic location of where they drank is also available.....all with no authentication! Woohoo!

So I wondered if I could patch together some Python to scrape the [Untappd.com](http://untappd.com) web site for a given user and then do some analytics on their drinking habits. Stuff like:
* What time of day do they drink most often?
* What day of the week do they drink most often?
* What day of the month do they drink most often?
* Who do they drink with?
* Where do they drink?
* Are they "binge" drinking?

The output from this (shown below), is output to the terminal/command line. One exception is that the GPS locations of all the places the user account reported consuming drinks at are written to an HTML output file in the current directory. You can double click on the HTML file and see a heat map of all the places that the person recorded drinking at. Could you infer where they worked and lived from this data? I'll let you guess.

# Caveats
Since this script scrapes the public pages:
* Private Untappd profiles are not scraped
* Without using the Untappd API and without requiring login, it only has access to the last 25 beers a target has consumed. While this doesn't sound like a lot, we can learn many things from 25 beers. And what if you ran this script every week (or day!)? Could you store all the data about a specific person on a rolling basis? Yup!

# Usage
## Requirements
There are some required modules for this script to work. They are below. The most important of which is __this script is written in Python 3.x__. 

- Python 3.x
- bs4
- geocoder
- gmplot
- requests

Just type: `pip install -r requirements.txt` from the command line and your system should install all required modules.

## Help command Output
```
$  python untappd.py -h
usage: untappd.py [-h] -u USER

Grab Untappd user activity

optional arguments:
  -h, --help            show this help message and exit
  -u USER, --user USER  Username to research
```

# Example Output
```
$ python3 untappd.py -u nvrhapy

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
[!]            14:47:53
[!]            20:10:21
[!]            18:09:01
[!]            17:38:35
[!]            16:22:59
[!]      * This script does not examine the amount of time between drinks, which is important.
[!]      * https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking

[ ] VENUE DATA: Requesting https://untappd.com/user/nvrhapy/venues?type=&sort=highest_checkin
      Checkins   Name, Address
        633      shorts house,  IL  [38.4110575, -87.75759330000001]
        304      steve and christinas,  IL  [40.6331249, -89.3985283]
        108      Redpac's Cocktail Lounge and Beer Bar,  2145 calistoga ave New Lenox, IL  [41.4792808, -87.95593339999999]
         57      sprout's brew haus,  IL  None
         42      The Beer Dungeon,  IL  [42.1857372, -88.4369487]
         40      Evil Horse Brewing Company ,  1338 Main St Crete, IL  [41.444957, -87.631468]
         37      halsted & joe orr rd,  IL  [41.5205964, -87.63574779999999]
         35      Peaceful Acres Resort,  Larch Rd Ludington, MI  None
         32      Steger Wildcat Football,  IL  [41.46785879999999, -87.6267603]
         31      One Trick Pony,  17845 Chappel Ave Lansing, IL  [41.5711478, -87.571823]
         26      Flossmoor Station Restaurant & Brewery,  1035 Sterling Ave Flossmoor, IL  [41.5433326, -87.67863589999999]
         24      Road America,  N7390 State Road 67 Elkhart Lake, WI  [43.79751, -87.989963]
         24      Lassen's Sports Bar & Grill,  2131 183rd St Homewood, IL  [41.5570125, -87.6689267]
         23      Chicagoland Speedway,  500 Speedway Blvd Joliet, IL  [41.474828, -88.05752629999999]
         22      Smokey Jo's Scratch Kitchen & Ale House,  475 W Burville Rd Crete, IL  [41.435353, -87.6304124]
         18      MountainLoft Resort,  110 Mountainloft Dr Gatlinburg, TN  [35.7265932, -83.4845216]
         17      Rock Bottom Restaurant & Brewery,  16156 S La Grange Rd Orland Park, IL  [41.5960194, -87.8531833]
         17      Matts place,  IL  [42.244263, -88.316465]
         17      Steger Baseball (Veterans Park),  3599 Phillips Ave Steger, IL  [41.46612229999999, -87.6284039]
         16      Crown Brewing,  211 S East St Crown Point, IN  None
         15      Northwoods Restaurant & Saloon,  968 E Steger Rd Crete, IL  [41.46951079999999, -87.5885505]
         14      Richard D. Irwin Park,  IL  None
         13      The Open Bottle,  7101 183rd St, Unit 105 Tinley Park, IL  [41.558072, -87.79042799999999]
         13      City of Chicago Heights,  IL  [41.506146, -87.6355995]
         12      Eastview School,  IL  [41.684709, -88.342738]
```

# To Do
* Webify this so that it looks better and easy to access
* Use an internal DB (sqlite?) to track users over time

# License
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
