/**
 * friends.js
 * Purpose: Enhances the friends page by detecting truncated text and adding interactive tooltips.
 * This script runs after the DOM loads to check if friend descriptions or notes are overflowing,
 * and adds appropriate classes and titles for better user experience.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Select all paragraph elements in friend card bodies
  var friendText = document.querySelectorAll(".friend-body p");

  friendText.forEach(function (element) {
    // Check if the text is overflowing (either height or width)
    var isOverflowing =
      element.scrollHeight > element.clientHeight + 1 ||
      element.scrollWidth > element.clientWidth + 1;

    if (isOverflowing) {
      // Add class to indicate truncation for potential styling
      element.classList.add("is-truncated");

      // Add title attribute for tooltip if not already present
      if (!element.getAttribute("title")) {
        element.setAttribute("title", element.textContent.trim());
      }
    }
  });
});
