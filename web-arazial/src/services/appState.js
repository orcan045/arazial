/**
 * App State Service
 * 
 * A central store for application state and lifecycle management
 * This eliminates bugs caused by competing event handlers
 */

import { supabase } from './supabase';

class AppStateManager {
  constructor() {
    // Core state
    this.isVisible = true;
    this.isOnline = true;
    this.isAuthed = false;
    this.lastRefreshTime = Date.now();
    this.listeners = new Map();
    this.pendingRefresh = false;
    this.initialSetupComplete = false;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
    
    // Maps for different event types
    this.eventTypes = ['visibility', 'auth', 'network', 'refresh'];
    this.eventTypes.forEach(type => {
      this.listeners.set(type, new Set());
    });
    
    // Safe accessor for Supabase auth
    this.auth = {
      user: null,
      session: null,
      profile: null,
      isAdmin: false
    };
    
    // Initialize handlers
    this.setupHandlers();
  }
  
  // Set up all necessary event listeners
  setupHandlers() {
    // Use a try/catch block to avoid errors during initialization
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Page visibility handler
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Focus/blur handlers
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        window.addEventListener('focus', this.handleFocus);
        window.addEventListener('blur', this.handleBlur);
        
        // Network state handlers
        this.handleOnline = this.handleOnline.bind(this);
        this.handleOffline = this.handleOffline.bind(this);
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
        
        // Pageshow handler (for back/forward cache)
        this.handlePageShow = this.handlePageShow.bind(this);
        window.addEventListener('pageshow', this.handlePageShow);
        
        // Initialize current state
        this.isVisible = document.visibilityState === 'visible';
        this.isOnline = navigator.onLine !== false;
        
        // Set up auth state change listener with Supabase
        this.setupAuthListener();
        
        console.log('[AppState] Event handlers initialized');
      }
    } catch (error) {
      console.error('[AppState] Error setting up handlers:', error);
    }
  }
  
  // Set up authentication state listener
  setupAuthListener() {
    // Get initial session
    this.refreshAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          this.auth.user = session.user;
          this.auth.session = session;
          await this.fetchUserProfile(session.user.id);
        } else {
          this.auth.user = null;
          this.auth.session = null;
          this.auth.profile = null;
          this.auth.isAdmin = false;
        }
        this.notifyListeners('auth');
      }
    );
    
    this.authSubscription = subscription;
  }
  
  // Fetch user profile data with retry logic
  async fetchUserProfile(userId) {
    if (!userId) {
      this.auth.profile = null;
      this.auth.isAdmin = false;
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      this.auth.profile = data;
      this.auth.isAdmin = data?.role === 'admin';
    } catch (error) {
      console.error('Error fetching profile:', error);
      this.auth.profile = null;
      this.auth.isAdmin = false;
    }
  }
  
  // Manually refresh authentication state
  async refreshAuth() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        this.auth.user = null;
        this.auth.session = null;
        this.auth.profile = null;
        this.auth.isAdmin = false;
        return;
      }
      
      this.auth.user = data.session.user;
      this.auth.session = data.session;
      await this.fetchUserProfile(data.session.user.id);
      
    } catch (error) {
      console.error('Error refreshing auth:', error);
      this.auth.user = null;
      this.auth.session = null;
      this.auth.profile = null;
      this.auth.isAdmin = false;
    }
    
    this.notifyListeners('auth');
  }
  
  /* Event Handlers */
  
  // Handle visibility change
  handleVisibilityChange() {
    try {
      const wasVisible = this.isVisible;
      this.isVisible = document.visibilityState === 'visible';
      
      // Only handle becoming visible
      if (this.isVisible && !wasVisible) {
        console.log('[AppState] Tab became visible');
        this.handleVisibilityStateChange();
      }
    } catch (error) {
      console.error('[AppState] Error in visibility change handler:', error);
    }
  }
  
  // Handle focus event
  handleFocus() {
    try {
      const wasVisible = this.isVisible;
      this.isVisible = true;
      
      if (!wasVisible) {
        console.log('[AppState] Window gained focus');
        this.handleVisibilityStateChange();
      }
    } catch (error) {
      console.error('[AppState] Error in focus handler:', error);
    }
  }
  
  // Handle blur event
  handleBlur() {
    try {
      this.isVisible = false;
      console.log('[AppState] Window lost focus');
    } catch (error) {
      console.error('[AppState] Error in blur handler:', error);
    }
  }
  
  // Handle online event
  handleOnline() {
    try {
      this.isOnline = true;
      console.log('[AppState] Network connection restored');
      
      // Trigger visibility state change logic to refresh data
      this.handleVisibilityStateChange();
      
      // Notify network listeners
      this.notifyListeners('network');
    } catch (error) {
      console.error('[AppState] Error in online handler:', error);
    }
  }
  
  // Handle offline event
  handleOffline() {
    try {
      this.isOnline = false;
      console.log('[AppState] Network connection lost');
      
      // Notify network listeners
      this.notifyListeners('network');
    } catch (error) {
      console.error('[AppState] Error in offline handler:', error);
    }
  }
  
  // Handle pageshow event (browser cache restoration)
  handlePageShow(event) {
    try {
      if (event.persisted) {
        console.log('[AppState] Page restored from bfcache');
        
        // Fix for WebKit browsers: force minimal reflow to unstick frozen UI
        if (document.body) {
          document.body.style.display = 'none';
          // Force browser to process the style change
          void document.body.offsetHeight;
          document.body.style.display = '';
        }
        
        // Trigger visibility state change to refresh data
        this.handleVisibilityStateChange();
      }
    } catch (error) {
      console.error('[AppState] Error in pageshow handler:', error);
    }
  }
  
  /* Core visibility state change handling */
  
  // Central visibility state change handler
  async handleVisibilityStateChange() {
    try {
      // Skip if not visible or not online (will be handled when back online)
      if (!this.isVisible || !this.isOnline) {
        return;
      }
      
      // Notify visibility listeners first (immediate UI updates)
      this.notifyListeners('visibility');
      
      // Check if we need to refresh auth (more than 5 minutes since last refresh)
      const now = Date.now();
      const timeSinceLastRefresh = now - this.lastRefreshTime;
      
      if (timeSinceLastRefresh > 5 * 60 * 1000) {
        console.log('[AppState] Auth refresh needed');
        await this.refreshAuth();
      } else {
        console.log('[AppState] Auth refresh not needed, last refresh was', 
          Math.round(timeSinceLastRefresh / 1000), 'seconds ago');
      }
      
      // Notify refresh listeners (components that need to refresh their data)
      this.notifyListeners('refresh');
    } catch (error) {
      console.error('[AppState] Error handling visibility state change:', error);
    }
  }
  
  /* Event Subscription */
  
  // Subscribe to an event type
  subscribe(type, callback) {
    if (!this.eventTypes.includes(type)) {
      console.error(`[AppState] Invalid event type: ${type}`);
      return () => {};
    }
    
    if (typeof callback !== 'function') {
      console.error('[AppState] Callback must be a function');
      return () => {};
    }
    
    const listeners = this.listeners.get(type);
    listeners.add(callback);
    
    console.log(`[AppState] Added ${type} listener, total: ${listeners.size}`);
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      console.log(`[AppState] Removed ${type} listener, remaining: ${listeners.size}`);
    };
  }
  
  // Subscribe to visibility changes (when tab becomes visible)
  onVisibilityChange(callback) {
    return this.subscribe('visibility', callback);
  }
  
  // Subscribe to auth state changes
  onAuthChange(callback) {
    if (!this.listeners) {
      this.listeners = new Set();
    }
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  // Subscribe to network state changes
  onNetworkChange(callback) {
    return this.subscribe('network', callback);
  }
  
  // Subscribe to data refresh events
  onRefresh(callback) {
    return this.subscribe('refresh', callback);
  }
  
  // Notify all listeners of a specific event type
  notifyListeners(type) {
    if (type === 'auth' && this.listeners) {
      this.listeners.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in auth listener:', error);
        }
      });
    }
  }
  
  // Force a refresh
  forceRefresh() {
    console.log('[AppState] Force refreshing app state');
    
    // Immediately notify about refresh
    this.notifyListeners('refresh');
    
    // Also refresh auth if needed
    if (Date.now() - this.lastRefreshTime > 60 * 1000) {
      this.refreshAuth();
    }
  }
  
  /* Cleanup */
  
  // Clean up all event listeners
  cleanup() {
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Remove DOM event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('focus', this.handleFocus);
        window.removeEventListener('blur', this.handleBlur);
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
        window.removeEventListener('pageshow', this.handlePageShow);
        
        // Unsubscribe from Supabase auth
        if (this.authSubscription) {
          this.authSubscription.unsubscribe();
        }
        
        // Clear all listeners
        this.eventTypes.forEach(type => {
          this.listeners.get(type).clear();
        });
        
        console.log('[AppState] Cleaned up all listeners');
      }
    } catch (error) {
      console.error('[AppState] Error during cleanup:', error);
    }
  }
  
  /* Auth helpers */
  
  // Get current user
  getUser() {
    return this.auth.user;
  }
  
  // Get user profile
  getUserProfile() {
    return this.auth.profile;
  }
  
  // Check if user is admin with fallback to cached value
  isUserAdmin() {
    return this.auth.isAdmin;
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    return this.isAuthed;
  }
  
  // Get loading state
  isLoading() {
    return !this.auth.initialized || this.pendingRefresh;
  }
  
  // Add method to force refresh profile
  async forceRefreshProfile() {
    if (this.auth.user?.id) {
      // Clear cache
      this.auth.lastProfileFetch = null;
      // Fetch fresh profile
      await this.fetchUserProfile(this.auth.user.id);
      // Notify listeners
      this.notifyListeners('auth');
    }
  }
}

// Create a singleton instance
const appState = new AppStateManager();

// Export the singleton
export default appState;

// Immediately refresh auth state after login/logout
export const forceAuthRefresh = async () => {
  console.log("[appState] Forcing auth refresh");
  await appState.refreshAuth();
  appState.notifyListeners('auth');
};

// Emergency reset function to clear all auth-related local storage
// This can be called when authentication is stuck or corrupted
export const resetAllAuthStorage = () => {
  console.log('[appState] Emergency auth storage reset');
  try {
    // Clear all Supabase-related items from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Look for Supabase keys
      if (key && (
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth') ||
        key.includes('token')
      )) {
        console.log(`[appState] Removing localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    }
    return true;
  } catch (error) {
    console.error('[appState] Error clearing auth storage:', error);
    return false;
  }
};