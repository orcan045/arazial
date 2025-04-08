import React, { useState } from 'react';
import styled from 'styled-components';
import valletPayment from '../services/valletPayment';

const PaymentContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  background-color: white;
  margin-bottom: 1rem;
`;

const PaymentTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
`;

const PaymentInfo = styled.p`
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const DepositPayment = ({ auction, user, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayDeposit = async () => {
    if (!user || !auction) return;

    setLoading(true);
    setError(null);

    try {
      // Generate a unique orderId
      const timestamp = Date.now();
      const orderId = `DEP${timestamp}`;
      const callbackBaseUrl = window.location.origin;

      // Ensure we have a valid email
      if (!user.email) {
        throw new Error('E-posta adresi gereklidir.');
      }

      // Split full name into first and last name
      const nameParts = user.user_metadata?.full_name?.split(' ') || [];
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || 'Unknown';

      const amount = 2000; // TL 2000 deposit
      const paymentParams = {
        orderId,
        auctionId: auction.id,
        amount,
        buyerName: firstName,
        buyerSurName: lastName,
        buyerGsmNo: user.user_metadata?.phone || '5555555555',
        buyerMail: user.email,
        buyerIp: '159.146.16.178',
        callbackOkUrl: `${callbackBaseUrl}/payment/success/${auction.id}`,
        callbackFailUrl: `${callbackBaseUrl}/payment/fail/${auction.id}`
      };

      console.log('Creating payment with parameters:', paymentParams);

      const response = await valletPayment.createPaymentLink(paymentParams);
      
      if (response.status === 'success') {
        // The redirect will happen in the service
        onPaymentComplete?.();
      } else {
        throw new Error('Ödeme sayfası oluşturulamadı');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContainer>
      <PaymentTitle>Depozito Ödemesi</PaymentTitle>
      <PaymentInfo>
        İhaleye katılmak için ₺2,000 depozito yatırmanız gerekmektedir.
        Bu tutar, ihaleyi kazanmanız durumunda satın alma bedeline sayılacak,
        kazanamamanız durumunda ise size iade edilecektir.
      </PaymentInfo>
      <PaymentButton
        onClick={handlePayDeposit}
        disabled={loading}
      >
        {loading ? 'İşleniyor...' : 'Depozito Öde'}
      </PaymentButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PaymentContainer>
  );
};

export default DepositPayment; 