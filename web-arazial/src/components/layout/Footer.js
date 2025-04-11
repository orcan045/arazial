import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const FooterContainer = styled.footer`
  background: linear-gradient(to bottom, var(--color-primary-dark) 0%, #041124 100%);
  color: rgba(255, 255, 255, 0.8);
  padding: 5rem 0 2rem;
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%);
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (min-width: 1024px) {
    padding: 0 3rem;
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;
  margin-bottom: 4rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 4rem;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const FooterColumnTitle = styled.h3`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-gold) 0%, rgba(212, 175, 55, 0.5) 100%);
  }
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.25rem;
  text-decoration: none;
  
  img {
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.75rem;
  }
  
  span {
    color: white;
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 359px) {
    span {
      display: none;
    }
  }
`;

const FooterDescription = styled.p`
  margin-bottom: 2rem;
  line-height: 1.7;
  max-width: 400px;
  color: rgba(255, 255, 255, 0.7);
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    padding-left: 0;
    display: inline-block;
    
    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: var(--color-gold);
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: white;
      padding-left: 5px;
      
      &::before {
        width: 100%;
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-gold);
    transform: translateY(-3px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ContactInfo = styled.div`
  margin-top: 1.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.75rem;
    margin-top: 3px;
    color: var(--color-gold);
  }
  
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  
  a {
    color: var(--color-gold);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LegalLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  
  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.875rem;
    
    &:hover {
      color: var(--color-gold);
    }
  }
`;

const Newsletter = styled.div`
  margin-top: 1.5rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  
  input {
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-md);
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    margin-bottom: 0.75rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  button {
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-md);
    border: none;
    background: linear-gradient(90deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  img {
    height: 24px;
    opacity: 0.6;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  margin: 3rem 0;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <div>
            <FooterLogo to="/">
              <img src={logoImage} alt="Arazialcom Logo" />
              <span>Arazialcom</span>
            </FooterLogo>
            
            <FooterDescription>
              Türkiye'nin en güvenilir arazi yatırım platformu. En değerli yatırım fırsatlarını sizlere sunarak, geleceğinizi şekillendirmeye yardımcı oluyoruz.
            </FooterDescription>
            
            <SocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </SocialLink>
            </SocialLinks>
          </div>
          
          <div>
            <FooterColumnTitle>Bilgi</FooterColumnTitle>
            <FooterLinks>
              <FooterLink>
                <Link to="/about">Hakkımızda</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/contact">İletişim</Link>
              </FooterLink>
              <FooterLink>
                <Link to="/faq">Sık Sorulan Sorular</Link>
              </FooterLink>
            </FooterLinks>
          </div>
          
          <div>
            <FooterColumnTitle>İletişim</FooterColumnTitle>
            <ContactInfo>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>ULU CAMİ MAH. 389 SK. NO:2/18<br />AKHİSAR / MANİSA</p>
              </ContactItem>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>info@arazialcom.com</p>
              </ContactItem>
            </ContactInfo>
            
            <Newsletter>
              <p>Yeni fırsatlardan haberdar olun:</p>
              <NewsletterForm>
                <input type="email" placeholder="E-posta adresiniz" required />
                <button type="submit">Abone Ol</button>
              </NewsletterForm>
            </Newsletter>
          </div>
        </FooterTop>
        
        <Divider />
        
        <PaymentMethods>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
        </PaymentMethods>
        
        <FooterBottom>
          <CopyrightText>
            © {currentYear} <Link to="/">Arazialcom</Link>. Tüm hakları saklıdır.
          </CopyrightText>
          <LegalLinks>
            <Link to="/terms">Kullanım Koşulları</Link>
            <Link to="/privacy">Gizlilik Politikası</Link>
            <Link to="/cookies">Çerez Politikası</Link>
            <Link to="/legal">Yasal Bildirimler</Link>
            <Link to="/security">Güvenlik</Link>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;