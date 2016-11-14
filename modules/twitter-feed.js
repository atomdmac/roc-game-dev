var TwitterAggregator = require('./twitter-aggregator');
var Promize = require('promise');

var settings = {
  refreshRate: 12000000,
  searchParams: {
    q: '#rocgamedev'
  }
};

// Store the refresh timeout ID so we can clear it if necessary.
var refreshInt;

// Cache of tweets.
var tweetCache = [];

// Create a TwitterAggregator object to interact with the API.
var clientCredentials = require('../credentials/twitter-feed-credentials.json');
var client = new TwitterAggregator(clientCredentials);

function refresh () {
  return client.refresh().then(
    // Success
    function (data) {
      tweetCache = data.combined;
    });
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
