import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const FooterContainer = styled.footer`
  background: #1a1a1a;
  color: #fff;
  padding: 4rem 0 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FooterLogoSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const LogoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 160px;
  @media (max-width: 768px) {
    align-items: center;
    min-width: unset;
  }
`;

const ContactBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
  }
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-top: 0; /* Mobil için */

  @media (min-width: 768px) {
    margin-top: 5rem; /* Masaüstü için */
}

  img {
    height: 40px;
    width: auto;
  }

  &:hover {
    color: #4CAF50;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FooterDescription = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-top: 0.5rem;
`;

const FooterSections = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;

  @media (min-width: 769px) {
    cursor: default;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #4CAF50, transparent);
  }
`;

const ToggleIcon = styled.span`
  display: none;
  color: #4CAF50;
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }

  ${props => props.isOpen && `
    transform: rotate(180deg);
  `}
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    ${props => !props.isOpen && `
      display: none;
    `}
  }
`;

const FooterLink = styled(Link)`
  color: #a0a0a0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
  position: relative;
  width: fit-content;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #4CAF50;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #4CAF50;
    transform: translateX(5px);

    &::after {
      width: 100%;
    }
  }
`;

const FooterBottom = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
`;

const ContactInfo = styled.div`
  margin-top: 1.5rem;
`;

const CompanyName = styled.h4`
  font-weight: 600;
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 1rem;
    margin-top: 0.25rem;
    color: #4CAF50;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const Address = styled.div`
  color: #a0a0a0;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState({
    about: false,
    agreements: false,
    contact: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterLogoSection>
            <LogoBlock>
              <FooterLogo to="/">
                <img src={logoImage} alt="arazialcom logo" />
                <span>arazialcom</span>
              </FooterLogo>
            </LogoBlock>
            <ContactBlock>
              <ContactInfo>
                <CompanyName>ARAZİALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ</CompanyName>
                <ContactItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <Address>ULU CAMİİ MAH. 388 SK. NO:29/1B<br />AKHİSAR / MANİSA</Address>
                </ContactItem>
                <ContactItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p><a href="mailto:info@arazialcom.org" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>info@arazialcom.org</a></p>
                </ContactItem>
                <ContactItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p><a href="tel:+908502419157" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>+90 850 241 91 57</a></p>
                </ContactItem>
              </ContactInfo>
            </ContactBlock>
          </FooterLogoSection>

          <FooterSections>
            <FooterSection>
              <SectionHeader onClick={() => toggleSection('about')}>
                <SectionTitle>Hakkımızda</SectionTitle>
                <ToggleIcon isOpen={openSections.about}>▼</ToggleIcon>
              </SectionHeader>
              <SectionContent isOpen={openSections.about}>
                <FooterLink to="/about">Hakkımızda</FooterLink>
                <FooterLink to="/how-to-use">Nasıl Kullanılır?</FooterLink>
                <FooterLink to="/faq">Sıkça Sorulan Sorular</FooterLink>
              </SectionContent>
            </FooterSection>

            <FooterSection>
              <SectionHeader onClick={() => toggleSection('agreements')}>
                <SectionTitle>Sözleşmeler</SectionTitle>
                <ToggleIcon isOpen={openSections.agreements}>▼</ToggleIcon>
              </SectionHeader>
              <SectionContent isOpen={openSections.agreements}>
                <FooterLink to="/terms-of-use">Kullanım Koşulları</FooterLink>
                <FooterLink to="/cookie-policy">Çerez Politikası</FooterLink>
              </SectionContent>
            </FooterSection>

            <FooterSection>
              <SectionHeader onClick={() => toggleSection('contact')}>
                <SectionTitle>İletişim</SectionTitle>
                <ToggleIcon isOpen={openSections.contact}>▼</ToggleIcon>
              </SectionHeader>
              <SectionContent isOpen={openSections.contact}>
                <FooterLink to="/contact">Bize Ulaşın</FooterLink>
                <FooterLink to="/faq">Yardım</FooterLink>
              </SectionContent>
            </FooterSection>
          </FooterSections>
        </FooterTop>

        <FooterBottom>
          <p>© {currentYear} arazialcom. Tüm hakları saklıdır.</p>
          <LegalLinks>
            <FooterLink to="/privacy-policy">Gizlilik Politikası</FooterLink>
            <FooterLink to="/terms-of-use">Kullanım Koşulları</FooterLink>
            <FooterLink to="/cookie-policy">Çerez Politikası</FooterLink>
            <FooterLink to="/kvkk">KVKK</FooterLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;