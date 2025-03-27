import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/ui/Button';

const HeroSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(67, 56, 202, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80') center/cover no-repeat;
  background-attachment: scroll;
  color: white;
  min-height: 90vh;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 80px;
    background-color: white;
    clip-path: polygon(0 50%, 100% 0, 100% 100%, 0% 100%);
  }
  
  @media (min-width: 768px) {
    padding-top: 10rem;
    padding-bottom: 12rem;
  }
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const HeroButton = styled(Button)`
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
  
  &.secondary-on-purple {
    background-color: white;
    color: var(--color-primary);
    border: none;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.9);
      color: var(--color-primary-dark);
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ScrollText = styled.span`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const ScrollIcon = styled.div`
  width: 30px;
  height: 50px;
  border: 2px solid white;
  border-radius: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
    transform: translateX(-50%);
    animation: scroll 2s infinite;
  }
  
  @keyframes scroll {
    0% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background-color: white;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 2rem;
  background-color: var(--color-surface-secondary);
`;

const StepsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const StepItem = styled.div`
  display: flex;
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  opacity: 0.9;
`;

const CTAButtonWrapper = styled.div`
  margin-top: 2rem;
`;

const CTAButton = styled(Button)`
  background-color: white;
  color: var(--color-primary);
  border: none;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--color-primary-dark);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const LandingPage = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      window.scrollTo({
        top: featuresSection.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Arazi İhalelerinde Dijital Dönüşüm</HeroTitle>
          <HeroSubtitle>
            Arazial ile zaman ve mekan sınırlaması olmadan, şeffaf ve güvenilir bir şekilde arazi ihalelerine katılın. Dijital platformumuz ile ihale süreçlerini yeniden tanımlıyoruz.
          </HeroSubtitle>
          <ButtonGroup>
            <HeroButton as={Link} to="/login" className="secondary-on-purple">Giriş Yap</HeroButton>
            <HeroButton as={Link} to="/signup">Hemen Ücretsiz Deneyin</HeroButton>
          </ButtonGroup>
        </HeroContent>
        
        <ScrollIndicator onClick={scrollToFeatures}>
          <ScrollText>Daha Fazla Keşfet</ScrollText>
          <ScrollIcon />
        </ScrollIndicator>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>Neden Arazial?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Her Yerden Erişim</FeatureTitle>
            <FeatureDescription>
              İnternet bağlantısı olan her yerden ihalelere katılın ve tekliflerinizi verin. Fiziksel olarak ihalenin yapıldığı lokasyonda bulunmanıza gerek yok.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Güvenli ve Şeffaf</FeatureTitle>
            <FeatureDescription>
              Tüm teklifler şifrelenmiş ve güvenli bir şekilde saklanır. İhale süreçleri tamamen şeffaf olarak yönetilir ve denetlenebilir.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Zaman Tasarrufu</FeatureTitle>
            <FeatureDescription>
              Fiziksel ihalelerde harcanan zaman ve kaynaklar minimuma iner. İşlemler otomatik olarak sistem tarafından yürütülür.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Maliyet Avantajı</FeatureTitle>
            <FeatureDescription>
              Fiziksel ihalelerin getirdiği mekan, personel ve organizasyon maliyetlerinden tasarruf edin. Daha ekonomik bir ihale süreci yönetin.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Detaylı Raporlama</FeatureTitle>
            <FeatureDescription>
              İhale süreçleriyle ilgili detaylı raporlar ve analizler elde edin. Verilerle desteklenmiş kararlar alın.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Geniş Katılım</FeatureTitle>
            <FeatureDescription>
              Coğrafi sınırlamalar olmadan daha fazla katılımcıya ulaşın. Rekabet arttıkça, ihalenin getirisi de artar.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <HowItWorksSection>
        <SectionTitle>Nasıl Çalışır?</SectionTitle>
        <StepsContainer>
          <StepItem>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Hesap Oluşturun</StepTitle>
              <StepDescription>
                Hızlı ve kolay bir şekilde hesap oluşturun. Kimlik doğrulama işlemlerini tamamlayın.
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>İhaleleri Keşfedin</StepTitle>
              <StepDescription>
                Aktif ve yaklaşan ihaleleri görüntüleyin. Arazi detaylarını, ihale şartlarını ve zamanlamasını inceleyin.
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>Teklif Verin</StepTitle>
              <StepDescription>
                İlgilendiğiniz ihaleye katılın ve teklifinizi verin. İhale süresince teklifinizi güncelleyebilirsiniz.
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>İhaleyi Kazanın</StepTitle>
              <StepDescription>
                En yüksek teklifi vererek ihaleyi kazandığınızda, sistem sizi otomatik olarak bilgilendirir ve sonraki adımlar hakkında yönlendirir.
              </StepDescription>
            </StepContent>
          </StepItem>
        </StepsContainer>
      </HowItWorksSection>

      <CTASection>
        <CTATitle>Hemen Başlayın</CTATitle>
        <CTAText>
          Arazial ile arazi ihalelerine katılmanın kolaylığını deneyimleyin. Şimdi kayıt olun ve fırsatları kaçırmayın.
        </CTAText>
        <CTAButtonWrapper>
          <CTAButton as={Link} to="/signup">Ücretsiz Kayıt Ol</CTAButton>
        </CTAButtonWrapper>
      </CTASection>
    </>
  );
};

export default LandingPage;