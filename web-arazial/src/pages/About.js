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
          Arazialcom Gayrimenkul Sanayi ve Ticaret Limited Şirketi, Türkiye genelinde tapulu taşınmazların dijital ortamda tanıtımını ve başvuru süreçlerini yönetmek amacıyla kurulmuş bir teknoloji platformudur.
        </Paragraph>
        
        <Paragraph>
          Amacımız; güvenilir, şeffaf ve kolay erişilebilir bir sistem ile gayrimenkul başvuru süreçlerini dijitalleştirerek, kullanıcıların zaman ve maliyet avantajı elde etmesini sağlamaktır.
        </Paragraph>

        <Paragraph>
          Arazialcom üzerinden yapılan işlemler satış amaçlı değil, yalnızca kullanıcıların ilgilendiği taşınmazlara katılım başvurusu yapabilmesini sağlamak amacı taşır. Bu kapsamda, her başvuru için teminat bedeli tahsil edilmekte olup, işlem gerçekleşmediği durumlarda teminat tutarı şartsız ve eksiksiz şekilde iade edilmektedir.
        </Paragraph>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Sistem Nasıl Çalışır?</SectionTitle>
        
        <Paragraph>
          Arazialcom'da taşınmaz başvuru süreci şu şekilde işlemektedir:
        </Paragraph>
        
        <NumberedList>
          <NumberedListItem>
            <strong>Taşınmaz İnceleme:</strong>
            <br />
            Platformda yer alan tapulu taşınmazların detaylarını, konumunu, özelliklerini ve diğer bilgilerini dijital ortamda inceleyebilirsiniz.
          </NumberedListItem>
          
          <NumberedListItem>
            <strong>Başvuru Yapma:</strong>
            <br />
            İlgilendiğiniz taşınmaza başvuru yapmak için teminat bedelini yatırarak başvuru sürecini başlatabilirsiniz.
          </NumberedListItem>
          
          <NumberedListItem>
            <strong>Başvuru Sonucu:</strong>
            <br />
            Başvurunuz değerlendirilir ve sonuç tarafınıza bildirilir. İşlem gerçekleşmediği durumlarda teminat tutarı şartsız ve eksiksiz şekilde iade edilir.
          </NumberedListItem>
        </NumberedList>
        
        <Paragraph>
          Tüm süreç dijital ortamda şeffaf bir şekilde yürütülür ve kullanıcıların zaman ve maliyet avantajı elde etmesi sağlanır.
        </Paragraph>
      </Section>
      
      <Divider />
      
      <Section>
        <SectionTitle>Neden Arazialcom?</SectionTitle>
        <List>
          <ListItem>Güvenilir ve şeffaf başvuru sistemi</ListItem>
          <ListItem>Teminat sistemiyle güvenli katılım</ListItem>
          <ListItem>Kullanıcı dostu, hızlı ve pratik arayüz</ListItem>
          <ListItem>İşlem gerçekleşmediğinde şartsız teminat iadesi</ListItem>
          <ListItem>Dijital ortamda tapulu taşınmaz tanıtımı ve başvuru süreci</ListItem>
        </List>
        
        <Paragraph style={{ marginTop: '2rem' }}>
          Arazialcom, modern teknolojiyle gayrimenkul başvuru süreçlerini daha güvenilir, daha hızlı ve daha erişilebilir hale getirmek için kurulmuştur.
        </Paragraph>
      </Section>
    </AboutContainer>
  );
};

export default About; 