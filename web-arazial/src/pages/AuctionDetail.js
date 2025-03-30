import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAuctionById, getAuctionBids, placeBid } from '../services/auctionService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { VisibilityEvents } from '../context/AuthContext';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: var(--color-primary-dark);
  }
`;

const AuctionHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const AuctionTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const AuctionLocation = styled.div`
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const AuctionStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  margin-top: 0.5rem;
  background-color: ${props => 
    props.status === 'active' ? 'rgba(5, 150, 105, 0.1)' : 
    props.status === 'upcoming' ? 'rgba(37, 99, 235, 0.1)' : 
    'rgba(107, 114, 128, 0.1)'
  };
  color: ${props => 
    props.status === 'active' ? 'rgb(5, 150, 105)' : 
    props.status === 'upcoming' ? 'rgb(37, 99, 235)' : 
    'rgb(107, 114, 128)'
  };
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div``;

const SideContent = styled.div``;

const Section = styled.section`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
`;

const PropertyList = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PropertyItem = styled.div``;

const PropertyLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
`;

const BidsList = styled.div`
  margin-top: 1.5rem;
`;

const BidItem = styled.div`
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const BidderInfo = styled.div``;

const BidderName = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
`;

const BidTime = styled.div`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
`;

const BidAmount = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
`;

const BidForm = styled.form`
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch auction details
        const { data: auctionData, error: auctionError } = await getAuctionById(id);
        if (auctionError) throw auctionError;
        
        if (!auctionData) {
          throw new Error('Auction not found');
        }
        
        console.log('Auction data received:', auctionData);
        setAuction(auctionData);
        
        // Fetch bids
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            *,
            profiles (full_name, avatar_url)
          `)
          .eq('auction_id', id)
          .order('amount', { ascending: false });
        
        if (bidsError) throw bidsError;
        
        setBids(bidsData || []);
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setError('Couldn\'t load auction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data load
    fetchData();
    
    // Subscribe to visibility events from the central system
    const unsubscribe = VisibilityEvents.subscribe(() => {
      console.log("AuctionDetail received visibility change notification");
      fetchData();
    });
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [id]);
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    try {
      setBidError(null);
      setBidLoading(true);
      
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= 0) {
        setBidError('Please enter a valid bid amount.');
        return;
      }
      
      const { success, error } = await placeBid(id, amount);
      
      if (error) {
        setBidError(error.message || 'Failed to place bid. Please try again.');
        return;
      }
      
      if (success) {
        // Refresh auction details and bids
        const { data: auctionData } = await getAuctionById(id);
        const { data: bidsData } = await getAuctionBids(id);
        
        setAuction(auctionData);
        setBids(bidsData);
        setBidAmount('');
      }
    } catch (err) {
      console.error('Error placing bid:', err);
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };
  
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '₺0';
    
    // If price is already a string with currency formatting, return it
    if (typeof price === 'string' && price.includes('₺')) {
      return price;
    }
    
    // Convert to number if it's a string number
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    
    // Handle NaN
    if (isNaN(price)) return '₺0';
    
    // Format the number
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getAuctionStatus = () => {
    if (!auction) return '';
    
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);
    
    if (auction.status === 'active' && now >= startTime && now <= endTime) {
      return 'active';
    } else if (auction.status === 'upcoming' && now < startTime) {
      return 'upcoming';
    } else {
      return 'ended';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'upcoming': return 'Yaklaşan';
      case 'ended': return 'Sonlandı';
      default: return '';
    }
  };
  
  const getMinimumBidAmount = () => {
    // Get the current highest amount from bids
    const currentBid = bids.length > 0 ? bids[0].amount : 0;
    // Otherwise use stored values
    const currentPrice = currentBid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice || 0;
    const increment = auction.min_increment || auction.minIncrement || 0;
    return currentPrice + increment;
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Yükleniyor...</LoadingState>
      </PageContainer>
    );
  }
  
  if (error || !auction) {
    return (
      <PageContainer>
        <div>
          <BackButton onClick={() => navigate('/dashboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </BackButton>
          <div>{error || 'Auction not found'}</div>
        </div>
      </PageContainer>
    );
  }
  
  const status = getAuctionStatus();
  const canBid = status === 'active' && !!user;
  
  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Geri Dön
      </BackButton>
      
      <AuctionHeader>
        <AuctionTitle>{auction.title || 'Arsa'}</AuctionTitle>
        <AuctionLocation>{auction.location || 'Konum bilgisi yok'}</AuctionLocation>
        <AuctionStatus status={status}>{getStatusText(status)}</AuctionStatus>
      </AuctionHeader>
      
      <ContentGrid>
        <MainContent>
          <Section>
            <SectionTitle>Arsa Bilgileri</SectionTitle>
            <PropertyList>
              <PropertyItem>
                <PropertyLabel>Yüz Ölçümü</PropertyLabel>
                <PropertyValue>
                  {auction.area_size 
                    ? `${auction.area_size} ${auction.area_unit || 'm²'}` 
                    : '—'}
                </PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Konum</PropertyLabel>
                <PropertyValue>{auction.location || '—'}</PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>İlan Tarihi</PropertyLabel>
                <PropertyValue>
                  {auction.created_at 
                    ? formatDate(auction.created_at) 
                    : '—'}
                </PropertyValue>
              </PropertyItem>
            </PropertyList>
          </Section>
          
          <Section>
            <SectionTitle>Detaylı Bilgiler</SectionTitle>
            <div style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              {auction.description || 'Bu arsa için ayrıntılı açıklama bulunmamaktadır.'}
            </div>
            {auction.images && auction.images.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Görseller</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {auction.images.map((image, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: 'var(--color-background)', 
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 'var(--border-radius-sm)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Section>
          
          <Section>
            <SectionTitle>İhale Bilgileri</SectionTitle>
            <PropertyList>
              <PropertyItem>
                <PropertyLabel>Başlangıç Fiyatı</PropertyLabel>
                <PropertyValue>
                  {formatPrice(auction.start_price || auction.startPrice)}
                </PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Mevcut Fiyat</PropertyLabel>
                <PropertyValue>
                  {formatPrice(
                    // If bids exist, use the highest bid amount
                    bids.length > 0 
                      ? bids[0].amount
                      // Otherwise fall back to stored values
                      : (auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice)
                  )}
                </PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Minimum Artırım</PropertyLabel>
                <PropertyValue>
                  {formatPrice(auction.min_increment || auction.minIncrement)}
                </PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Başlangıç Tarihi</PropertyLabel>
                <PropertyValue>
                  {formatDate(auction.start_time || auction.startTime)}
                </PropertyValue>
              </PropertyItem>
              <PropertyItem>
                <PropertyLabel>Bitiş Tarihi</PropertyLabel>
                <PropertyValue>
                  {formatDate(auction.end_time || auction.endTime)}
                </PropertyValue>
              </PropertyItem>
            </PropertyList>
          </Section>
        </MainContent>
        
        <SideContent>
          {canBid && (
            <Section>
              <SectionTitle>Teklif Ver</SectionTitle>
              <BidForm onSubmit={handleSubmitBid}>
                <InputGroup>
                  <InputLabel htmlFor="bidAmount">Teklif Tutarı (₺)</InputLabel>
                  <Input
                    id="bidAmount"
                    type="number"
                    min={getMinimumBidAmount()}
                    step="1000"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    disabled={bidLoading}
                    placeholder={`Minimum: ${formatPrice(getMinimumBidAmount())}`}
                  />
                </InputGroup>
                {bidError && <Error>{bidError}</Error>}
                <SubmitButton type="submit" disabled={bidLoading}>
                  {bidLoading ? 'İşleniyor...' : 'Teklif Ver'}
                </SubmitButton>
              </BidForm>
            </Section>
          )}

          <Section>
            <SectionTitle>Teklifler</SectionTitle>
            {bids.length > 0 ? (
              <BidsList>
                {bids.map((bid) => (
                  <BidItem key={bid.id}>
                    <BidderInfo>
                      <BidderName>{bid.profiles?.full_name || 'Anonim'}</BidderName>
                      <BidTime>{formatDate(bid.created_at)}</BidTime>
                    </BidderInfo>
                    <BidAmount>{formatPrice(bid.amount)}</BidAmount>
                  </BidItem>
                ))}
              </BidsList>
            ) : (
              <div>Henüz teklif bulunmuyor.</div>
            )}
          </Section>
        </SideContent>
      </ContentGrid>
    </PageContainer>
  );
};

export default AuctionDetail; 