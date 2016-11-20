function shorten(originalString, maxLength) {
  maxLength = maxLength || 10;
  if(originalString.length > maxLength) return originalString.substr(0, maxLength) + '...';
  return originalString;
}

function wrapUrls(originalString, options) {
  options = options || {};

  var urlRegEx = /http[s]?:\/\/[^\n\s]*/g;
  var splitString = originalString.split(urlRegEx);
  var urls = originalString.match(urlRegEx);

  var tokens = splitString.map(function (item, index) {
    var target = options.target ? ' target="' + options.target + '"' : '';
    return item + (urls[index] !== undefined ? ('<a' + target + ' href="' + urls[index] + '">' + urls[index] + '</a>') : '');
  });

  return tokens.join('');
}

module.exports = {
  shorten: shorten,
  wrapUrls: wrapUrls
};
