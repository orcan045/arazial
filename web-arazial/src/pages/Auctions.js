import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAuctions } from '../services/auctionService';
import { supabase } from '../services/supabase';
import appState from '../services/appState';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  color: var(--color-text);
  margin-bottom: 0.75rem;
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  max-width: 800px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--color-primary);
  }
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
  height: 180px;
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

// Add a styled refresh button
const RefreshButton = styled.button`
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Auctions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [auctions, setAuctions] = useState({
    active: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create a function to load auctions that can be called multiple times
  const loadAuctions = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // First get all auctions, passing the forceRefresh parameter
      const { data, error } = await fetchAuctions(forceRefresh);
      
      if (error) throw error;
      
      // Add debug logging to see all auctions and their details
      console.log('All auctions from database:', data);
      
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
      
      // Modify the filtering logic to ensure auctions appear in only one tab
      // with a clear priority: active > upcoming > past
      const now = new Date();
      
      // 1. First, filter active auctions - status is 'active' OR current time is within window
      const active = auctionsWithHighestBids.filter(auction => {
        const startTime = new Date(auction.start_time || auction.startTime);
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        
        // Either explicitly marked as active
        if (status === 'active') return true;
        
        // OR current time is within auction window AND not marked as upcoming/ended
        return status !== 'upcoming' && status !== 'ended' && 
               now >= startTime && now <= endTime;
      });
      
      // 2. Then upcoming auctions - those NOT in active that are either:
      // - have status 'upcoming' OR 
      // - start time is in the future
      const activeIds = new Set(active.map(a => a.id));
      const upcoming = auctionsWithHighestBids.filter(auction => {
        // Skip if already in active tab
        if (activeIds.has(auction.id)) return false;
        
        const startTime = new Date(auction.start_time || auction.startTime);
        const status = auction.status;
        
        // Either explicitly marked as upcoming
        if (status === 'upcoming') return true;
        
        // OR start time is in the future AND not marked as ended
        return status !== 'ended' && now < startTime;
      });
      
      // 3. Finally, past auctions - anything not in active or upcoming that:
      // - has status 'ended' OR
      // - current time is after end time
      const upcomingIds = new Set(upcoming.map(a => a.id));
      const past = auctionsWithHighestBids.filter(auction => {
        // Skip if already in active or upcoming tabs
        if (activeIds.has(auction.id) || upcomingIds.has(auction.id)) return false;
        
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        
        // Either explicitly marked as ended
        if (status === 'ended') return true;
        
        // OR current time is after end time
        return now > endTime;
      });
      
      setAuctions({
        active,
        upcoming,
        past
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setError('Couldn\'t load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Add event listeners for page visibility changes
  useEffect(() => {
    // Initial data load
    loadAuctions();
    
    // Subscribe to refresh events from the central system
    const unsubscribe = appState.onRefresh(() => {
      console.log("[Auctions] Received refresh notification");
      loadAuctions();
    });
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Update the tab switching logic to not trigger a loading state unnecessarily
  const handleTabSwitch = (tab) => {
    // Only set loading if we don't have data for this tab yet
    if (auctions[tab].length === 0 && !error) {
      setLoading(true);
      
      // Small timeout to allow UI to update before setting loading to false
      // if we already have the data
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    
    setActiveTab(tab);
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
  
  const handleAuctionClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'upcoming': return 'Yaklaşan';
      case 'ended': case 'past': return 'Sonlandı';
      default: return '';
    }
  };
  
  const renderAuctions = () => {
    let auctionsToRender = [];
    
    switch (activeTab) {
      case 'active':
        auctionsToRender = auctions.active;
        break;
      case 'upcoming':
        auctionsToRender = auctions.upcoming;
        break;
      case 'past':
        auctionsToRender = auctions.past;
        break;
      default:
        auctionsToRender = auctions.active;
    }
    
    if (loading) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Veriler Yükleniyor</EmptyStateTitle>
          <EmptyStateMessage>Lütfen bekleyin, ihale bilgileri yükleniyor...</EmptyStateMessage>
        </EmptyState>
      );
    }
    
    if (error) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Hata Oluştu</EmptyStateTitle>
          <EmptyStateMessage>{error}</EmptyStateMessage>
          <RefreshButton onClick={() => loadAuctions(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Yenile
          </RefreshButton>
        </EmptyState>
      );
    }
    
    if (auctionsToRender.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>
            {activeTab === 'active' ? 'Aktif İhale Bulunamadı' : 
             activeTab === 'upcoming' ? 'Yaklaşan İhale Bulunamadı' : 
             'Geçmiş İhale Bulunamadı'}
          </EmptyStateTitle>
          <EmptyStateMessage>
            {activeTab === 'active' ? 'Şu anda aktif bir ihale bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.' : 
             activeTab === 'upcoming' ? 'Şu anda planlanmış yaklaşan ihale bulunmamaktadır.' : 
             'Geçmiş ihaleler bulunamadı.'}
          </EmptyStateMessage>
          <RefreshButton onClick={() => loadAuctions(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Yenile
          </RefreshButton>
        </EmptyState>
      );
    }
    
    return (
      <AuctionsGrid>
        {auctionsToRender.map((auction) => (
          <AuctionCard key={auction.id} onClick={() => handleAuctionClick(auction.id)}>
            <AuctionImage>
              {auction.images && auction.images.length > 0 ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundImage: `url(${auction.images[0]})`,
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
              <AuctionTitle>{auction.title || 'Arsa'}</AuctionTitle>
              <AuctionLocation>{auction.location || 'Konum bilgisi yok'}</AuctionLocation>
              <AuctionDetails>
                <AuctionPrice>
                  {formatPrice(
                    activeTab === 'upcoming' 
                      ? (auction.start_price || auction.startPrice)
                      : (auction.highest_bid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice)
                  )}
                </AuctionPrice>
                <AuctionStatus status={activeTab}>{getStatusText(activeTab)}</AuctionStatus>
              </AuctionDetails>
            </AuctionContent>
          </AuctionCard>
        ))}
      </AuctionsGrid>
    );
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <PageTitle>Arsa İhaleleri</PageTitle>
            <PageDescription>
              Türkiye genelinde mevcut arsa ihalelerini görüntüleyin ve tekliflerinizi verin.
            </PageDescription>
          </div>
          <RefreshButton onClick={() => loadAuctions(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Yenile
          </RefreshButton>
        </div>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => handleTabSwitch('active')}
        >
          Aktif İhaleler ({auctions.active.length})
        </Tab>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => handleTabSwitch('upcoming')}
        >
          Yaklaşan İhaleler ({auctions.upcoming.length})
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => handleTabSwitch('past')}
        >
          Sonlanan İhaleler ({auctions.past.length})
        </Tab>
      </TabsContainer>
      
      {renderAuctions()}
    </PageContainer>
  );
};

export default Auctions; 