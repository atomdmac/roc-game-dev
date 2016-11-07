var Twitter = require('twitter');
var Promize = require('promise');

var settings = {
  // refreshRate: 120000,
  refreshRate: 12000000,
  searchParams: {
    q: '#rocgamedev'
  }
};

// Store the refresh timeout ID so we can clear it if necessary.
var refreshInt;

// Cache of tweets.
var tweetCache = [];

// Create a Twitter client object to interact with the API.
var clientCredentials = require('../credentials/twitter-feed-credentials.json');
var client = new Twitter(clientCredentials);

function refresh () {
  var p = new Promize(function (fulfill, reject) {
    client.get(
      'search/tweets',
      settings.searchParams,
      function(error, results, response) {
        // Report error if necessary.
        if(error) {
          reject(error);
          return;
        }

        // Empty tweets list and start over.
        tweetCache.splice(0, tweetCache.length -1);

        // Build new list of tweets
        results.statuses.forEach(function (tweet, index) {
          tweetCache.push(tweet);
        });

        fulfill(tweetCache);
    });
  });

  // Return promise so we can all get on with our lives.
  return p;
}

function start () {
  refreshInt = setInterval(refresh, settings.refreshRate);
  return refresh();
}

function stop () {
  clearInterval(refreshInt);
}

function getTweets () {
  return tweetCache;
}

module.exports = {
  getTweets: getTweets,
  start: start,
  stop: stop,
  refresh: refresh
};
