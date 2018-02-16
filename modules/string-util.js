function shorten(originalString, maxLength) {
  maxLength = maxLength || 10;
  if (originalString.length > maxLength) {
    return originalString.substr(0, maxLength) + '...';
  }
  return originalString;
}

function wrapUrls(originalString, options) {
  options = options || {};

  const urlRegEx = /http[s]?:\/\/[^\n\s"<>#%\{\}\|\\\^~\[\]\`]*/g;
  const splitString = originalString.split(urlRegEx);
  const urls = originalString.match(urlRegEx);

  if (urls === null) return originalString;

  const tokens = splitString.map(function (item, index) {
    const target = options.target ? ' target="' + options.target + '"' : '';
    return item + (urls[index] !== undefined ? ('<a' + target + ' href="' + urls[index] + '">' + urls[index] + '</a>') : '');
  });

  return tokens.join('');
}

function linebreaksToMarkup(inputStr) {
  const lineBreakRegEx = /[\n]/;
  return inputStr.split(lineBreakRegEx).join('<br>');
}

module.exports = {
  shorten: shorten,
  wrapUrls: wrapUrls,
  linebreaksToMarkup: linebreaksToMarkup
};
