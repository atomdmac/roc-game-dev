var Promize = require('promise');
var Twitter = require('twitter');
var fs = require('mz/fs');
var extend = require('extend');

var TwitterAggregator = function (options) {
  this.client = new Twitter(options);
};

function ensureAccess (path) {
  return new Promize(function (fulfill, reject) {
    fs.access(path, fs.constants.R_OK | fs.constants.W_OK, function(err) {
      if (err) {
        for(var a in err) console.log(a);
      }
      resolve();
    })
  })
}

TwitterAggregator.prototype.getLocal = function(file) {
  return new Promize(function (fulfill, reject) {
    fs.readFile(file, {encoding: 'utf8'}, function (error, data) {
      if(error === null) {
        // Successfully loaded JSON data.  Now let's parse it!
        try {
          data = JSON.parse(data);
          fulfill(data);
        } catch (error) {
          reject(error);
        }

      // The file doesn't exist yet.
      } else if (error.code === 'ENOENT') {
        fulfill([]);

      // The file doesn't exist yet.
      } else {
        reject(error);
      }
    });
  });
};

TwitterAggregator.prototype.getRemote = function (searchParams) {
  var self = this;
  return new Promize(function (fulfill, reject) {
    self.client.get(
      'search/tweets',
      searchParams,
      function(error, results) {
        // Report error if necessary.
        if(error) {
          reject(error);
        } else {
          fulfill(results.statuses);
        }
      }
    );
  });
};

TwitterAggregator.prototype.getCombined = function (localFile, remoteSearchParams) {
  var self = this;

  return Promize.all([
    self.getLocal(localFile),
    self.getRemote(remoteSearchParams)])
    .then(
    // Success
    function (data) {
      var localData = data[0];
      var remoteData = data[1];
      var combinedData = self.combine(localData, remoteData);
      var results = {
        combined: combinedData,
        local: localData,
        remote: remoteData
      };

      // Sort combined results by ID
      results.combined.sort(function (a, b) {
        if(a.id > b.id) return -1;
        if(a.id < b.id) return  1;
        return 0;
      });

      // Success!
      return Promize.resolve(results);
    },

    // Failure
    function (error) {
      return Promize.reject(error);
    }
  );
};

TwitterAggregator.prototype.refresh = function (localFile, remoteSearchParams, options) {
  var defaultOptions = {
    outputFile: localFile
  };
  options = extend(defaultOptions, options);

  return this.getCombined(localFile, remoteSearchParams)
    .then(function(data) {

      // Write data to the filesystem.
      return fs.writeFile(
        options.outputFile,
        JSON.stringify(data.combined, null, 2),
        {encoding: 'utf8'}
      ).then(
        // Success
        function () {
          return data;
        }
      );
    },

    // Fail
    function (error) {
      return Promize.reject(error);
    }
  );
};

TwitterAggregator.prototype.combine = function (local, remote) {
  var newData = local.concat(remote);
  newData = newData.filter(function (tweet, index, tweets) {
    for(var t = index+1; t<tweets.length; t++) {
      if(tweet.id_str === tweets[t].id_str) {
        return false;
      }
    }
    return true;
  });
  return newData;
};

module.exports = TwitterAggregator;
