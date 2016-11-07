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
var client = new Twitter({
  consumer_key: 'bRN09D9szr9TUEI4PXn9bovOZ',
  consumer_secret: 'pzKaia6y5DgeCUZEtx3HRghKJxWS68qRAmRiesoFzos63UFhW9',
  access_token_key: '2800910940-qSNvkxIgvEgt0BpqMexZVajtVExeU9WuTNOgS8v',
  access_token_secret: 'VPHJOi6I06c1e3jmvr8hgrB5APrCUu9hDgSBIPKi9skQ1'
});

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