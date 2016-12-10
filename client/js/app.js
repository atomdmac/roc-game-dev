var smoothScroll = require('smooth-scroll');

require('scrollingelement');
require('./html-element');

// Back to top buttons.
var btnTop = document.querySelector('.btn-top');

// Only show back to top button when scrolled down.
var headerEl = document.querySelector('header');
var scrollingEl = document.scrollingElement;

document.addEventListener('scroll', function() {
	var headerHeight = parseInt(headerEl.offsetHeight, 10);
	if(scrollingEl.scrollTop > headerHeight - 10) {
		btnTop.removeClass('hidden');
	} else {
		if(!btnTop.hasClass('hidden')) btnTop.addClass('hidden');
	}
});

// Animated scrolling
smoothScroll.init({
	selector: 'a', // Selector for links (must be a class, ID, data attribute, or element tag)
	selectorHeader: null, // Selector for fixed headers (must be a valid CSS selector) [optional]
	speed: 500, // Integer. How fast to complete the scroll in milliseconds
	easing: 'easeInOutCubic', // Easing pattern to use
	offset: 0 // Integer. How far to offset the scrolling anchor location in pixels
	// callback: function ( anchor, toggle ) {} // Function to run after scrolling
});
