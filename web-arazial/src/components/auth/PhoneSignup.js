import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { forceAuthRefresh } from '../../services/appState';
import { supabase } from '../../services/supabase';

// Define default colors to avoid undefined theme issues
const defaultColors = {
  border: '#E5E7EB',
  text: '#374151',
  background: '#F9FAFB',
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  placeholderText: '#9CA3AF',
  buttonText: '#FFFFFF',
  disabledButton: '#D1D5DB',
  disabledText: '#9CA3AF',
  secondaryText: '#6B7280',
  error: '#EF4444',
  success: '#10B981'
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CountryCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme?.colors?.border || defaultColors.border};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.text || defaultColors.text};
  background-color: ${props => props.theme?.colors?.background || defaultColors.background};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme?.colors?.border || defaultColors.border};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.text || defaultColors.text};
  background-color: ${props => props.theme?.colors?.background || defaultColors.background};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || defaultColors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme?.colors?.placeholderText || defaultColors.placeholderText};
  }
`;

const OTPInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const OTPInput = styled.input`
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  border: 1px solid ${props => props.theme?.colors?.border || defaultColors.border};
  border-radius: 0.375rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || defaultColors.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => 
    props.disabled 
      ? (props.theme?.colors?.disabledButton || defaultColors.disabledButton) 
      : (props.theme?.colors?.primary || defaultColors.primary)
  };
  color: ${props => props.theme?.colors?.buttonText || defaultColors.buttonText};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme?.colors?.primaryHover || defaultColors.primaryHover};
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${props => 
    props.disabled 
      ? (props.theme?.colors?.disabledText || defaultColors.disabledText) 
      : (props.theme?.colors?.primary || defaultColors.primary)
  };
  font-size: 0.875rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  align-self: center;
  
  &:hover:not(:disabled) {
    text-decoration: underline;
  }
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.secondaryText || defaultColors.secondaryText};
  text-align: center;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.error || defaultColors.error};
  text-align: center;
`;

const SuccessText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.success || defaultColors.success};
  text-align: center;
`;

const Timer = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.secondaryText || defaultColors.secondaryText};
  text-align: center;
`;

const PhoneSignup = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'password'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  // Handle phone number input validation
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (input.length <= 10) {
      setPhoneNumber(input);
    }
  };
  
  // Format phone number for API call (add 90 prefix)
  const formatPhoneNumber = () => {
    if (phoneNumber.length === 10 && phoneNumber.startsWith('5')) {
      return `90${phoneNumber}`;
    }
    return null;
  };
  
  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    const formatted = formatPhoneNumber();
    if (!formatted) {
      setError('Lütfen geçerli bir telefon numarası girin (5XX XXX XX XX)');
      return;
    }
    
    setLoading(true);
    
    try {
      // Add debug logging
      console.log('Formatted phone number:', formatted);
      
      // Call the Supabase Edge Function
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          phone_number: formatted
        }),
      });
      
      const data = await response.json();
      console.log('OTP response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Doğrulama kodu gönderilirken bir hata oluştu');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Doğrulama kodu gönderilirken bir hata oluştu');
      }
      
      setFormattedPhoneNumber(formatted);
      setSuccess('Doğrulama kodu gönderildi');
      setStep('otp');
      
      // Start countdown timer for resend (2 minutes)
      setTimer(120);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Doğrulama kodu gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle OTP input
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
    
    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  
  // Handle OTP keydown (for backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    const otp = otpInputs.join('');
    if (otp.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin');
      return;
    }
    
    if (step === 'otp') {
      setStep('password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the Supabase Edge Function
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
          otp,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Doğrulama kodunu kontrol ederken bir hata oluştu');
      }
      
      setSuccess(data.message || 'Telefon numaranız doğrulandı');
      
      // Attempt to sign in
      try {
        // Use the email created from phone number
        const email = `${formattedPhoneNumber}@phone.arazial.com`;
        await signIn(email, password);
        
        // Force refresh auth state
        await forceAuthRefresh();
        
        // Navigate to home
        navigate('/');
      } catch (signInError) {
        console.error('Sign in error:', signInError);
        // If auto-login fails, redirect to login page after delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.message || 'Doğrulama kodunu kontrol ederken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render different steps
  const renderPhoneStep = () => (
    <Form onSubmit={handleSendOTP}>
      <PhoneInputContainer>
        <CountryCode>+90</CountryCode>
        <Input
          type="tel"
          placeholder="5XX XXX XX XX"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          maxLength={10}
          required
        />
      </PhoneInputContainer>
      
      <InfoText>
        Telefon numaranıza bir doğrulama kodu göndereceğiz.
      </InfoText>
      
      <Button type="submit" disabled={loading || phoneNumber.length !== 10}>
        {loading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
      </Button>
    </Form>
  );
  
  const renderOtpStep = () => (
    <Form onSubmit={handleVerifyOTP}>
      <InfoText>
        {formattedPhoneNumber.replace('90', '+90 ')} numarasına gönderilen 6 haneli doğrulama kodunu girin.
      </InfoText>
      
      <OTPInputContainer>
        {otpInputs.map((digit, index) => (
          <OTPInput
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </OTPInputContainer>
      
      {timer > 0 && (
        <Timer>
          Kodu yeniden gönderme: {formatTime(timer)}
        </Timer>
      )}
      
      {timer === 0 && (
        <ResendButton 
          type="button" 
          onClick={handleSendOTP}
          disabled={loading}
        >
          Kodu Yeniden Gönder
        </ResendButton>
      )}
      
      <Button type="submit" disabled={loading || otpInputs.join('').length !== 6}>
        {loading ? 'Doğrulanıyor...' : 'Doğrula ve Devam Et'}
      </Button>
    </Form>
  );
  
  const renderPasswordStep = () => (
    <Form onSubmit={handleVerifyOTP}>
      <InfoText>
        Hesabınız için lütfen bir şifre belirleyin.
      </InfoText>
      
      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      
      <Input
        type="password"
        placeholder="Şifre (Tekrar)"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
      />
      
      <InfoText>
        Şifreniz en az 6 karakter olmalıdır.
      </InfoText>
      
      <Button type="submit" disabled={loading || !password || !confirmPassword}>
        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </Button>
    </Form>
  );
  
  return (
    <Container>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      
      {step === 'phone' && renderPhoneStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'password' && renderPasswordStep()}
    </Container>
  );
};

export default PhoneSignup; 