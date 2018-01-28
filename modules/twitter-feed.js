var TwitterAggregator = require('./twitter-aggregator');
var extend = require('extend');
var logger = require('winston');

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
  var clientCredentials = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  };
  this.twitterAggregator = new TwitterAggregator(clientCredentials);
}

TwitterFeed.prototype.refresh = function () {
  var self = this;
  return this.twitterAggregator.refresh(
    this.options.inputFile,
    this.options.searchParams,
    {
      outputFile: this.options.outputFile
    })
    .then(
      // Success
      function (data) {
        // Make a clone of the returned combined data.
        self.cache = data.combined.slice(0);
        return data;
      },

      // Failure
      function (reason) {
        logger.error('TwitterAggregator failed: ', reason);
        return reason;
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

TwitterFeed.prototype.getTweets = function (maxTweets) {
  if(typeof maxTweets === 'number' && maxTweets > 0) {
    return this.cache.slice(0, maxTweets);
  }

  else {
    return this.cache.slice();
  }
};

module.exports = TwitterFeed;
