!function e(t,n,o){function r(a,c){if(!n[a]){if(!t[a]){var l="function"==typeof require&&require;if(!c&&l)return l(a,!0);if(i)return i(a,!0);throw new Error("Cannot find module '"+a+"'")}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){var n=t[a][1][e];return r(n||e)},u,u.exports,e,t,n,o)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(e,t,n){var o=e("smooth-scroll");e("scrollingelement"),e("./html-element");var r=document.querySelector(".btn-top"),i=document.querySelector("header"),a=document.scrollingElement;document.addEventListener("scroll",function(){var e=parseInt(i.offsetHeight,10);a.scrollTop>e-10?r.removeClass("hidden"):r.hasClass("hidden")||r.addClass("hidden")}),o.init({selector:"a",selectorHeader:null,speed:500,easing:"easeInOutCubic",offset:0})},{"./html-element":2,scrollingelement:3,"smooth-scroll":4}],2:[function(e,t,n){HTMLElement.prototype.addClass=function(e){this.hasClass(e)||(this.className+=" "+e)},HTMLElement.prototype.removeClass=function(e){var t=" "+this.className.replace(/[\t\r\n]/g," ")+" ";if(this.hasClass(e)){for(;t.indexOf(" "+e+" ")>=0;)t=t.replace(" "+e+" "," ");this.className=t.replace(/^\s+|\s+$/g,"")}},HTMLElement.prototype.hasClass=function(e){return-1!==this.className.indexOf(e)}},{}],3:[function(e,t,n){"scrollingElement"in document||function(){function e(e){return window.getComputedStyle?getComputedStyle(e,null):e.currentStyle}function t(e){return window.HTMLBodyElement?e instanceof HTMLBodyElement:/body/i.test(e.tagName)}function n(e){for(var n=e;n=n.nextSibling;)if(1==n.nodeType&&t(n))return n;return null}function o(e){return"none"!=e.display&&!("collapse"==e.visibility&&/^table-(.+-group|row|column)$/.test(e.display))}function r(t){var n=e(t),r=e(document.documentElement);return"visible"!=n.overflow&&"visible"!=r.overflow&&o(n)&&o(r)}var i,a=function(){if(!/^CSS1/.test(document.compatMode))return!1;if(void 0===i){var e=document.createElement("iframe");e.style.height="1px",(document.body||document.documentElement||document).appendChild(e);var t=e.contentWindow.document;t.write('<!DOCTYPE html><div style="height:9999em">x</div>'),t.close(),i=t.documentElement.scrollHeight>t.body.scrollHeight,e.parentNode.removeChild(e)}return i},c=function(){if(a())return document.documentElement;var e=document.body;return e=e&&!/body/i.test(e.tagName)?n(e):e,e&&r(e)?null:e};Object.defineProperty?Object.defineProperty(document,"scrollingElement",{get:c}):document.__defineGetter__?document.__defineGetter__("scrollingElement",c):(document.scrollingElement=c(),document.attachEvent&&document.attachEvent("onpropertychange",function(){"activeElement"==window.event.propertyName&&(document.scrollingElement=c())}))}()},{}],4:[function(e,t,n){(function(e){!function(e,o){"function"==typeof define&&define.amd?define([],function(){return o(e)}):"object"==typeof n?t.exports=o(e):e.SmoothScroll=o(e)}(void 0!==e?e:"undefined"!=typeof window?window:this,function(e){"use strict";var t="querySelector"in document&&"addEventListener"in e&&"requestAnimationFrame"in e&&"closest"in e.Element.prototype,n={ignore:"[data-scroll-ignore]",header:null,speed:500,offset:0,easing:"easeInOutCubic",customEasing:null,before:function(){},after:function(){}},o=function(){for(var e={},t=0,n=arguments.length;t<n;t++){var o=arguments[t];!function(t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}(o)}return e},r=function(t){return parseInt(e.getComputedStyle(t).height,10)},i=function(e){"#"===e.charAt(0)&&(e=e.substr(1));for(var t,n=String(e),o=n.length,r=-1,i="",a=n.charCodeAt(0);++r<o;){if(0===(t=n.charCodeAt(r)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");i+=t>=1&&t<=31||127==t||0===r&&t>=48&&t<=57||1===r&&t>=48&&t<=57&&45===a?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122?n.charAt(r):"\\"+n.charAt(r)}return"#"+i},a=function(e,t){var n;return"easeInQuad"===e.easing&&(n=t*t),"easeOutQuad"===e.easing&&(n=t*(2-t)),"easeInOutQuad"===e.easing&&(n=t<.5?2*t*t:(4-2*t)*t-1),"easeInCubic"===e.easing&&(n=t*t*t),"easeOutCubic"===e.easing&&(n=--t*t*t+1),"easeInOutCubic"===e.easing&&(n=t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e.easing&&(n=t*t*t*t),"easeOutQuart"===e.easing&&(n=1- --t*t*t*t),"easeInOutQuart"===e.easing&&(n=t<.5?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e.easing&&(n=t*t*t*t*t),"easeOutQuint"===e.easing&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e.easing&&(n=t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t),e.customEasing&&(n=e.customEasing(t)),n||t},c=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},l=function(e,t,n){var o=0;if(e.offsetParent)do{o+=e.offsetTop,e=e.offsetParent}while(e);return o=Math.max(o-t-n,0)},u=function(e){return e?r(e)+e.offsetTop:0},s=function(t,n,o){o||(t.focus(),document.activeElement.id!==t.id&&(t.setAttribute("tabindex","-1"),t.focus(),t.style.outline="none"),e.scrollTo(0,n))},d=function(t){return!!("matchMedia"in e&&e.matchMedia("(prefers-reduced-motion)").matches)};return function(r,f){var m,h,g,p,v,y,E,b={};b.cancelScroll=function(){cancelAnimationFrame(E)},b.animateScroll=function(t,r,i){var d=o(m||n,i||{}),f="[object Number]"===Object.prototype.toString.call(t),h=f||!t.tagName?null:t;if(f||h){var g=e.pageYOffset;d.header&&!p&&(p=document.querySelector(d.header)),v||(v=u(p));var y,E,w,C=f?t:l(h,v,parseInt("function"==typeof d.offset?d.offset():d.offset,10)),S=C-g,O=c(),I=0,H=function(n,o){var i=e.pageYOffset;if(n==o||i==o||(g<o&&e.innerHeight+i)>=O)return b.cancelScroll(),s(t,o,f),d.after(t,r),y=null,!0},T=function(t){y||(y=t),I+=t-y,E=I/parseInt(d.speed,10),E=E>1?1:E,w=g+S*a(d,E),e.scrollTo(0,Math.floor(w)),H(w,C)||(e.requestAnimationFrame(T),y=t)};0===e.pageYOffset&&e.scrollTo(0,0),d.before(t,r),b.cancelScroll(),e.requestAnimationFrame(T)}};var w=function(e){h&&(h.id=h.getAttribute("data-scroll-id"),b.animateScroll(h,g),h=null,g=null)},C=function(t){if(!d()&&0===t.button&&!t.metaKey&&!t.ctrlKey&&(g=t.target.closest(r))&&"a"===g.tagName.toLowerCase()&&!t.target.closest(m.ignore)&&g.hostname===e.location.hostname&&g.pathname===e.location.pathname&&/#/.test(g.href)){var n;try{n=i(decodeURIComponent(g.hash))}catch(e){n=i(g.hash)}if("#"===n){t.preventDefault(),h=document.body;var o=h.id?h.id:"smooth-scroll-top";return h.setAttribute("data-scroll-id",o),h.id="",void(e.location.hash.substring(1)===o?w():e.location.hash=o)}(h=document.querySelector(n))&&(h.setAttribute("data-scroll-id",h.id),h.id="",g.hash===e.location.hash&&(t.preventDefault(),w()))}},S=function(e){y||(y=setTimeout(function(){y=null,v=u(p)},66))};return b.destroy=function(){m&&(document.removeEventListener("click",C,!1),e.removeEventListener("resize",S,!1),b.cancelScroll(),m=null,h=null,g=null,p=null,v=null,y=null,E=null)},b.init=function(r){t&&(b.destroy(),m=o(n,r||{}),p=m.header?document.querySelector(m.header):null,v=u(p),document.addEventListener("click",C,!1),e.addEventListener("hashchange",w,!1),p&&e.addEventListener("resize",S,!1))},b.init(f),b}})}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);