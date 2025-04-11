import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
`;

const PageSubtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const DocumentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

const ContentSection = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--color-text);
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.75rem;
  line-height: 1.6;
  color: var(--color-text);
`;

const Divider = styled.hr`
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid var(--color-border);
`;

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gizlilik Politikası</PageTitle>
        <PageSubtitle>
          KİŞİSEL VERİLERİN KORUNMASI HAKKINDA AYDINLATMA METNİ
        </PageSubtitle>
      </PageHeader>

      <DocumentMeta>
        <div>Yürürlülük Tarihi: 29/03/2025</div>
        <div>Son Güncelleme Tarihi: 29/03/2025</div>
      </DocumentMeta>

      <ContentSection>
        <Paragraph>
          Arazialcom Gayrimenkul Sanayi ve Ticaret Limited Şirketi ("Arazialcom" olarak anılacaktır) olarak, kullanıcılarımızın kişisel verilerinin güvenliğine önem veriyoruz.
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerin ne şekilde toplandığı, işlendiği ve korunduğuna dair bilgilendirme amacıyla hazırlanmıştır.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>1. Veri Sorumlusu</SectionTitle>
        <Paragraph>
          Veri Sorumlusu:
          Arazialcom Gayrimenkul Sanayi ve Ticaret Ltd. Şti.
          Adres: ULU CAMİİ MAH. 388 SK. NO:29/1B, AKHİSAR / MANİSA
          Vergi No: 0730982784
          E-posta: info@arazialcom.org
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>2. İşlenen Kişisel Veriler</SectionTitle>
        <Paragraph>
          Tarafımızca işlenebilecek kişisel veriler şunlardır:
        </Paragraph>

        <List>
          <ListItem>Ad, soyad</ListItem>
          <ListItem>Telefon numarası</ListItem>
          <ListItem>E-posta adresi</ListItem>
          <ListItem>IBAN ve ödeme dekontu (teminat işlemleri için)</ListItem>
          <ListItem>IP adresi, işlem zamanı, cihaz bilgileri</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>3. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebep</SectionTitle>
        <Paragraph>
          Veriler, web sitemiz, mobil uygulamamız veya iletişim kanallarımız aracılığıyla doğrudan kullanıcı tarafından sağlanır.
        </Paragraph>
        <Paragraph>
          Toplama amaçları:
        </Paragraph>

        <List>
          <ListItem>Teminat ödeme ve iade işlemlerini yürütmek</ListItem>
          <ListItem>Kullanıcı doğrulama ve destek hizmeti sunmak</ListItem>
          <ListItem>Yasal yükümlülükleri yerine getirmek</ListItem>
        </List>

        <Paragraph>
          Hukuki sebepler:
        </Paragraph>

        <List>
          <ListItem>KVKK md.5/2-c: Sözleşmenin ifası için gerekli olması</ListItem>
          <ListItem>KVKK md.5/2-f: Veri sorumlusunun meşru menfaati</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>4. Verilerin Aktarımı</SectionTitle>
        <Paragraph>
          Kişisel veriler, üçüncü kişilerle kesinlikle paylaşılmaz.
          Yalnızca yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına aktarılır.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>5. Saklama Süresi</SectionTitle>
        <Paragraph>
          Toplanan veriler, ilgili mevzuat gereğince ve hizmetin gerektirdiği süre boyunca saklanır.
          Teminat ve işlem bilgileri, vergi ve ticaret mevzuatı uyarınca 5 yıl süreyle muhafaza edilir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>6. KVKK Kapsamındaki Haklarınız</SectionTitle>
        <Paragraph>
          6698 sayılı Kanun'un 11. maddesi gereği, kullanıcılar aşağıdaki haklara sahiptir:
        </Paragraph>

        <List>
          <ListItem>Kişisel verisinin işlenip işlenmediğini öğrenme</ListItem>
          <ListItem>İşlenmişse buna ilişkin bilgi talep etme</ListItem>
          <ListItem>Amacına uygun kullanılıp kullanılmadığını öğrenme</ListItem>
          <ListItem>Hatalı ya da eksikse düzeltilmesini isteme</ListItem>
          <ListItem>İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde silinmesini talep etme</ListItem>
          <ListItem>Zarara uğranmışsa giderilmesini talep etme</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>7. Başvuru</SectionTitle>
        <Paragraph>
          KVKK kapsamındaki tüm taleplerinizi info@arazialcom.org adresine e-posta yoluyla iletebilirsiniz.
          Talepleriniz yasal süre içerisinde değerlendirilecek ve tarafınıza dönüş sağlanacaktır.
        </Paragraph>
      </ContentSection>
    </PageContainer>
  );
};

export default PrivacyPolicy; 