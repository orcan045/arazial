import React from 'react';
import styled from 'styled-components';

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

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const SectionContent = styled.div`
  margin-bottom: 4rem;
`;

const TextBlock = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const TeamSection = styled.section`
  margin-bottom: 4rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TeamMember = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const TeamMemberImage = styled.div`
  height: 280px;
  background-color: var(--color-surface-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TeamMemberInfo = styled.div`
  padding: 1.5rem;
`;

const TeamMemberName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const TeamMemberRole = styled.p`
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-weight: 500;
`;

const TeamMemberBio = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const About = () => {
  return (
    <PageContainer>
      <HeroSection>
        <PageTitle>Hakkımızda</PageTitle>
        <Subtitle>
          Arazial, Türkiye'nin ilk dijital arazi ihale platformu olarak gayrimenkul sektöründe 
          şeffaflık ve erişilebilirlik sağlamayı amaçlayan yenilikçi bir girişimdir.
        </Subtitle>
        <Divider />
      </HeroSection>
      
      <SectionContent>
        <SectionTitle>Vizyonumuz</SectionTitle>
        <TextBlock>
          Arazial'da vizyonumuz, Türkiye'deki arazi ihalelerini dijitalleştirerek daha geniş bir kitleye ulaştırmak 
          ve ihale süreçlerini daha şeffaf, güvenli ve erişilebilir hale getirmektir. Gayrimenkul sektöründeki 
          geleneksel ve zaman alıcı ihale süreçlerinin yerini, modern teknolojileri kullanarak daha verimli ve 
          kullanıcı dostu bir platform sunuyoruz.
        </TextBlock>
        <TextBlock>
          Hedefimiz, coğrafi sınırlamaları ortadan kaldırarak, Türkiye'nin her yerindeki değerli arazilere erişimi 
          kolaylaştırmak ve arazi sahibi olmak isteyenler için fırsatları artırmaktır. Aynı zamanda, arazi 
          satıcılarına da daha geniş bir alıcı kitlesine ulaşma imkanı sağlayarak, adil piyasa değerlerine 
          ulaşmalarına yardımcı oluyoruz.
        </TextBlock>
      </SectionContent>
      
      <SectionContent>
        <SectionTitle>Misyonumuz</SectionTitle>
        <TextBlock>
          Misyonumuz, teknoloji ve inovasyonu kullanarak arazi ihale süreçlerini demokratikleştirmek ve 
          Türkiye'nin gayrimenkul sektöründe dijital dönüşümü hızlandırmaktır. Şeffaflık, güvenlik ve 
          kullanıcı deneyimi, platformumuzun temel değerlerini oluşturmaktadır.
        </TextBlock>
        <TextBlock>
          Arazial olarak, her bir ihalenin güvenli, adil ve verimli bir şekilde gerçekleşmesini sağlayarak, 
          hem alıcılara hem de satıcılara değer katmayı hedefliyoruz. Platformumuzun kullanımı kolay arayüzü 
          ve şeffaf ihale süreci sayesinde, gayrimenkul alım satımında yeni bir standart oluşturuyoruz.
        </TextBlock>
      </SectionContent>
      
      <TeamSection>
        <SectionTitle>Ekibimiz</SectionTitle>
        <TeamGrid>
          <TeamMember>
            <TeamMemberImage>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Ahmet Yılmaz" />
            </TeamMemberImage>
            <TeamMemberInfo>
              <TeamMemberName>Ahmet Yılmaz</TeamMemberName>
              <TeamMemberRole>Kurucu & CEO</TeamMemberRole>
              <TeamMemberBio>
                10 yılı aşkın gayrimenkul ve teknoloji deneyimiyle, Ahmet Bey Arazial'ın vizyonunu şekillendiriyor 
                ve şirketin stratejik gelişimini yönetiyor.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>
          
          <TeamMember>
            <TeamMemberImage>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80" alt="Zeynep Kaya" />
            </TeamMemberImage>
            <TeamMemberInfo>
              <TeamMemberName>Zeynep Kaya</TeamMemberName>
              <TeamMemberRole>Teknoloji Direktörü</TeamMemberRole>
              <TeamMemberBio>
                Yazılım mühendisliği alanındaki uzmanlığıyla Zeynep Hanım, platformun teknolojik altyapısını 
                geliştiriyor ve kullanıcı deneyimini en üst seviyeye çıkarıyor.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>
          
          <TeamMember>
            <TeamMemberImage>
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt="Mehmet Demir" />
            </TeamMemberImage>
            <TeamMemberInfo>
              <TeamMemberName>Mehmet Demir</TeamMemberName>
              <TeamMemberRole>Gayrimenkul Uzmanı</TeamMemberRole>
              <TeamMemberBio>
                Sektörde 15 yıllık tecrübesiyle Mehmet Bey, platform üzerindeki tüm arazi ihalelerinin değerlendirmesini 
                ve kalite kontrolünü sağlıyor.
              </TeamMemberBio>
            </TeamMemberInfo>
          </TeamMember>
        </TeamGrid>
      </TeamSection>
      
      <SectionContent>
        <SectionTitle>Değerlerimiz</SectionTitle>
        <TextBlock>
          <strong>Şeffaflık:</strong> Tüm ihale süreçlerinde şeffaflığı ve dürüstlüğü ön planda tutuyoruz. 
          Platformumuzda gerçekleşen her işlem kayıt altına alınıyor ve izlenebilir kılınıyor.
        </TextBlock>
        <TextBlock>
          <strong>Güvenlik:</strong> Kullanıcılarımızın verilerinin güvenliği ve ihale süreçlerinin güvenilirliği 
          en önemli önceliklerimiz arasında. En yüksek güvenlik standartlarını uyguluyoruz.
        </TextBlock>
        <TextBlock>
          <strong>Erişilebilirlik:</strong> Herkesin, her yerden arazi ihalelerine katılabilmesini sağlayarak, 
          fırsat eşitliği yaratıyoruz.
        </TextBlock>
        <TextBlock>
          <strong>Yenilikçilik:</strong> Sürekli olarak platformumuzu geliştiriyor ve gayrimenkul sektöründe 
          yenilikçi çözümler sunmaya devam ediyoruz.
        </TextBlock>
      </SectionContent>
    </PageContainer>
  );
};

export default About; 