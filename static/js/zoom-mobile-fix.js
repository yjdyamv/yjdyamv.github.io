/**
 * zoom-mobile-fix.js
 * Purpose: Fixes mediumZoom dismiss behavior on mobile touch devices.
 * The Blowfish theme's mediumZoom uses margin:24 which leaves only 24px of
 * tappable background on mobile, making it hard to dismiss. This script adds
 * touchend handling so tapping the zoomed image also closes the zoom.
 */
(function () {
  document.addEventListener('touchend', function (e) {
    var overlay = document.querySelector('.medium-zoom-overlay');
    if (!overlay || overlay.style.display === 'none') return;

    var target = e.target;
    if (
      target.classList.contains('medium-zoom-overlay') ||
      target.classList.contains('medium-zoom-image--opened') ||
      target.classList.contains('medium-zoom-image')
    ) {
      e.preventDefault();
      var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      overlay.dispatchEvent(clickEvent);
    }
  });
})();
