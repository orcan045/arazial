import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

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
        setError('Oturum süresi doldu. Lütfen sayfayı yenileyin.');
      }
    }, 15000); // 15 seconds max
    
    return () => clearTimeout(loadingTimeout);
  }, [loading]);
  
  // Initialize auth state and subscribe to auth changes
  useEffect(() => {
    let authSubscription;
    
    async function setupAuthListener() {
      try {
        setLoading(true);
        
        // Get initial session
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setUser(data.session.user);
          await fetchUserProfile(data.session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
        
        // Subscribe to auth changes
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          try {
            if (session?.user) {
              setUser(session.user);
              await fetchUserProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
              setIsAdmin(false);
            }
          } catch (error) {
            console.error('Error handling auth change:', error);
          } finally {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error setting up auth:', error);
        setError('Oturum bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    
    setupAuthListener();
    
    // Cleanup subscription
    return () => {
      if (authSubscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      // Skip if no user ID
      if (!userId) {
        setProfile(null);
        setIsAdmin(false);
        return;
      }
      
      // First check if we have a cached profile and it's not too old
      const cachedProfile = localStorage.getItem('user_profile');
      const cachedTime = localStorage.getItem('user_profile_time');
      const now = Date.now();
      
      // Use cache if it exists and is less than 30 minutes old
      if (cachedProfile && cachedTime && (now - parseInt(cachedTime)) < 30 * 60 * 1000) {
        try {
          const profile = JSON.parse(cachedProfile);
          if (profile.id === userId) {
            console.log('Using cached profile');
            setProfile(profile);
            setIsAdmin(profile.role === 'admin');
            
            // Only fetch new profile in background if cache is older than 5 minutes
            if ((now - parseInt(cachedTime)) > 5 * 60 * 1000) {
              backgroundFetchProfile(userId, now).catch(console.error);
            }
            return;
          }
        } catch (e) {
          console.error('Error parsing cached profile:', e);
        }
      }
      
      await backgroundFetchProfile(userId, now);
    } catch (error) {
      console.error('Exception fetching profile:', error);
      // Keep existing profile if we have one, otherwise set default
      if (!profile) {
        setProfile({ role: 'user' });
        setIsAdmin(false);
      }
    }
  };
  
  // Internal method for fetching profile from server
  const backgroundFetchProfile = async (userId, now) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }

      setProfile(data);
      setIsAdmin(data?.role === 'admin');
      
      // Cache the profile
      localStorage.setItem('user_profile', JSON.stringify(data));
      localStorage.setItem('user_profile_time', now.toString());
      console.log('User profile loaded and cached, isAdmin:', data?.role === 'admin');
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Don't reset existing profile on background fetch error
      if (!profile) {
        setProfile({ role: 'user' });
        setIsAdmin(false);
      }
    }
  };
  
  // Force reload of user profile
  const reloadUserProfile = async () => {
    setLoading(true);
    
    try {
      if (user?.id) {
        await fetchUserProfile(user.id);
      }
    } catch (error) {
      console.error('Error reloading user profile:', error);
      setError('Profil yüklenirken bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Force refresh auth session
  const refreshAuth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data?.session) {
        setUser(data.session.user);
        await fetchUserProfile(data.session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
      return data;
    } catch (error) {
      console.error('Error refreshing auth:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
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
      }
      
      // Clear any cached profile data
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_profile_time');
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
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
    refreshAuth
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}