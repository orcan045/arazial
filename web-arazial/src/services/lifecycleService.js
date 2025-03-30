/**
 * Central service to handle app lifecycle events like visibility changes
 * This ensures we don't have competing event handlers across different components
 * 
 * IMPORTANT FIX FOR BACKGROUND-FOREGROUND TRANSITION BUG:
 * This service replaces all the individual visibility handlers 
 * that were causing conflicts across components, leading to the app
 * freezing when returning from background on macOS.
 */

// Safari/WebKit specific fix for the background-foreground transition bug
if (typeof window !== 'undefined') {
  // Make page explicitly reset any pending UI updates when returning from background
  // to prevent stalls in rendering pipeline
  window.addEventListener('pageshow', (event) => {
    // Force a minimal reflow to unstick any frozen UI
    if (event.persisted) {
      console.log('Page was restored from bfcache, forcing layout refresh');
      // This triggers a reflow without causing visible layout shift
      document.body.style.display = 'none';
      // Use RAF to ensure browser processes the style change
      requestAnimationFrame(() => {
        document.body.style.display = '';
      });
    }
  });
}

// Visibility change event system
class VisibilityEventManager {
  constructor() {
    this.listeners = new Set();
    this.isChanging = false;
    this.debounceTimer = null;
    this.lastVisibilityChangeTime = 0;
    this.minTimeBetweenEvents = 2000; // Minimum 2 seconds between events
    this.isVisible = document.visibilityState === 'visible';
    
    // Set up the visibility change handler
    this.setupVisibilityHandler();
    
    // Additional focus/blur handlers for better cross-browser support
    this.setupFocusHandlers();
    
    // Network reconnection handler
    this.setupNetworkHandlers();
  }
  
  setupVisibilityHandler() {
    // The main visibility change handler
    this.handleVisibilityChange = () => {
      const now = Date.now();
      const becameVisible = document.visibilityState === 'visible';
      this.isVisible = becameVisible;
      
      console.log(`Tab visibility changed: ${becameVisible ? 'visible' : 'hidden'}`);
      
      // Only process visibility changes if:
      // 1. The tab became visible (ignore becoming hidden)
      // 2. We're not already processing a change
      // 3. It's been long enough since the last change
      if (becameVisible && !this.isChanging && (now - this.lastVisibilityChangeTime) > this.minTimeBetweenEvents) {
        this.processVisibilityChange();
      }
    };
    
    // Attach the event listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }
  
  setupFocusHandlers() {
    // Focus handler for additional browser support
    this.handleFocus = () => {
      const now = Date.now();
      this.isVisible = true;
      
      // Only process if enough time has passed and we're not already processing
      if (!this.isChanging && (now - this.lastVisibilityChangeTime) > this.minTimeBetweenEvents) {
        console.log('Window received focus');
        this.processVisibilityChange();
      }
    };
    
    // Blur handler to track when window loses focus
    this.handleBlur = () => {
      this.isVisible = false;
      console.log('Window lost focus');
    };
    
    // Add window focus/blur handlers
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
  }
  
  setupNetworkHandlers() {
    // Network reconnection handler
    this.handleNetworkReconnection = () => {
      console.log('Network connection restored, triggering visibility event');
      this.processVisibilityChange();
    };
    
    // Handle network online event
    window.addEventListener('online', this.handleNetworkReconnection);
  }
  
  processVisibilityChange() {
    // Set the flag to prevent multiple simultaneous updates
    this.isChanging = true;
    this.lastVisibilityChangeTime = Date.now();
    
    // Clear any existing timer
    clearTimeout(this.debounceTimer);
    
    // Notify all listeners
    console.log(`Notifying ${this.listeners.size} visibility event listeners`);
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in visibility event listener:', error);
      }
    });
    
    // Reset the changing flag after a delay to debounce rapid visibility changes
    this.debounceTimer = setTimeout(() => {
      this.isChanging = false;
    }, 1000);
  }
  
  // Subscribe to visibility events
  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error('Visibility event subscription requires a function callback');
      return () => {};
    }
    
    this.listeners.add(callback);
    console.log(`Added visibility listener, now have ${this.listeners.size} listeners`);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      console.log(`Removed visibility listener, now have ${this.listeners.size} listeners`);
    };
  }
  
  // Force a visibility change event (for testing or manual refresh)
  forceRefresh() {
    console.log('Manually forcing visibility refresh');
    this.processVisibilityChange();
  }
  
  // Cleanup when the app is unmounted
  cleanup() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('online', this.handleNetworkReconnection);
    clearTimeout(this.debounceTimer);
    this.listeners.clear();
  }
  
  // Add a one-time listener that auto-removes after being called
  subscribeOnce(callback) {
    if (typeof callback !== 'function') {
      console.error('One-time visibility event subscription requires a function callback');
      return () => {};
    }
    
    // Create a wrapper function that removes itself after execution
    const onceWrapper = () => {
      try {
        callback();
      } finally {
        this.listeners.delete(onceWrapper);
      }
    };
    
    this.listeners.add(onceWrapper);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(onceWrapper);
    };
  }
  
  // Get current visibility state
  getIsVisible() {
    return this.isVisible;
  }
}

// Create a singleton instance
export const VisibilityEvents = new VisibilityEventManager();

// Export a cleanup function for app unmount
export const cleanupLifecycleEvents = () => {
  VisibilityEvents.cleanup();
};

export default VisibilityEvents;