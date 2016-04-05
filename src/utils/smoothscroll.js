/* Taken from https://github.com/alicelieutier/smoothScroll
Though, at the time of use, the repo was behind by a couple key PRs,
so I took the PR code directly.*/

(function (root, smoothScroll) {
  'use strict';

  // Support RequireJS and CommonJS/NodeJS module formats.
  // Attach smoothScroll to the `window` when executed as a <script>.

  // RequireJS
  if (typeof define === 'function' && define.amd) {
    define(smoothScroll);

  // CommonJS
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = smoothScroll();

  } else {
    root.smoothScroll = smoothScroll();
  }

})(this, function(){
'use strict';

// Do not initialize smoothScroll when running server side, handle it in client:
if (typeof window !== 'object') return;

// We do not want this script to be applied in browsers that do not support those
// That means no smoothscroll on IE9 and below.
if(document.querySelectorAll === void 0 || window.pageYOffset === void 0 || history.pushState === void 0) { return; }

// Get the top position of an element in the document
var getTop = function(element, context) {
    if (context === window) {
        // return value of html.getBoundingClientRect().top ... IE : 0, other browsers : -pageYOffset
        if(element.nodeName === 'HTML') return -window.pageYOffset
        return element.getBoundingClientRect().top + window.pageYOffset;
    }
    else {
        return element.getBoundingClientRect().top - context.getBoundingClientRect().top + context.scrollTop;
    }
}
// ease in out function thanks to:
// http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
var easeInOutCubic = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }
var easeInOutQuad = function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }
var KeySpline = function (mX1, mY1, mX2, mY2) {

  this.get = function(aX) {
    if (mX1 == mY1 && mX2 == mY2) return aX; // linear
    return CalcBezier(GetTForX(aX), mY1, mY2);
  }

  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function CalcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function GetSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function GetTForX(aX) {
    // Newton raphson iteration
    var aGuessT = aX;
    for (var i = 0; i < 4; ++i) {
      var currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope == 0.0) return aGuessT;
      var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
}
// calculate the scroll position we should be in
// given the start and end point of the scroll
// the time elapsed from the beginning of the scroll
// and the total duration of the scroll (default 500ms)
var position = function(start, end, elapsed, duration) {
    if (elapsed > duration) return end;
    // return start + (end - start) * easeInOutQuad(elapsed / duration); // <-- you can change the easing funtion there
    // return start + (end - start) * (elapsed / duration); // <-- this would give a linear scroll
	var spline = new KeySpline(0.42, 0.0, 0.58, 1.0)
	return start + (end - start) * spline.get(elapsed / duration);
}

// we use requestAnimationFrame to be called by the browser before every repaint
// if the first argument is an element then scroll to the top of this element
// if the first argument is numeric then scroll to this location
// if the callback exist, it is called when the scrolling is finished
// if context is set then scroll that element, else scroll window
var smoothScroll = function(el, duration, callback, context, offset){
    duration = duration || 500;
    context = context || window;
    offset = offset || 0;
    var start = context === window ? window.pageYOffset : context.scrollTop;

    if (typeof el === 'number') {
      var end = el + offset;
    } else {
      var end = getTop(el, context) + offset;
    }

    // var endContext = context === window ? document.body : context;
    // end = Math.min(end, endContext.scrollHeight - endContext.offsetHeight);

    var clock = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){window.setTimeout(fn, 15);};

    var step = function(){
        var elapsed = Date.now() - clock;
        if (context !== window) {
          context.scrollTop = position(start, end, elapsed, duration);
        }
        else {
          window.scroll(0, position(start, end, elapsed, duration));
        }

        if (elapsed > duration) {
            if (typeof callback === 'function') {
                callback(el);
            }
        } else {
            requestAnimationFrame(step);
        }
    }
    step();
}

smoothScroll.attachToAllLinks = function() {
    var linkHandler = function(ev) {
      ev.preventDefault();

      if (location.hash !== this.hash) window.history.pushState(null, null, this.hash)
      // using the history api to solve issue #1 - back doesn't work
      // most browser don't update :target when the history api is used:
      // THIS IS A BUG FROM THE BROWSERS.
      // change the scrolling duration in this call
      smoothScroll(document.getElementById(this.hash.substring(1)), 500, function(el) {
          location.replace('#' + el.id)
          // this will cause the :target to be activated.
      });
    }

    // We look for all the internal links in the documents and attach the smoothscroll function
    document.addEventListener("DOMContentLoaded", function () {
        var internal = document.querySelectorAll('a[href^="#"]:not([href="#"])'), a;
        for(var i=internal.length; a=internal[--i];){
            a.addEventListener("click", linkHandler, false);
        }
    });
}

// return smoothscroll API
return smoothScroll;

});
