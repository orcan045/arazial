import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

// Debug flag - set to true to enable login page logs
const DEBUG = process.env.NODE_ENV === 'development' && true;

// Simple debug logger that only logs when DEBUG is true
const debug = (message, ...args) => {
  if (DEBUG) {
    console.log(message, ...args);
  }
};

const AuthContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    height: 3rem;
    width: 3rem;
    color: var(--color-primary);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
  font-size: 0.875rem;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
  
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #b91c1c;
  font-size: 0.875rem;
`;

const FormFooter = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  a {
    color: var(--color-primary);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const LoginTab = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const CountryCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 1rem;
  border: 1.2px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.875rem;
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
  margin-top: 0;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  
  /* Make the input component take full width */
  & > div {
    width: 100%;
  }
  
  /* Style the input to account for the button space */
  & input {
    padding-right: 45px;
  }
  
  /* Position the eye button relative to the input field */
  & > button {
    /* This positions relative to the input field, not the wrapper */
    top: 38px !important;
    transform: none !important;
  }
`;

const EyeButton = ({ isVisible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--color-text-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '24px',
      width: '24px',
      padding: 0,
      zIndex: 5,
      pointerEvents: 'auto'
    }}
  >
    {isVisible ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )}
  </button>
);

// Add the CheckboxContainer, Checkbox and CheckboxLabel styled components
const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
  margin-right: 0.75rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState('phone'); // 'email' or 'phone', default to phone
  const [authStep, setAuthStep] = useState('identifier'); // 'identifier', 'password', 'otp', 'new_password'
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [userExists, setUserExists] = useState(null); // null = unknown, true = exists, false = new user
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [formattedIdentifier, setFormattedIdentifier] = useState(''); // Formatted email or phone
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  const { signIn, error, user, loading, authState, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Direct debug for component state
  console.log('[LoginPage] Render state:', { 
    user: user?.email, 
    isAdmin: user?.role === 'admin',
    loading,
    authState,
    isAuthenticated,
    loginAttempted,
    hasError: !!error,
    loginMethod
  });

  // Watch for successful login and navigate accordingly
  useEffect(() => {
    // Check if we should navigate - user is authenticated and login was attempted
    if (loginAttempted && isAuthenticated) {
      console.log('[LoginPage] Auth conditions met, navigating to home:', {
        loginAttempted,
        authState,
        user: user?.email,
      });
      
      // Force navigation directly
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loginAttempted, authState, user, navigate]);

  // Handle tab changing
  const handleTabChange = (method) => {
    setLoginMethod(method);
    setErrors({});
    setLoginAttempted(false);
  };
  
  // Handle phone number input validation
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length <= 10) {
      setPhoneNumber(input);
      
      // Clear errors when input changes
      if (errors.phoneNumber || errors.general) {
        setErrors(prev => ({
          ...prev,
          phoneNumber: undefined,
          general: undefined
        }));
      }
    }
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
    // Clear errors when input changes
    if (errors.password || errors.general) {
      setErrors(prev => ({
        ...prev,
        password: undefined,
        general: undefined
      }));
    }
  };
  
  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
    // Clear errors when input changes
    if (errors.email || errors.general) {
      setErrors(prev => ({
        ...prev,
        email: undefined,
        general: undefined
      }));
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'E-posta adresinizi giriniz';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!password) {
      newErrors.password = 'Şifrenizi giriniz';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhoneForm = () => {
    const newErrors = {};
    
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Telefon numaranızı giriniz';
    } else if (phoneNumber.length !== 10 || !phoneNumber.startsWith('5')) {
      newErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)';
    }
    
    if (!password) {
      newErrors.password = 'Şifrenizi giriniz';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    setIsLoading(true);
    setLoginAttempted(false); // Reset first, will set to true on success
    
    try {
      console.log('[LoginPage] Attempting to sign in with email:', email);
      const data = await signIn(email, password);
      
      // Update last auth timestamp in localStorage for potential debugging
      localStorage.setItem('auth_last_login', Date.now().toString());
      
      // Mark login attempted - will trigger navigation in useEffect when auth state updates
      if (data?.session?.user) {
        console.log('[LoginPage] Sign in successful with user ID:', data.session.user.id);
        setLoginAttempted(true);
      } else {
        console.log('[LoginPage] Sign in returned without valid session data:', data);
      }
    } catch (error) {
      console.error('[LoginPage] Login error:', error);
      
      // Handle errors consistently in Turkish
      if (error.message === 'Invalid login credentials') {
        setErrors({ general: 'Geçersiz giriş bilgileri' });
      } else {
        setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneForm()) return;
    
    setIsLoading(true);
    setLoginAttempted(false);
    
    try {
      // Format phone number for authentication
      const formattedPhone = `90${phoneNumber}`;
      const phoneBasedEmail = `${formattedPhone}@phone.arazial.com`;
      
      console.log('[LoginPage] Attempting to sign in with phone:', phoneBasedEmail);
      localStorage.setItem('phone_login_attempt', phoneBasedEmail);
      
      let loginSuccess = false;
      
      try {
        // Try to sign in using the phone-email format
        console.log('[LoginPage] Trying primary sign in method');
        const data = await signIn(phoneBasedEmail, password);
        
        // Update login timestamp
        localStorage.setItem('auth_last_login', Date.now().toString());
        localStorage.setItem('phone_login_success', Date.now().toString());
        
        if (data?.session?.user) {
          console.log('[LoginPage] Phone sign in successful with user ID:', data.session.user.id);
          loginSuccess = true;
          setLoginAttempted(true);
        }
      } catch (primaryError) {
        console.error('[LoginPage] Primary phone sign in error:', primaryError);
        // Handle error consistently with Turkish message
        if (primaryError.message === 'Invalid login credentials') {
          setErrors({ general: 'Geçersiz giriş bilgileri' });
          return;
        }
      }
      
      // If first attempt failed, try direct login
      if (!loginSuccess) {
        try {
          console.log('[LoginPage] Trying direct Supabase sign in');
          const { data: directSignIn, error: directSignInError } = await supabase.auth.signInWithPassword({
            email: phoneBasedEmail,
            password
          });
          
          if (directSignInError) {
            console.error('[LoginPage] Direct phone sign in error:', directSignInError);
            
            // Check for specific errors and provide helpful Turkish feedback
            if (directSignInError.message.includes('email/password')) {
              setErrors({
                general: 'Bu telefon numarası ile kayıtlı bir hesap bulunamadı veya şifre hatalı'
              });
            } else if (directSignInError.message === 'Invalid login credentials') {
              setErrors({
                general: 'Geçersiz giriş bilgileri'
              });
            } else {
              // Never show the raw error message
              setErrors({
                general: 'Giriş yapılırken bir hata oluştu'
              });
            }
          } else if (directSignIn?.session) {
            console.log('[LoginPage] Direct phone sign in successful:', directSignIn.session.user.id);
            loginSuccess = true;
            setLoginAttempted(true);
          }
        } catch (directError) {
          console.error('[LoginPage] Direct sign in exception:', directError);
          setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
        }
      }
      
      // Try with + prefix if all else failed
      if (!loginSuccess) {
        try {
          // Try with + prefix
          const alternateEmail = `+${formattedPhone}@phone.arazial.com`;
          console.log('[LoginPage] Trying with alternate email format:', alternateEmail);
          
          const { data: altSignIn, error: altSignInError } = await supabase.auth.signInWithPassword({
            email: alternateEmail,
            password,
          });
          
          if (!altSignInError && altSignIn?.session) {
            loginSuccess = true;
            console.log('[LoginPage] Alternate email sign-in successful');
            setLoginAttempted(true);
          } else if (altSignInError) {
            console.error('[LoginPage] Alternative sign-in error:', altSignInError);
          }
        } catch (altError) {
          console.error('[LoginPage] Alternative sign-in exception:', altError);
        }
      }
      
      if (!loginSuccess) {
        // If we get here, all login attempts failed
        setErrors({
          general: 'Giriş işlemi başarısız oldu. Lütfen telefon numaranızı ve şifrenizi kontrol edin.'
        });
      }
    } catch (error) {
      console.error('[LoginPage] Phone login error:', error);
      setErrors({
        general: 'Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
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

  // Render form based on authentication step
  const renderForm = () => {
    // Show general error message at the top of any form
    const errorMessage = errors.general && <ErrorMessage>{errors.general}</ErrorMessage>;
    
    // Step 1: Enter email or phone
    if (authStep === 'identifier') {
      return (
        <>
          {errorMessage}
          
          <LoginTabs>
            <LoginTab 
              active={loginMethod === 'email'} 
              onClick={() => handleTabChange('email')}
            >
              E-posta ile Giriş
            </LoginTab>
            <LoginTab 
              active={loginMethod === 'phone'} 
              onClick={() => handleTabChange('phone')}
            >
              Telefon ile Giriş
            </LoginTab>
          </LoginTabs>
          
          <AuthForm onSubmit={checkUserExists}>
            {loginMethod === 'email' ? (
              <Input
                id="email"
                label="E-posta"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="ornek@email.com"
                error={errors.email}
                autoFocus
              />
            ) : (
              <div>
                <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Telefon Numarası
                </label>
                <PhoneInputContainer>
                  <CountryCode>+90</CountryCode>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="5XX XXX XX XX"
                    error={errors.phoneNumber}
                    hideLabel
                    autoFocus
                    style={{ flexGrow: 1, marginBottom: 0 }}
                  />
                </PhoneInputContainer>
                {errors.phoneNumber && (
                  <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
            )}
            
            <Button type="submit" fullWidth loading={isLoading}>
              {isLoading ? 'Kontrol Ediliyor...' : 'Devam Et'}
            </Button>
          </AuthForm>
          
          <FormFooter>
            {loginMethod === 'email' 
              ? <>E-posta adresiniz yoksa <Link to="#" onClick={() => handleTabChange('phone')}>telefon numarası ile devam edin</Link></>
              : <>Telefon numaranız kayıtlı değilse, kaydolmak için devam edebilirsiniz</>
            }
          </FormFooter>
        </>
      );
    }
    
    // Step 2: Enter password (for existing users)
    if (authStep === 'password') {
      return (
        <>
          {errorMessage}
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold' }}>{loginMethod === 'email' ? email : `+90 ${phoneNumber}`}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Giriş yapmak için şifrenizi girin
            </div>
          </div>
          
          <AuthForm onSubmit={handlePasswordSubmit}>
            <PasswordInputWrapper>
              <Input
                id="password"
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                autoFocus
              />
              <EyeButton isVisible={showPassword} onClick={togglePasswordVisibility} />
            </PasswordInputWrapper>
            
            <div style={{ textAlign: 'right' }}>
              <Link 
                to={loginMethod === 'email' 
                  ? `/forgot-password?email=${encodeURIComponent(email)}` 
                  : `/forgot-password?phone=${encodeURIComponent(phoneNumber)}`} 
                style={{ fontSize: '0.875rem' }}
              >
                Şifrenizi mi unuttunuz?
              </Link>
            </div>
            
            <Button type="submit" fullWidth loading={isLoading}>
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </AuthForm>
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="#" onClick={() => setAuthStep('identifier')}>
              Farklı {loginMethod === 'email' ? 'e-posta' : 'telefon numarası'} kullan
            </Link>
          </div>
        </>
      );
    }
    
    // Step 3: OTP verification (for new phone users)
    if (authStep === 'otp') {
      return (
        <>
          {errorMessage}
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold' }}>+90 {phoneNumber}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Telefon numaranıza gönderilen 6 haneli doğrulama kodunu girin
            </div>
          </div>
          
          <AuthForm onSubmit={verifyOTP}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {otpInputs.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    autoFocus={index === 0}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      border: '2px solid var(--color-primary, #0f3460)',
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      color: 'var(--color-text, #333)',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px rgba(15, 52, 96, 0.2)';
                      e.target.style.borderColor = 'var(--color-primary, #0f3460)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Hesap oluşturmak için şifre belirleyin</div>
              <PasswordInputWrapper>
                <Input
                  id="password"
                  label="Şifre"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                />
                <EyeButton isVisible={showPassword} onClick={togglePasswordVisibility} />
              </PasswordInputWrapper>
              
              <PasswordInputWrapper>
                <Input
                  id="confirmPassword"
                  label="Şifre (Tekrar)"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
                <EyeButton isVisible={showConfirmPassword} onClick={toggleConfirmPasswordVisibility} />
              </PasswordInputWrapper>
            </div>
            
            <CheckboxContainer>
              <Checkbox 
                id="termsAgreement" 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <CheckboxLabel htmlFor="termsAgreement">
                <Link to="/terms-of-use" target="_blank">Kullanım Koşulları</Link>'nı okudum ve kabul ediyorum.
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.terms && <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{errors.terms}</div>}
            
            <CheckboxContainer>
              <Checkbox 
                id="privacyAgreement" 
                type="checkbox" 
                checked={privacyAccepted} 
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <CheckboxLabel htmlFor="privacyAgreement">
                <Link to="/privacy-policy" target="_blank">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.privacy && <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{errors.privacy}</div>}
            
            <Button type="submit" fullWidth loading={isLoading} disabled={!termsAccepted || !privacyAccepted}>
              {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Kaydol'}
            </Button>
            
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
              <Link to="#" onClick={() => setAuthStep('identifier')}>
                Farklı telefon numarası kullan
              </Link>
              {' • '}
              <Link to="#" onClick={sendOTP}>
                Kodu tekrar gönder
              </Link>
            </div>
          </AuthForm>
        </>
      );
    }
    
    // Step 4: Create password for new email users
    if (authStep === 'new_password') {
      return (
        <>
          {errorMessage}
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold' }}>{email}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Bu e-posta adresiyle hesap oluşturmak için şifre belirleyin
            </div>
          </div>
          
          <AuthForm onSubmit={handleNewEmailUserSubmit}>
            <PasswordInputWrapper>
              <Input
                id="password"
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                autoFocus
              />
              <EyeButton isVisible={showPassword} onClick={togglePasswordVisibility} />
            </PasswordInputWrapper>
            
            <PasswordInputWrapper>
              <Input
                id="confirmPassword"
                label="Şifre (Tekrar)"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />
              <EyeButton isVisible={showConfirmPassword} onClick={toggleConfirmPasswordVisibility} />
            </PasswordInputWrapper>
            
            <CheckboxContainer>
              <Checkbox 
                id="termsAgreement" 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <CheckboxLabel htmlFor="termsAgreement">
                <Link to="/terms-of-use" target="_blank">Kullanım Koşulları</Link>'nı okudum ve kabul ediyorum.
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.terms && <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{errors.terms}</div>}
            
            <CheckboxContainer>
              <Checkbox 
                id="privacyAgreement" 
                type="checkbox" 
                checked={privacyAccepted} 
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <CheckboxLabel htmlFor="privacyAgreement">
                <Link to="/privacy-policy" target="_blank">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.privacy && <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>{errors.privacy}</div>}
            
            <Button type="submit" fullWidth loading={isLoading} disabled={!termsAccepted || !privacyAccepted}>
              {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </Button>
          </AuthForm>
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="#" onClick={() => setAuthStep('identifier')}>
              Farklı e-posta adresi kullan
            </Link>
          </div>
        </>
      );
    }
    
    // Step 5: Email verification sent
    if (authStep === 'email_sent') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉️</div>
          <h2>E-posta Doğrulaması Gönderildi</h2>
          <p>
            <strong>{email}</strong> adresine bir doğrulama e-postası gönderdik.
            <br />Lütfen e-postanızı kontrol edin ve hesabınızı doğrulamak için e-postadaki bağlantıya tıklayın.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="#" onClick={() => setAuthStep('identifier')}>
              Farklı bir hesapla giriş yap
            </Link>
          </div>
        </div>
      );
    }
    
    // Fallback
    return <div>Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.</div>;
  };

  // Handle checking if user exists based on identifier (email or phone)
  const checkUserExists = async (e) => {
    e.preventDefault();
    
    // Validate the identifier based on login method
    let isValid = false;
    if (loginMethod === 'email') {
      if (!email) {
        setErrors({ email: 'E-posta adresinizi giriniz' });
        return;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: 'Geçerli bir e-posta adresi giriniz' });
        return;
      }
      isValid = true;
      setFormattedIdentifier(email);
    } else { // loginMethod === 'phone'
      if (!phoneNumber) {
        setErrors({ phoneNumber: 'Telefon numaranızı giriniz' });
        return;
      } else if (phoneNumber.length !== 10 || !phoneNumber.startsWith('5')) {
        setErrors({ phoneNumber: 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)' });
        return;
      }
      isValid = true;
      // Format phone number for authentication
      const formattedPhone = `90${phoneNumber}`;
      setFormattedIdentifier(formattedPhone);
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (loginMethod === 'email') {
        // Use a more reliable approach for checking email existence
        console.log('[LoginPage] Checking if email exists for:', email);
        
        // First try the direct edge function approach
        try {
          console.log('[LoginPage] Calling check-email edge function');
          
          const checkEmailResponse = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/check-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ email })
          });
          
          if (checkEmailResponse.ok) {
            const checkEmailData = await checkEmailResponse.json();
            console.log('[LoginPage] check-email response:', checkEmailData);
            
            if (checkEmailData.exists === true) {
              console.log('[LoginPage] Email exists in auth table - email is REGISTERED');
              setUserExists(true);
              setAuthStep('password');
              return;
            } else if (checkEmailData.exists === false) {
              console.log('[LoginPage] Email does NOT exist in auth table - email is NOT REGISTERED');
              setUserExists(false);
              setAuthStep('new_password');
              return;
            }
          } else {
            // If the check-email function fails, log the error and try fallback methods
            console.error('[LoginPage] check-email function failed:', await checkEmailResponse.text());
          }
        } catch (checkEmailError) {
          console.error('[LoginPage] Error calling check-email function:', checkEmailError);
        }
        
        // Try sign-in with wrong password as fallback
        try {
          console.log('[LoginPage] Trying sign-in check method for email');
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: 'WRONG_PASSWORD_TO_CHECK_EXISTENCE'
          });
          
          if (signInError) {
            console.log('[LoginPage] Sign-in error message:', signInError.message);
            
            // First check the email existence in the earlier part of the file
            if (signInError.message.includes('Invalid login credentials')) {
              console.log('[LoginPage] Email exists based on error message - email is REGISTERED');
              setUserExists(true);
              setAuthStep('password');
              return;
            }
          }
        } catch (signInCheckError) {
          console.error('[LoginPage] Error in sign-in check for email:', signInCheckError);
        }
        
        // Fallback to checking profiles table
        try {
          console.log('[LoginPage] Fallback to profiles table check for email');
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .limit(1);
          
          if (userError) {
            console.error('[LoginPage] Error checking email in profiles:', userError);
          } else {
            const exists = userData && userData.length > 0;
            if (exists) {
              console.log('[LoginPage] Email found in profiles table');
              setUserExists(true);
              setAuthStep('password');
              return;
            } else {
              console.log('[LoginPage] Email not found in profiles table');
            }
          }
        } catch (profileCheckError) {
          console.error('[LoginPage] Error checking profiles for email:', profileCheckError);
        }
        
        // If we get here, assume new user
        console.log('[LoginPage] Email does not exist, proceeding to new user flow');
        setUserExists(false);
        setAuthStep('new_password');
      } else { // phone login
        const formattedPhone = `90${phoneNumber}`;
        const phoneBasedEmail = `${formattedPhone}@phone.arazial.com`;
        
        console.log('[LoginPage] Checking if phone number exists for:', phoneBasedEmail);
        
        // First try the direct edge function approach for checking phone existence
        try {
          console.log('[LoginPage] Calling check-phone edge function');
          
          const checkPhoneResponse = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/check-phone`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ phoneNumber: formattedPhone })
          });
          
          if (checkPhoneResponse.ok) {
            const checkPhoneData = await checkPhoneResponse.json();
            console.log('[LoginPage] check-phone response:', checkPhoneData);
            
            if (checkPhoneData.exists === true) {
              console.log('[LoginPage] Phone exists in auth table - phone number is REGISTERED');
              setUserExists(true);
              setAuthStep('password');
              setIsLoading(false);
              return;
            } else if (checkPhoneData.exists === false) {
              console.log('[LoginPage] Phone does NOT exist in auth table - phone number is NOT REGISTERED');
              setUserExists(false);
              await sendOTP();
              setIsLoading(false);
              return;
            }
          } else {
            // If the check-phone function fails, log the error and try fallback methods
            console.error('[LoginPage] check-phone function failed:', await checkPhoneResponse.text());
          }
        } catch (checkPhoneError) {
          console.error('[LoginPage] Error calling check-phone function:', checkPhoneError);
        }
        
        // Fallback: Check profiles table
        try {
          console.log('[LoginPage] Falling back to profiles table check');
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone_number', formattedPhone)
            .limit(1);
            
          if (!profileError && profileData && profileData.length > 0) {
            console.log('[LoginPage] Found user in profiles table:', profileData[0].id);
            setUserExists(true);
            setAuthStep('password');
            setIsLoading(false);
            return;
          } else {
            console.log('[LoginPage] User not found in profiles table');
          }
        } catch (profileCheckError) {
          console.error('[LoginPage] Error checking profiles table:', profileCheckError);
        }
        
        // Final fallback: Try sign-in to see if it fails with the right error
        try {
          console.log('[LoginPage] Final fallback: trying sign-in with wrong password');
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: phoneBasedEmail,
            password: 'WRONG_PASSWORD_TO_CHECK_EXISTENCE'
          });
          
          if (signInError) {
            console.log('[LoginPage] Sign-in error message:', signInError.message);
            
            // This is very unreliable but it's our last resort
            if (signInError.message.includes('Invalid login credentials')) {
              console.log('[LoginPage] User might exist based on error message');
              setUserExists(true);
              setAuthStep('password');
              setIsLoading(false);
              return;
            }
          }
        } catch (signInCheckError) {
          console.error('[LoginPage] Error in sign-in check:', signInCheckError);
        }
        
        // If we reach here without definitively knowing if the user exists,
        // assume they don't exist and go to OTP flow
        console.log('[LoginPage] Assuming user does not exist - proceeding to OTP verification');
        setUserExists(false);
        await sendOTP();
      }
    } catch (error) {
      console.error('[LoginPage] Error checking user existence:', error);
      setErrors({ general: 'Kullanıcı kontrol edilirken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send OTP for phone verification
  const sendOTP = async () => {
    setIsLoading(true);
    
    try {
      const formattedPhone = `90${phoneNumber}`;
      console.log('Sending OTP to phone number:', formattedPhone);
      
      // Call the send-otp function
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });
      
      const data = await response.json();
      console.log('OTP response:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'OTP gönderilemedi');
      }
      
      // Move to OTP verification step
      setAuthStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Always show Turkish error message
      setErrors({ general: 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
    
    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  
  // Handle OTP keydown (for backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  
  // Verify OTP and complete registration
  const verifyOTP = async (e) => {
    e.preventDefault();
    
    if (otpInputs.join('').length !== 6) {
      setErrors({ general: 'Lütfen 6 haneli doğrulama kodunu tam olarak girin.' });
      return;
    }
    
    if (!password) {
      setErrors({ password: 'Şifrenizi giriniz' });
      return;
    }
    
    if (password.length < 6) {
      setErrors({ password: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Şifreler eşleşmiyor' });
      return;
    }
    
    if (!termsAccepted) {
      setErrors({ terms: 'Kullanım Koşullarını kabul etmelisiniz' });
      return;
    }
    
    if (!privacyAccepted) {
      setErrors({ privacy: 'Gizlilik Politikasını kabul etmelisiniz' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify OTP and create user
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          phoneNumber: formattedIdentifier,
          otp: otpInputs.join(''),
          password: password,
        },
      });
      
      if (error) {
        console.error('Error verifying OTP:', error);
        // Always use Turkish error message
        setErrors({ general: 'Doğrulama başarısız oldu. Lütfen tekrar deneyin.' });
        return;
      }
      
      console.log('OTP verification successful:', data);
      
      // Attempt to sign in with the newly created account
      const phoneBasedEmail = `${formattedIdentifier}@phone.arazial.com`;
      
      try {
        const signInResult = await signIn(phoneBasedEmail, password);
        console.log('Sign in result after OTP verification:', signInResult);
        
        if (signInResult?.session) {
          setLoginAttempted(true);
        }
      } catch (signInError) {
        console.error('Error signing in after OTP verification:', signInError);
        
        // Try direct login as fallback
        try {
          const { data: directSignIn } = await supabase.auth.signInWithPassword({
            email: phoneBasedEmail,
            password
          });
          
          if (directSignIn?.session) {
            setLoginAttempted(true);
          }
        } catch (directError) {
          console.error('Direct sign in error:', directError);
          // Use Turkish error message
          setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
        }
      }
    } catch (error) {
      console.error('Error in OTP verification process:', error);
      setErrors({ general: 'Doğrulama işlemi sırasında bir hata oluştu.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password submission for existing users
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setErrors({ password: 'Şifrenizi giriniz' });
      return;
    }
    
    if (password.length < 6) {
      setErrors({ password: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For email login
      if (loginMethod === 'email') {
        try {
          const data = await signIn(formattedIdentifier, password);
          
          if (data?.session?.user) {
            console.log('[LoginPage] Email sign in successful:', data.session.user.id);
            setLoginAttempted(true);
          }
        } catch (error) {
          console.error('[LoginPage] Email login error:', error);
          if (error.message === 'Invalid login credentials') {
            setErrors({ general: 'Geçersiz giriş bilgileri' });
          } else {
            setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
          }
        }
      } 
      // For phone login
      else {
        const phoneBasedEmail = `${formattedIdentifier}@phone.arazial.com`;
        let loginSuccess = false;
        
        try {
          const data = await signIn(phoneBasedEmail, password);
          
          if (data?.session?.user) {
            loginSuccess = true;
            setLoginAttempted(true);
          }
        } catch (primaryError) {
          console.error('[LoginPage] Primary phone login error:', primaryError);
          
          // Handle specific error case
          if (primaryError.message === 'Invalid login credentials') {
            setErrors({ general: 'Geçersiz giriş bilgileri' });
            return;
          }
          
          // Try direct login as fallback
          try {
            const { data: directSignIn, error: directSignInError } = await supabase.auth.signInWithPassword({
              email: phoneBasedEmail,
              password
            });
            
            if (directSignInError) {
              if (directSignInError.message.includes('email/password')) {
                setErrors({ password: 'Hatalı şifre, lütfen tekrar deneyin' });
              } else if (directSignInError.message === 'Invalid login credentials') {
                setErrors({ general: 'Geçersiz giriş bilgileri' });
              } else {
                setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
              }
            } else if (directSignIn?.session) {
              loginSuccess = true;
              setLoginAttempted(true);
            }
          } catch (directError) {
            console.error('[LoginPage] Direct sign in error:', directError);
            setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
          }
        }
        
        if (!loginSuccess) {
          setErrors({ general: 'Giriş yapılamadı, lütfen şifrenizi kontrol edin' });
        }
      }
    } catch (error) {
      console.error('[LoginPage] Login error:', error);
      setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password submission for new email users
  const handleNewEmailUserSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setErrors({ password: 'Şifrenizi giriniz' });
      return;
    }
    
    if (password.length < 6) {
      setErrors({ password: 'Şifre en az 6 karakter olmalıdır' });
      return;
    }
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Şifreler eşleşmiyor' });
      return;
    }
    
    if (!termsAccepted) {
      setErrors({ terms: 'Kullanım Koşullarını kabul etmelisiniz' });
      return;
    }
    
    if (!privacyAccepted) {
      setErrors({ privacy: 'Gizlilik Politikasını kabul etmelisiniz' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the new user
      const { data, error } = await supabase.auth.signUp({
        email: formattedIdentifier,
        password
      });
      
      if (error) {
        console.error('[LoginPage] Registration error:', error);
        // Use a generic Turkish error message
        setErrors({ general: 'Kayıt işlemi sırasında bir hata oluştu' });
        return;
      }
      
      if (data?.user) {
        if (data.user.confirmed_at) {
          // User is confirmed immediately - sign in
          try {
            const signInData = await signIn(formattedIdentifier, password);
            if (signInData?.session) {
              setLoginAttempted(true);
            }
          } catch (signInError) {
            console.error('[LoginPage] Error signing in after registration:', signInError);
            setErrors({ general: 'Giriş yapılırken bir hata oluştu' });
          }
        } else {
          // User needs to confirm email
          setAuthStep('email_sent');
        }
      }
    } catch (error) {
      console.error('[LoginPage] Error during registration:', error);
      setErrors({ general: 'Kayıt işlemi sırasında bir hata oluştu' });
    } finally {
      setIsLoading(false);
    }
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
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
        </Logo>
        <Title>Giriş Yap</Title>
        <Subtitle>Arazi ihale platformuna giriş yapın</Subtitle>
      </AuthHeader>
      
      {renderForm()}
    </AuthContainer>
  );
};

export default LoginPage;