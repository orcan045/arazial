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

const About = () => {
  return (
    <PageContainer>
      <HeroSection>
        <PageTitle>Hakkımızda</PageTitle>
        <Subtitle>
          Arazialcom, Türkiye'nin ilk dijital arazi ihale platformu olarak gayrimenkul sektöründe 
          şeffaflık ve erişilebilirlik sağlamayı amaçlayan yenilikçi bir girişimdir.
        </Subtitle>
        <Divider />
      </HeroSection>
      
      <SectionContent>
        <SectionTitle>Vizyonumuz</SectionTitle>
        <TextBlock>
          Arazialcom'da vizyonumuz, Türkiye'deki arazi ihalelerini dijitalleştirerek daha geniş bir kitleye ulaştırmak 
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
          Arazialcom olarak, her bir ihalenin güvenli, adil ve verimli bir şekilde gerçekleşmesini sağlayarak, 
          hem alıcılara hem de satıcılara değer katmayı hedefliyoruz. Platformumuzun kullanımı kolay arayüzü 
          ve şeffaf ihale süreci sayesinde, gayrimenkul alım satımında yeni bir standart oluşturuyoruz.
        </TextBlock>
      </SectionContent>
      
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