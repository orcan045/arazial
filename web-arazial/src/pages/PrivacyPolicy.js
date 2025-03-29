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

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gizlilik Politikası</PageTitle>
        <PageSubtitle>
          ARAZIALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ POLİTİKASI
        </PageSubtitle>
      </PageHeader>

      <DocumentMeta>
        <div>Yürürlülük Tarihi: 29/03/2025</div>
        <div>Son Güncelleme Tarihi: 29/03/2025</div>
      </DocumentMeta>

      <ContentSection>
        <SectionTitle>1. Veri Sorumlusu</SectionTitle>
        <Paragraph>
          ARAZIALCOM EMLAK SANAYİ VE TİCARET LİMİTED ŞİRKETİ ("ARAZIALCOM" veya "Şirket") olarak kişisel verilerinizin güvenliği ve korunması önceliklerimiz arasındadır. 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca "Veri Sorumlusu" sıfatıyla, kişisel verilerinizin işlenmesi, saklanması ve aktarılmasına ilişkin sizleri bilgilendirmek amacıyla işbu Kişisel Verilerin Korunması ve İşlenmesi Politikası'nı ("Politika") hazırlamış bulunmaktayız.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>2. Tanımlar</SectionTitle>
        <Paragraph>Bu Politika'da geçen:</Paragraph>

        <List>
          <ListItem>
            <strong>Kişisel Veri:</strong> Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi,
          </ListItem>
          <ListItem>
            <strong>Veri Sorumlusu:</strong> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi,
          </ListItem>
          <ListItem>
            <strong>Veri İşleyen:</strong> Veri sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişiyi,
          </ListItem>
          <ListItem>
            <strong>KVKK:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu'nu,
          </ListItem>
          <ListItem>
            <strong>İlgili Kişi:</strong> Kişisel verisi işlenen gerçek kişiyi,
          </ListItem>
          <ListItem>
            <strong>Açık Rıza:</strong> Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rızayı,
          </ListItem>
          <ListItem>
            <strong>Kişisel Verilerin İşlenmesi:</strong> Kişisel verilerin tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hâle getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi veriler üzerinde gerçekleştirilen her türlü işlemi,
          </ListItem>
          <ListItem>
            <strong>Uygulama/Platform:</strong> ARAZIALCOM tarafından geliştirilen ve işletilen, internet sitesi ve mobil uygulamayı, ifade eder.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>3. İşlenen Kişisel Veri Kategorileri</SectionTitle>
        <Paragraph>
          ARAZIALCOM tarafından aşağıdaki kategorilerde yer alan kişisel verileriniz işlenebilmektedir:
        </Paragraph>

        <List>
          <ListItem>
            <strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası, doğum tarihi, cinsiyet vb.
          </ListItem>
          <ListItem>
            <strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres, faks numarası vb.
          </ListItem>
          <ListItem>
            <strong>Müşteri İşlem Bilgileri:</strong> Alışveriş geçmişi, ihaleler, teklifler, siparişler, talep ve şikayetler, ödeme bilgileri vb.
          </ListItem>
          <ListItem>
            <strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, kullanıcı adı, şifre, sistem giriş-çıkış bilgileri, tarayıcı bilgileri, cihaz bilgileri vb.
          </ListItem>
          <ListItem>
            <strong>Finansal Bilgiler:</strong> Banka hesap/IBAN bilgileri, kredi kartı bilgileri, fatura bilgileri vb.
          </ListItem>
          <ListItem>
            <strong>Hukuki İşlem Bilgileri:</strong> Adli makamlarla yazışmalardaki bilgiler, dava dosyasındaki bilgiler vb.
          </ListItem>
          <ListItem>
            <strong>Pazarlama Bilgileri:</strong> Çerez kayıtları, kampanya çalışmasıyla elde edilen bilgiler, anket ve tercih bilgileri vb.
          </ListItem>
          <ListItem>
            <strong>Gayrimenkul Bilgileri:</strong> Gayrimenkul tipi, yeri, özellikleri, tapu bilgileri, imar durumu vb.
          </ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>4. Kişisel Verilerin İşlenme Amaçları</SectionTitle>
        <Paragraph>
          Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenebilmektedir:
        </Paragraph>

        <List>
          <ListItem>Uygulama'da hesap oluşturulması ve yönetilmesi,</ListItem>
          <ListItem>İhale ve artırma süreçlerinin yürütülmesi,</ListItem>
          <ListItem>Teklif verme, satın alma ve satış işlemlerinin gerçekleştirilmesi,</ListItem>
          <ListItem>Ödeme işlemlerinin gerçekleştirilmesi ve takibi,</ListItem>
          <ListItem>Müşteri ilişkileri yönetimi ve müşteri memnuniyeti faaliyetlerinin yürütülmesi,</ListItem>
          <ListItem>Şirket tarafından sunulan ürün ve hizmetlerin iyileştirilmesi, geliştirilmesi,</ListItem>
          <ListItem>Kullanıcı deneyiminin iyileştirilmesi ve kişiselleştirilmesi,</ListItem>
          <ListItem>İletişim faaliyetlerinin yürütülmesi,</ListItem>
          <ListItem>Talep ve şikayetlerin takibi ve çözümlenmesi,</ListItem>
          <ListItem>Bilgi güvenliği süreçlerinin yürütülmesi,</ListItem>
          <ListItem>Hukuki süreçlerin takibi ve yükümlülüklerin yerine getirilmesi,</ListItem>
          <ListItem>Dolandırıcılık ve sahtekarlık gibi yasadışı faaliyetlerin önlenmesi,</ListItem>
          <ListItem>Pazarlama analiz çalışmalarının yürütülmesi,</ListItem>
          <ListItem>Açık rızanız olması halinde pazarlama ve reklam faaliyetlerinin yürütülmesi.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, Uygulama'ya üyelik oluşturmanız, Uygulama üzerinden gerçekleştirdiğiniz işlemler, formlar, anketler, çerezler, görüşmeler, Uygulama'yı kullanımınız sırasında otomatik olarak oluşturulan log kayıtları, üçüncü taraf hizmet sağlayıcılar aracılığıyla ve benzeri yöntemlerle elektronik ve/veya fiziki ortamda toplanmaktadır.
        </Paragraph>
        <Paragraph>
          Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanarak işlenmektedir:
        </Paragraph>

        <List>
          <ListItem>Açık rızanızın bulunması,</ListItem>
          <ListItem>Kanunlarda açıkça öngörülmesi,</ListItem>
          <ListItem>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması,</ListItem>
          <ListItem>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması,</ListItem>
          <ListItem>İlgili kişinin kendisi tarafından alenileştirilmiş olması,</ListItem>
          <ListItem>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması,</ListItem>
          <ListItem>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>6. Kişisel Verilerin Aktarılması</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda ve işbu Politika'da belirtilen hukuki sebepler çerçevesinde gerekli olduğu ölçüde aşağıdaki alıcı gruplarına aktarılabilecektir:
        </Paragraph>

        <List>
          <ListItem>Yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşlarına,</ListItem>
          <ListItem>İşlem güvenliğinin sağlanması ve hizmetin ifası amacıyla ödeme sistemleri ve aracı hizmet sağlayıcılarına,</ListItem>
          <ListItem>Hizmetlerimizin sağlanması amacıyla iş ortaklarımıza ve tedarikçilerimize,</ListItem>
          <ListItem>Teknik ve operasyonel hizmetlerin sunulması amacıyla hizmet alınan üçüncü kişilere,</ListItem>
          <ListItem>Şirket içi operasyonel süreçlerin yürütülmesi amacıyla grup şirketlerimize.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>7. Kişisel Verilerin Saklanma Süresi</SectionTitle>
        <Paragraph>
          Kişisel verileriniz, işlenme amaçlarının gerektirdiği süreler boyunca ve yasal saklama sürelerince saklanacaktır. Saklama süresi dolan kişisel veriler, anonim hale getirilmekte veya yok edilmektedir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>8. Veri Güvenliği Tedbirleri</SectionTitle>
        <Paragraph>
          ARAZIALCOM, kişisel verilerinizin gizliliğini ve güvenliğini korumak için uygun güvenlik düzeyini temin etmeye yönelik gerekli her türlü teknik ve idari tedbiri almaktadır. Bu kapsamda:
        </Paragraph>

        <List>
          <ListItem>Kişisel verilere erişim yetkileri sınırlandırılmakta ve düzenli olarak denetlenmektedir.</ListItem>
          <ListItem>Güncel anti-virüs sistemleri kullanılmaktadır.</ListItem>
          <ListItem>Düzenli olarak güvenlik testleri yapılmaktadır.</ListItem>
          <ListItem>Veri ihlali durumunda alınacak önlemler belirlenmiştir.</ListItem>
          <ListItem>Çalışanlarımıza kişisel verilerin korunması hukuku ve kişisel verilerin hukuka uygun olarak işlenmesi konusunda eğitimler verilmektedir.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>9. Veri Sahibinin Hakları (KVKK Madde 11)</SectionTitle>
        <Paragraph>
          KVKK'nın 11. maddesi uyarınca herkes, veri sorumlusuna başvurarak kendisiyle ilgili aşağıdaki haklara sahiptir:
        </Paragraph>

        <List>
          <ListItem>Kişisel verilerinin işlenip işlenmediğini öğrenme,</ListItem>
          <ListItem>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</ListItem>
          <ListItem>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</ListItem>
          <ListItem>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</ListItem>
          <ListItem>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</ListItem>
          <ListItem>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</ListItem>
          <ListItem>Düzeltme, silme ve yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</ListItem>
          <ListItem>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</ListItem>
          <ListItem>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme.</ListItem>
        </List>
      </ContentSection>

      <ContentSection>
        <SectionTitle>10. Başvuru ve İletişim</SectionTitle>
        <Paragraph>
          KVKK kapsamındaki haklarınızı kullanmak için, kimliğinizi doğrulayıcı belgelerle birlikte yazılı talebinizi "ULU CAMİ MAH. 389 SK. NO:2/18 AKHİSAR / MANİSA" adresine ıslak imzalı olarak veya destek@arazialcom.com adresine güvenli elektronik imza, mobil imza ya da sistemimizde kayıtlı elektronik posta adresinizi kullanmak suretiyle iletebilirsiniz.
        </Paragraph>
        <Paragraph>
          Başvurunuz ARAZIALCOM tarafından, talebin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içerisinde ücretsiz olarak sonuçlandırılacaktır. Ancak, işlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilecektir.
        </Paragraph>
      </ContentSection>

      <ContentSection>
        <SectionTitle>11. Politika'da Yapılacak Değişiklikler</SectionTitle>
        <Paragraph>
          ARAZIALCOM, işbu Politika'yı gerektiğinde güncelleme ve değiştirme hakkını saklı tutar. Politika'nın güncel versiyonu, yayımlandığı tarih itibariyle yürürlüğe girecektir. Politika'daki önemli değişikliklerde sizlere bilgilendirme yapılacaktır.
        </Paragraph>
      </ContentSection>
    </PageContainer>
  );
};

export default PrivacyPolicy; 