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

  it('Should read existing Twitter data from disk', function () {
    return taInstance
      .getLocal('../data_cache/twitter.json')
      .then(
        // Success
        function(localData) {
          expect(localData, 'Read local Twitter data from disk.').to.be.instanceof(Array);
        },

        // Fail
        function(error) {
          expect(false, 'Failed to load local Twitter data.');
        }
      );
  });

  it('Should read data from the Twitter Search API', function () {
    return taInstance
      .getRemote({q:'#rocgamedev'})
      .then(
        // Success
        function(remoteData) {
          expect(remoteData, 'Read remote data from Twitter Search API').to.be.instanceof(Array);
        },

        // Fail
        function(error) {
          expect(false).to.equal(true, 'Failed to load remote Twitter data.');
        });
  });

  it('Should combine local and remote Tweets without duplicates', function () {
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
      .refreshLocal('./twitter-aggregator-spec-data.json', {q:'#rocgamedev'})
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
