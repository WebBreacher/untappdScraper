webpackHotUpdate("static/development/pages/index.js",{

/***/ "./lib/utils.js":
/*!**********************!*\
  !*** ./lib/utils.js ***!
  \**********************/
/*! exports provided: daysOfWeek, parseRecentActivity, getUntappdOsint, loadGoogleMapsClient, formatHour */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "daysOfWeek", function() { return daysOfWeek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseRecentActivity", function() { return parseRecentActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUntappdOsint", function() { return getUntappdOsint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadGoogleMapsClient", function() { return loadGoogleMapsClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatHour", function() { return formatHour; });
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cheerio */ "./node_modules/cheerio/index.js");
/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(cheerio__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment-timezone */ "./node_modules/moment-timezone/index.js");
/* harmony import */ var moment_timezone__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment_timezone__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _googlemaps_loader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @googlemaps/loader */ "./node_modules/@googlemaps/loader/dist/loader.esm.js");



function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }





var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var baseUrl = 'https://cors-anywhere.herokuapp.com/https://untappd.com';

var timeToMomentWithTimezone = function timeToMomentWithTimezone(time) {
  var offset = moment_timezone__WEBPACK_IMPORTED_MODULE_4__(time).format('Z');
  var timezoneNames = moment_timezone__WEBPACK_IMPORTED_MODULE_4__["tz"].names();
  var timezoneName = timezoneNames.find(function (timezoneName) {
    return offset === moment_timezone__WEBPACK_IMPORTED_MODULE_4__["tz"](timezoneName).format('Z');
  });
  return moment_timezone__WEBPACK_IMPORTED_MODULE_4__["tz"](time, timezoneName);
};

var getUserDom = function getUserDom(username) {
  var res;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function getUserDom$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(axios__WEBPACK_IMPORTED_MODULE_2__["get"]("".concat(baseUrl, "/user/").concat(username)));

        case 2:
          res = _context.sent;

          if (!(res.status !== 200)) {
            _context.next = 5;
            break;
          }

          throw new Error('Could not fetch user data.');

        case 5:
          return _context.abrupt("return", cheerio__WEBPACK_IMPORTED_MODULE_3__["load"](res.data));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
};

var getFriendsDom = function getFriendsDom(username) {
  var res;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function getFriendsDom$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(axios__WEBPACK_IMPORTED_MODULE_2__["get"]("".concat(baseUrl, "/user/").concat(username, "/friends")));

        case 2:
          res = _context2.sent;

          if (!(res.status !== 200)) {
            _context2.next = 5;
            break;
          }

          throw new Error('Could not fetch friends data.');

        case 5:
          return _context2.abrupt("return", cheerio__WEBPACK_IMPORTED_MODULE_3__["load"](res.data));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, null, Promise);
};

var getBeersDom = function getBeersDom(username) {
  var res;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function getBeersDom$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(axios__WEBPACK_IMPORTED_MODULE_2__["get"]("".concat(baseUrl, "/user/").concat(username, "/beers")));

        case 2:
          res = _context3.sent;

          if (!(res.status !== 200)) {
            _context3.next = 5;
            break;
          }

          throw new Error('Could not fetch beers data.');

        case 5:
          return _context3.abrupt("return", cheerio__WEBPACK_IMPORTED_MODULE_3__["load"](res.data));

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, null, Promise);
};

var getVenuesDom = function getVenuesDom(username) {
  var res;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function getVenuesDom$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(axios__WEBPACK_IMPORTED_MODULE_2__["get"]("".concat(baseUrl, "/user/").concat(username, "/venues?type=&sort=highest_checkin")));

        case 2:
          res = _context4.sent;

          if (!(res.status !== 200)) {
            _context4.next = 5;
            break;
          }

          throw new Error('Could not fetch venue data.');

        case 5:
          return _context4.abrupt("return", cheerio__WEBPACK_IMPORTED_MODULE_3__["load"](res.data));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, null, Promise);
};

var parseNumber = function parseNumber(num) {
  return num ? parseInt(num.replace(/,/g, ''), 10) : NaN;
};

var parseStats = function parseStats($) {
  var stats = {};
  var statElements = $('.stat');

  if (!statElements || statElements.length !== 4) {
    throw new Error('Could not parse stats data.');
  }

  var statsArray = [];
  statElements.each(function (i, statElement) {
    statsArray.push(parseNumber($(statElement).text()));
  });
  stats.totalBeers = statsArray[0];
  stats.totalUnique = statsArray[1];
  stats.totalBadges = statsArray[2];
  stats.totalFriends = statsArray[3];
  return stats;
};

var parseRecentActivity = function parseRecentActivity($) {
  var recentActivity = [];
  var checkInElements = $('.checkin');

  try {
    checkInElements.each(function (i, checkInElement) {
      var activity = {};
      var checkInTopText = $(checkInElement).find('.top .text');
      var checkInBottomLinks = $(checkInElement).find('.bottom a');

      if (!checkInTopText || !checkInBottomLinks || checkInBottomLinks.length === 0) {
        throw new Error('Could not parse check-in data.');
      }

      var checkInText = checkInTopText.text();
      var checkInTime = $(checkInBottomLinks[0]).text();

      if (!checkInTime) {
        throw new Error('Could not parse check-in time.');
      }

      activity.time = timeToMomentWithTimezone(checkInTime);
      var parts = checkInText.split(' is drinking an ');

      if (parts.length === 1) {
        parts = checkInText.split(' is drinking a ');
      }

      if (parts.length === 1) {
        parts = checkInText.split(' is drinking ');
      }

      if (parts.length === 1) {
        console.log(checkInText);
        throw new Error('Could not parse check-in drink.');
      }

      parts = parts[1].split(' by ');
      activity.beer = parts[0];

      if (parts.length === 2) {
        parts = parts[1].split(' at ');
        activity.brewery = parts[0];

        if (parts.length === 2) {
          activity.location = parts[1];
        }
      }

      recentActivity.push(activity);
    });
  } catch (err) {
    throw new Error(err);
  }

  return recentActivity;
};

var parseFriends = function parseFriends($) {
  var friends = [];
  var userElements = $('.user .info');
  userElements.each(function (i, userElement) {
    var nameElement = $(userElement).find('h1', 'a');
    var usernameElement = $(userElement).find('.username');
    var locationElement = $(userElement).find('.location');

    if (!nameElement || !usernameElement || !locationElement) {
      throw new Error('Could not parse friend details data.');
    }

    friends.push({
      name: $(nameElement).text(),
      username: $(usernameElement).text(),
      location: $(locationElement).text()
    });
  });
  return friends;
};

var parseBeers = function parseBeers($) {
  var beers = [];
  var beerElements = $('.beer-item');
  beerElements.each(function (i, beerElement) {
    var nameElement = $(beerElement).find('.name a');
    var breweryElement = $(beerElement).find('.brewery');
    var styleElement = $(beerElement).find('.style');
    var abvElement = $(beerElement).find('.abv');
    var ibuElement = $(beerElement).find('.ibu');
    var checkInsElement = $(beerElement).find('.check-ins');

    if (!nameElement || !breweryElement || !styleElement || !abvElement || !ibuElement) {
      throw new Error('Could not parse beer details data.');
    }

    var dateElements = $(beerElement).find('.date a .date-time');

    if (dateElements.length !== 2) {
      throw new Error('Could not parse beer dates.');
    }

    beers.push({
      name: $(nameElement).text(),
      brewery: $(breweryElement).text(),
      style: $(styleElement).text(),
      abv: $(abvElement).text(),
      ibu: $(ibuElement).text(),
      firstDrinkTime: timeToMomentWithTimezone($(dateElements[0]).text()),
      lastDrinkTime: timeToMomentWithTimezone($(dateElements[1]).text()),
      checkIns: parseNumber($(checkInsElement).text().split('Total: ')[1])
    });
  });
  return beers;
};

var parseVenues = function parseVenues($) {
  var venues = [];
  var venueElements = $('.venue-item');
  venueElements.each(function (i, venueElement) {
    var venueDetailsElement = $(venueElement).find('.venue-details');

    if (!venueDetailsElement) {
      throw new Error('Could not parse venue data.');
    }

    var nameElement = $(venueDetailsElement).find('.name a');
    var addressElement = $(venueDetailsElement).find('.address');
    var checkInsElement = $(venueElement).find('.details .check-ins');
    var dateElements = $(venueElement).find('.date');

    if (!nameElement || !addressElement || !checkInsElement || !dateElements || dateElements.length === 0) {
      throw new Error('Could not parse venue details data.');
    }

    var address = addressElement.text().trim();
    var firstDateText = $(dateElements[0]).text();
    var firstVisitDate;
    var lastVisitDate;

    if (dateElements.length === 2) {
      firstVisitDate = firstDateText;
      lastVisitDate = $(dateElements[1]).text();
    } else {
      lastVisitDate = firstDateText;
    }

    venues.push({
      name: nameElement.text().trim(),
      address: address,
      checkIns: parseNumber(checkInsElement.text().split('Check-ins: ')[1]),
      firstVisitDate: firstVisitDate,
      lastVisitDate: lastVisitDate
    });
  });
  return venues;
};

var updateDrinkHistogram = function updateDrinkHistogram(beerAnalytics, drinkTime) {
  var dayOfWeek = drinkTime.format('ddd');
  beerAnalytics.dayOfWeek[dayOfWeek]++;
  var hourOfDay = parseNumber(drinkTime.format('H'));
  beerAnalytics.hourOfDay[hourOfDay]++;
  var dayOfMonth = parseNumber(drinkTime.format('D'));
  beerAnalytics.dayOfMonth[dayOfMonth]++;
};

var analyzeBeers = function analyzeBeers(beers, recentActivity) {
  var beerAnalytics = {
    dayOfWeek: {},
    hourOfDay: {},
    dayOfMonth: {},
    binges: [],
    heavyUses: []
  };
  var uniqueDrinkTimes = [];
  var uniqueDrinkUnixTimestamps = [];

  var _iterator = _createForOfIteratorHelper(daysOfWeek),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var day = _step.value;
      beerAnalytics.dayOfWeek[day] = 0;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  for (var i = 0; i < 24; i++) {
    beerAnalytics.hourOfDay[i] = 0;
  }

  for (var _i = 1; _i <= 31; _i++) {
    beerAnalytics.dayOfMonth[_i] = 0;
  }

  var _iterator2 = _createForOfIteratorHelper(beers),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var beer = _step2.value;
      uniqueDrinkTimes.push(beer.firstDrinkTime);
      uniqueDrinkUnixTimestamps.push(beer.firstDrinkTime.unix());
      updateDrinkHistogram(beerAnalytics, beer.firstDrinkTime);

      if (beer.firstDrinkTime.diff(beer.lastDrinkTime) !== 0) {
        uniqueDrinkTimes.push(beer.lastDrinkTime);
        uniqueDrinkUnixTimestamps.push(beer.lastDrinkTime.unix());
        updateDrinkHistogram(beerAnalytics, beer.lastDrinkTime);
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var _iterator3 = _createForOfIteratorHelper(recentActivity),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var activity = _step3.value;
      var time = activity.time;
      var timeUnix = time.unix();

      if (!uniqueDrinkUnixTimestamps.includes(timeUnix)) {
        uniqueDrinkTimes.push(time);
        uniqueDrinkUnixTimestamps.push(timeUnix);
        updateDrinkHistogram(beerAnalytics, time);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var uniqueDrinkTimesSorted = uniqueDrinkTimes.sort(function (drinkTimeA, drinkTimeB) {
    var drinkUnixA = drinkTimeA.unix();
    var drinkUnixB = drinkTimeB.unix();

    if (drinkUnixA < drinkUnixB) {
      return -1;
    }

    if (drinkUnixA > drinkUnixB) {
      return 1;
    }

    return 0;
  });
  /*
  Drinking Levels from https://www.niaaa.nih.gov/alcohol-health/overview-alcohol-consumption/moderate-binge-drinking
  Binge Drinking = 5+ drinks (men) / 4+ drinks (women) in < 2 hours
  Heavy Alcohol Use = 5+ instances of binge drinking in the past month
  */

  var potentialBinge = [];
  var twoHoursMilliseconds = 60 * 60 * 2 * 1000;

  var _iterator4 = _createForOfIteratorHelper(uniqueDrinkTimesSorted),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var drinkTime = _step4.value;

      if (potentialBinge.length === 0) {
        potentialBinge = [drinkTime];
      } else if (drinkTime.diff(potentialBinge[potentialBinge.length - 1]) > twoHoursMilliseconds) {
        if (potentialBinge.length >= 4) {
          beerAnalytics.binges.push(potentialBinge);
        }

        potentialBinge = [drinkTime];
      } else {
        potentialBinge.push(drinkTime);
        console.log(potentialBinge.length);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  if (potentialBinge.length >= 4) {
    beerAnalytics.binges.push(potentialBinge);
  }

  var potentialHeavyUse = [];
  var oneMonthSeconds = 60 * 60 * 24 * 30;

  var _iterator5 = _createForOfIteratorHelper(beerAnalytics.binges),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var binge = _step5.value;

      if (potentialHeavyUse.length === 0) {
        potentialHeavyUse = [binge];
      } else {
        var previousBinge = potentialBinge[potentialBinge.length - 1];

        if (binge[0].diff(previousBinge[previousBinge.length - 1]) > oneMonthSeconds) {
          if (potentialHeavyUse.length >= 5) {
            beerAnalytics.heavyUses.push(potentialHeavyUse);
          }

          potentialHeavyUse = [binge];
        } else {
          potentialHeavyUse.push(binge);
        }
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  if (potentialHeavyUse.length >= 5) {
    beerAnalytics.heavyUses.push(potentialHeavyUse);
  }

  return beerAnalytics;
};

var geocodeAddress = function geocodeAddress(geocoder, venue) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function geocodeAddress$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", new Promise(function (resolve, reject) {
            geocoder.geocode({
              address: venue.address
            }, function (results, status) {
              if (status !== 'OK') {
                if (status === 'OVER_QUERY_LIMIT') {
                  // Retry after 1 second.
                  setTimeout(function () {
                    geocodeAddress(geocoder, venue).then(resolve)["catch"](reject);
                  }, 1000);
                } else {
                  reject(new Error(status));
                }
              } else {
                venue.geocode = results;
                resolve();
              }
            });
          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, null, Promise);
};

var geocodeAddresses = function geocodeAddresses(googleMapsClient, venues) {
  var geocoder, promises, _iterator6, _step6, venue;

  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function geocodeAddresses$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (googleMapsClient) {
            _context6.next = 2;
            break;
          }

          throw new Error('Must set the Google Maps API key prior to using this functionality.');

        case 2:
          geocoder = new googleMapsClient.maps.Geocoder();
          promises = [];
          _iterator6 = _createForOfIteratorHelper(venues);

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              venue = _step6.value;
              promises.push(geocodeAddress(geocoder, venue));
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          _context6.next = 8;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(Promise.all(promises));

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, null, Promise);
};

var displayGoogleMap = function displayGoogleMap(googleMapsClient, venues) {
  var latLngs = [];
  var markers = [];
  var heatmapData = [];

  var _iterator7 = _createForOfIteratorHelper(venues),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var venue = _step7.value;

      if (venue.geocode) {
        var latLng = {
          lat: venue.geocode[0].geometry.location.lat(),
          lng: venue.geocode[0].geometry.location.lng()
        };
        latLngs.push(latLng);
        markers.push(new googleMapsClient.maps.Marker({
          position: latLng,
          title: "".concat(venue.checkIns, " beers logged at ").concat(venue.name)
        }));
        heatmapData.push({
          location: new googleMapsClient.maps.LatLng(latLng.lat, latLng.lng),
          weight: venue.checkIns
        });
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  var center = {
    lat: latLngs.map(function (latLng) {
      return latLng.lat;
    }).reduce(function (a, b) {
      return a + b;
    }, 0) / latLngs.length,
    lng: latLngs.map(function (latLng) {
      return latLng.lng;
    }).reduce(function (a, b) {
      return a + b;
    }, 0) / latLngs.length
  };
  var map = new googleMapsClient.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 4
  });

  for (var _i2 = 0, _markers = markers; _i2 < _markers.length; _i2++) {
    var marker = _markers[_i2];
    marker.setMap(map);
  } // eslint-disable-next-line no-new


  new googleMapsClient.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    dissipating: false
  });
  return map;
};

var getUntappdOsint = function getUntappdOsint(username, recentActivityOnly, googleMapsClient) {
  var data, userDom, _await$Promise$all, _await$Promise$all2, friendsDom, beersDom, venuesDom;

  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function getUntappdOsint$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          data = {
            username: username
          };
          _context7.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(getUserDom(username));

        case 3:
          userDom = _context7.sent;
          data.stats = parseStats(userDom);
          data.recentActivity = parseRecentActivity(userDom);

          if (!recentActivityOnly) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", data);

        case 8:
          _context7.next = 10;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(Promise.all([getFriendsDom(username), getBeersDom(username), getVenuesDom(username)]));

        case 10:
          _await$Promise$all = _context7.sent;
          _await$Promise$all2 = Object(_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_await$Promise$all, 3);
          friendsDom = _await$Promise$all2[0];
          beersDom = _await$Promise$all2[1];
          venuesDom = _await$Promise$all2[2];
          data.friends = parseFriends(friendsDom);
          data.beers = parseBeers(beersDom);
          data.venues = parseVenues(venuesDom);
          data.beerAnalytics = analyzeBeers(data.beers, data.recentActivity);

          if (!googleMapsClient) {
            _context7.next = 23;
            break;
          }

          _context7.next = 22;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(geocodeAddresses(googleMapsClient, data.venues));

        case 22:
          data.map = displayGoogleMap(googleMapsClient, data.venues);

        case 23:
          return _context7.abrupt("return", data);

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, null, Promise);
};
var loadGoogleMapsClient = function loadGoogleMapsClient(googleMapsApiKey) {
  var loader;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.async(function loadGoogleMapsClient$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          loader = new _googlemaps_loader__WEBPACK_IMPORTED_MODULE_5__["Loader"]({
            apiKey: googleMapsApiKey,
            version: 'weekly',
            libraries: ['visualization']
          });
          _context8.next = 3;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.awrap(loader.load());

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, null, Promise);
};
var formatHour = function formatHour(hour) {
  return moment_timezone__WEBPACK_IMPORTED_MODULE_4__(hour, 'H').format('h A');
};

/***/ })

})
//# sourceMappingURL=index.js.5375dfe9b6da025b434b.hot-update.js.map