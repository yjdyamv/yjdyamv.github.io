/**
 * zoom-mobile-fix.js
 * Purpose: Fixes mediumZoom dismiss behavior on mobile touch devices.
 * The theme's mediumZoom uses margin:24 leaving only 24px of tappable background
 * on mobile. This script adds touchend handling to dismiss the zoom.
 */
(function () {
  var isMobile = 'ontouchstart' in window;

  if (!isMobile) return;

  document.addEventListener('touchend', function (e) {
    var overlay = document.querySelector('.medium-zoom-overlay');
    if (!overlay) return;

    if (e.target.closest('.medium-zoom-overlay')) {
      e.preventDefault();
      e.stopPropagation();

      var zoomedImg = overlay.querySelector('.medium-zoom-image--opened');
      if (zoomedImg && zoomedImg._mediumZoom) {
        zoomedImg._mediumZoom.close();
      } else if (zoomedImg) {
        zoomedImg.click();
      }
    }
  });
})();
