var TwitterAggregator = require('./twitter-aggregator');
var Promize = require('promise');
var extend = require('extend');

var defaultOptions = {
  inputFile: './twitter-input.json',
  outputFile: './twitter-output.json',
  searchParams: {
    q: '#twitter'
  },
  refreshRate: 60000
};

function TwitterFeed (options) {
  // Merge the provided options in with the defaults.
  this.options = extend(true, {}, defaultOptions, options);

  // An in-memory cache of the Tweets that have been retreived.
  this.cache = [];

  // Store the refresh timeout ID so we can clear it if necessary.
  this.refreshInt = null;

  // Create a TwitterAggregator object to interact with the API.
  var clientCredentials = require('../credentials/twitter-feed-credentials.json');
  this.twitterAggregator = new TwitterAggregator(clientCredentials);
}

TwitterFeed.prototype.refresh = function () {
  var self = this;
  return this.twitterAggregator.refresh(
    this.options.inputFile,
    this.options.searchParams,
    {
      outputFile: this.options.outputFile
    }).then(

    // Success
    function (data) {
      // Make a clone of the returned combined data.
      self.tweetCache = data.combined.slice(0);
    },

    // Failure
    function (reason) {
      console.log('TwitterAggregator failed: ', reason);
    });
};

TwitterFeed.prototype.start = function () {
  var self = this;
  this.refreshInt = setInterval(
    function () {
      self.refresh();
    },
    this.options.refreshRate
  );
  return this.refresh();
};

TwitterFeed.prototype.stop = function () {
  clearInterval(this.refreshInt);
};

TwitterFeed.prototype.getTweets = function () {
  return this.tweetCache;
};

module.exports = TwitterFeed;
