/**
 * Auth Utilities
 * 
 * Provides compatibility functions to replace the appState auth functions
 * This helps maintain backward compatibility while transitioning away
 * from the appState service to using AuthContext directly.
 */

// Import supabase for direct access if needed
import { supabase } from './supabase';

/**
 * Forces authentication refresh
 * This is used by components that previously used forceAuthRefresh from appState
 */
export const forceAuthRefresh = async () => {
  // Simply refresh the session from Supabase directly
  // AuthContext will pick up the changes via its auth state change subscription
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error refreshing auth:', error);
    throw error;
  }
  return data;
};

/**
 * Resets all auth storage
 * Used by components that previously relied on resetAllAuthStorage from appState
 */
export const resetAllAuthStorage = () => {
  // Clear any profile data in localStorage
  localStorage.removeItem('user_profile');
  localStorage.removeItem('user_profile_time');
  
  // Log the action
  console.log('Auth storage reset');
};

/**
 * Simple utility function to check if a user is authenticated
 * Compatible with previous appState.isAuthenticated() function
 */
export const isAuthenticated = () => {
  return supabase.auth.getSession()
    .then(({ data }) => {
      return !!data?.session?.user;
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return false;
    });
}; 