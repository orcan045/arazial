import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import appState, { forceAuthRefresh } from '../services/appState';

// Create auth context
const AuthContext = createContext();

// Custom hook for using auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
export function AuthProvider({ children }) {
  // State
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Loading timeout - prevents perpetual loading states
  useEffect(() => {
    // If loading persists too long, attempt retry
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout reached, attempting retry');
        setRetryCount(prev => prev + 1);
        // Force refresh the profile
        appState.forceRefreshProfile();
      }
    }, 5000); // 5 seconds before retry
    
    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  // Reset retry count when user changes
  useEffect(() => {
    if (user) {
      setRetryCount(0);
    }
  }, [user]);
  
  // Subscribe to auth changes from centralized appState
  useEffect(() => {
    // Update our local state whenever appState auth changes
    const handleAuthChange = () => {
      const currentUser = appState.getUser();
      setUser(currentUser);
      
      // Set profile from appState
      const userProfile = appState.getUserProfile();
      setProfile(userProfile);
      
      // Set admin status with fallback to cache
      const adminStatus = appState.isUserAdmin();
      setIsAdmin(adminStatus);
      
      // Only stop loading if we have either successfully loaded the profile
      // or have made maximum retry attempts
      if (!currentUser || retryCount >= 3 || userProfile) {
        setLoading(false);
      }
    };
    
    // Initial state update
    handleAuthChange();
    
    // Subscribe to auth changes in appState
    const unsubscribe = appState.onAuthChange(handleAuthChange);
    
    // Additional subscription for visibility/refresh changes
    const refreshUnsubscribe = appState.onRefresh(() => {
      handleAuthChange();
    });
    
    // Cleanup
    return () => {
      unsubscribe();
      refreshUnsubscribe();
    };
  }, [retryCount]);
  
  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Force immediate auth state refresh
      await forceAuthRefresh();
      
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up function
  const signUp = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { data };
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out function with better error handling
  const signOut = async () => {
    setError(null);
    
    try {
      setLoading(true);
      
      // First, clear local state to ensure UI updates immediately
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      // Then try to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out Supabase error:', error);
        // We still want to force auth refresh even on error
      }
      
      // Always force refresh auth state, even if there was an error
      await forceAuthRefresh();
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      
      // Try force refresh even on error
      try {
        await forceAuthRefresh();
      } catch (refreshError) {
        console.error('Error refreshing after sign out error:', refreshError);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    }
  };
  
  // Update password
  const updatePassword = async (newPassword) => {
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      throw error;
    }
  };
  
  // Add a function to force profile refresh
  const reloadUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      await appState.forceRefreshProfile();
    } catch (error) {
      console.error('Failed to reload user profile:', error);
      setError('Failed to reload profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth state:', { 
      user: user?.email, 
      isAdmin, 
      loading
    });
  }
  
  // Value object to provide to context consumers
  const value = {
    user,
    profile,
    loading,
    error,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    reloadUserProfile,
    retryCount
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}