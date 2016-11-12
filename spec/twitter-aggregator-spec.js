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
          expect(false, 'Failed to load local Twitter data.');
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
          expect(false).to.equal(true, 'Failed to load remote Twitter data.');
        });
  });

  it('getCombined', function () {
    return taInstance
      .getCombined('./twitter-aggregator-spec-data.json', {q:'#rocgamedev'})
      .then(
        // Success
        function (data) {
          // Are combined appropriately.
          expect(data.combined.length).to.equal(data.remote.length + 1);
        },

        // Failure
        function (error) {
          expect(false);
        });
  });

  it('refreshLocal', function (done) {
    taInstance
      .refreshLocal(
        // Local input file
        './twitter-aggregator-spec-data.json',

        // Remote search parameters
        {
          q:'#rocgamedev'
        },

        // Other options
        {
          outputFile: './twitter-aggregator-data.output.json'
        }
      )
      .then(
        // Success
        function (data) {
          expect(true).to.be.true;
          done();
        },

        // Failure
        function (error) {
          expect(false).to.be.true;
          done();
        });
  });
});
