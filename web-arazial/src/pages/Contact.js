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
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
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
  white-space: pre-line;
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
          Bizimle iletişime geçmek çok kolay. Sorularınız, önerileriniz veya iş birliği talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz.
        </Subtitle>
      </HeroSection>

      <ContentGrid>
        <ContactInfo>
          <InfoTitle>İletişim Bilgileri</InfoTitle>
          
          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Şirket Adı
            </InfoLabel>
            <InfoText>ARAZİALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ</InfoText>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Adres
            </InfoLabel>
            <InfoText>ULU CAMİİ MAH. 388 SK. NO:29/1B{"\n"}Akhisar / MANİSA</InfoText>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Telefon
            </InfoLabel>
            <InfoText>
              <InfoLink href="tel:+908502419157">+90 850 241 91 57</InfoLink>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              E-posta
            </InfoLabel>
            <InfoText>
              <InfoLink href="mailto:info@arazialcom.org">info@arazialcom.org</InfoLink>
            </InfoText>
          </InfoItem>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>Bize Ulaşın</FormTitle>
          
          {formStatus.submitted && formStatus.success && (
            <SuccessMessage>
              Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </SuccessMessage>
          )}
          
          {formStatus.submitted && !formStatus.success && (
            <ErrorMessage>
              {formStatus.error || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
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
            <Label htmlFor="email">E-posta</Label>
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
            <Label htmlFor="message">Mesaj</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            GÖNDER
          </Button>
        </ContactForm>
      </ContentGrid>
    </PageContainer>
  );
};

export default Contact; 