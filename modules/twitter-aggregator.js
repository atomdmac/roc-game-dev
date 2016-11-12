var Promize = require('promise');
var Twitter = require('twitter');
var fs = require('fs');

var TwitterAggregator = function (options) {
  this.client = new Twitter(options);
};

TwitterAggregator.prototype.getLocal = function(file) {
  return new Promize(function (fulfill, reject) {
    fs.readFile(file, {encoding: 'utf8'}, function (error, data) {
      if(error === null)
        // Successfully loaded JSON data.  Now let's parse it!
        try {
          data = JSON.parse(data);
          fulfill(data);
        } catch (error) {
          reject(error);
        }
      else reject(error);
    });
  });
};

TwitterAggregator.prototype.getRemote = function (searchParams) {
  var self = this;
  return new Promize(function (fulfill, reject) {
    self.client.get(
      'search/tweets',
      searchParams,
      function(error, results, response) {
        // Report error if necessary.
        if(error) {
          reject(error);
        } else {
          fulfill(results.statuses);
        }
    });
  });
};

TwitterAggregator.prototype.getCombined = function (localFile, remoteSearchParams) {
  var self = this;
  return new Promize(function(fulfill, reject) {
    Promize
      .all([self.getLocal(localFile), self.getRemote(remoteSearchParams)])
      .then(
        function (data) {
          var localData = data[0];
          var remoteData = data[1];
          var combinedData = self.combine(localData, remoteData);

          // Success!
          fulfill({
            combined: combinedData,
            local: localData,
            remote: remoteData
          });
        },
        function (error) {
          reject(error);
        }
      );
  });
};

TwitterAggregator.prototype.refreshLocal = function (localFile, remoteSearchParams) {
  var self = this;
  return new Promize(function(fulfill, reject) {
    self.getCombined(localFile, remoteSearchParams)
      .then(function(data) {
        // Write data to the filesystem.
        fs.writeFile(localFile + 'test.json', JSON.stringify(data.combined, null, 2), {encoding: 'utf8'}, function (err) {
          if(err === null) {
            fulfill(data);
          } else {
            reject(err);
          }
        });
      },

      // Fail
      function (error) {
        reject(error);
      });
  });
};

TwitterAggregator.prototype.combine = function (local, remote) {
  var newData = local.concat(remote);
  newData = newData.filter(function (tweet, index, tweets) {
    for(var t = index+1; t<tweets.length; t++) {
      if(tweet.id === tweets[t].id) {
        return false;
      }
    }
    return true;
  });
  return newData;
};

module.exports = TwitterAggregator;
