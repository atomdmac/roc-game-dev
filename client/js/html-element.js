/*
 * Utility methods for the HTMLElement object
 */
HTMLElement.prototype.addClass = function (className) {
  if(!this.hasClass(className)) this.className += ' ' + className;
};

HTMLElement.prototype.removeClass = function (className) {
  var newClass = ' ' + this.className.replace( /[\t\r\n]/g, ' ') + ' ';
  if (this.hasClass(className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    this.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};

HTMLElement.prototype.hasClass = function (className) {
  var index = this.className.indexOf(className);
  if(index === -1) return false;
  return true;
};