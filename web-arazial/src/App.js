import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
// Import auth utils for backward compatibility
import { forceAuthRefresh, resetAllAuthStorage } from './services/authUtils';

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
import PaymentCallback from './pages/PaymentCallback';
import FAQ from './pages/FAQ';

// Re-export for backward compatibility
export { forceAuthRefresh, resetAllAuthStorage };

// Loading spinner component
const LoadingSpinner = ({ message, loadingTime, retryAction }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '12px',
    background: 'var(--color-background)'
  }}>
    <div style={{ 
      width: '36px', 
      height: '36px', 
      border: '4px solid var(--color-background)', 
      borderTop: '4px solid var(--color-primary)', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
    }}></div>
    
    <p style={{ 
      fontSize: '0.875rem', 
      color: 'var(--color-text-secondary)',
      margin: 0
    }}>
      {message}
      {loadingTime > 2 && <span> ({loadingTime}s)</span>}
    </p>
    
    {loadingTime > 5 && (
      <button 
        onClick={retryAction}
        style={{
          padding: '6px 12px',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px',
          fontSize: '0.8125rem'
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
  const { user, loading, reloadUserProfile, isAuthenticated, authState } = useAuth();
  const [loadingTime, setLoadingTime] = useState(0);
  const [maxLoadingTime, setMaxLoadingTime] = useState(15); // Auto-retry after 15 seconds
  const [showLoading, setShowLoading] = useState(false);
  
  // Debug authentication state - remove this after fixing the issue
  useEffect(() => {
    console.log('[ProtectedRoute] Auth state:', { 
      user: user?.email, 
      authState, 
      isAuthenticated, 
      loading 
    });
  }, [user, authState, isAuthenticated, loading]);
  
  useEffect(() => {
    let timer;
    let loadingDelayTimer;
    
    if (loading) {
      // Only show loading spinner if loading takes more than 300ms
      loadingDelayTimer = setTimeout(() => {
        setShowLoading(true);
      }, 500);
      
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
      setShowLoading(false);
    }
    
    return () => {
      clearInterval(timer);
      clearTimeout(loadingDelayTimer);
    };
  }, [loading, reloadUserProfile, maxLoadingTime]);
  
  const handleRetry = () => {
    console.log("Manual retry of profile loading");
    setLoadingTime(0);
    reloadUserProfile();
    // Increase timeout for next retry
    setMaxLoadingTime(prev => Math.min(prev + 5, 30));
  };
  
  if (loading && showLoading) {
    return (
      <LoadingSpinner 
        message="Oturum bilgileri yükleniyor..."
        loadingTime={loadingTime}
        retryAction={handleRetry}
      />
    );
  }
  
  // Check if user is not authenticated and not loading
  if (!isAuthenticated && !loading) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // If still loading but not showing spinner yet, render nothing to avoid flicker
  if (loading) {
    return null;
  }
  
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading, isAuthenticated, authState } = useAuth();

  // Debug admin authentication
  useEffect(() => {
    console.log('[AdminRoute] Auth state:', { 
      user: user?.email, 
      authState, 
      isAuthenticated, 
      isAdmin, 
      loading 
    });
  }, [user, authState, isAuthenticated, isAdmin, loading]);

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    console.log('[AdminRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // If we know they're definitely not admin, redirect
  if (isAuthenticated && !isAdmin && !loading) {
    console.log('[AdminRoute] User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }
  
  // Show spinner while checking credentials
  if (loading) {
    return (
      <LoadingSpinner 
        message="Yetki kontrolü yapılıyor..."
        loadingTime={0}
      />
    );
  }
  
  // Otherwise render the admin UI
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
      
      // Store timestamp of email confirmation redirect
      localStorage.setItem('auth_redirect_detected', Date.now().toString());
      
      // Handle the session from the URL
      supabase.auth.getSession()
        .then(({ data }) => {
          clearTimeout(failSafeTimer); // Clear the failsafe timer on success
          
          if (data?.session) {
            console.log("[App] Successfully retrieved session from URL");
            
            // Store user ID for debugging
            if (data.session.user) {
              localStorage.setItem('auth_redirect_user_id', data.session.user.id);
            }
            
            // Ensure all auth systems are updated
            forceAuthRefresh()
              .then(() => {
                console.log("[App] Auth refresh completed after redirect");
                localStorage.setItem('auth_redirect_success', Date.now().toString());
              })
              .catch(refreshError => {
                console.error("[App] Error refreshing auth state:", refreshError);
                localStorage.setItem('auth_redirect_error', JSON.stringify({
                  time: Date.now(),
                  message: refreshError.message
                }));
              })
              .finally(() => {
                // Always clean up the URL and finish redirect handling
                window.history.replaceState(null, document.title, window.location.pathname);
                setHandlingRedirect(false);
              });
          } else {
            console.log("[App] No session found in URL");
            localStorage.setItem('auth_redirect_no_session', Date.now().toString());
            setHandlingRedirect(false);
          }
        })
        .catch(error => {
          clearTimeout(failSafeTimer); // Clear the failsafe timer on error
          console.error("[App] Error handling auth redirect:", error);
          localStorage.setItem('auth_redirect_critical_error', JSON.stringify({
            time: Date.now(),
            message: error.message
          }));
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
  
  // Initialize auction service
  useEffect(() => {
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
            path="/sss" 
            element={
              <Layout>
                <FAQ />
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
            element={<Navigate to="/login" />} 
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
          
          <Route 
            path="/payment-callback" 
            element={
              <ProtectedRoute>
                <PaymentCallback />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all redirect */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;