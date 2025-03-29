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

const TermsOfUse = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Kullanım Koşulları</PageTitle>
        <PageSubtitle>
          ARAZIALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ MOBİL UYGULAMA KULLANIM KOŞULLARI
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
        <SectionTitle>1. Taraflar ve Kabul</SectionTitle>
        <Paragraph>
          İşbu Kullanım Koşulları ("Koşullar"), bir tarafta ULU CAMİ MAH. 389 SK. NO:2/18 AKHİSAR / MANİSA adresinde mukim ARAZIALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ ("ARAZIALCOM" veya "Şirket") ile diğer tarafta Şirket tarafından sunulan mobil uygulamayı ("Uygulama") kullanan gerçek veya tüzel kişi ("Kullanıcı") arasındaki hukuki ilişkiyi düzenlemektedir.
        </Paragraph>
        <Paragraph>
          Uygulama'yı indirerek, yükleyerek, erişerek veya kullanarak, işbu Koşulları ve ayrılmaz bir parçası olan Gizlilik Politikası'nı okuduğunuzu, anladığınızı ve yasal olarak bağlı olduğunuzu kabul etmiş olursunuz. Bu Koşulları kabul etmiyorsanız, Uygulama'yı kullanmamalısınız.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>2. Tanımlar</SectionTitle>
        <Paragraph>Bu Koşullarda geçen;</Paragraph>

        <List>
          <ListItem>
            <strong>Şirket/ARAZIALCOM:</strong> ARAZIALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ'ni,
          </ListItem>
          <ListItem>
            <strong>Uygulama:</strong> ARAZIALCOM tarafından geliştirilen ve işletilen, arsa ve arazi gibi gayrimenkullerin online ihale (açık artırma) yöntemiyle alım satımına aracılık eden mobil platformu,
          </ListItem>
          <ListItem>
            <strong>Kullanıcı:</strong> Uygulama'ya üye olan ve/veya Uygulama üzerinden sunulan Hizmetlerden faydalanan her türlü gerçek veya tüzel kişiyi (Alıcı, Satıcı veya her ikisi),
          </ListItem>
          <ListItem>
            <strong>Hizmetler:</strong> Uygulama aracılığıyla Kullanıcılara sunulan, gayrimenkul ilanı verme, ihale düzenleme, teklif verme, alıcı ve satıcıyı buluşturma ve ilgili diğer platform hizmetlerini,
          </ListItem>
          <ListItem>
            <strong>İhale:</strong> Satıcı tarafından belirlenen koşullar çerçevesinde, bir gayrimenkulün Uygulama üzerinden teklif alma suretiyle satışa sunulduğu süreci,
          </ListItem>
          <ListItem>
            <strong>Teklif:</strong> Bir Kullanıcının (Alıcı Adayı) bir İhale'deki gayrimenkulü belirli bir bedel karşılığında satın alma yönündeki bağlayıcı irade beyanını,
          </ListItem>
          <ListItem>
            <strong>Satıcı:</strong> Uygulama üzerinden gayrimenkulünü (arsa, arazi vb.) İhale yoluyla satışa sunan Kullanıcıyı,
          </ListItem>
          <ListItem>
            <strong>Alıcı:</strong> Bir İhale'de en yüksek geçerli Teklifi vererek gayrimenkulü satın alma hakkını kazanan Kullanıcıyı,
          </ListItem>
          <ListItem>
            <strong>İçerik:</strong> Uygulama'da yer alan her türlü metin, grafik, kullanıcı arayüzü, görsel arayüz, fotoğraf, ticari marka, logo, ses, müzik, yazılım ve bilgisayar kodu dahil ancak bunlarla sınırlı olmamak üzere tüm materyalleri,
          </ListItem>
          <ListItem>
            <strong>Gizlilik Politikası:</strong> Uygulama kullanımı sırasında toplanan kişisel verilerin işlenmesine ilişkin esasları belirleyen ve işbu Koşulların ayrılmaz bir parçası olan politikayı,
          </ListItem>
          <ListItem>
            <strong>KVKK:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu'nu, ifade eder.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>3. Hizmetlerin Açıklaması ve Kapsamı</SectionTitle>
        <List>
          <ListItem>
            ARAZIALCOM, Kullanıcıların (Satıcıların) sahip oldukları arsa ve arazileri Uygulama üzerinden online ihale yöntemiyle satışa sunmalarına ve diğer Kullanıcıların (Alıcıların) bu ihalelere katılarak teklif vermelerine olanak tanıyan bir platform (aracı hizmet sağlayıcı) sunmaktadır.
          </ListItem>
          <ListItem>
            ARAZIALCOM, kural olarak satışa sunulan gayrimenkullerin sahibi değildir. Şirket, Alıcı ve Satıcı arasındaki alım-satım işleminin tarafı olmayıp, yalnızca bu işlemin gerçekleştirilebileceği dijital ortamı sağlar. Taraflar arasındaki gayrimenkul satış sözleşmesi ve ilgili tüm yasal süreçler (tapu devri vb.) Alıcı ve Satıcı'nın kendi sorumluluğundadır.
          </ListItem>
          <ListItem>
            ARAZIALCOM, listelenen gayrimenkullerin mülkiyeti, durumu, imar durumu, hukuki durumu, değeri veya Satıcı tarafından sağlanan bilgilerin doğruluğu konusunda herhangi bir garanti vermez. Alıcılar, teklif vermeden önce ilgili gayrimenkul hakkında gerekli tüm araştırmayı (due diligence) yapmakla bizzat yükümlüdür.
          </ListItem>
          <ListItem>
            Hizmetlerin kapsamı ve Uygulama'nın özellikleri ARAZIALCOM tarafından tek taraflı olarak değiştirilebilir, genişletilebilir veya daraltılabilir.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>4. Kullanıcı Hesabı ve Üyelik</SectionTitle>
        <List>
          <ListItem>
            Uygulama'nın belirli özelliklerinden (örn. teklif verme, ihale başlatma) faydalanmak için Kullanıcıların bir hesap oluşturması gerekmektedir.
          </ListItem>
          <ListItem>
            Kullanıcı, hesap oluşturma sırasında doğru, güncel ve eksiksiz bilgi sağlamayı kabul ve taahhüt eder. Sağlanan bilgilerin yanlış veya eksik olmasından doğacak tüm sorumluluk Kullanıcıya aittir.
          </ListItem>
          <ListItem>
            Kullanıcılar, hesap bilgilerini (kullanıcı adı, şifre vb.) gizli tutmakla ve hesaplarının güvenliğini sağlamakla yükümlüdür. Hesapları üzerinden gerçekleştirilen tüm işlemlerden Kullanıcılar sorumludur. Hesap güvenliğinin ihlal edildiğinden şüphelenilmesi durumunda derhal ARAZIALCOM'a bildirimde bulunulmalıdır.
          </ListItem>
          <ListItem>
            Kullanıcılar, 18 yaşından büyük ve fiil ehliyetine sahip olmalıdır. Tüzel kişiler adına hesap oluşturanlar, ilgili tüzel kişiyi temsil etmeye yetkili olduklarını beyan ve taahhüt ederler.
          </ListItem>
          <ListItem>
            ARAZIALCOM, gerekli gördüğü durumlarda Kullanıcılardan kimlik veya yetki doğrulama amacıyla ek bilgi ve belge talep etme hakkını saklı tutar.
          </ListItem>
          <ListItem>
            Her Kullanıcı yalnızca bir hesaba sahip olabilir. Birden fazla hesap açılması veya hesap devri yasaktır.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>5. Kullanım Kuralları ve Kullanıcı Yükümlülükleri</SectionTitle>
        <Paragraph>
          Kullanıcılar, Uygulama'yı kullanırken aşağıdaki kurallara uymayı kabul ve taahhüt ederler:
        </Paragraph>

        <List>
          <ListItem>Uygulama'yı yalnızca yasalara uygun amaçlarla kullanmak.</ListItem>
          <ListItem>Yanlış, yanıltıcı, eksik veya güncel olmayan bilgiler vermemek.</ListItem>
          <ListItem>Başkası adına veya sahte kimlikle hesap oluşturmamak, işlem yapmamak.</ListItem>
          <ListItem>Uygulama'nın işleyişine müdahale etmemek, güvenlik sistemlerini aşmaya çalışmamak, virüs veya zararlı kod bulaştırmamak.</ListItem>
          <ListItem>Diğer Kullanıcıların haklarını ihlal etmemek, taciz edici, tehditkar, karalayıcı veya rahatsız edici davranışlarda bulunmamak.</ListItem>
          <ListItem>ARAZIALCOM'un veya üçüncü tarafların fikri mülkiyet haklarını (telif hakkı, marka vb.) ihlal etmemek.</ListItem>
          <ListItem>İhale süreçlerini manipüle etmeye yönelik davranışlarda bulunmamak (örn. sahte teklifler vermek, Satıcı ile anlaşarak fiyatı yapay olarak artırmak).</ListItem>
          <ListItem>Uygulama aracılığıyla elde edilen bilgileri, ARAZIALCOM'un yazılı izni olmaksızın ticari veya başka amaçlarla kullanmamak, kopyalamamak, dağıtmamak.</ListItem>
          <ListItem>Özellikle Alıcılar, ilgilendikleri gayrimenkullerle ilgili tüm hukuki, teknik ve fiili durumu (imar, tapu kaydı, vergi borcu, ipotek, haciz, fiili kullanım durumu vb.) teklif vermeden önce kendi imkanlarıyla araştırmak ve doğrulamakla yükümlüdür.</ListItem>
          <ListItem>Satıcılar, satışa sundukları gayrimenkuller hakkında doğru ve eksiksiz bilgi vermekle, gayrimenkulün satışına engel teşkil edecek hukuki veya fiili bir durum varsa bunu açıkça belirtmekle yükümlüdür.</ListItem>
          <ListItem>İlgili tüm vergi (KDV, tapu harcı vb.) ve yasal yükümlülüklere uymak.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>6. İhale Süreci, Teklif Verme ve Satın Alma</SectionTitle>
        <List>
          <ListItem>
            Satıcılar, ARAZIALCOM tarafından belirlenen kurallar çerçevesinde Uygulama üzerinden gayrimenkullerini ihaleye çıkarabilirler. İhale başlangıç fiyatı, süresi, rezerv fiyat (varsa) gibi detaylar Satıcı tarafından belirlenir ve ihale sayfasında gösterilir.
          </ListItem>
          <ListItem>
            <strong>Verilen Her Teklif, İhalenin Kazanılması Durumunda Gayrimenkulü Belirtilen Fiyattan Satın Almaya Yönelik Geri Alınamaz ve Bağlayıcı Bir İradedir.</strong> Kullanıcılar, teklif vermeden önce tüm koşulları dikkatlice incelemeli ve satın alma niyetlerinin kesin olduğundan emin olmalıdırlar.
          </ListItem>
          <ListItem>
            İhale süresi sonunda veya "Hemen Al" seçeneği (varsa) kullanıldığında, en yüksek geçerli teklifi veren Kullanıcı (Alıcı), ihaleyi kazanmış sayılır ve Satıcı ile arasında, teklif edilen bedel üzerinden gayrimenkul alım-satımına yönelik bir ön anlaşma kurulmuş olur.
          </ListItem>
          <ListItem>
            İhaleyi kazanan Alıcı, ARAZIALCOM tarafından belirlenen süre ve yöntemle (örn. kapora ödemesi) yükümlülüklerini yerine getirmek ve Satıcı ile tapu devri dahil resmi alım-satım işlemlerini tamamlamakla yükümlüdür.
          </ListItem>
          <ListItem>
            İhaleyi kazanan Alıcının yükümlülüklerini yerine getirmemesi durumunda, Satıcının yasal hakları saklı kalmak kaydıyla, ARAZIALCOM tarafından Kullanıcının hesabı askıya alınabilir veya kapatılabilir ve varsa ödenen teminat/kapora iade edilmeyebilir.
          </ListItem>
          <ListItem>
            Satıcının, ihaleyi kazanan Alıcıya gayrimenkulü devretme yükümlülüğünü yerine getirmemesi durumunda Alıcının yasal hakları saklıdır. ARAZIALCOM bu tür uyuşmazlıklarda taraf değildir.
          </ListItem>
          <ListItem>
            ARAZIALCOM, teknik arızalar veya mücbir sebepler nedeniyle ihale süreçlerinde yaşanabilecek aksaklıklardan sorumlu tutulamaz, ancak bu gibi durumlarda makul çözümler üretmeye çalışır.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>7. Ücretler ve Ödemeler</SectionTitle>
        <List>
          <ListItem>
            Uygulama'nın temel kullanımı ücretsiz olabilir ancak ARAZIALCOM, belirli Hizmetler (örn. ihale listeleme, başarılı satış sonrası komisyon vb.) için ücret talep etme hakkını saklı tutar.
          </ListItem>
          <ListItem>
            Uygulanacak ücretler, komisyon oranları ve ödeme koşulları, ilgili Hizmetin sunulduğu Uygulama ekranlarında veya ayrı bir "Ücretlendirme Politikası" sayfasında Kullanıcılara açıkça bildirilecektir.
          </ListItem>
          <ListItem>
            Ödemeler, ARAZIALCOM'un anlaşmalı olduğu üçüncü taraf ödeme hizmeti sağlayıcısı (Paratika) aracılığıyla gerçekleştirilir. Ödeme işlemleri sırasında Paratika'nın kendi kullanım koşulları ve gizlilik politikası geçerli olabilir.
          </ListItem>
          <ListItem>
            Kullanıcılar, beyan ettikleri ödeme bilgilerinin doğruluğundan ve geçerliliğinden sorumludur.
          </ListItem>
          <ListItem>
            Alım-satım işlemine ilişkin yasal vergiler (KDV, tapu harcı vb.) ve masraflar, ilgili mevzuat uyarınca Alıcı ve/veya Satıcı tarafından karşılanır. ARAZIALCOM, bu vergi ve masraflardan sorumlu değildir.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>8. Fikri Mülkiyet Hakları</SectionTitle>
        <List>
          <ListItem>
            Uygulama'nın kendisi, tasarımı, metinleri, görselleri, logoları, markaları, veritabanı, yazılım kodları ve diğer tüm İçerik ("ARAZIALCOM İçeriği"), ARAZIALCOM'a veya lisans verenlerine aittir ve Türk ve uluslararası fikri mülkiyet yasalarıyla korunmaktadır.
          </ListItem>
          <ListItem>
            Kullanıcılara, Uygulama'yı yalnızca işbu Koşullar çerçevesinde ve Hizmetlerden faydalanma amacıyla kişisel, münhasır olmayan, devredilemez ve geri alınabilir sınırlı bir kullanım lisansı verilmektedir.
          </ListItem>
          <ListItem>
            Kullanıcılar, ARAZIALCOM İçeriğini kopyalayamaz, değiştiremez, çoğaltamaz, dağıtamaz, satamaz, kiralayamaz, tersine mühendislik yapamaz veya türev çalışmalarını oluşturamaz.
          </ListItem>
          <ListItem>
            Kullanıcılar tarafından Uygulama'ya yüklenen içeriklerin (ilan bilgileri, fotoğraflar vb.) fikri mülkiyet hakları kendilerine aittir. Ancak Kullanıcılar, bu içeriklerin Hizmetlerin sunulması amacıyla ARAZIALCOM tarafından kullanılmasına, çoğaltılmasına, dağıtılmasına ve sergilenmesine yönelik dünya çapında, telifsiz ve münhasır olmayan bir lisansı ARAZIALCOM'a vermiş sayılırlar.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>9. Garantilerin Reddi</SectionTitle>
        <List>
          <ListItem>
            UYGULAMA VE HİZMETLER, "OLDUĞU GİBİ" VE "MEVCUT OLDUĞU ŞEKİLDE" SUNULMAKTADIR. ARAZIALCOM, UYGULAMANIN KESİNTİSİZ, HATASIZ, GÜVENLİ VEYA VİRÜSSÜZ ÇALIŞACAĞINA DAİR AÇIK VEYA ZIMNİ HİÇBİR GARANTİ VERMEMEKTEDİR.
          </ListItem>
          <ListItem>
            ARAZIALCOM, KULLANICILAR TARAFINDAN SAĞLANAN BİLGİLERİN (GAYRİMENKUL DETAYLARI, İLAN AÇIKLAMALARI DAHİL) DOĞRULUĞU, GÜVENİLİRLİĞİ, EKSİKSİZLİĞİ VEYA GÜNCELLİĞİ KONUSUNDA HİÇBİR SORUMLULUK KABUL ETMEZ VE GARANTİ VERMEZ.
          </ListItem>
          <ListItem>
            ARAZIALCOM, UYGULAMA ÜZERİNDEN SATIŞA SUNULAN GAYRİMENKULLERİN HUKUKİ DURUMU, MÜLKİYETİ, DEĞERİ, İMAR DURUMU, FİZİKİ KOŞULLARI VEYA SATILABİLİRLİĞİ KONUSUNDA HİÇBİR GARANTİ VERMEMEKTEDİR. BU KONULARDAKİ TÜM RİSK KULLANICILARA (ÖZELLİKLE ALICILARA) AİTTİR.
          </ListItem>
          <ListItem>
            ARAZIALCOM, ALICI VE SATICI ARASINDAKİ İLİŞKİDEN, ALIM-SATIM SÖZLEŞMESİNİN İFASINDAN VEYA İFASINDAN KAYNAKLANAN UYUŞMAZLIKLARDAN SORUMLU DEĞİLDİR.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>14. Uygulanacak Hukuk ve Yetkili Mahkeme</SectionTitle>
        <Paragraph>
          İşbu Koşulların yorumlanmasında, uygulanmasında ve Koşullar nedeniyle ortaya çıkabilecek tüm uyuşmazlıkların çözümünde Türk Hukuku uygulanacaktır. İşbu Koşullardan kaynaklanan veya Koşullar ile bağlantılı her türlü ihtilafın çözümünde Manisa (Akhisar) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>15. İletişim Bilgileri</SectionTitle>
        <Paragraph>
          İşbu Koşullar ile ilgili soru ve bildirimleriniz için aşağıdaki iletişim kanallarını kullanabilirsiniz:
        </Paragraph>
        <Paragraph>
          E-posta: destek@arazialcom.com
        </Paragraph>
        <Paragraph>
          Adres: ULU CAMİ MAH. 389 SK. NO:2/18 AKHİSAR / MANİSA
        </Paragraph>
      </ContentSection>

      <Emphasis>
        Kullanıcı, Uygulama'yı kullanarak yukarıdaki tüm maddeleri okuduğunu, anladığını ve kabul ettiğini beyan eder.
      </Emphasis>
    </PageContainer>
  );
};

export default TermsOfUse; 