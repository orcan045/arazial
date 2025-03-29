import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getFilteredAuctions, fetchAuctions } from '../services/auctionService';
import { supabase } from '../supabaseClient';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeMessage = styled.h1`
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

const AuctionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AuctionCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const AuctionImage = styled.div`
  height: 150px;
  background-color: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 3rem;
    height: 3rem;
    color: var(--color-primary);
  }
`;

const AuctionContent = styled.div`
  padding: 1.5rem;
`;

const AuctionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const AuctionLocation = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`;

const AuctionDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

const AuctionPrice = styled.p`
  font-weight: 600;
  color: var(--color-success);
`;

const AuctionStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
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

const EmptyState = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 1.5rem;
  
  svg {
    width: 3rem;
    height: 3rem;
    color: var(--color-text-secondary);
    opacity: 0.5;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
`;

const EmptyStateMessage = styled.p`
  font-size: 1rem;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto 1.5rem;
`;

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState({
    active: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBids: 0,
    activeAuctions: 0,
    wonAuctions: 0,
    totalSpent: 0
  });
  
  useEffect(() => {
    // Wait for auth to be loaded
    if (authLoading) return;
    
    // Redirect if no user
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadAuctions();
    loadUserStats();
  }, [user, authLoading, navigate]);
  
  const loadAuctions = async () => {
    try {
      setLoading(true);
      
      // First get all auctions
      const { data, error } = await fetchAuctions();
      
      if (error) throw error;
      
      // Get the highest bid for each auction
      const auctionsWithHighestBids = await Promise.all(
        data.map(async (auction) => {
          try {
            // Fetch the highest bid for this auction
            const { data: bids } = await supabase
              .from('bids')
              .select('amount')
              .eq('auction_id', auction.id)
              .order('amount', { ascending: false })
              .limit(1);
            
            // If there's a highest bid, use it as the current price
            if (bids && bids.length > 0) {
              auction.highest_bid = bids[0].amount;
            }
          } catch (err) {
            console.error(`Error fetching bids for auction ${auction.id}:`, err);
          }
          return auction;
        })
      );
      
      // Filter auctions into categories
      const now = new Date();
      
      const active = auctionsWithHighestBids.filter(auction => {
        const startTime = new Date(auction.start_time || auction.startTime);
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        return status === 'active' && now >= startTime && now <= endTime;
      });
      
      const upcoming = auctionsWithHighestBids.filter(auction => {
        const startTime = new Date(auction.start_time || auction.startTime);
        const status = auction.status;
        return status === 'upcoming' && now < startTime;
      });
      
      const past = auctionsWithHighestBids.filter(auction => {
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        return now > endTime || status === 'ended';
      });
      
      setAuctions({
        active,
        upcoming,
        past
      });
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setError('Couldn\'t load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadUserStats = async () => {
    // Implementation of loadUserStats function
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
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleAuctionClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };
  
  // Display loading while auth is loading
  if (authLoading || loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p>Yükleniyor...</p>
        </div>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeMessage>Hoş Geldiniz, {user?.email}</WelcomeMessage>
        <Subtitle>İhaleleri takip edin ve tekliflerinizi yönetin</Subtitle>
      </DashboardHeader>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Aktif İhaleler</StatTitle>
          <StatValue>{auctions.active.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Yaklaşan İhaleler</StatTitle>
          <StatValue>{auctions.upcoming.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Geçmiş İhaleler</StatTitle>
          <StatValue>{auctions.past.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Toplam İhale</StatTitle>
          <StatValue>{auctions.active.length + auctions.upcoming.length + auctions.past.length}</StatValue>
        </StatCard>
      </StatsGrid>
      
      <SectionTitle>Aktif İhaleler</SectionTitle>
      {error ? (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Hata Oluştu</EmptyStateTitle>
          <EmptyStateMessage>{error}</EmptyStateMessage>
        </EmptyState>
      ) : auctions.active.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Aktif İhale Bulunamadı</EmptyStateTitle>
          <EmptyStateMessage>Şu anda aktif bir ihale bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.</EmptyStateMessage>
        </EmptyState>
      ) : (
        <AuctionsGrid>
          {auctions.active.map((auction) => (
            <AuctionCard key={auction.id} onClick={() => handleAuctionClick(auction.id)}>
              <AuctionImage>
                {auction.land_listings?.images && auction.land_listings.images.length > 0 ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundImage: `url(${auction.land_listings.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                )}
              </AuctionImage>
              <AuctionContent>
                <AuctionTitle>{auction.land_listings?.title || 'Arsa'}</AuctionTitle>
                <AuctionLocation>{auction.land_listings?.location || 'Konum bilgisi yok'}</AuctionLocation>
                <AuctionDetails>
                  <AuctionPrice>
                    {formatPrice(
                      auction.highest_bid || 
                      auction.final_price || 
                      auction.finalPrice || 
                      auction.start_price || 
                      auction.startPrice
                    )}
                  </AuctionPrice>
                  <AuctionStatus status="active">Aktif</AuctionStatus>
                </AuctionDetails>
              </AuctionContent>
            </AuctionCard>
          ))}
        </AuctionsGrid>
      )}
      
      <SectionTitle>Yaklaşan İhaleler</SectionTitle>
      {error ? (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Yaklaşan İhale Bulunamadı</EmptyStateTitle>
          <EmptyStateMessage>Şu anda planlanmış yaklaşan ihale bulunmamaktadır.</EmptyStateMessage>
        </EmptyState>
      ) : auctions.upcoming.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Yaklaşan İhale Bulunamadı</EmptyStateTitle>
          <EmptyStateMessage>Şu anda planlanmış yaklaşan ihale bulunmamaktadır.</EmptyStateMessage>
        </EmptyState>
      ) : (
        <AuctionsGrid>
          {auctions.upcoming.map((auction) => (
            <AuctionCard key={auction.id} onClick={() => handleAuctionClick(auction.id)}>
              <AuctionImage>
                {auction.land_listings?.images && auction.land_listings.images.length > 0 ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundImage: `url(${auction.land_listings.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                )}
              </AuctionImage>
              <AuctionContent>
                <AuctionTitle>{auction.land_listings?.title || 'Arsa'}</AuctionTitle>
                <AuctionLocation>{auction.land_listings?.location || 'Konum bilgisi yok'}</AuctionLocation>
                <AuctionDetails>
                  <AuctionPrice>
                    {formatPrice(auction.start_price || auction.startPrice)}
                  </AuctionPrice>
                  <AuctionStatus status="upcoming">Yaklaşan</AuctionStatus>
                </AuctionDetails>
              </AuctionContent>
            </AuctionCard>
          ))}
        </AuctionsGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;