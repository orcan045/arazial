import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAuctionById, getAuctionBids, placeBid } from '../services/auctionService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import appState from '../services/appState';
import CountdownTimer from '../components/CountdownTimer';

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
  margin-bottom: 1.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
    color: var(--color-primary-dark);
  }
`;

const AuctionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 7fr 3fr;
  }
`;

const AuctionHeader = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  }
`;

const AuctionTitle = styled.h1`
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  line-height: 1.2;
`;

const AuctionLocation = styled.div`
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--color-primary);
  }
`;

const AuctionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const MetaValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
`;

const AuctionStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-radius: var(--border-radius-lg);
  margin-right: auto;
  
  @media (max-width: 768px) {
    margin-right: 0;
    width: 100%;
    justify-content: center;
  }
`;

const TimerLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-right: 0.75rem;
  font-weight: 500;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.section`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--color-primary);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PropertyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PropertyLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
`;

const HighlightedValue = styled(PropertyValue)`
  font-size: 1.125rem;
  color: var(--color-primary);
  font-weight: 600;
`;

const Description = styled.div`
  line-height: 1.7;
  color: var(--color-text);
  white-space: pre-line;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ImageThumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  background-position: center;
  background-size: cover;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-light);
  }
`;

const BidContainer = styled.div`
  background: linear-gradient(to bottom, rgba(var(--color-primary-rgb), 0.05), white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  border: 1px solid rgba(var(--color-primary-rgb), 0.1);
`;

const CurrentPrice = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const PriceAmount = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.1;
`;

const MinimumIncrement = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  text-align: center;
`;

const BidForm = styled.form`
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
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
  padding: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const BidButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
    transform: none;
  }
`;

const Error = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(var(--color-error-rgb), 0.05);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-error);
`;

const BidsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const BidItem = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  
  &:first-child {
    background-color: rgba(var(--color-primary-rgb), 0.05);
    
    ${PropertyValue} {
      color: var(--color-primary);
      font-weight: 600;
    }
  }
  
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
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  
  ${BidItem}:first-child & {
    color: var(--color-primary);
  }
`;

const EmptyBids = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.4;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  
  svg {
    animation: spin 1.5s linear infinite;
    width: 40px;
    height: 40px;
    color: var(--color-primary);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
`;

// Icon components for better UI
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const PropertyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BidsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const NoBidsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

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
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
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
        const { data: bidsData, error: bidsError } = await getAuctionBids(id);
        if (bidsError) throw bidsError;
        
        console.log('Bids data received:', bidsData);
        setBids(bidsData || []);
        
        // If there are images, set the first one as selected
        if (auctionData.images && auctionData.images.length > 0) {
          setSelectedImage(auctionData.images[0]);
        }
        
      } catch (err) {
        console.error('Error fetching auction details:', err);
        setError(err.message || 'Failed to load auction details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription to the auction
    const auctionSubscription = supabase
      .channel(`auction-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${id}`
      }, (payload) => {
        console.log('Auction updated:', payload);
        setAuction(old => ({...old, ...payload.new}));
      })
      .subscribe();
      
    // Set up real-time subscription to bids
    const bidsSubscription = supabase
      .channel(`bids-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${id}`
      }, () => {
        // Refresh bids when a new one is placed
        refreshBids();
      })
      .subscribe();
    
    return () => {
      // Clean up subscriptions
      supabase.removeChannel(auctionSubscription);
      supabase.removeChannel(bidsSubscription);
    };
  }, [id]);

  // Effect to handle timer expiry
  useEffect(() => {
    if (shouldRefresh) {
      const refreshData = async () => {
        try {
          // Fetch auction details
          const { data: auctionData } = await getAuctionById(id);
          setAuction(auctionData);
          
          // Fetch bids
          const { data: bidsData } = await getAuctionBids(id);
          setBids(bidsData || []);
          
          setShouldRefresh(false);
        } catch (err) {
          console.error('Error refreshing data after timer completion:', err);
        }
      };
      
      refreshData();
    }
  }, [shouldRefresh, id]);
  
  // When auction or bids data changes, update the bid amount field
  useEffect(() => {
    if (auction && canBid) {
      // Set the initial bid amount to the minimum allowed bid
      setBidAmount(getMinimumBidAmount().toString());
    }
  }, [auction, bids]);
  
  const refreshBids = async () => {
    try {
      const { data: bidsData, error: bidsError } = await getAuctionBids(id);
      if (bidsError) throw bidsError;
      
      setBids(bidsData || []);
    } catch (err) {
      console.error('Error refreshing bids:', err);
    }
  };
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setBidError('Lütfen teklif vermek için giriş yapın');
      return;
    }
    
    // Validate bid amount
    const amount = parseFloat(bidAmount);
    const minimumBid = getMinimumBidAmount();
    
    if (isNaN(amount) || amount < minimumBid) {
      setBidError(`Teklifiniz en az ${formatPrice(minimumBid)} olmalıdır`);
      return;
    }
    
    try {
      setBidLoading(true);
      setBidError(null);
      
      const { success, error } = await placeBid(id, amount);
      
      if (error) {
        setBidError(error.message || 'Teklif verilirken bir hata oluştu. Lütfen tekrar deneyin.');
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
      setBidError('Teklif verilirken bir hata oluştu. Lütfen tekrar deneyin.');
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
    const startTime = new Date(auction.start_time || auction.startTime || auction.start_date || auction.startDate);
    const endTime = new Date(auction.end_time || auction.endTime || auction.end_date || auction.endDate);
    
    // If status is explicitly set to 'active' in the database, prioritize it
    // This allows admins to override the time-based logic
    if (auction.status === 'active') {
      return 'active';
    }
    
    // Time-based logic for auctions without explicit status
    if (now >= startTime && now <= endTime) {
      return 'active';
    } else if (now < startTime) {
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
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>;
      case 'upcoming': 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>;
      default: 
        return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>;
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

  const handleTimerComplete = () => {
    console.log('Auction timer completed');
    setShouldRefresh(true);
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingState>
          <LoadingIcon />
          <LoadingText>Arsa Bilgileri Yükleniyor...</LoadingText>
        </LoadingState>
      </PageContainer>
    );
  }
  
  if (error || !auction) {
    return (
      <PageContainer>
        <div>
          <BackButton onClick={() => navigate('/auctions')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            İhalelere Geri Dön
          </BackButton>
          <div>{error || 'İhale bulunamadı'}</div>
        </div>
      </PageContainer>
    );
  }
  
  const status = getAuctionStatus();
  // Allow bidding if:
  // 1. Auction is in the 'active' state AND user is logged in
  // 2. OR explicitly set to 'active' in the database AND user is logged in (administrative override)
  const canBid = (status === 'active' || auction.status === 'active') && !!user;
  const auctionEndTime = auction.end_time || auction.endTime || auction.end_date || auction.endDate;
  const currentPrice = bids.length > 0 
    ? bids[0].amount
    : (auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice);
  const highestBidder = bids.length > 0 ? bids[0].profiles?.full_name || 'Anonim' : null;
  
  console.log('Auction status debug:', {
    auctionId: id,
    dbStatus: auction.status,
    calculatedStatus: status,
    canBid,
    startTime: auction.start_time || auction.startTime,
    endTime: auction.end_time || auction.endTime,
    now: new Date().toISOString()
  });
  
  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/auctions')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        İhalelere Geri Dön
      </BackButton>
      
      <AuctionHeader>
        <AuctionStatus status={status}>
          {getStatusIcon(status)}
          {getStatusText(status)}
        </AuctionStatus>
        <AuctionTitle>{auction.title || 'Arsa'}</AuctionTitle>
        <AuctionLocation>
          <LocationIcon />
          {auction.location || 'Konum bilgisi yok'}
        </AuctionLocation>
        
        <AuctionMeta>
          {status === 'active' && auctionEndTime && (
            <TimerWrapper>
              <TimerLabel>Kalan Süre:</TimerLabel>
              <CountdownTimer 
                endTime={auctionEndTime} 
                onComplete={handleTimerComplete}
                showSeconds={true}
                alwaysVisible={true}
                auctionId={id}
              />
            </TimerWrapper>
          )}
          
          <MetaItem>
            <MetaLabel>Başlangıç Fiyatı</MetaLabel>
            <MetaValue>{formatPrice(auction.start_price || auction.startPrice)}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Mevcut Fiyat</MetaLabel>
            <MetaValue style={{color: 'var(--color-primary)'}}>{formatPrice(currentPrice)}</MetaValue>
          </MetaItem>
          
          <MetaItem>
            <MetaLabel>Artış Miktarı</MetaLabel>
            <MetaValue>{formatPrice(auction.min_increment || auction.minIncrement)}</MetaValue>
          </MetaItem>
        </AuctionMeta>
      </AuctionHeader>
      
      <AuctionContainer>
        <Column>
          {auction.images && auction.images.length > 0 && (
            <Card>
              <CardContent style={{ padding: 0 }}>
                <div style={{ 
                  width: '100%', 
                  height: '400px',
                  backgroundImage: `url(${selectedImage || auction.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderTopLeftRadius: 'var(--border-radius-lg)',
                  borderTopRightRadius: 'var(--border-radius-lg)'
                }} />
                <ImageGallery style={{ padding: '1rem' }}>
                  {auction.images.map((image, index) => (
                    <ImageThumbnail 
                      key={index} 
                      style={{ 
                        backgroundImage: `url(${image})`,
                        borderColor: selectedImage === image ? 'var(--color-primary)' : 'transparent'
                      }}
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
                </ImageGallery>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>
                <PropertyIcon />
                Arsa Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid>
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
                {auction.parcel_number && (
                  <PropertyItem>
                    <PropertyLabel>Parsel Numarası</PropertyLabel>
                    <PropertyValue>{auction.parcel_number}</PropertyValue>
                  </PropertyItem>
                )}
                {auction.zoning_status && (
                  <PropertyItem>
                    <PropertyLabel>İmar Durumu</PropertyLabel>
                    <PropertyValue>{auction.zoning_status}</PropertyValue>
                  </PropertyItem>
                )}
              </PropertyGrid>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <InfoIcon />
                Detaylı Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Description>
                {auction.description || 'Bu arsa için ayrıntılı açıklama bulunmamaktadır.'}
              </Description>
            </CardContent>
          </Card>
        </Column>
        
        <Column>
          {canBid && (
            <BidContainer>
              <CurrentPrice>
                <PriceLabel>Mevcut Fiyat</PriceLabel>
                <PriceAmount>{formatPrice(currentPrice)}</PriceAmount>
                {highestBidder && (
                  <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    En Yüksek Teklif: {highestBidder}
                  </div>
                )}
                <MinimumIncrement>
                  Minimum Artış: {formatPrice(auction.min_increment || auction.minIncrement)}
                </MinimumIncrement>
              </CurrentPrice>
              
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
                <BidButton type="submit" disabled={bidLoading}>
                  {bidLoading ? 'İşleniyor...' : 'Teklif Ver'}
                </BidButton>
              </BidForm>
            </BidContainer>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                <BidsIcon />
                Teklifler
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              {bids.length > 0 ? (
                <BidsList>
                  {bids.map((bid, index) => (
                    <BidItem key={bid.id}>
                      <BidderInfo>
                        <BidderName>
                          {bid.profiles?.full_name || 'Anonim'}
                          {index === 0 && (
                            <span style={{ 
                              marginLeft: '0.5rem',
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              backgroundColor: 'rgba(5, 150, 105, 0.1)',
                              color: 'rgb(5, 150, 105)',
                              borderRadius: 'var(--border-radius-full)',
                              fontWeight: '600'
                            }}>
                              Lider
                            </span>
                          )}
                        </BidderName>
                        <BidTime>{formatDate(bid.created_at)}</BidTime>
                      </BidderInfo>
                      <BidAmount>{formatPrice(bid.amount)}</BidAmount>
                    </BidItem>
                  ))}
                </BidsList>
              ) : (
                <EmptyBids>
                  <NoBidsIcon />
                  <div>Henüz teklif bulunmuyor</div>
                </EmptyBids>
              )}
            </CardContent>
          </Card>
          
          {status === 'ended' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  İhale Sonucu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyGrid>
                  <PropertyItem>
                    <PropertyLabel>Sonuç</PropertyLabel>
                    <HighlightedValue>
                      {bids.length > 0 ? 'Tamamlandı' : 'Teklif Olmadan Sonlandı'}
                    </HighlightedValue>
                  </PropertyItem>
                  {bids.length > 0 && (
                    <>
                      <PropertyItem>
                        <PropertyLabel>Kazanan</PropertyLabel>
                        <HighlightedValue>
                          {bids[0].profiles?.full_name || 'Anonim'}
                        </HighlightedValue>
                      </PropertyItem>
                      <PropertyItem>
                        <PropertyLabel>Kazanan Teklif</PropertyLabel>
                        <HighlightedValue>
                          {formatPrice(bids[0].amount)}
                        </HighlightedValue>
                      </PropertyItem>
                    </>
                  )}
                </PropertyGrid>
              </CardContent>
            </Card>
          )}
        </Column>
      </AuctionContainer>
    </PageContainer>
  );
};

export default AuctionDetail; 