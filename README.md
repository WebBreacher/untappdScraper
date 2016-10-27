# untappdScraper
I noticed that many people on Twitter [publish when they use the Untappd.com](https://www.google.com/search?num=100&newwindow=1&q=untappd+%22i+just+earned%22+site%3Atwitter.com&oq=untappd+%22i+just+earned%22+site%3Atwitter.com&gs_l=serp.3...4164.7850.0.8239.9.9.0.0.0.0.140.679.6j2.8.0....0...1c.1.64.serp..1.3.259...33i160k1j33i21k1.7lDTNQbSBAk) application. This app allows a user to "check-in" when they drink beer. They get badges, they dates and times of their drinking is noted, and many times the geographic location of where they drank is also available.....all with no authentication! Woohoo!

So I wondered if I could patch together some Python to scrape the [Untappd.com](http://untappd.com) web site for a given user and then do some analytics on their drinking habits. Stuff like:
* What time of day do they drink most often?
* What day of the week do they drink most often?
* What day of the month do they drink most often?
* Who do they drink with?
* Where do they drink?

# Caveat
Since this script scrapes the public pages without using the Untappd API and without requiring login, it only has access to the last 25 beers a target has consumed. While this doesn't sound like a lot, we can learn many things from 25 beers. And what if you ran this script every week (or day!)? Could you store all the data about a specific person on a rolling basis? Yup!

# Usage
Grab the code for this and you should be good (no 3rd party libraries).

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
$  python untapped.py -u sprout1880

[ ] Requesting https://untappd.com/user/sprout1880/beers
[+]     Response from Untappd received
[*]  Drinking Patterns (Last 25 beers) - Days of Week
         Day (#) : HISTOGRAM
        ---------------------------------
         Mon ( 0) :
         Tue ( 0) :
         Wed ( 1) : x
         Thu ( 5) : xxxxx
         Fri ( 3) : xxx
         Sat ( 9) : xxxxxxxxx
         Sun ( 7) : xxxxxxx

[*]  Drinking Patterns (Last 25 beers) - Hours of Day
         Hour   (#) : HISTOGRAM
      ---------------------------------
         06:00 ( 0) :
         07:00 ( 0) :
         08:00 ( 0) :
         09:00 ( 0) :
         10:00 ( 0) :
         11:00 ( 0) :
         12:00 ( 3) : xxx
         13:00 ( 1) : x
         14:00 ( 3) : xxx
         15:00 ( 0) :
         16:00 ( 1) : x
         17:00 ( 0) :
         18:00 ( 5) : xxxxx
         19:00 ( 1) : x
         20:00 ( 3) : xxx
         21:00 ( 7) : xxxxxxx
         22:00 ( 1) : x
         23:00 ( 0) :
         00:00 ( 0) :
         01:00 ( 0) :
         02:00 ( 0) :
         03:00 ( 0) :
         04:00 ( 0) :
         05:00 ( 0) :

[*]  Drinking Patterns (Last 25 beers) - Day of Month
       Day (#) : HISTOGRAM
      ---------------------------------
         00 ( 0) :
         01 ( 0) :
         02 ( 0) :
         03 ( 1) : x
         04 ( 0) :
         05 ( 0) :
         06 ( 0) :
         07 ( 0) :
         08 ( 2) : xx
         09 ( 2) : xx
         10 ( 0) :
         11 ( 0) :
         12 ( 0) :
         13 ( 0) :
         14 ( 2) : xx
         15 ( 0) :
         16 ( 3) : xxx
         17 ( 1) : x
         18 ( 2) : xx
         19 ( 0) :
         20 ( 5) : xxxxx
         21 ( 1) : x
         22 ( 5) : xxxxx
         23 ( 0) :
         24 ( 0) :
         25 ( 0) :
         26 ( 0) :
         27 ( 0) :
         28 ( 0) :
         29 ( 0) :
         30 ( 1) : x
         31 ( 0) :

[ ] Requesting https://untappd.com/user/sprout1880/friends
[+]     Response from Untappd received
[ ]     Friends of sprout1880:
            Acct Name ------ Name
            --------------------
            beerhere89 ------ stephany d.
            drinkcraftbrew ------ Tony
            Kubrickx ------ Zenus
            Fatabird ------ Fatima F.
            crispix ------ Christina Z.
            nvrhapy ------ steve
            1rar3br33d ------ Matt
            pinatax ------ Tall S.
            Redpac ------ Dan S.

[ ] Requesting https://untappd.com/user/sprout1880
[+]     Response from Untappd received
[ ]     User info for sprout1880:
            Total Beers:    3,582
            Total Unique:   2,015
            Total Badges:     514
            Total Friends:      9
```

# To Do
* Triangulate where the person lives by using the places they most frequent and some fancy geolocation
* Do some analytics on their drinking behaviors (binge drinking, morning drinking...)
* Webify this so that it looks better and easy to access
* See if I can get more than just the last 25 beers somehow (aside from API use)
* Use an internal DB (sqlite?) to track users over time
