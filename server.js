var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var twitterFeed = require('./twitter-feed');
var facebookFeed = require('./facebook-feed');
var htmlTpl;

// Configure body-parser Express plug-in for using variables from POST requests.
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Which port should the server offer connections on?
var PORT = 8080;

// DEBUG MODE
// If set to TRUE, HTML templates will be re-compiled on an interval to make
// debugging not so terrible.
var DEBUG_MODE = true;

// Short-cut variables.
var cwd = path.resolve();

// Load HTML templates
function compileHTMLTemplates () {
  fs.readFile('./client/html/home.html', 'utf8', function (err, data) {
    htmlTpl = handlebars.compile(data);
  });
}

// DEBUG: If in debug mode, recompile templates on an interval.
if(DEBUG_MODE) {
  setInterval(compileHTMLTemplates, 1000);
} else {
  compileHTMLTemplates();
}

// Start web services.

// Home page rendering
app.get('/', function (req, res) {
  res.send(htmlTpl(getPageData()));
});

// JavaScript files
app.get('/js/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/js/' + req.params.fileName);
});

// CSS files
app.get('/css/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/css/' + req.params.fileName);
});

// Images
app.get('/images/:fileName', function (req, res) {
  res.sendFile(cwd + '/client/images/' + req.params.fileName);
});

// Facebook Event Updates
app.get('/update', function (req, res) {
  res.sendFile(cwd + '/html/update.html');
});

// Accept event update requests.
app.post('/update', function (req, res) {
  facebookFeed.refresh(req.body.token).then(function (fbResponse) {
    res.send(fbResponse);
  });
});

// Twitter aggregator
twitterFeed.start();

// HTTP server
app.listen(PORT, function () {
  console.log('ROC Game Dev server listening on port', PORT);
});

// Return all aggregated page data.
function getPageData () {
  return {
    tweets: twitterFeed.getTweets(),
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

// Inserts content if the given date is in the past.
handlebars.registerHelper('is_past', function(dateTimeStr, options) {

    var currentDate = new Date();
    var inputDate = new Date(dateTimeStr);

    var result = false;
    if(inputDate < currentDate) result = true;

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});