/**
 * friends.js
 * Purpose: Enhances the friends page by detecting truncated text and adding interactive tooltips.
 * This script runs after the DOM loads to check if friend descriptions or notes are overflowing,
 * and adds appropriate classes and titles for better user experience.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Debounce function to limit execution frequency
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized text overflow detection
  function detectTextOverflow() {
    requestAnimationFrame(() => {
      const friendText = document.querySelectorAll(".friend-body p");
      
      friendText.forEach(function (element) {
        // Skip if already processed
        if (element.classList.contains("is-truncated")) return;
        
        // Check overflow with better precision
        const isOverflowing = 
          element.scrollHeight > element.clientHeight + 2 ||
          element.scrollWidth > element.clientWidth + 2;
        
        if (isOverflowing) {
          element.classList.add("is-truncated");
          if (!element.getAttribute("title")) {
            element.setAttribute("title", element.textContent.trim());
          }
        }
      });
    });
  }

  // Initial detection
  detectTextOverflow();
  
  // Re-check on window resize with debounce
  window.addEventListener("resize", debounce(detectTextOverflow, 150));
});
