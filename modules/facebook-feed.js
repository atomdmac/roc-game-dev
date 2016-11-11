var FB = require('fb');
var Promize = require('promise');
var fs = require('fs');
var moment = require('moment');
var stringUtil = require('./string-util');

var CACHE_DIR = 'data_cache';
var GROUP_ID = '1453415071632653';

var DATE_FORMAT = "MMMM D - h:mma";

// The Facebook event data.
var eventData = loadCachedEventData();
eventData = transformEventData(eventData);
eventData = removePastEvents(eventData);

// Canonicalize data that has been pulled from Facebook.
function transformEventData(eventData) {
  var newEventData = [];
  eventData.forEach(function (event, index) {
    newEventData.push({
      description: stringUtil.wrapUrls(event.description),
      start_time     : moment(event.start_time).format(DATE_FORMAT),
      end_time       : moment(event.end_time).format(DATE_FORMAT),
      start_time_raw : event.start_time,
      end_time_raw   : event.end_time,
      id             : event.id,
      name           : event.name,
      place          : {
        id  : event.place.id,
        name: event.place.name,
        location: {
          city     : event.place.location.city,
          country  : event.place.location.country,
          latitude : event.place.location.latitude,
          longitude: event.place.location.longitude,
          state    : event.place.location.state,
          street   : event.place.location.street,
          zip      : event.place.location.zip
        }
      }
    });
  });

  return newEventData;
}

// Remove any events from the given list that have occurred in the past.
// NOTE: This assumes that the given event list has already been processed by
// the transformEventData() function.
function removePastEvents(eventList) {
  var currentDate = new Date();
  return eventList.filter(function (event, index) {
    return new Date(event.start_time_raw) > currentDate;
  });
}

// Load data that was previously pulled from Facebook.
function loadCachedEventData() {
  var cachedData = fs.readFileSync(CACHE_DIR + '/events.json', {encoding: 'utf8'});
  try {
    cachedData = JSON.parse(cachedData);
  } catch (e) {
    cachedData = [];
  }

  return cachedData;
}

// Gets the most up-to-date event data from Facebook, updates our version of the
// event data in memory, and saves it to disk for later.
function refresh (token) {

  // Set access token for access to Facebook.
  FB.setAccessToken(token);

  // Create a promise to return while we wait for Facebook and our save process.
  var p = new Promize(function (fulfill, reject) {
  var nowTimeStamp = Math.round((new Date()).getTime() / 1000);

    FB.api(
      '/' + GROUP_ID + '/events',
      // {since: nowTimeStamp},
      {limit: 2},
      function (response) {

        // Facebook returned an error :(
        if(response.error) {
          reject(response);
        }

        // Facebook response is successful.  Now let's try to save that data to
        // our website so we can display it to users later.
        else {

          // Update our in-memory copy of the data.
          eventData = transformEventData(response.data);
          eventDate = removePastEvents(eventData);

          // Attempt to write data to disk for later.
          // NOTE: We're saving the *ORIGINAL* data that we got from Facebook.
          // This allows us to update the way date is transformed later without
          // needing to fetch it again from Facebook.
          fs.writeFile(CACHE_DIR + '/events.json', JSON.stringify(response.data), function (writeErr) {

            // Data write was successful.
            if(!writeErr) {
              fulfill(JSON.stringify(response));
            }

            // Data write has failed.  Let the user know.
            else {
              reject({
                error: {
                  message: 'The events came over from Facebook but couldn\'t be saved to the server. Ask Atom about it.'
                }
              });
            }
          });
        }
      }
    );
  });

  // Return the promise object.
  return p;
}

// Returns our current copy of Facebook event data.
function getEvents() {
  return eventData;
}

module.exports = {
  refresh: refresh,
  getEvents: getEvents
};
