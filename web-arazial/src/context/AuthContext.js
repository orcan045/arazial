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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Subscribe to auth changes from appState
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(appState.getUser());
      setProfile(appState.getUserProfile());
      setIsAdmin(appState.isUserAdmin());
      setLoading(false);
    };
    
    handleAuthChange();
    return appState.onAuthChange(handleAuthChange);
  }, []);
  
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
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    profile,
    loading,
    error,
    isAdmin,
    signIn,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}