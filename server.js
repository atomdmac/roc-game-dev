var logger = require('winston');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var TwitterFeed = require('./modules/twitter-feed');
var facebookFeed = require('./modules/facebook-feed');
var htmlTpl;

// Configure body-parser Express plug-in for using variables from POST requests.
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Configure logger.
logger.add(logger.transports.File, { filename: 'server.log' });

// Which port should the server offer connections on?
var PORT = 80;

// DEBUG MODE
// Set to FALSE before moving to production.
var DEBUG_MODE = false;

// Short-cut variables.
var cwd = path.resolve();

// Load HTML templates
function compileHTMLTemplates () {
  fs.readFile('./client/build/html/home.html', 'utf8', function (err, data) {
    htmlTpl = handlebars.compile(data);
  });
}

// DEBUG: If in debug mode...
if(DEBUG_MODE) {
  // Run on port 8080 instead of 80
  PORT = 8080;

  // recompile templates on an interval.
  setInterval(compileHTMLTemplates, 1000);
}

// If NOT in debug mode...
else {
  compileHTMLTemplates();
}

// Start web services.

// Home page rendering
app.get('/', function (req, res) {
  res.send(htmlTpl(getPageData()));
});

// JavaScript files
app.get('/js/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/build/js/' + req.params.fileName);
});

// CSS files
app.get('/css/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/build/css/' + req.params.fileName);
});

// Images
app.get('/images/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/build/images/' + req.params.fileName);
});

// Facebook Event Updates
app.get('/update', function (req, res) {
  res.sendFile(cwd + '/client/build/html/update.html');
});

// Accept event update requests.
app.post('/update', function (req, res) {
  facebookFeed.refresh(req.body.token)

    // Success
    .then(function (fbResponse) {
      res.send(fbResponse);
      logger.info('Facebook event data updated successfully.');
    },

    // Failure
    function (reason) {
      logger.error('Facebook event data upate failure!.');
      res.send(reason);
    });
});

// Start polling Twitter data source.
var twitterFeedInstance = new TwitterFeed({
  inputFile : './data_cache/twitter.json',
  outputFile: './data_cache/twitter.json',
  searchParams: {
    q: '#rocgamedev'
  }
});

// Start polling!
twitterFeedInstance.start();

// HTTP server
app.listen(PORT, function () {
  logger.info('ROC Game Dev server listening on port', PORT);
});

// Return all aggregated page data.
function getPageData () {
  return {
    tweets: twitterFeedInstance.getTweets(),
    events: facebookFeed.getEvents()
  };
}

// Stub for generating FB event data (since we're not currently hooked into FB)
function getEvents () {
  return [
    {
      eventName: 'September Workshop',
      eventDate: 'Wednesday September 7th, 2016',
      eventLocation: 'RIT MAGIC',
      eventDetails: 'This is where we might put directions for finding the place and what people can expect to find when they get there.'
    },
    {
      eventName: 'September Social',
      eventDate: 'Wednesday September 28th, 2016',
      eventLocation: 'Swillburger',
      eventDetails: 'This is where we might put directions for finding the place and what people can expect to find when they get there.'
    },
    {
      eventName: 'October Workshop',
      eventDate: 'Wednesday October 5th, 2016',
      eventLocation: 'RIT MAGIC',
      eventDetails: 'This is where we might put directions for finding the place and what people can expect to find when they get there.'
    }
  ];
}

// Inserts content if the first number is larger than the second.
handlebars.registerHelper('is_larger_than', function(number1, number2, options) {
  if( number1 > number2 ) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});
