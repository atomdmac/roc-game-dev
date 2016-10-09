var FB = require('fb');
var Promize = require('promise');
var fs = require('fs');

var GROUP_ID = '1453415071632653';

// The Facebook event data.
var eventData = loadCachedEventData();

// Load data that was previously pulled from Facebook.
function loadCachedEventData() {
  var cachedData = fs.readFileSync('events.json', {encoding: 'utf8'});
  try {
    cachedData = JSON.parse(cachedData);
  } catch (e) {
    cachedData = [];
  }
  return cachedData;
}

function trimDescriptions(data) {
  data.forEach(function(item, index) {
    item.description = item.description.substr(0, 100) + '...';
  });
  return data;
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
          eventData = trimDescriptions(response.data);

          // Attempt to write data to disk for later.
          fs.writeFile('events.json', JSON.stringify(eventData), function (writeErr) {
            
            // Data write was successful.
            if(!writeErr) {
              fulfill(JSON.stringify(response));
            }

            // Data write has failed.  Let the user know.
            else {
              reject({
                error: {
                  message: 'There was a problem copying events to the ROC Game Dev server.  Ask Atom about it.'
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