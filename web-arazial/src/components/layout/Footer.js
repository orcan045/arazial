import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const FooterContainer = styled.footer`
  background: var(--color-surface);
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
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    background-color: var(--color-primary-dark);
  }
  
  svg {
    width: 20px;
    height: 20px;
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
            <h3>arazialcom</h3>
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
        
        <SocialLinks>
          <SocialLink href="https://whatsapp.com/channel/0029Va9O4lVATRSg84Ug8z01" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </SocialLink>
          <SocialLink href="https://www.instagram.com/arazialcomnet?igsh=MWF3amUwMjIwcWs3Yw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </SocialLink>
          <SocialLink href="https://www.facebook.com/share/15QZDkWGjP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </SocialLink>
        </SocialLinks>
        
        <FooterBottom>
          <CopyrightText>
            © {currentYear} <Link to="/">arazialcom</Link>. Tüm hakları saklıdır.
          </CopyrightText>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;