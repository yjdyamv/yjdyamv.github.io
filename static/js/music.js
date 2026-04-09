/**
 * music.js
 * Purpose: Enhances the music page with interactive features and animations.
 * This script adds hover effects, lazy loading optimizations, and accessibility improvements.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize music page features
  initMusicPage();
  
  // Add keyboard navigation support
  initKeyboardNavigation();
  
  // Add image loading optimizations
  initImageLoading();
});

/**
 * Initialize music page features
 */
function initMusicPage() {
  // Add click animation to music cards
  const musicCards = document.querySelectorAll('.music-card, .sound-card');
  
  musicCards.forEach(card => {
    card.addEventListener('click', function (e) {
      // Only animate if clicking on the card itself, not on links inside
      if (e.target.tagName === 'A') return;
      
      // Find the first link in the card
      const link = this.querySelector('a');
      if (link) {
        link.click();
      }
    });
    
    // Add keyboard support for card clicks
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = this.querySelector('a');
        if (link) {
          link.click();
        }
      }
    });
  });
  
  // Add hover delay for better UX
  let hoverTimer;
  musicCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        this.classList.add('is-hovering');
      }, 100);
    });
    
    card.addEventListener('mouseleave', function () {
      clearTimeout(hoverTimer);
      this.classList.remove('is-hovering');
    });
  });
}

/**
 * Initialize keyboard navigation support
 */
function initKeyboardNavigation() {
  // Make all interactive elements focusable
  const interactiveElements = document.querySelectorAll('.music-btn, .sound-link');
  
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
    
    // Add focus styles
    element.addEventListener('focus', function () {
      this.classList.add('is-focused');
    });
    
    element.addEventListener('blur', function () {
      this.classList.remove('is-focused');
    });
  });
  
  // Add skip to content link for accessibility
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = '跳转到主要内容';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: white;
    padding: 8px;
    z-index: 1000;
    text-decoration: none;
  `;
  
  skipLink.addEventListener('focus', function () {
    this.style.top = '0';
  });
  
  skipLink.addEventListener('blur', function () {
    this.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Initialize image loading optimizations
 */
function initImageLoading() {
  // Lazy load images with Intersection Observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    // Observe all lazy-loaded images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          this.classList.add('loaded');
        });
        imageObserver.observe(img);
      }
    });
  }
  
  // Add loading animation for images
  const style = document.createElement('style');
  style.textContent = `
    img[loading="lazy"] {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    img[loading="lazy"].loaded {
      opacity: 1;
    }
    
    .music-cover, .sound-icon {
      position: relative;
      overflow: hidden;
    }
    
    .music-cover::before, .sound-icon::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        rgba(var(--color-neutral-100), 0.1) 25%, 
        rgba(var(--color-neutral-200), 0.2) 50%, 
        rgba(var(--color-neutral-100), 0.1) 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    img.loaded + .music-cover::before,
    .loaded .sound-icon::before {
      display: none;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .dark .music-cover::before, .dark .sound-icon::before {
      background: linear-gradient(90deg, 
        rgba(var(--color-neutral-800), 0.1) 25%, 
        rgba(var(--color-neutral-700), 0.2) 50%, 
        rgba(var(--color-neutral-800), 0.1) 75%
      );
    }
  `;
  document.head.appendChild(style);
}

/**
 * Utility function to debounce events
 */
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

/**
 * Utility function to throttle events
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMusicPage,
    initKeyboardNavigation,
    initImageLoading,
    debounce,
    throttle
  };
}