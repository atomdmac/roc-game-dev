function shorten(originalString, maxLength) {
  maxLength = maxLength || 10;
  if(originalString.length > maxLength) return originalString.substr(0, maxLength) + '...';
  return originalString;
}

module.exports = {
  shorten: shorten
};
