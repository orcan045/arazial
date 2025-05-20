import React from 'react';
import styled from 'styled-components';

// Basic styling, can be enhanced later or use existing styled components if available
const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #333;
  line-height: 1.8;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const PageHeader = styled.header`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 2rem 0;
`;

const ContentSection = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.6rem;
  color: #34495e;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
  text-align: justify;

  strong {
    color: #2c3e50;
  }
`;

const List = styled.ul`
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const KvkkAydinlatmaMetniPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>KİŞİSEL VERİLERİN KORUNMASI HAKKINDA AYDINLATMA METNİ</PageTitle>
      </PageHeader>

      <Paragraph>
        İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla arazialcom.net tarafından kişisel verilerinizin işlenme usul ve esaslarını açıklamak amacıyla hazırlanmıştır.
      </Paragraph>

      <Divider />

      <ContentSection>
        <SectionTitle>1. Veri Sorumlusu</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, veri sorumlusu sıfatıyla arazialcom.net tarafından KVKK'ya uygun şekilde işlenmektedir.
          İletişim: info@arazialcom.org
        </Paragraph>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>2. İşlenen Kişisel Veriler</SectionTitle>
        <Paragraph>
          Kimlik ve iletişim bilgileriniz (ad, soyad, e-posta, telefon), IP adresi, işlem geçmişi, ödeme bilgileri, teklif ve üyelik verileri gibi kişisel verileriniz işlenmektedir.
        </Paragraph>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>3. Kişisel Verilerin İşlenme Amaçları</SectionTitle>
        <Paragraph>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</Paragraph>
        <List>
          <ListItem>Üyelik ve kullanıcı işlemlerinin yürütülmesi</ListItem>
          <ListItem>Açık artırma ve ilan hizmetlerinin sağlanması</ListItem>
          <ListItem>Teminat ödeme süreçlerinin yönetilmesi</ListItem>
          <ListItem>Müşteri ilişkileri ve bilgilendirme faaliyetleri</ListItem>
          <ListItem>İlgili mevzuattan doğan yasal yükümlülüklerin yerine getirilmesi</ListItem>
        </List>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>4. Hukuki Sebepler</SectionTitle>
        <Paragraph>Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen:</Paragraph>
        <List>
          <ListItem>Sözleşmenin kurulması ve ifası</ListItem>
          <ListItem>Bir hakkın tesisi, kullanılması veya korunması</ListItem>
          <ListItem>Kanuni yükümlülüklerin yerine getirilmesi</ListItem>
          <ListItem>Açık rızaya dayalı olarak</ListItem>
        </List>
        <Paragraph>hukuki sebeplerle işlenmektedir.</Paragraph>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>5. Aktarım Bilgisi</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, yalnızca yasal zorunluluk hâlinde veya hizmetin ifası için gerekli durumlarda; yetkili kamu kurumları, ödeme kuruluşları ve hizmet alınan iş ortaklarına aktarılabilir.
        </Paragraph>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>6. Saklama Süresi</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, mevzuatta belirtilen süreler kadar veya işleme amacı ortadan kalkana kadar saklanmakta, ardından silinmekte, yok edilmekte ya da anonimleştirilmektedir.
        </Paragraph>
      </ContentSection>
      
      <Divider />

      <ContentSection>
        <SectionTitle>7. KVKK Kapsamındaki Haklarınız</SectionTitle>
        <Paragraph>KVKK'nın 11. maddesi uyarınca;</Paragraph>
        <List>
          <ListItem>Kişisel verilerinizin işlenip işlenmediğini öğrenme</ListItem>
          <ListItem>İşlenmişse buna ilişkin bilgi talep etme</ListItem>
          <ListItem>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</ListItem>
          <ListItem>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</ListItem>
          <ListItem>Eksik veya yanlış işlenmişse düzeltilmesini isteme</ListItem>
          <ListItem>KVKK'ya aykırı işlenmişse silinmesini veya yok edilmesini isteme</ListItem>
          <ListItem>Bu işlemlerin üçüncü kişilere bildirilmesini isteme</ListItem>
          <ListItem>İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</ListItem>
          <ListItem>Zarara uğramanız hâlinde tazminat talep etme hakkınız vardır.</ListItem>
        </List>
      </ContentSection>

      <Divider />

      <ContentSection>
        <SectionTitle>8. Başvuru Yolu</SectionTitle>
      <Paragraph>
          Bu haklarınıza ilişkin taleplerinizi info@arazialcom.org adresine iletebilirsiniz.
      </Paragraph>
      </ContentSection>
    </PageContainer>
  );
};

export default KvkkAydinlatmaMetniPage; 