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

  it('Should not parse URLs with unsafe characters in them', function () {
    originalString = 'This is a URL: http://www.google.com/"<>#%{}|\\^~[]`.  Isn\'t that great?';
    expectedString = 'This is a URL: <a href="http://www.google.com/">http://www.google.com/</a>"<>#%{}|\\^~[]`.  Isn\'t that great?';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);
  })

  it('Should not include <br> tags that immediately follow URLs', function () {
    originalString = 'This is a URL: http://www.google.com/<br><br>Isn\'t that neat?';
    expectedString = 'This is a URL: <a href="http://www.google.com/">http://www.google.com/</a><br><br>Isn\'t that neat?';
    actualString = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);
  })

  it('Should insert \'target\' attribute if given', function () {
    originalString = 'This is a URL and it looks like this:\n https://www.facebook.com/ritmagic/\n\n Isn\'t that neat?\n  \nAnd as an added bonus, here\'s another URL that looks like this: http://www.google.com';
    expectedString = 'This is a URL and it looks like this:\n <a target="_blank" href="https://www.facebook.com/ritmagic/">https://www.facebook.com/ritmagic/</a>\n\n Isn\'t that neat?\n  \nAnd as an added bonus, here\'s another URL that looks like this: <a target="_blank" href="http://www.google.com">http://www.google.com</a>';
    actualString   = stringUtil.wrapUrls(originalString, {target: '_blank'});
    expect(actualString).to.equal(expectedString);
  });

  it('Should handle strings that do not contain URLs', function () {
    originalString = 'This is a string that does not contain any URLs.';
    expectedString = 'This is a string that does not contain any URLs.';
    actualString   = stringUtil.wrapUrls(originalString);
    expect(actualString).to.equal(expectedString);
  })

});

describe('StringUtil.linebreaksToMarkup', function () {
  it('Should turn each instance of \\n into <br>', function () {

    // Single instance
    var input = 'Hello\nWorld!';
    var expected = 'Hello<br>World!';
    var actual = stringUtil.linebreaksToMarkup(input);

    expect(actual).to.equal(expected);

    // Multiple instances
    input = 'Hello\n\n\nWorld!';
    expected = 'Hello<br><br><br>World!';
    actual = stringUtil.linebreaksToMarkup(input);

    expect(actual).to.equal(expected);
  });

  it('Should leave URLs with http:// prefixes intact', function () {

    var input = '<a href="http://www.google.com">Hello\n\nWorld</a>';
    var expected = '<a href="http://www.google.com">Hello<br><br>World</a>';
    var actual = stringUtil.linebreaksToMarkup(input);

    expect(actual).to.equal(expected);
  })
});
