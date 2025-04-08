import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  
  @media (min-width: 768px) {
    padding: 5rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-surface-secondary);
  margin: 3rem 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  display: flex;
  align-items: baseline;
  
  &:before {
    content: "•";
    color: var(--color-primary);
    font-weight: bold;
    margin-right: 0.75rem;
  }
`;

const NumberedList = styled.ol`
  padding-left: 1.25rem;
  margin: 1.5rem 0;
`;

const NumberedListItem = styled.li`
  color: var(--color-text-secondary);
  line-height: 1.75;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  padding-left: 0.5rem;
  
  &::marker {
    color: var(--color-primary);
    font-weight: 600;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>Hakkımızda</Title>
      
      <Section>
        <Paragraph>
          Arazialcom, arsaların ve arazilerin açık artırma yöntemiyle satışa sunulduğu modern bir dijital ihale platformudur. Türkiye'nin dört bir yanındaki araziler, güvenli ve şeffaf bir ortamda yatırımcılarla buluşur.
        </Paragraph>
        
        <Paragraph>
          Amacımız; kullanıcıların kolayca katılabileceği, güvenle teklif verebileceği ve yasal sürecin eksiksiz tamamlandığı bir sistem sunmaktır. Tüm işlemler online ortamda gerçekleştirilir ve satış, resmi tapu devri ile tamamlanır.
        </Paragraph>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Sistem Nasıl Çalışır?</SectionTitle>
        
        <Paragraph>
          Arazialcom'da iki farklı satış türü bulunmaktadır:
        </Paragraph>
        
        <NumberedList>
          <NumberedListItem>
            <strong>Teklif Toplama (Açık Artırma) Süreci:</strong>
            <br />
            Belirlenen başlangıç ve bitiş süresi boyunca kullanıcılar, araziye teminat yatırarak teklif verebilir. En yüksek teklifi veren kişi ihalenin sonunda araziyi satın alma hakkı kazanır.
          </NumberedListItem>
          
          <NumberedListItem>
            <strong>Doğrudan Satış (Sabit Fiyatlı Satış):</strong>
            <br />
            Bazı araziler sabit fiyatla satışa sunulur. Teminat yatırarak bu arazilere de başvuru yapılabilir. İlk başvuru yapan kullanıcı, belirtilen süre içinde işlemleri tamamlarsa satın alma hakkını elde eder.
          </NumberedListItem>
        </NumberedList>
        
        <Paragraph>
          Her iki satış türünde de süreç teminatla başlar ve kazanan kişiyle birlikte tapu devri işlemleri başlatılır. Tapu devri, ilgili tapu müdürlüğünde yasal olarak gerçekleştirilir.
        </Paragraph>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Neden Arazialcom?</SectionTitle>
        <List>
          <ListItem>Açık ve şeffaf satış modeli</ListItem>
          <ListItem>Teminat sistemiyle güvenli ihale katılımı</ListItem>
          <ListItem>Kullanıcı dostu, hızlı ve pratik arayüz</ListItem>
          <ListItem>İhaleyi kazanamayanlara teminat iadesi garantisi</ListItem>
          <ListItem>Satışlar tapu müdürlüğünde resmi olarak tamamlanır</ListItem>
        </List>
        
        <Paragraph style={{ marginTop: '2rem' }}>
          Arazialcom, modern teknolojiyle arazi yatırım süreçlerini daha adil, daha hızlı ve daha erişilebilir hale getirmek için kurulmuştur.
        </Paragraph>
      </Section>
    </AboutContainer>
  );
};

export default About; 