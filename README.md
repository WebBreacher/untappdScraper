# untappdScraper

I noticed that many people on Twitter [publish when they use the Untappd.com](https://www.google.com/search?num=100&newwindow=1&q=untappd+%22i+just+earned%22+site%3Atwitter.com&oq=untappd+%22i+just+earned%22+site%3Atwitter.com&gs_l=serp.3...4164.7850.0.8239.9.9.0.0.0.0.140.679.6j2.8.0....0...1c.1.64.serp..1.3.259...33i160k1j33i21k1.7lDTNQbSBAk) application. This app allows a user to "check-in" when they drink beer. They get badges, they dates and times of their drinking is noted, and many times the geographic location of where they drank is also available.....all with no authentication! Woohoo!

So I wondered if I could patch together some Python to scrape the [Untappd.com](http://untappd.com) web site for a given user and then do some analytics on their drinking habits. Stuff like:

* What time of day do they drink most often?
* What day of the week do they drink most often?
* What day of the month do they drink most often?
* Who do they drink with?
* Where do they drink?
* Are they "binge" drinking?

Originally, this was just a Python script (details are below), but some amazing people noticed it and gave it a flashy web interface (for which I'm grateful). For the web version, just visit https://untappd.osint.ninja!

The output from the Python script (shown below), is output to the terminal/command line. One exception is that the GPS locations of all the places the user account reported consuming drinks at are written to an HTML output file in the current directory. You can double click on the HTML file and see a heat map of all the places that the person recorded drinking at. Could you infer where they worked and lived from this data? I'll let you guess.

## Caveats

Since this script scrapes the public pages:

* Private Untappd profiles are not scraped
* Without using the Untappd API and without requiring login, it only has access to the last 25 beers a target has consumed. While this doesn't sound like a lot, we can learn many things from 25 beers. And what if you ran this script every week (or day!)? Could you store all the data about a specific person on a rolling basis? Yup!
* It uses the Google Geocoding API which you need to sign up for for the HTML output to be generated (https://developers.google.com/maps/documentation/geocoding/intro)

## Usage

For the web version, just visit https://untappd.osint.ninja!

### Requirements

Python 3.x

#### Modules

* bs4
* geocoder
* gmplot
* googlemaps
* re

If you have PIP installed, type: `pip3 install -r requirements.txt` from the command line and your system should install all required modules.

#### Geocoding API

You will need to add your Google API key to the `geocode_api_keys.py` file by replacing the following content:

```bash
google_api_key = 'YOUR_GOOGLE_API_KEY'
```

Of course this means you need to go get a valid Google Developer API key for the Geocoding
(<https://developers.google.com/>).


## Help command Output

```bash
$ python3 ./untappd.py -h
usage: untappd.py [-h] [-r] -u USER

Grab Untappd user activity

optional arguments:
  -h, --help            show this help message and exit
  -r, --recent          Just dump the locations of the last beers they logged
  -u USER, --user USER  Username to research
```

## Example Output

```bash
$ python3 untappd.py -u mogford

[ ] USER DATA: Requesting https://untappd.com/user/mogford

        Total Beers:    6,783
        Total Unique:   5,257
        Total Badges:   3,487
        Total Friends:     61

[ ] FRIEND DATA: Requesting 25 friends from https://untappd.com/user/mogford/friends

              Account               Name              Location
        -------------------- ------------------ --------------------
        eve17                Evelyn A.
        GinaGlz              Gina G.            Cancun
        Bigvin40             Chris M.
        dforst               Dave               Evanston
        markdel              Mark D.            London United Kingdom
        Yushi                Yushi
        jrsaint85            James P.           Illinois
        jojander             Joshua A.
        devareo              DeVareo G.
        Sherifftruman        Lee L.
        Jblangston           Jennifer L.
        Toughguise           Greg W.
        Srweitz              Sarah W.
        BigLou1020           Big Lou N.         Georgia
        Carol2494            Carolina C.
        Jbon815              John B.
        Chel77RN             Michelle R.        Gettysburg
        JenBen222            Jennifer B.        It's Happy Hour somewhere
        BrewGoddess          Desiree K.         Tulsa, Ok
        brendanDougherty     Brendan D.
        Capstone82           Matthew H.
        jbspence3            Benjie S.          Mississippi
        Tomwad12             Tom W.
        apollospeck          Tera R.
        JGlade               Jessica G.

[ ] BEER CONSUMPTION DATA: Requesting https://untappd.com/user/mogford/beers
[*]  Drinking Patterns (Last 25 beers) - Days of Week
         Day ( #) : HISTOGRAM
        ---------------------------------
         Mon ( 1) : x
         Tue ( 0) :
         Wed ( 2) : xx
         Thu (12) : xxxxxxxxxxxx
         Fri ( 6) : xxxxxx
         Sat ( 3) : xxx
         Sun ( 2) : xx

[*]  Drinking Patterns (Last 25 beers) - Hours of Day
         Hour  ( #) : HISTOGRAM
      ---------------------------------
         06:00 ( 0) :
         07:00 ( 0) :
         08:00 ( 0) :
         09:00 ( 0) :
         10:00 ( 0) :
         11:00 ( 0) :
         12:00 ( 0) :
         13:00 ( 1) : x
         14:00 ( 1) : x
         15:00 ( 0) :
         16:00 ( 4) : xxxx
         17:00 ( 3) : xxx
         18:00 ( 2) : xx
         19:00 ( 1) : x
         20:00 ( 7) : xxxxxxx
         21:00 ( 4) : xxxx
         22:00 ( 3) : xxx
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
       00  ( 0) :
       01  ( 0) :
       02  ( 0) :
       03  ( 0) :
       04  ( 0) :
       05  ( 0) :
       06  ( 0) :
       07  ( 0) :
       08  ( 0) :
       09  ( 0) :
       10  ( 1) : x
       11  ( 3) : xxx
       12  ( 2) : xx
       13  ( 1) : x
       14  ( 0) :
       15  ( 2) : xx
       16  (12) : xxxxxxxxxxxx
       17  ( 5) : xxxxx
       18  ( 0) :
       19  ( 0) :
       20  ( 0) :
       21  ( 0) :
       22  ( 0) :
       23  ( 0) :
       24  ( 0) :
       25  ( 0) :
       26  ( 0) :
       27  ( 0) :
       28  ( 0) :
       29  ( 0) :
       30  ( 0) :
       31  ( 0) :

[!] *ALERT - Due to drinking 12 beers on day 16, user may be a "Binge Drinker"
[!]          Examine times they drank the beers below. If 5+ drinks in < 2 hours, then binge.
[!]            13:44:52
[!]            16:05:16
[!]            16:20:57
[!]            17:38:30
[!]            17:40:08
[!]            18:22:33
[!]            18:23:50
[!]            20:35:06
[!]            20:36:48
[!]            21:22:47
[!]            22:29:18
[!]            22:30:32
[!] *ALERT - Due to drinking 5 beers on day 17, user may be a "Binge Drinker"
[!]          Examine times they drank the beers below. If 5+ drinks in < 2 hours, then binge.
[!]            16:58:04
[!]            20:05:16
[!]            20:06:58
[!]            20:57:54
[!]            21:45:47
[!]      * This script does not examine the amount of time between drinks, which is important.
[!]      * https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking

[ ] VENUE DATA: Requesting https://untappd.com/user/mogford/venues?type=&sort=highest_checkin

      Checkins   Name, Address (Geocode)
      --------  ----------------------------------------------------
         113      El Estadio- Cervecería & Restaurant, av Kabah SM 21 lt 12 local 05 Cancún, Quintana Roo  (21.151525, -86.8400556)
          98      The Growler Guys - Meridian, 2020 E Overland Rd. (S. Millenium Way), Suite 100 Meridian, ID  (43.59070639999999, -116.3692766)
          73      Homestead Bar and Grill, 6275 N Linder Rd Meridian, ID  (43.661755, -116.414528)
          49      Hampton Inn & Suites, 8220 E Regal Pl Tulsa, OK  (36.0104624, -95.884198)
          43      Taphouse, 760 W Main St Boise, ID  (43.615481, -116.2027931)
          41      Cactus Petes, 1385 US-93 Jackpot, NV  (41.9853802, -114.6706905)
          33      Barley's Brewhub, 3320 W Kennewick Ave Kennewick, WA  (46.20985, -119.1670833)
          33      Dallas Fort Worth International Airport (DFW) (Dallas Fort Worth International Airport), 2400 Aviation Dr Irving, TX  (32.8998091, -97.0403352)
          28      Midland Beer Garden, 7112 W Hwy 80 Midland, TX  (31.9474597, -102.1695773)
          27      Bittercreek Alehouse, 246 N 8th St Boise, ID  (43.6165919, -116.2023165)
          27      Paseos del Caribe, Av. Paseo Xcaret Cancún, Quintana Roo  (21.1351624, -86.8690601)
          26      St Louis Microfest, St Louis, MO  (38.6084333, -90.2005313)
          22      Alefort, Boise, ID  (43.6150186, -116.2023137)
          21      Aeropuerto Internacional de Cancún (CUN) (Aeropuerto Internacional de Cancún), Carr. Fed. Cancún - Chetumal Km 22 Cancún, Quintana Roo  (21.0417033, -86.8740062)
          21      McNellie's - South City, 7031 S Zurich Ave Tulsa, OK  (36.0620732, -95.92050429999999)
          21      Wildhorse Resort & Casino, 46510 Wildhorse Boulevard Pendleton, OR  (45.64721590000001, -118.6795054)
          19      Flying Saucer Draught Emporium DFW, 2337 S International Pkwy Terminal D Grapevine, TX  (32.8964696, -97.0446875)
          19      Hartsfield-Jackson Atlanta International Airport (ATL) (Hartsfield-Jackson Atlanta International Airport), 6000 N Terminal Pkwy Atlanta, GA  (33.6404219, -84.4336872)
          18      Flying Pie Pizzaria, 1326 S Broadway Ave Boise, ID  (43.59607099999999, -116.193121)
          17      10 Barrel Brewing, 830 W Bannock St Boise, ID  (43.6178751, -116.2027478)
          16      Flingers Pizza Pub, 1503 E Vernon Ave Bloomington, IL  (40.5023867, -88.9563817)
          16      Cloud Nine Brewery, 1750 W State St Boise, ID  (43.6255931, -116.2109849)
          16      Minneapolis–Saint Paul International Airport (MSP) (Minneapolis–Saint Paul International Airport), 4300 Glumack Dr Minneapolis, MN  (44.8852485, -93.21287579999999)
          16      Roosevelt's, 1551 E 15th St, ste 101 Tulsa, OK  (36.1407695, -95.9702234)
          15      George Bush Intercontinental Airport (IAH) (George Bush Intercontinental Airport), 2800 N Terminal Rd Houston, TX  (36.1407695, -95.9702234)

[ ] HTML output file named untappd_map_mogford_1584103691.html was written to disk.
```

All scripts (with a valid Google API key) should produce HTML output files that show the geolocated content. An example is below:
![image of sample output](example_output.png)

If your web page shows "For Development Purposes Only" watermarks, you will need to edit the HTML file and add your Google API key for JavaScript Maps API. Add `key=YOUR_GOOGLE_API_KEY` to the end of the maps.googleapis.com line like this: `https://maps.googleapis.com/maps/api/js?libraries=visualization&sensor=true_or_false&key=YOUR_GOOGLE_API_KEY`

## Thank Yous
Really appreciate the work that the people below have put in to make this tool better! I'm very thankful for their volunteer efforts.
- [@brandone](https://github.com/BrandonE)
- [@wesbragagt](https://github.com/wesbragagt)

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
