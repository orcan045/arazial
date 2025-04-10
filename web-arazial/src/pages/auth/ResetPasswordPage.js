import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

// Reusing styles from ForgotPasswordPage
const AuthContainer = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const AuthHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Logo = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  color: var(--color-primary);
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
`;

const AuthForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Input = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid ${props => props.error ? 'var(--color-error)' : 'var(--color-border)'};
    border-radius: var(--border-radius-md);
    font-size: 1rem;
    background-color: var(--color-bg-input);
    color: var(--color-text);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
    
    &::placeholder {
      color: var(--color-text-placeholder);
    }
  }
  
  .error-message {
    margin-top: 0.5rem;
    color: var(--color-error);
    font-size: 0.75rem;
  }
`;

const Button = styled.button`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
  
  .loading-spinner {
    margin-right: 0.5rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--color-error-bg);
  color: var(--color-error);
  padding: 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background-color: var(--color-success-bg);
  color: var(--color-success);
  padding: 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 2.2rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  margin-bottom: 2rem;
  
  &:hover {
    color: var(--color-primary);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { updatePassword, isAuthenticated, authState } = useAuth();
  const navigate = useNavigate();
  
  // Check auth state and recovery token
  useEffect(() => {
    console.log('[ResetPasswordPage] Auth state:', authState, 'isAuthenticated:', isAuthenticated);
    
    const hash = window.location.hash;
    console.log('[ResetPasswordPage] Current URL:', window.location.href);
    console.log('[ResetPasswordPage] Current URL hash:', hash);
    
    // More flexible token detection - accept any hash with access_token
    if (hash && hash.includes('access_token')) {
      console.log('[ResetPasswordPage] Auth token detected in URL');
      
      // Check the current session directly
      supabase.auth.getSession().then(({ data }) => {
        console.log('[ResetPasswordPage] Current session data:', data);
        
        if (data?.session?.user) {
          console.log('[ResetPasswordPage] User authenticated via token:', data.session.user.id);
          // We can proceed with password reset
          setErrorMessage('');
        } else {
          console.warn('[ResetPasswordPage] No active session with the auth token');
          setErrorMessage('Oturum doğrulanamadı. Lütfen yeni bir şifre sıfırlama bağlantısı talep ediniz.');
        }
      }).catch(error => {
        console.error('[ResetPasswordPage] Error checking session:', error);
        setErrorMessage('Oturum doğrulanırken hata oluştu. Lütfen yeni bir şifre sıfırlama bağlantısı talep ediniz.');
      });
    } else if (!hash) {
      console.log('[ResetPasswordPage] No hash found in URL');
      setErrorMessage('Doğrulama kodu bulunamadı. Lütfen e-postanızdaki bağlantıya tıkladığınızdan emin olun.');
    } else {
      console.log('[ResetPasswordPage] Invalid hash format:', hash);
      setErrorMessage('Geçersiz sıfırlama bağlantısı. Lütfen yeni bir şifre sıfırlama bağlantısı talep ediniz.');
    }
  }, [authState, isAuthenticated]);
  
  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Şifrenizi giriniz';
    } else if (password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Şifrenizi tekrar giriniz';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle submit for password reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('[ResetPasswordPage] Attempting to update password');
      
      // Make direct call to Supabase to update password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });
      
      console.log('[ResetPasswordPage] Direct password update result:', data, error);
      
      if (error) {
        throw error;
      }
      
      // Success!
      setSuccess(true);
      setSuccessMessage('Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('[ResetPasswordPage] Update password error:', error);
      setErrorMessage(`Şifre değiştirme işlemi sırasında bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <AuthContainer>
      <BackLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Anasayfaya Dön
      </BackLink>
      
      <AuthHeader>
        <Logo>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </Logo>
        <Title>Şifre Yenileme</Title>
        <Subtitle>Yeni şifrenizi belirleyin</Subtitle>
      </AuthHeader>
      
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {success && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      {!success && (
        <AuthForm onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <Input error={errors.password}>
              <label htmlFor="password">Yeni Şifre</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </Input>
            <EyeButton type="button" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </EyeButton>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Input error={errors.confirmPassword}>
              <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </Input>
            <EyeButton type="button" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </EyeButton>
          </div>
          
          <Button type="submit" fullWidth loading={isLoading}>
            {isLoading ? (
              <>
                <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Şifre Değiştiriliyor...
              </>
            ) : (
              'Şifremi Değiştir'
            )}
          </Button>
        </AuthForm>
      )}
      
      <FormFooter>
        <Link to="/login">Giriş sayfasına dön</Link>
      </FormFooter>
    </AuthContainer>
  );
};

export default ResetPasswordPage; 