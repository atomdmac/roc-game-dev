var FB = require('fb');
var Promize = require('promise');

var GROUP_ID = '1453415071632653';

function refresh (token) {

  // Set access token for access to Facebook.
  FB.setAccessToken(token);

  // Create a promise to return while we wait for Facebook and our save process.
  var p = new Promize(function (fulfill, reject) {
    FB.api(
      '/' + GROUP_ID + '/events',
      function (response) {

        // Facebook returned an error :(
        if(response.error) {
          reject(response);
        } 

        // Facebook response is successful.  Now let's try to save that data to
        // our website so we can display it to users later.
        else {
          fs.writeFile('events.json', JSON.stringify(response), function (writeErr) {
            
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

function getEvents() {}

module.exports = {
  refresh: refresh,
  getEvents: getEvents
};