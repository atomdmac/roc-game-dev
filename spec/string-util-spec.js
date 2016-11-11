var expect = require('chai').expect;
var stringUtil = require('../modules/string-util');

describe('StringUtil.wrapUrl', function () {
  var originalString, expectedString, actualString;

  it('Should wrap a single URL starting with http://, https://, or www with anchor tags', function () {
    originalString = 'This is a URL and it looks like this: http://facebook.com/ritmagic/ Isn\'t that neat?';
    expectedString = 'This is a URL and it looks like this: <a href="http://facebook.com/ritmagic/">http://facebook.com/ritmagic/</a> Isn\'t that neat?';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);

    originalString = 'This is a URL and it looks like this: https://www.facebook.com/ritmagic/ Isn\'t that neat?';
    expectedString = 'This is a URL and it looks like this: <a href="https://www.facebook.com/ritmagic/">https://www.facebook.com/ritmagic/</a> Isn\'t that neat?';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);

    // originalString = 'This is a URL and it looks like this: www.facebook.com/ritmagic/ Isn\'t that neat?';
    // expectedString = 'This is a URL and it looks like this: <a href="www.facebook.com/ritmagic/">www.facebook.com/ritmagic/</a> Isn\'t that neat?';
    // actualString   = stringUtil.wrapUrls(originalString);
    // expect(actualString).to.equal(expectedString);
  });

  it('Should be able to wrap multiple URLs starting with http:// or https://', function () {
    originalString = 'This is a URL and it looks like this: https://www.facebook.com/ritmagic/ Isn\'t that neat?  And as an added bonus, here\'s another URL that looks like this: http://www.google.com';
    expectedString = 'This is a URL and it looks like this: <a href="https://www.facebook.com/ritmagic/">https://www.facebook.com/ritmagic/</a> Isn\'t that neat?  And as an added bonus, here\'s another URL that looks like this: <a href="http://www.google.com">http://www.google.com</a>';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);
  });

  it('Should be able to deal with instances of \\n and \\\\n gracefully.', function () {
    originalString = 'This is a URL and it looks like this:\n https://www.facebook.com/ritmagic/\n\n Isn\'t that neat?\n  \nAnd as an added bonus, here\'s another URL that looks like this: http://www.google.com';
    expectedString = 'This is a URL and it looks like this:\n <a href="https://www.facebook.com/ritmagic/">https://www.facebook.com/ritmagic/</a>\n\n Isn\'t that neat?\n  \nAnd as an added bonus, here\'s another URL that looks like this: <a href="http://www.google.com">http://www.google.com</a>';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);
  });

});
