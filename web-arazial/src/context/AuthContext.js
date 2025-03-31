import { createContext, useContext, useState, useEffect } from 'react';
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
  
  // Loading timeout - prevents perpetual loading states
  useEffect(() => {
    // If loading persists too long, force reset it
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.error('Auth context loading timeout reached, forcing reset');
        setLoading(false);
        setError('Authentication timeout. Please refresh the page.');
      }
    }, 15000); // 15 seconds max
    
    return () => clearTimeout(loadingTimeout);
  }, [loading]);
  
  // Subscribe to auth changes from centralized appState
  useEffect(() => {
    // Update our local state whenever appState auth changes
    const handleAuthChange = () => {
      // Set user from appState
      setUser(appState.getUser());
      
      // Set profile from appState
      const userProfile = appState.getUserProfile();
      setProfile(userProfile);
      
      // Set admin status
      setIsAdmin(appState.isUserAdmin());
      
      // Update loading state
      setLoading(appState.isLoading());
    };
    
    // Initial state update
    handleAuthChange();
    
    // Subscribe to auth changes in appState
    const unsubscribe = appState.onAuthChange(handleAuthChange);
    
    // Additional subscription for visibility/refresh changes
    const refreshUnsubscribe = appState.onRefresh(() => {
      // This just updates the loading state when refreshes happen
      setLoading(appState.isLoading());
    });
    
    // Cleanup
    return () => {
      unsubscribe();
      refreshUnsubscribe();
    };
  }, []);
  
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
  
  // Force reload of user profile
  const reloadUserProfile = async () => {
    setLoading(true);
    
    try {
      // Use appState to refresh auth
      await appState.refreshAuth();
    } catch (error) {
      console.error('Error reloading user profile:', error);
      setError('Profil yüklenirken bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
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
    reloadUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}