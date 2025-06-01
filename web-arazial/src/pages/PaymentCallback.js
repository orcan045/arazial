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
        
        // Call the Supabase Edge Function using invoke
        const { data, error: functionError } = await supabase.functions.invoke('payment-proxy', {
          body: payload
            });

        if (functionError || !data) {
          throw new Error(functionError?.message || 'Ödeme sonucu alınamadı.');
        }
        setResult(data);
      } catch (err) {
        setError(err.message || 'Ödeme sonucu alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [searchParams]);

  const handleContinue = () => {
    // Extract auction ID from orderId
    const orderId = searchParams.get('orderId');
    if (orderId) {
      const match = orderId.match(/auction-(\d+)-user/);
      if (match && match[1]) {
        window.location.href = `/auctions/${match[1]}`;
        return;
      }
    }
    // Fallback to auctions list if we can't extract the auction ID
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

  return (
    <Container>
      <Title success={result && result.IsDone}>
        {result && result.IsDone ? 'Ödeme Başarılı!' : 'Ödeme Başarısız'}
      </Title>
      <Message>
        {result && result.IsDone
          ? `Depozito ödemesi başarıyla tamamlandı. Artık ihaleye teklif verebilirsiniz.`
          : `Depozito ödemesi başarısız oldu. Lütfen tekrar deneyin.`}
      </Message>
      {result && (
        <div>
          {result.IsDone ? (
            <>
              <p><b>Tutar:</b> {result.Content?.Amount} TL</p>
              <p><b>İşlem No:</b> {result.Content?.OrderId || result.Content?.Uid}</p>
            </>
          ) : (
            <p><b>Hata:</b> {result.Message || 'Bilinmeyen hata'}</p>
          )}
        </div>
      )}
      <Button onClick={handleContinue}>İlana Geri Dön</Button>
    </Container>
  );
};

export default PaymentCallback; 