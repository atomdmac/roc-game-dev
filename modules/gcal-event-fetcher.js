var _ = require('lodash');
var ical = require('ical');
var moment = require('moment');
const DATE_FORMAT = 'MMM Do [at] h:mma';

function GCalEventFetcher (options) {
  this.url = options.url || '';
  this.pollInterval = options.pollInterval || 1 * ( 60 * 1000);
  this.events = [];
}

const createLocationString = rawLocation =>
  encodeURI(
    rawLocation.replace(/\s/g, '+')
  );

const createGoogleMapUrl = locationString =>
  `https://www.google.com/maps/?q=${locationString}`;

const createShortLocationString = rawLocation =>
  rawLocation.split(',')[0];

GCalEventFetcher.prototype.refreshEvents = function () {
  ical.fromURL(this.url, {}, (err, calendarEvents) => {
    if (err) {
      throw err;
    }
    var now = moment();
    this.events = _(calendarEvents)
      // Conver to array
      .values()
      // Only include on-going or future events.
      .filter(event => moment(event.end).isAfter(now))
      // Compose additional fields.
      .map(event => ({
        ...event,
        // A shortened location string
        locationShort: createShortLocationString(event.location),
        // Link to Google Maps
        locationUrl: createGoogleMapUrl(
          createLocationString(event.location)
        ),
        // Formatted start/end times.
        startFormatted: moment(event.start).format(DATE_FORMAT),
        endFormatted: moment(event.end).format(DATE_FORMAT)
        // TODO: Link to GCal event
      }))
      .value();
  });
};

GCalEventFetcher.prototype.start = function () {
  this.pollIntervalId = setInterval(
    this.refreshEvents.bind(this),
    this.pollInterval
  );
  this.refreshEvents.bind(this)();
};

GCalEventFetcher.prototype.stop = function () {
  clearInterval(this.pollIntervalId);
};

GCalEventFetcher.prototype.getEvents = function () {
  return this.events;
};

module.exports = GCalEventFetcher;