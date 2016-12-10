var FB = require('fb');
var Promize = require('promise');
var fs = require('fs');
var moment = require('moment');
var stringUtil = require('./string-util');
var extend = require('extend');

var defaultOptions = {
  token: '',
  cacheLocation: 'data_cache/events.json',
  groupId: '',
  dateFormat: 'MMMM D - h:mma'
};

function FacebookFeed (options) {
  this.options = extend({}, defaultOptions, options);

  // Throw an error if no groupId is available.
  if(this.options.groupId === '') throw new Error('A valid Facebook groupId must be provided to the FacebookFeed constructor.');

  // Load and process previously cached events.
  this.events = FacebookFeed.loadEventsFromDisk(this.options.cacheLocation);
  this.events = FacebookFeed.transformEventData(this.events);
  this.events = FacebookFeed.removePastEvents(this.events);
}

// Canonicalize data that has been pulled from Facebook.
FacebookFeed.transformEventData = function (eventData, options) {
  var newEventData = [],
      self = this;

  // Build options
  options = extend({}, defaultOptions, options);

  eventData.forEach(function (event, index) {
    // Clone event object and augment as necessary.
    var newEvent = extend({}, event);

    // Format times
    newEvent.start_time = moment.parseZone(event.start_time).format(options.dateFormat);
    newEvent.end_time = moment.parseZone(event.end_time).format(options.dateFormat);

    // Maintain raw/unformatted times
    newEvent.start_time_raw = event.start_time;
    newEvent.end_time_raw = event.end_time;

    // Format description
    newEvent.description = stringUtil.wrapUrls(
      stringUtil.linebreaksToMarkup(
        event.description
        )
      );

    // Update event list
    newEventData.push(newEvent);
  });

  return newEventData;
};

// Remove any events from the given list that have occurred in the past.
// NOTE: This assumes that the given event list has already been processed by
// the transformEventData() function.
FacebookFeed.removePastEvents = function (eventList, cutOffDate) {
  cutOffDate = cutOffDate || new Date();
  return eventList.filter(function (event, index) {
    if(event.end_time_raw === undefined) throw Error('Event objects are missing property \'end_time_raw\'.  Make sure you pass data that was created from FacebookFeed.transformEventData');
    return new Date(event.end_time_raw) > cutOffDate;
  });
};

// Load data that was previously pulled from Facebook and saved to disk.
// Returns an empty Array if no data was found on disk.
FacebookFeed.loadEventsFromDisk = function (url) {
  var cachedData;
  try {
    cachedData = fs.readFileSync(url, {encoding: 'utf8'});
    cachedData = JSON.parse(cachedData);
  } catch (e) {
    cachedData = [];
  }

  return cachedData;
};

// Gets the most up-to-date event data from Facebook, updates our version of the
// event data in memory, and saves it to disk for later.
FacebookFeed.prototype.refresh = function (token) {
  // Scoping aid.
  var self = this;

  // Set access token for access to Facebook.
  FB.setAccessToken(token);

  // Create a promise to return while we wait for Facebook and our save process.
  var p = new Promize(function (fulfill, reject) {
    var nowTimeStamp = Math.round((new Date()).getTime() / 1000);

    // Attempt to gather new data from Facebook.
    FB.api(
      '/' + self.options.groupId + '/events',
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
          self.events = FacebookFeed.transformEventData(response.data);
          self.events = FacebookFeed.removePastEvents(self.events);

          // Attempt to write data to disk for later.
          // NOTE: We're saving the *ORIGINAL* data that we got from Facebook.
          // This allows us to update the way date is transformed later without
          // needing to fetch it again from Facebook.
          fs.writeFile(self.options.cacheLocation, JSON.stringify(response.data), function (writeErr) {

            // Data write was successful.
            if(!writeErr) {
              fulfill(JSON.stringify(response));
            }

            // Data write has failed.  Let the user know.
            else {
              reject({
                error: {
                  message: writeErr
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
};

// Returns a copy of Facebook event data.
FacebookFeed.prototype.getEvents = function () {
  return this.events.slice();
};

module.exports = FacebookFeed;
