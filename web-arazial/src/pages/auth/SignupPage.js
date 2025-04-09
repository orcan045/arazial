import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import PhoneSignup from '../../components/auth/PhoneSignup';

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

const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #15803d;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
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

const ErrorText = styled.div`
  margin-top: 0.25rem;
  color: #b91c1c;
  font-size: 0.75rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 0;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SignupPage = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const { signUp, signIn, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
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
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    if (!termsAccepted) {
      newErrors.terms = 'Gizlilik Politikası ve Kullanım Koşullarını kabul etmelisiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('[SignupPage] Attempting to register with email:', email);
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) throw signUpError;
      
      console.log('[SignupPage] Registration successful:', data?.user ? 'User created' : 'Unknown state');
      
      // Store signup timestamp for debugging
      localStorage.setItem('auth_last_signup', Date.now().toString());
      
      setSuccess(true);
      setUserData(data);
      
      // Check if auto-confirmation is enabled (user is available immediately)
      if (data?.user && data.user.confirmed_at) {
        try {
          console.log('[SignupPage] Auto-confirmation detected, signing in automatically');
          // Attempt to sign in - Auth context will handle the refresh
          await signIn(email, password);
          
          // Store login timestamp
          localStorage.setItem('auth_last_login', Date.now().toString());
          
          console.log('[SignupPage] Auto-login successful, navigating to home');
          // Navigate to home page immediately
          navigate('/');
        } catch (signInError) {
          console.error('[SignupPage] Auto-login error:', signInError);
          // If auto-login fails, redirect to login page after delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        // For email confirmation flow, show a message and don't auto-redirect
        // User needs to check their email first
        console.log("[SignupPage] Email confirmation required, waiting for user to check email");
      }
    } catch (error) {
      console.error('[SignupPage] Signup error:', error);
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
        <Title>Kayıt Ol</Title>
        <Subtitle>Arazi ihale platformuna kayıt olun</Subtitle>
      </AuthHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!success && (
        <TabContainer>
          <Tab 
            active={activeTab === 'email'} 
            onClick={() => setActiveTab('email')}
          >
            E-posta ile
          </Tab>
          <Tab 
            active={activeTab === 'phone'} 
            onClick={() => setActiveTab('phone')}
          >
            Telefon ile
          </Tab>
        </TabContainer>
      )}
      
      {success && activeTab === 'email' && (
        <SuccessMessage>
          {userData?.user && userData.user.confirmed_at ? (
            'Kayıt işlemi başarılı! Otomatik olarak giriş yapılıyor ve ana sayfaya yönlendiriliyorsunuz...'
          ) : (
            <>
              Kayıt işlemi başarılı! E-posta adresinize gönderilen doğrulama bağlantısına tıklayarak hesabınızı aktifleştirin.
              <br /><br />
              <strong>Önemli:</strong> E-posta onayından sonra otomatik olarak giriş yapabileceksiniz.
            </>
          )}
        </SuccessMessage>
      )}
      
      {!success && activeTab === 'email' && (
        <AuthForm onSubmit={handleSubmit}>
          <Input
            id="email"
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            error={errors.email}
          />
          
          <Input
            id="password"
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          
          <Input
            id="confirmPassword"
            label="Şifre Tekrar"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          
          <CheckboxContainer>
            <Checkbox 
              id="termsAgreement" 
              type="checkbox" 
              checked={termsAccepted} 
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <CheckboxLabel htmlFor="termsAgreement">
              <Link to="/terms-of-use" target="_blank">Kullanım Koşulları</Link> ve <Link to="/privacy-policy" target="_blank">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
            </CheckboxLabel>
          </CheckboxContainer>
          {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
          
          <Button type="submit" fullWidth loading={isLoading}>
            {isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </AuthForm>
      )}
      
      {activeTab === 'phone' && (
        <PhoneSignup />
      )}
      
      <FormFooter>
        Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
      </FormFooter>
    </AuthContainer>
  );
};

export default SignupPage;