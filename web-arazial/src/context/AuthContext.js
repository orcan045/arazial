import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
    }
  };

  // Auth session setup
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Initial session check:", !!session);
        
        if (session?.user) {
          console.log("User found in session:", session.user.email);
          setUser(session.user);
          await updateUserStatus(session.user.id);
        } else {
          setUser(null);
          setUserRole(null);
          setIsAdmin(false);
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Auth setup error:", error);
      } finally {
        setLoading(false);
      }
      
      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email);
          
          if (session?.user) {
            setUser(session.user);
            await updateUserStatus(session.user.id);
          } else {
            setUser(null);
            setUserRole(null);
            setIsAdmin(false);
            setProfileLoaded(true);
          }
        }
      );
      
      return () => {
        subscription?.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserRole(null);
      setIsAdmin(false);
      setProfileLoaded(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
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
  
  // Force refresh user profile
  const reloadUserProfile = async () => {
    if (user) {
      console.log("Force reloading user profile");
      await updateUserStatus(user.id);
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