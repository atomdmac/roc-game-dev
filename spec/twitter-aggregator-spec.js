var expect = require('chai').expect;
var TwitterAggregator = require('../modules/twitter-aggregator');

// We're using an external version of the Promise object since the version of
// node currently running on our server doesn't have a native version yet.
var Promize = require('promise');

describe('TwitterAggregator', function () {

  // Import some Twitter API credentials to use for our tests.
  var credentials = require('../credentials/twitter-feed-credentials.json');

  // Create an instance of the Twitter Aggregator to test.
  var taInstance = new TwitterAggregator(credentials);

  it('Should exist', function () {
    expect(TwitterAggregator).to.not.equal(undefined);
  });

  it('getLocal', function () {
    return taInstance
      .getLocal('../data_cache/twitter.json')
      .then(
        // Success
        function(localData) {
          expect(localData).to.be.instanceof(Array);
        },

        // Fail
        function(error) {
          throw new Error(error.message);
        }
      );
  });

  it('getRemote', function () {
    return taInstance
      .getRemote({q:'#rocgamedev'})
      .then(
        // Success
        function(remoteData) {
          expect(remoteData).to.be.instanceof(Array);
        },

        // Fail
        function(error) {
          throw new Error(error.message);
        });
  });

  it('getCombined', function () {
    return taInstance
      .getCombined('./twitter-aggregator-spec-data.json', {q:'#rocgamedev'})
      .then(
        // Success
        function (data) {
          // Are combined appropriately.
          expect(data).to.have.property('local');
          expect(data).to.have.property('remote');
          expect(data).to.have.property('combined');
        },

        // Failure
        function (error) {
          throw new Error(error.message);
        });
  });

  describe('refresh', function () {

    var pathToTweetCache = './twitter-aggregator-spec-data.json';
    var pathToModifiedTweetCache = './twitter-aggregator-data.output.json';

    it('Should save data to specified output file', function () {
      return taInstance
        .refresh(
          // Local input file
          pathToTweetCache,

          // Remote search parameters
          {
            q:'#rocgamedev'
          },

          // Other options
          {
            outputFile: pathToModifiedTweetCache
          }
        )
        .then(
          // Success
          function (data) {
            expect(true).to.equal(true);
          },

          // Failure
          function (error) {
            throw new Error(error.message);
          });
    });

    it('Should sort tweets by date (descending) before being saved to disk', function () {
      // NOTE: We assume that the preveious test (savomg data tp disk) succeeded.
      var tweets = require(pathToModifiedTweetCache);

      // Should have more than 1 tweet.
      expect(tweets).to.have.length.above(0);

      var smallestId = null;
      tweets.forEach(function (item, index) {
        if(smallestId === null) {
          smallestId = item.id;
          return;
        }
        if(smallestId > item.id) {
          smallestId = item.id;
        } else {
          throw new Error('Tweets are not sorted by ID (descending) ' + item.id + ' is larger than ' + smallestId);
        }
      });
    });

  });
});
