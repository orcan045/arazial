import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const Divider = styled.div`
  height: 4px;
  width: 60px;
  background-color: var(--color-primary);
  margin: 0 auto 3rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ContactForm = styled.form`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-text);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: border-color 0.3s ease;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-top: 1rem;
`;

const ContactInfo = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  height: fit-content;
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-text);
`;

const InfoItem = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    color: var(--color-primary);
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-left: 1.75rem;
  line-height: 1.6;
`;

const InfoLink = styled.a`
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }
`;

const SuccessMessage = styled.div`
  background-color: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #065f46;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #991b1b;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: null
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        error: null
      });
      setLoading(false);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <PageContainer>
      <HeroSection>
        <PageTitle>İletişim</PageTitle>
        <Subtitle>
          Sorularınız, önerileriniz veya iş birliği talepleriniz için aşağıdaki 
          formu doldurabilir veya bizimle doğrudan iletişime geçebilirsiniz.
        </Subtitle>
        <Divider />
      </HeroSection>
      
      <ContentGrid>
        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>Bize Ulaşın</FormTitle>
          
          {formStatus.submitted && formStatus.success && (
            <SuccessMessage>
              Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.
            </SuccessMessage>
          )}
          
          {formStatus.submitted && formStatus.error && (
            <ErrorMessage>
              {formStatus.error}
            </ErrorMessage>
          )}
          
          <FormGroup>
            <Label htmlFor="name">Ad Soyad</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="subject">Konu</Label>
            <Input 
              type="text" 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">Mesajınız</Label>
            <TextArea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              required 
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </SubmitButton>
        </ContactForm>
        
        <ContactInfo>
          <InfoTitle>İletişim Bilgileri</InfoTitle>
          
          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
              Adres
            </InfoLabel>
            <InfoText>
              ULU CAMİ MAH. 389 SK. NO:2/18<br />
              AKHİSAR / MANİSA
            </InfoText>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              E-posta
            </InfoLabel>
            <InfoText>
              <InfoLink href="mailto:info@arazial.com">info@arazial.com</InfoLink>
            </InfoText>
          </InfoItem>
          
        </ContactInfo>
      </ContentGrid>
    </PageContainer>
  );
};

export default Contact; 