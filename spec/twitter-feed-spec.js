var expect = require('chai').expect;
var TwitterFeed = require('../modules/twitter-feed');

var twitterFeedInstance;

before(function () {
  // Start polling Twitter data source.
  twitterFeedInstance = new TwitterFeed({
    inputFile : '../data_cache/twitter.json',
    outputFile: '../data_cache/twitter.json',
    searchParams: {
      q: '#rocgamedev'
    }
  });
});

describe('TwitterFeed', function () {

  describe('getTweets (before polling)', function () {
    it('Should return an empty Array if called before polling has begun.', function () {
      var tweets = twitterFeedInstance.getTweets();
      expect(tweets).to.have.length(0);
    });
  });

  describe('getTweets', function () {

    before(function () {
      // Start polling for Tweets.
      return twitterFeedInstance.start();
    });

    it('Tweets should be sorted by ID (descending)', function () {

      var tweets = twitterFeedInstance.getTweets();

      tweets.sort(function(a, b) {
        if(a.id > b.id) return 1;
        if(a.id < b.id) return -1;
        return 0;
      });

      var largestId = null;
      tweets.forEach(function (item, index) {
        if(largestId === null) {
          largestId = item.id;
          return;
        }
        if(largestId < item.id) {
          largestId = item.id;
        } else {
          throw new Error('Tweets are not sorted by ID (descending)');
        }
      });
    });

    it('Should return 6 most recent tweets', function () {
      var tweets = twitterFeedInstance.getTweets(6);
      expect(tweets.length).to.equal(6);
    });

    // TODO
    it('Should return empty tweet list if called before tweets have been returned.');
  });
});
