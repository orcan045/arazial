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

const Emphasis = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
  font-weight: 600;
`;

const Divider = styled.hr`
  margin: 1.5rem 0;
  border: 0;
  border-top: 1px solid var(--color-border);
`;

const TermsOfUse = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Kullanım Koşulları</PageTitle>
        <PageSubtitle>
          MESAFELİ HİZMET SÖZLEŞMESİ
        </PageSubtitle>
      </PageHeader>

      <DocumentMeta>
        <div>Yürürlülük Tarihi: 29/03/2025</div>
        <div>Son Güncelleme Tarihi: 29/03/2025</div>
      </DocumentMeta>

      <Emphasis>
        LÜTFEN BU KULLANIM KOŞULLARINI DİKKATLİCE OKUYUNUZ. BU UYGULAMAYI KULLANARAK, AŞAĞIDAKİ ŞART VE KOŞULLARI KABUL ETMİŞ SAYILIRSINIZ.
      </Emphasis>

      <ContentSection>
        <SectionTitle>1. Taraflar</SectionTitle>
        <Paragraph>
          İşbu Mesafeli Hizmet Sözleşmesi, bir tarafta arazialcom Gayrimenkul Sanayi ve Ticaret Limited Şirketi ("Hizmet Sağlayıcı" olarak anılacaktır), diğer tarafta platforma üye olan ve teminat ödemesi gerçekleştiren kullanıcı ("Hizmet Alan" olarak anılacaktır) arasında, aşağıdaki şartlar çerçevesinde elektronik ortamda kurulmuştur.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>2. Konu</SectionTitle>
        <Paragraph>
          İşbu sözleşme, Hizmet Alan'ın arazialcom platformunda yayınlanan taşınmazlara katılım teminatı ödeyerek başvuru hakkı kazanması sürecine ilişkin şartları düzenler.
        </Paragraph>
        <Paragraph>
          Bu sözleşme herhangi bir taşınmazın satışı değil, yalnızca başvuru ve teklif sürecine katılım hizmeti sunulmasına ilişkindir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>3. Hizmetin Kapsamı</SectionTitle>
        <List>
          <ListItem>Hizmet Alan, ilanda belirtilen teminat tutarını ödeyerek ilgili taşınmaza teklif verme hakkı elde eder.</ListItem>
          <ListItem>Teminat ödemesi yapılmadan teklif verilemez.</ListItem>
          <ListItem>Bu süreçte arazialcom yalnızca dijital altyapı sağlar, doğrudan satış gerçekleştirmez.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>4. Teminat ve İade Koşulları</SectionTitle>
        <List>
          <ListItem>Teminat ödemesi, başvurulan taşınmaza katılım amacıyla tahsil edilir.</ListItem>
          <ListItem>Satın alma gerçekleşmezse, teminat bedeli 7 (yedi) iş günü içinde iade edilir.</ListItem>
          <ListItem>Kazanım sağlanırsa, teminat bedeli satış bedelinden düşülür.</ListItem>
          <ListItem>Hatalı IBAN, alıcı bilgisi gibi kullanıcıdan kaynaklı sorunlarda gecikmelerden Hizmet Sağlayıcı sorumlu değildir.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>5. Cayma Hakkı</SectionTitle>
        <List>
          <ListItem>Kullanıcı, teminat ödemesini yaptıktan sonra taşınmaza teklif vermemişse, 14 gün içinde cayma hakkını kullanabilir.</ListItem>
          <ListItem>Bu durumda teminat, kullanıcıya iade edilir.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>6. Sözleşmenin Süresi</SectionTitle>
        <Paragraph>
          Bu sözleşme, teminat ödemesiyle birlikte elektronik ortamda yürürlüğe girer ve ilgili başvuru süreci sona erdiğinde veya iade yapıldığında kendiliğinden sona erer.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>7. Uyuşmazlıkların Çözümü</SectionTitle>
        <Paragraph>
          Taraflar arasında doğabilecek uyuşmazlıklar öncelikle uzlaşma yoluyla çözülmeye çalışılır.
          Çözülemeyen durumlarda, Manisa Akhisar Mahkemeleri ve İcra Daireleri yetkilidir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>8. İletişim Bilgileri</SectionTitle>
        <Paragraph>
          arazialcom Gayrimenkul Sanayi ve Ticaret Ltd. Şti.
          <br />
          Adres: ULU CAMİİ MAH. 388 SK. NO:29/1B, AKHİSAR / MANİSA
          <br />
          Vergi No: 0730982784
          <br />
          E-posta: info@arazialcom.org
        </Paragraph>
      </ContentSection>
    </PageContainer>
  );
};

export default TermsOfUse; 