var expect = require('chai').expect;
var assert = require('chai').assert;
var FacebookFeed = require('../modules/facebook-feed');
var fbCredentials = require('../credentials/facebook-feed-credentials.json');

describe('FacebookFeed', function () {

  it('Should exist', function () {
    expect(FacebookFeed !== undefined);
  });

  describe('Static Methods', function () {

    describe('#loadEventsFromDisk', function () {
      var cachedEvents;

      it('Should return an empty array if no event data found on disk', function () {
        cachedEvents = FacebookFeed.loadEventsFromDisk('./data_doesnt_exist.json');
        expect(cachedEvents).to.have.length(0);
      });

      it('Should return previously saved event data', function () {
        cachedEvents = FacebookFeed.loadEventsFromDisk('./data_cache/events.json');
        expect(cachedEvents.length).to.be.above(0);
      });
    });

    describe('#transformEventData', function () {
      var cachedEvents = FacebookFeed.loadEventsFromDisk('./data_cache/events.json');

      it('Should NOT throw an error if \'options\' argument is not given', function () {
        FacebookFeed.transformEventData(cachedEvents);
      });

      it('Should return event objects with start_date_raw properties', function () {
        transformedEvents = FacebookFeed.transformEventData(cachedEvents);

        expect(transformedEvents.length).to.equal(cachedEvents.length);
        expect(transformedEvents[0]).to.include.key('start_time_raw');
      });

      it('Should return event objects with end_date_raw properties', function () {
        transformedEvents = FacebookFeed.transformEventData(cachedEvents);

        expect(transformedEvents.length).to.equal(cachedEvents.length);
        expect(transformedEvents[0]).to.include.key('end_time_raw');
      });

    });

    describe('#removePastEvents', function () {
      var cachedEvents = FacebookFeed.loadEventsFromDisk('./data_cache/events.json');
      var transformedEvents = FacebookFeed.transformEventData(cachedEvents);

      it('Should throw an error if passed malformed event data', function () {
        var failFunction = function () {
          FacebookFeed.removePastEvents(cachedEvents);
        };
        expect(failFunction).to.throw(/end_time_raw/);
      });

      it('Should not return events who\'s end_time occurs after the given date', function () {
        var cutOffDate = new Date('11/19/2016 16:00:00');
        var filteredEvents = FacebookFeed.removePastEvents(transformedEvents, cutOffDate);

        // Should have filtered out all but one event from the sample data.
        expect(filteredEvents).to.have.length(1);

        // Ensure that ALL returned dates occur after the given cut-off date.
        filteredEvents.forEach(function (item) {
          expect(new Date(item.end_time_raw)).to.be.above(cutOffDate);
        });
      });

    });
  });

  describe('Constructor', function () {
    it('Should throw an error if no groupId is available', function () {
      var failFunction = function () {
        new FacebookFeed();
      };
      expect(failFunction).to.throw(/A valid Facebook groupId must be provided/);
    });

    describe('#refresh', function () {
      var fbfInstance = new FacebookFeed({
        cacheLocation: './data_cache/events.json',
        groupId: '1453415071632653'
      });

      it('Should fail if no \'token\' argument is provided', function () {
        return fbfInstance.refresh()
          .then(
            // Success
            function () {
              assert(false);
            },

            // Failure
            function (reason) {
              assert(true);
            }
          );
      });

      it('Should succeed if a valid \'token\' argument is provided', function () {
        return fbfInstance.refresh(fbCredentials.token)
          .then(
            // Success
            function () {
              assert(true);
            },

            // Failure
            function (reason) {
              assert(false, reason.message);
            }
          );
        });
    });

    describe('#getEvents', function () {
      var fbfInstance = new FacebookFeed({
        cacheLocation: './data_cache/events.json',
        groupId: '1453415071632653'
      });

      it('Should return an Array', function () {
        var results = fbfInstance.getEvents();
        expect(results).to.be.instanceof(Array);
      });

      it('Should return an empty Array if no events have been loaded');
    });
  });

});
