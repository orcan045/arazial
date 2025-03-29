import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import { useState, useEffect } from 'react';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
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

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading, reloadUserProfile } = useAuth();
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    
    return () => clearInterval(timer);
  }, [loading]);
  
  if (loading) {
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
        <div style={{ width: '50px', height: '50px', border: '5px solid var(--color-background)', 
                    borderTop: '5px solid var(--color-primary)', borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' }}></div>
        <p>Oturum bilgileri yükleniyor... ({loadingTime}s)</p>
        
        {loadingTime > 5 && (
          <button 
            onClick={() => {
              console.log("Force refreshing profile!");
              reloadUserProfile();
            }}
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
  
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      setLoadingTime(0);
    }
    
    return () => clearInterval(timer);
  }, [loading]);
  
  if (loading) {
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
        <div style={{ width: '50px', height: '50px', border: '5px solid var(--color-background)', 
                    borderTop: '5px solid var(--color-primary)', borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' }}></div>
        <p>Yönetici bilgileri kontrol ediliyor... ({loadingTime}s)</p>
        
        {loadingTime > 5 && (
          <button 
            onClick={() => {
              console.log("Force refreshing admin profile!");
              reloadUserProfile();
            }}
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
                <LandingPage />
              </Layout>
            } 
          />
          
          <Route 
            path="/auctions" 
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
            path="/admin" 
            element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } 
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