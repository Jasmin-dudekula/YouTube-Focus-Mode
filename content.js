// YouTube Focus Mode Content Script
const FocusMode = {
  isActive: false, // Tracks whether focus mode is active
  settings: {
    hideComments: false, // Whether to hide comments
    hideSidebar: false   // Whether to hide the sidebar/suggested videos
  },

  // Element selectors for YouTube sections to hide
  selectors: {
    comments: [
      '#comments',
      'ytd-comments',
      'ytd-comments-panel-renderer',
      '[section-identifier="comment-item-section"]',
      'ytd-video-secondary-info-renderer .comment-teaser'
    ],
    sidebar: [
      '#secondary',
      'ytd-watch-next-secondary-results-renderer',
      'ytd-reel-shelf-renderer',
      '[id="secondary"][class*="ytd-watch-flexy"]'
    ]
  },

  // Hide all elements matching provided selectors
  hideElements(selectors) {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element) {
          element.style.display = 'none'; // Hide element
          element.classList.add('yt-focus-hidden'); // Add hidden class for tracking
        }
      });
    });
  },

  // Show elements that were previously hidden
  showElements(selectors) {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element && element.classList.contains('yt-focus-hidden')) {
          element.style.display = ''; // Reset display property
          element.classList.remove('yt-focus-hidden'); // Remove hidden class
        }
      });
    });
  },

  // Apply the current focus mode settings
  applyFocusMode() {
    if (this.settings.hideComments) {
      this.hideElements(this.selectors.comments);
    }
    
    if (this.settings.hideSidebar) {
      this.hideElements(this.selectors.sidebar);
    }
  },

  // Remove focus mode and restore all hidden elements
  removeFocusMode() {
    this.showElements(this.selectors.comments);
    this.showElements(this.selectors.sidebar);
  },

  // Enable focus mode with specified settings
  enable(hideComments, hideSidebar) {
    this.isActive = true;
    this.settings.hideComments = hideComments;
    this.settings.hideSidebar = hideSidebar;
    this.applyFocusMode(); // Apply changes immediately
  },

  // Disable focus mode
  disable() {
    this.isActive = false;
    this.removeFocusMode();
  },

  // Initialize focus mode state based on saved settings
  init() {
    chrome.storage.sync.get(['focusMode', 'hideComments', 'hideSidebar'], (data) => {
      if (data.focusMode) {
        this.enable(data.hideComments || false, data.hideSidebar || false);
      }
    });
  }
};

// Listen for messages from popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'focusToggle') {
    if (message.value) {
      FocusMode.enable(message.hideComments, message.hideSidebar);
    } else {
      FocusMode.disable();
    }
    sendResponse({ success: true });
  }
});

// Observer to handle YouTube's dynamic content loading
const observer = new MutationObserver(() => {
  if (FocusMode.isActive) {
    setTimeout(() => {
      FocusMode.applyFocusMode();
    }, 500);
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    FocusMode.init();
    observer.observe(document.body, { childList: true, subtree: true });
  });
} else {
  FocusMode.init();
  observer.observe(document.body, { childList: true, subtree: true });
}

// Handle YouTube's SPA navigation changes
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    setTimeout(() => {
      FocusMode.init();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });
