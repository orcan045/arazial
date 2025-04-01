import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import { useState, useEffect } from 'react';
import appState, { forceAuthRefresh } from './services/appState';
import { supabase } from './services/supabase';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import AuctionDetail from './pages/AuctionDetail';
import Auctions from './pages/Auctions';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import UserSettings from './pages/UserSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

// Loading spinner component
const LoadingSpinner = ({ message, loadingTime, retryAction }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '16px',
    background: 'var(--color-background)'
  }}>
    <div style={{ width: '50px', height: '50px', border: '5px solid var(--color-background)', 
                borderTop: '5px solid var(--color-primary)', borderRadius: '50%', 
                animation: 'spin 1s linear infinite' }}></div>
    <p>{message} ({loadingTime}s)</p>
    
    {loadingTime > 5 && (
      <button 
        onClick={retryAction}
        style={{
          padding: '8px 16px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '16px'
        }}
      >
        Yeniden Dene
      </button>
    )}
    
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading, reloadUserProfile } = useAuth();
  const [loadingTime, setLoadingTime] = useState(0);
  const [maxLoadingTime, setMaxLoadingTime] = useState(15); // Auto-retry after 15 seconds
  
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => {
          // Auto-retry after maxLoadingTime seconds
          if (prev + 1 >= maxLoadingTime) {
            console.log("Auto-retrying profile load after timeout");
            reloadUserProfile();
            return 0; // Reset timer after auto-retry
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    
    return () => clearInterval(timer);
  }, [loading, reloadUserProfile, maxLoadingTime]);
  
  const handleRetry = () => {
    console.log("Manual retry of profile loading");
    setLoadingTime(0);
    reloadUserProfile();
    // Increase timeout for next retry
    setMaxLoadingTime(prev => Math.min(prev + 5, 30));
  };
  
  if (loading) {
    return (
      <LoadingSpinner 
        message="Oturum bilgileri yükleniyor..."
        loadingTime={loadingTime}
        retryAction={handleRetry}
      />
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading, reloadUserProfile } = useAuth();
  const [loadingTime, setLoadingTime] = useState(0);
  const [maxLoadingTime, setMaxLoadingTime] = useState(15); // Auto-retry after 15 seconds
  
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => {
          // Auto-retry after maxLoadingTime seconds
          if (prev + 1 >= maxLoadingTime) {
            console.log("Auto-retrying admin profile load after timeout");
            reloadUserProfile();
            return 0; // Reset timer after auto-retry
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    
    return () => clearInterval(timer);
  }, [loading, reloadUserProfile, maxLoadingTime]);
  
  const handleRetry = () => {
    console.log("Manual retry of admin profile loading");
    setLoadingTime(0);
    reloadUserProfile();
    // Increase timeout for next retry
    setMaxLoadingTime(prev => Math.min(prev + 5, 30));
  };
  
  if (loading) {
    return (
      <LoadingSpinner 
        message="Yönetici bilgileri kontrol ediliyor..."
        loadingTime={loadingTime}
        retryAction={handleRetry}
      />
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Auth Layout (without navbar/footer for auth pages)
const AuthLayout = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      padding: '1rem'
    }}>
      {children}
    </div>
  );
};

const App = () => {
  // Handle the Supabase email confirmation auth state
  const [handlingRedirect, setHandlingRedirect] = useState(true);
  
  useEffect(() => {
    // Failsafe: Set a maximum timeout for handling redirects
    const failSafeTimer = setTimeout(() => {
      console.log("[App] Failsafe triggered - force ending redirect handling");
      setHandlingRedirect(false);
    }, 10000); // 10 seconds max
    
    // Check for access_token in the URL to detect returning from email confirmation
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log("[App] Detected auth redirect, handling session");
      
      // Handle the session from the URL
      supabase.auth.getSession()
        .then(({ data }) => {
          clearTimeout(failSafeTimer); // Clear the failsafe timer on success
          
          if (data?.session) {
            console.log("[App] Successfully retrieved session from URL");
            // Force auth refresh to ensure state is updated
            forceAuthRefresh()
              .then(() => {
                console.log("[App] Auth state refreshed after redirect");
                // Remove the hash from the URL to avoid issues on refresh
                window.history.replaceState(null, document.title, window.location.pathname);
              })
              .catch(error => {
                console.error("[App] Error refreshing auth after redirect:", error);
              })
              .finally(() => {
                setHandlingRedirect(false);
              });
          } else {
            console.log("[App] No session found in URL");
            setHandlingRedirect(false);
          }
        })
        .catch(error => {
          clearTimeout(failSafeTimer); // Clear the failsafe timer on error
          console.error("[App] Error handling auth redirect:", error);
          setHandlingRedirect(false);
        });
    } else {
      // No redirect detected, continue normally
      clearTimeout(failSafeTimer); // Clear the failsafe timer
      setHandlingRedirect(false);
    }
    
    return () => {
      clearTimeout(failSafeTimer); // Cleanup on unmount
    };
  }, []);

  // Initialize and clean up appState
  useEffect(() => {
    // Ensure appState is initialized first
    console.log('[App] Initializing appState');
    
    // Trigger manual refresh on app load
    appState.forceRefresh();
    
    // Dynamic import to prevent circular dependencies
    import('./services/auctionService')
      .then(({ setupBackgroundRefresh }) => {
        if (typeof setupBackgroundRefresh === 'function') {
          console.log('[App] Setting up auction background refresh');
          setupBackgroundRefresh();
        }
      })
      .catch(error => {
        console.error('[App] Failed to initialize auction service:', error);
      });
    
    // Clean up on unmount
    return () => {
      console.log('[App] Cleaning up appState');
      appState.cleanup();
    };
  }, []);
  
  // Show a loading spinner if we're handling an email confirmation redirect
  if (handlingRedirect) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--color-background)'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid var(--color-background)', 
          borderTop: '5px solid var(--color-primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <p>E-posta doğrulaması işleniyor...</p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <Layout>
                <Auctions />
              </Layout>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <Layout>
                <About />
              </Layout>
            } 
          />
          
          <Route 
            path="/contact" 
            element={
              <Layout>
                <Contact />
              </Layout>
            } 
          />
          
          <Route 
            path="/privacy-policy" 
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            } 
          />
          
          <Route 
            path="/terms-of-use" 
            element={
              <Layout>
                <TermsOfUse />
              </Layout>
            } 
          />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/forgot-password" 
            element={
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UserSettings />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={<Navigate to="/admin/dashboard" />} 
          />
          
          <Route 
            path="/auctions/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AuctionDetail />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;