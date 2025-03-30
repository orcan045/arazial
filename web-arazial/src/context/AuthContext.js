import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import appState from '../services/appState';

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
      
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    setError(null);
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
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