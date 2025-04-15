'use client';

import React from 'react';
import styled from 'styled-components';

const FAQContainer = styled.div`
  max-width: 4xl;
  margin: 0 auto;
  padding: 3rem 1rem;
  
  @media (min-width: 640px) {
    padding: 4rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }
`;

const FAQTitle = styled.h1`
  text-align: center;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 3rem;
  letter-spacing: -0.025em;
  
  @media (max-width: 640px) {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }
`;

const FAQList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 640px) {
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--color-surface-secondary);
  padding-bottom: 2rem;
  
  @media (max-width: 640px) {
    padding-bottom: 1.5rem;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Question = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
`;

const Answer = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.75;
  white-space: pre-line;
  
  @media (max-width: 640px) {
    font-size: 0.9375rem;
    line-height: 1.6;
  }
`;

const FAQ = () => {
  const faqItems = [
    {
      question: "İhaleye nasıl katılabilirim?",
      answer: "İhaleye katılmak için önce arazialcom'a üye olmanız gerekiyor. Üyelikten sonra ilgilendiğiniz arazi ilanına girerek teminat yatırma adımlarını takip edebilir ve ihaleye katılım hakkı kazanabilirsiniz."
    },
    {
      question: "Teminat nedir, ne işe yarar?",
      answer: "Teminat, ihaleye katılabilmeniz için yatırmanız gereken güvence bedelidir. Her arazi için teminat tutarı farklı olabilir. Teminat yatırılmadan ihaleye teklif verilemez."
    },
    {
      question: "Teminatı nasıl yatırırım?",
      answer: "İlgili arazi ilanında yer alan \"Teminat Yatır\" butonuna tıklayarak yönlendirilen adımları takip edebilir, sistem üzerinden kolayca ödeme yapabilirsiniz. Ödeme onaylandıktan sonra teklif verme hakkınız aktif hale gelir."
    },
    {
      question: "İhaleyi kazanamazsam teminatım ne olur?",
      answer: "İhaleyi kazanamayan katılımcıların yatırdığı teminatlar, en geç 3 iş günü içerisinde eksiksiz şekilde iade edilir."
    },
    {
      question: "İhaleyi kazanırsam ne olur, ne yapmam gerekiyor?",
      answer: "İhale sona erdiğinde kazanan kişiye sistem üzerinden bir bilgilendirme mesajı gönderilir. Ardından kimlik bilgileri talep edilir. Bu bilgiler alındıktan sonra tapu giriş işlemleri yapılır ve tapu devri, ilgili tapu dairesinde resmi olarak gerçekleştirilir."
    },
    {
      question: "Ödeme yöntemleri nelerdir?",
      answer: "arazialcom üzerinden sadece teminat bedeli tahsil edilmektedir. Teminat yatırmak için banka havalesi, EFT veya sistemde tanımlı online ödeme altyapısı kullanılabilir.\n\nİhaleyi kazandıktan sonra yapılacak olan tapuyla ilgili tüm ödemeler, doğrudan tapu dairesinde, resmi işlem sırasında gerçekleştirilir. Bu işlemler arazialcom dışında yürütülür."
    },
    {
      question: "Araziyi görmeden satın alabilir miyim?",
      answer: "Evet, satın alabilirsiniz. Ancak her arazi ilanında konum bilgileri, fotoğraflar ve açıklamalar yer almaktadır. Dilerseniz araziyi yerinde görmek için adres bilgilerini kullanarak önceden keşif yapabilirsiniz."
    },
    {
      question: "Satın aldığım arazinin tapusu nasıl devrediliyor?",
      answer: "İhaleyi kazandıktan sonra kimlik bilgilerinizle birlikte tapu giriş işlemleri yapılır. Sonrasında tapu devri, ilgili tapu müdürlüğünde resmi olarak gerçekleştirilir. Tüm bu süreçte tarafınıza gerekli bilgilendirmeler yapılır."
    }
  ];

  return (
    <FAQContainer>
      <FAQTitle>Sık Sorulan Sorular (SSS)</FAQTitle>
      <FAQList>
        {faqItems.map((item, index) => (
          <FAQItem key={index}>
            <Question>{index + 1}. {item.question}</Question>
            <Answer>{item.answer}</Answer>
          </FAQItem>
        ))}
      </FAQList>
    </FAQContainer>
  );
};

export default FAQ; 