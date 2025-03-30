import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Create a simple event bus for visibility changes
export const VisibilityEvents = {
  listeners: new Set(),
  
  // Add a listener for visibility changes
  subscribe: (callback) => {
    VisibilityEvents.listeners.add(callback);
    return () => VisibilityEvents.listeners.delete(callback);
  },
  
  // Notify all listeners
  notify: () => {
    VisibilityEvents.listeners.forEach(callback => callback());
  }
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [lastChecked, setLastChecked] = useState(0);
  const [visibilityChanging, setVisibilityChanging] = useState(false);

  // Simple direct database query to get role
  const fetchUserRole = async (userId) => {
    console.log("Directly fetching role for user:", userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching role:", error);
        return null;
      }
      
      console.log("Role data fetched:", data);
      return data?.role;
    } catch (error) {
      console.error("Exception fetching role:", error);
      return null;
    }
  };
  
  const updateUserStatus = async (userId) => {
    if (!userId) {
      console.log("No user ID provided to updateUserStatus");
      setUserRole(null);
      setIsAdmin(false);
      setProfileLoaded(true);
      return;
    }
    
    console.log("Updating user status for:", userId);
    setProfileLoaded(false);
    
    try {
      const role = await fetchUserRole(userId);
      console.log("User role from direct query:", role);
      
      setUserRole(role || 'user');
      setIsAdmin(role === 'admin');
      
      console.log("Updated status:", { role, isAdmin: role === 'admin' });
    } catch (error) {
      console.error("Error updating user status:", error);
      setUserRole('user');
      setIsAdmin(false);
    } finally {
      setProfileLoaded(true);
      setLastChecked(Date.now());
    }
  };

  // Auth session setup
  useEffect(() => {
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        setLoading(true);
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Initial session check:", !!session);
        
        if (session?.user && mounted) {
          console.log("User found in session:", session.user.email);
          setUser(session.user);
          await updateUserStatus(session.user.id);
        } else if (mounted) {
          setUser(null);
          setUserRole(null);
          setIsAdmin(false);
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Auth setup error:", error);
        if (mounted) {
          setError(error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
      
      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email);
          
          if (session?.user && mounted) {
            setUser(session.user);
            await updateUserStatus(session.user.id);
          } else if (mounted) {
            setUser(null);
            setUserRole(null);
            setIsAdmin(false);
            setProfileLoaded(true);
          }
        }
      );
      
      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  // CENTRAL visibility change handler that coordinates refreshes
  useEffect(() => {
    // Debounce flag to prevent multiple calls
    let debounceTimer = null;
    
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Prevent multiple rapid visibility changes from triggering multiple refreshes
        if (visibilityChanging) return;
        
        console.log("Tab became visible - CENTRAL HANDLER");
        setVisibilityChanging(true);
        clearTimeout(debounceTimer);
        
        try {
          // Only refresh if it's been more than 1 minute since last check
          const now = Date.now();
          if (now - lastChecked > 60000) {
            console.log("Refreshing session after visibility change");
            
            // First refresh auth session
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              console.log("Session refreshed, user still authenticated");
              setUser(session.user);
              await updateUserStatus(session.user.id);
              
              // Now notify other components that they can refresh their data
              // This ensures auth is updated before data refreshes happen
              VisibilityEvents.notify();
            } else if (user) {
              console.log("Session expired, logging out");
              setUser(null);
              setUserRole(null);
              setIsAdmin(false);
              setProfileLoaded(true);
            }
            setLastChecked(now);
          } else {
            // Even if we don't need an auth refresh, notify components to refresh their data
            console.log("Auth is recent, just notifying components");
            VisibilityEvents.notify();
          }
        } catch (error) {
          console.error("Error in visibility change handler:", error);
        } finally {
          // Set a debounce timer to prevent rapid changes
          debounceTimer = setTimeout(() => {
            setVisibilityChanging(false);
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(debounceTimer);
    };
  }, [user, lastChecked, visibilityChanging]);

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
      
      setUser(null);
      setUserRole(null);
      setIsAdmin(false);
      setProfileLoaded(true);
      setLastChecked(Date.now());
    } catch (error) {
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
      setError(error.message);
      throw error;
    }
  };
  
  // Force refresh user session and profile
  const reloadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // First refresh the session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        console.log("Force reloading user profile");
        setUser(session.user);
        await updateUserStatus(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
        setIsAdmin(false);
        setProfileLoaded(true);
      }
    } catch (error) {
      console.error("Error reloading user profile:", error);
      setError("Profil yüklenirken bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      setLastChecked(Date.now());
    }
  };

  console.log("Auth context state:", {
    user: user?.email,
    userRole,
    isAdmin,
    loading: loading || (user && !profileLoaded)
  });

  // Create the auth value object
  const value = {
    user,
    loading: loading || (user && !profileLoaded),
    error,
    userRole,
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