import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const FooterContainer = styled.footer`
  background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%);
  color: var(--color-text-secondary);
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
    background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.05) 50%, transparent 100%);
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 1.25rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
    font-size: 0.875rem;

    &:hover {
      color: var(--color-text);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const FooterColumnTitle = styled.h3`
  color: var(--color-text);
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
    background: linear-gradient(90deg, var(--color-primary) 0%, rgba(15, 52, 96, 0.5) 100%);
  }
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
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
    color: var(--color-text);
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
  color: var(--color-text-secondary);
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: var(--color-text-secondary);
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
      background-color: var(--color-primary);
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: var(--color-text);
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
          <FooterSection>
            <h3>Arazialcom</h3>
            <ul>
              <li>
                <Link to="/about">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/contact">İletişim</Link>
              </li>
              <li>
                <Link to="/sss">Sıkça Sorulan Sorular</Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Sözleşmeler</h3>
            <ul>
              <li>
                <Link to="/terms-of-use">Kullanım Koşulları</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link to="/cookies">Çerez Politikası</Link>
              </li>
              <li>
                <Link to="/legal">Yasal Bildirimler</Link>
              </li>
              <li>
                <Link to="/security">Güvenlik</Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>İletişim</h3>
            <ContactInfo>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>ULU CAMİİ MAH. 388 SK. NO:29/1B<br />AKHİSAR / MANİSA</p>
              </ContactItem>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>info@arazialcom.org</p>
              </ContactItem>
              <ContactItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p>+90 850 241 91 57</p>
              </ContactItem>
            </ContactInfo>
          </FooterSection>
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
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;