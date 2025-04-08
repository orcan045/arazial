import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import valletPayment from '../services/valletPayment';
import { supabase } from '../supabaseClient';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.success ? 'var(--color-success)' : 'var(--color-error)'};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const PaymentCallback = () => {
  const { status, auctionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get pending payment info from localStorage
        const pendingPayment = JSON.parse(localStorage.getItem('pendingPayment') || '{}');
        
        if (!pendingPayment.orderId || !pendingPayment.auctionId) {
          throw new Error('Ödeme bilgileri bulunamadı');
        }

        if (pendingPayment.auctionId !== auctionId) {
          throw new Error('Ödeme bilgileri eşleşmiyor');
        }

        if (status === 'success') {
          // Verify the payment with Vallet's callback data
          const urlParams = new URLSearchParams(window.location.search);
          const callbackData = {
            status: urlParams.get('status'),
            paymentStatus: urlParams.get('paymentStatus'),
            hash: urlParams.get('hash'),
            paymentAmount: urlParams.get('paymentAmount'),
            paymentType: urlParams.get('paymentType'),
            orderId: pendingPayment.orderId,
            shopCode: urlParams.get('shopCode')
          };

          const isValid = valletPayment.verifyCallback(callbackData);

          if (!isValid) {
            throw new Error('Ödeme doğrulaması başarısız');
          }

          // Record the successful payment in your database
          const { error: dbError } = await supabase
            .from('deposits')
            .insert({
              auction_id: auctionId,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              amount: pendingPayment.amount,
              payment_id: pendingPayment.orderId,
              status: 'completed'
            });

          if (dbError) throw dbError;
        }

        // Clear the pending payment info
        localStorage.removeItem('pendingPayment');
        setLoading(false);
      } catch (err) {
        console.error('Payment callback error:', err);
        setError(err.message || 'Bir hata oluştu');
        setLoading(false);
      }
    };

    handleCallback();
  }, [status, auctionId]);

  const handleContinue = () => {
    navigate(`/auction/${auctionId}`);
  };

  if (loading) {
    return (
      <Container>
        <Message>Ödeme durumu kontrol ediliyor...</Message>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title success={false}>Ödeme İşlemi Başarısız</Title>
        <Message>{error}</Message>
        <Button onClick={handleContinue}>İlana Geri Dön</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Title success={status === 'success'}>
        {status === 'success' ? 'Ödeme Başarılı!' : 'Ödeme Başarısız'}
      </Title>
      <Message>
        {status === 'success'
          ? 'Depozito ödemesi başarıyla tamamlandı. Artık ihaleye teklif verebilirsiniz.'
          : 'Depozito ödemesi başarısız oldu. Lütfen tekrar deneyin.'}
      </Message>
      <Button onClick={handleContinue}>İlana Geri Dön</Button>
    </Container>
  );
};

export default PaymentCallback; 