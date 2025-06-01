import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../services/supabase';

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

const PaymentDetails = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  margin: 1rem 0;
  text-align: left;
  
  p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  
  strong {
    color: var(--color-text-primary);
  }
`;

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = searchParams.get('uid');
    const orderId = searchParams.get('orderId');
    
    if (!uid && !orderId) {
      setError('Ödeme sonucu sorgulamak için gerekli parametreler eksik.');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const payload = {};
        if (uid) payload.uid = uid;
        if (orderId) payload.orderId = orderId;
        
        console.log('Checking payment result for:', payload);
        
        // Call the Supabase Edge Function for payment result checking
        const { data, error: functionError } = await supabase.functions.invoke('payment-result', {
          body: payload
        });

        console.log('Payment result response:', { data, functionError });

        if (functionError) {
          throw new Error(functionError.message || 'Ödeme sonucu kontrol edilemedi.');
        }

        if (!data) {
          throw new Error('Ödeme sonucu alınamadı.');
        }

        setResult(data);
        
        // Update deposit status based on payment result using Edge Function
        if (data.paymentSuccessful && data.paymentData) {
          try {
            // Update deposit status to completed
            const { error: updateError } = await supabase.functions.invoke('update-deposit-status', {
              body: {
                payment_id: data.paymentData.orderId,
                status: 'completed'
              }
            });
              
            if (updateError) {
              console.error('Error updating deposit status:', updateError);
            } else {
              console.log('Deposit status updated to completed');
            }
          } catch (updateErr) {
            console.error('Error updating deposit status:', updateErr);
          }
        } else if (data.success === false) {
          try {
            // Update deposit status to failed if payment was not successful
            const orderId = searchParams.get('orderId');
            if (orderId) {
              const { error: updateError } = await supabase.functions.invoke('update-deposit-status', {
                body: {
                  payment_id: orderId,
                  status: 'failed'
                }
              });
                
              if (updateError) {
                console.error('Error updating failed deposit status:', updateError);
              } else {
                console.log('Deposit status updated to failed');
              }
            }
          } catch (updateErr) {
            console.error('Error updating failed deposit status:', updateErr);
          }
        }
      } catch (err) {
        console.error('Payment result error:', err);
        setError(err.message || 'Ödeme sonucu alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

  const handleContinue = () => {
    // Extract auction ID from orderId or URL
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      // Try different patterns to extract auction ID
      let auctionId = null;
      
      // Pattern: auction-ID-user or aID-uID-timestamp
      const patterns = [
        /auction-([a-f0-9-]+)-user/i,
        /a([a-f0-9-]+)u[a-f0-9-]+t\d+/i,
        /([a-f0-9-]{8,})/i // Fallback: any long hex string
      ];
      
      for (const pattern of patterns) {
        const match = orderId.match(pattern);
        if (match && match[1]) {
          auctionId = match[1];
          break;
        }
      }
      
      if (auctionId) {
        window.location.href = `/auctions/${auctionId}`;
        return;
      }
    }
    
    // Fallback to auctions list
    window.location.href = '/auctions';
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

  // Check if payment was successful (Status = 4)
  const isSuccess = result && result.success && result.paymentSuccessful;
  const paymentData = result?.paymentData;

  return (
    <Container>
      <Title success={isSuccess}>
        {isSuccess ? 'Ödeme Başarılı!' : 'Ödeme Başarısız'}
      </Title>
      
      <Message>
        {isSuccess
          ? 'Depozito ödemesi başarıyla tamamlandı. Artık ihaleye teklif verebilirsiniz.'
          : 'Depozito ödemesi başarısız oldu. Lütfen tekrar deneyin.'}
      </Message>

      {paymentData && (
        <PaymentDetails>
          <p><strong>Durum:</strong> {isSuccess ? 'Başarılı' : 'Başarısız'}</p>
          {paymentData.amount && (
            <p><strong>Tutar:</strong> {paymentData.amount} TL</p>
          )}
          {paymentData.netAmount && (
            <p><strong>Net Tutar:</strong> {paymentData.netAmount} TL</p>
          )}
          {paymentData.authCode && (
            <p><strong>Yetkilendirme Kodu:</strong> {paymentData.authCode}</p>
          )}
          {paymentData.orderId && (
            <p><strong>Sipariş No:</strong> {paymentData.orderId}</p>
          )}
          {paymentData.uid && (
            <p><strong>İşlem ID:</strong> {paymentData.uid}</p>
          )}
          {paymentData.creationTime && (
            <p><strong>İşlem Zamanı:</strong> {new Date(paymentData.creationTime).toLocaleString('tr-TR')}</p>
          )}
        </PaymentDetails>
      )}

      {!isSuccess && result?.message && (
        <PaymentDetails>
          <p><strong>Hata Detayı:</strong> {result.message}</p>
        </PaymentDetails>
      )}

      <Button onClick={handleContinue}>İlana Geri Dön</Button>
    </Container>
  );
};

export default PaymentCallback; 