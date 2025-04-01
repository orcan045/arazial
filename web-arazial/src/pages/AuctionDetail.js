import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import appState from '../services/appState';
import CountdownTimer from '../components/CountdownTimer';
import Button from '../components/ui/Button';

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

const PropertyLabel = styled.label`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: block;
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
  border: 1px solid var(--color-border-light);
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

// --- Add New Styled Components for Offer Section ---
const OfferInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const OfferButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
`;

const OfferStatusMessage = styled.div`
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
  background-color: ${props => 
    props.status === 'pending' ? 'rgba(251, 191, 36, 0.1)' :
    props.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' :
    props.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' :
    'var(--color-background)'
  };
  color: ${props => 
    props.status === 'pending' ? '#D97706' :
    props.status === 'accepted' ? '#059669' :
    props.status === 'rejected' ? '#DC2626' :
    'var(--color-text-secondary)'
  };
`;

// --- Add New Icon Component --- 
const OfferIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.536c.445.272.99.272 1.435 0l.879-.536M7.5 14.25a3 3 0 0 0-3 3h15a3 3 0 0 0-3-3m-10.5-1.5a3 3 0 0 1 3-3h7.5a3 3 0 0 1 3 3" />
  </svg>
);

// --- Loading Spinner Component (Add this back) ---
const LoadingSpinner = ({ message }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
    <LoadingIcon />
    <p>{message || 'Yükleniyor...'}</p>
  </div>
);

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, profile } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // --- New State for Offers ---
  const [userOffers, setUserOffers] = useState([]);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerError, setOfferError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBidError(null);
    setOfferError(null);
    setUserOffers([]);

    try {
      // 1. Fetch Auction Details
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*, profiles ( full_name, avatar_url )')
        .eq('id', id)
        .single();

      if (auctionError || !auctionData) {
        throw auctionError || new Error('İlan bulunamadı.');
      }
      setAuction(auctionData);

      // 2. Fetch Bids OR Offers based on type
      if (auctionData.listing_type === 'auction') {
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('*, profiles ( full_name, avatar_url )')
          .eq('auction_id', id)
          .order('created_at', { ascending: false });

        if (bidsError) {
          console.error('Error fetching bids:', bidsError);
        }
        setBids(bidsData || []);
        
      } else if (auctionData.listing_type === 'offer') {
        // Fetch user's offers for THIS listing if logged in
        if (user?.id) {
            const { data: offersData, error: offersError } = await supabase
                .from('offers')
                .select('*')
                .eq('auction_id', id)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (offersError) {
                console.error("Error fetching user's offers:", offersError);
            } else {
                setUserOffers(offersData || []);
            }
        } else {
             // Not logged in, cannot fetch or make offers
             setUserOffers([]);
        }
      }

    } catch (err) {
      console.error('Error fetching auction details:', err);
      setError(err.message || 'İlan detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data when app becomes visible again
  useEffect(() => {
    const unsubscribe = appState.onVisibilityChange((isVisible) => {
      if (isVisible) {
        console.log('Tab became visible, refreshing auction details...');
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [fetchData]);

  const refreshBids = async () => {
    if (!auction || auction.listing_type !== 'auction') return;
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*, profiles ( full_name, avatar_url )')
        .eq('auction_id', auction.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error refreshing bids:', error);
    }
  };

  const handleSubmitBid = async (e) => {
    console.log("--- Executing handleSubmitBid ---");
    e.preventDefault();
    if (!user) {
      setBidError('Teklif vermek için giriş yapmalısınız.');
      return;
    }
    if (!auction || auction.listing_type !== 'auction') {
      setBidError('Bu ilana teklif verilemez.');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    const minimumBid = getMinimumBidAmount();
    
    if (isNaN(amount) || amount <= 0) {
      setBidError('Geçerli bir teklif miktarı girin.');
      return;
    }
    
    if (amount < minimumBid) {
      setBidError(`Minimum teklif ${formatPrice(minimumBid)} olmalıdır.`);
      return;
    }
    
    const currentStatus = getAuctionStatus();
    if (currentStatus !== 'active') {
       setBidError('Teklif verme süresi dolmuş veya henüz başlamamıştır.');
       return;
    }
    
    setSubmitLoading(true);
    setBidError(null);
    
    try {
      const { error: insertError } = await supabase.from('bids').insert({
        auction_id: auction.id,
        user_id: user.id,
        amount: amount,
      });
      
      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
           throw new Error('Kısa süre içinde birden fazla teklif veremezsiniz veya teklifiniz çok düşük.');
        } else {
           throw insertError;
        }
      }
      
      setBidAmount('');
      await refreshBids();
      
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError(error.message || 'Teklif gönderilirken bir hata oluştu.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const refreshOffers = useCallback(async () => {
    if (!auction || auction.listing_type !== 'offer' || !user?.id) return;
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('auction_id', auction.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserOffers(data || []);
    } catch (error) {
      console.error("Error refreshing user's offers:", error);
    }
  }, [auction, user?.id]);

  const handleSubmitOffer = async (e) => {
    console.log("--- Executing handleSubmitOffer ---");
    e.preventDefault();
    if (!user) {
      setOfferError('Teklif vermek için giriş yapmalısınız.');
      return;
    }
    if (!auction || auction.listing_type !== 'offer') {
      setOfferError('Bu ilana teklif verilemez.');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setOfferError('Lütfen geçerli bir teklif miktarı girin.');
      return;
    }

    // Double-check if user already has a pending or accepted offer just before submitting
    const { data: existingOffers, error: checkError } = await supabase
        .from('offers')
        .select('id, status')
        .eq('auction_id', auction.id)
        .eq('user_id', user.id)
        .in('status', ['pending', 'accepted'])
        .limit(1);

    if (checkError) {
        console.error('Error checking existing offers before submit:', checkError);
        setOfferError('Teklif durumu kontrol edilirken hata oluştu. Lütfen tekrar deneyin.');
        return;
    }

    if (existingOffers && existingOffers.length > 0) {
        const existingOffer = existingOffers[0];
        setOfferError(`Zaten ${existingOffer.status === 'pending' ? 'beklemede olan' : 'kabul edilmiş'} bir teklifiniz var.`);
        await refreshOffers(); // Refresh state to be sure
        return;
    }

    setSubmitLoading(true);
    setOfferError(null);

    try {
      const { error: insertError } = await supabase.from('offers').insert({
        auction_id: auction.id,
        user_id: user.id,
        amount: amount,
        // status defaults to 'pending' in the database
      });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation code for unique_pending_offer_per_user_auction
            throw new Error('Bu ilan için zaten beklemede olan bir teklifiniz var. Sayfayı yenileyin.');
        } else {
            throw insertError;
        }
      }

      setOfferAmount(''); // Clear input
      await refreshOffers(); // Refresh offers to show the new pending one

    } catch (error) {
      console.error('Error submitting offer:', error);
      setOfferError(error.message || 'Teklif gönderilirken bir hata oluştu.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Belirtilmemiş';
    try {
        return `₺${parseFloat(price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch { 
        return 'Hatalı Fiyat';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('tr-TR', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    } catch (e) {
      return 'Geçersiz Tarih';
    }
  };

  const getAuctionStatus = useCallback(() => {
    if (!auction) return 'loading';
    // For 'offer' type, status might be less relevant, but we keep the date logic for consistency
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);

    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    return 'active'; // Even offers can be considered 'active' during their listing window
  }, [auction]);

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'upcoming': return 'Yakında';
      case 'ended': return 'Sona Erdi';
      default: return 'Yükleniyor...';
    }
  };
  
  const getStatusIcon = (status) => {
      // Using same icons for simplicity, could be customized for offers
      switch (status) {
        case 'active': return <TimerIcon />;
        case 'upcoming': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
        case 'ended': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
        default: return null;
      }
    };

  // Only relevant for auctions
  const getMinimumBidAmount = useCallback(() => {
    if (!auction || auction.listing_type !== 'auction') return 0;
    const highestBid = bids[0]?.amount || 0;
    const startPrice = auction.start_price || 0;
    const minIncrement = auction.min_increment || 1;
    const currentPrice = Math.max(highestBid, startPrice);
    return currentPrice === startPrice ? startPrice : currentPrice + minIncrement; // Can bid start price initially
  }, [auction, bids]);

  const handleTimerComplete = useCallback(() => {
    console.log('Timer completed, refetching data...');
    fetchData();
  }, [fetchData]);
  
  if (loading && !auction) { 
      return <PageContainer><LoadingSpinner message="İlan yükleniyor..." /></PageContainer>;
  }

  if (error) {
      return <PageContainer><p style={{ color: 'red' }}>Hata: {error}</p></PageContainer>;
  }

  if (!auction) {
      return <PageContainer><p>İlan bulunamadı.</p></PageContainer>;
  }

  const currentStatus = getAuctionStatus();
  const isOfferListing = auction.listing_type === 'offer';
  
  // Determine offer state for rendering
  const userActiveOffer = isOfferListing ? userOffers.find(o => o.status === 'pending' || o.status === 'accepted') : null;
  const showOfferForm = isOfferListing && user && !authLoading && !userActiveOffer;
  const showRejectedMessage = isOfferListing && user && !authLoading && userOffers.find(o => o.status === 'rejected') && !userActiveOffer;

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg> Geri Dön
      </BackButton>
      
      <AuctionHeader>
          <AuctionStatus status={currentStatus}>
            {getStatusIcon(currentStatus)}
            {getStatusText(currentStatus)}
          </AuctionStatus>
        <AuctionTitle>{auction.title}</AuctionTitle>
        <AuctionLocation>
            <LocationIcon /> {auction.location || 'Konum belirtilmemiş'}
        </AuctionLocation>
        
        <AuctionMeta>
            {/* Price Display */} 
            <MetaItem>
                <MetaLabel>{isOfferListing ? 'Liste Fiyatı' : 'Başlangıç Fiyatı'}</MetaLabel>
                <MetaValue>{formatPrice(auction.start_price)}</MetaValue>
            </MetaItem>
            {/* Min Increment (Auction Only) */} 
            {!isOfferListing && (
                <MetaItem>
                    <MetaLabel>Min. Artış</MetaLabel>
                    <MetaValue>{formatPrice(auction.min_increment)}</MetaValue>
                </MetaItem>
            )}
            {/* Highest Bid (Auction Only) */} 
             {!isOfferListing && bids.length > 0 && (
                 <MetaItem>
                    <MetaLabel>En Yüksek Teklif</MetaLabel>
                    <MetaValue>{formatPrice(bids[0]?.amount)}</MetaValue>
                 </MetaItem>
             )}
             {/* Other Details */} 
             {auction.property_type && (
                  <MetaItem>
                    <MetaLabel>Emlak Tipi</MetaLabel>
                    <MetaValue>{auction.property_type}</MetaValue>
                  </MetaItem>
             )}
             {auction.area_sqm && (
                  <MetaItem>
                    <MetaLabel>Alan (m²)</MetaLabel>
                    <MetaValue>{auction.area_sqm} m²</MetaValue>
                  </MetaItem>
             )}
              {auction.zoning_status && (
                  <MetaItem>
                    <MetaLabel>İmar Durumu</MetaLabel>
                    <MetaValue>{auction.zoning_status}</MetaValue>
                  </MetaItem>
             )}
        </AuctionMeta>
        
      </AuctionHeader>

      <AuctionContainer>
        {/* --- Left Column (Details) --- */} 
        <Column>
            {/* Image Gallery Card */} 
             {auction.images && auction.images.length > 0 && (
                 <Card>
                    <CardHeader><CardTitle><PropertyIcon/> İlan Resimleri</CardTitle></CardHeader>
                    <CardContent>
                        <ImageGallery>
                        {auction.images.map((img, index) => (
                            <ImageThumbnail key={index} style={{ backgroundImage: `url(${img})` }} title={`Resim ${index + 1}`}/>
                        ))}
                        </ImageGallery>
                    </CardContent>
                </Card>
            )}

          {/* Description Card */} 
          <Card>
            <CardHeader><CardTitle><InfoIcon/> İlan Açıklaması</CardTitle></CardHeader>
            <CardContent>
              <Description>{auction.description || 'Açıklama girilmemiş.'}</Description>
            </CardContent>
          </Card>

           {/* Property Details Card */} 
          <Card>
             <CardHeader><CardTitle><PropertyIcon/> İlan Detayları</CardTitle></CardHeader>
             <CardContent>
                <PropertyGrid>
                    <PropertyItem>
                        <PropertyLabel>Konum</PropertyLabel>
                        <PropertyValue>{auction.location || '-'}</PropertyValue>
                    </PropertyItem>
                     <PropertyItem>
                        <PropertyLabel>Emlak Tipi</PropertyLabel>
                        <PropertyValue>{auction.property_type || '-'}</PropertyValue>
                    </PropertyItem>
                    <PropertyItem>
                        <PropertyLabel>Alan (m²)</PropertyLabel>
                        <PropertyValue>{auction.area_sqm ? `${auction.area_sqm} m²` : '-'}</PropertyValue>
                    </PropertyItem>
                    <PropertyItem>
                        <PropertyLabel>İmar Durumu</PropertyLabel>
                        <PropertyValue>{auction.zoning_status || '-'}</PropertyValue>
                    </PropertyItem>
                      <PropertyItem>
                        <PropertyLabel>Ada No</PropertyLabel>
                        <PropertyValue>{auction.parcel_island || '-'}</PropertyValue>
                    </PropertyItem>
                    <PropertyItem>
                        <PropertyLabel>Parsel No</PropertyLabel>
                        <PropertyValue>{auction.parcel_number || '-'}</PropertyValue>
                    </PropertyItem>
                     <PropertyItem>
                        <PropertyLabel>İlan Sahibi</PropertyLabel>
                        <PropertyValue>{auction.profiles?.full_name || 'Bilinmiyor'}</PropertyValue>
                    </PropertyItem>
                    <PropertyItem>
                        <PropertyLabel>İlan Tarihi</PropertyLabel>
                        <PropertyValue>{formatDate(auction.created_at)}</PropertyValue>
                    </PropertyItem>
                    {/* Show Auction Times only for Auctions */}
                    {!isOfferListing && (
                        <>
                        <PropertyItem>
                            <PropertyLabel>Başlangıç Zamanı</PropertyLabel>
                            <PropertyValue>{formatDate(auction.start_time)}</PropertyValue>
                        </PropertyItem>
                        <PropertyItem>
                            <PropertyLabel>Bitiş Zamanı</PropertyLabel>
                            <PropertyValue>{formatDate(auction.end_time)}</PropertyValue>
                        </PropertyItem>
                        </>
                    )}
                </PropertyGrid>
             </CardContent>
          </Card>
          
        </Column>

        {/* --- Right Column (Actions) --- */} 
        <Column style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            {/* Action Card (Bids or Offers) */} 
             <Card>
                <CardHeader>
                    <CardTitle>
                         {isOfferListing ? <><OfferIcon/> Teklif Yap</> : <><BidsIcon/> Teklifler</>}
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    {/* --- AUCTION BIDDING UI --- */} 
                     {!isOfferListing && (
                        <>
                            {/* Timer for Auctions */} 
                            <TimerWrapper>
                                <TimerLabel>
                                    {currentStatus === 'active' ? 'Kalan Süre:' : 
                                     currentStatus === 'upcoming' ? 'Başlamasına:' : 'Sona Erdi'}
                                </TimerLabel>
                                <CountdownTimer 
                                    startTime={auction.start_time} 
                                    endTime={auction.end_time} 
                                    onComplete={handleTimerComplete} 
                                />
                            </TimerWrapper>
                            
                            {/* Bid Form for Active Auctions */} 
                            {currentStatus === 'active' && (
                                <form onSubmit={handleSubmitBid} style={{ marginTop: '1.5rem' }}>
                                    {!user && !authLoading && (
                                        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Teklif vermek için <a href="/login">giriş yapın</a>.</p>
                                    )}
                                    {user && (
                                        <>
                                            <PropertyLabel htmlFor="bidAmount">Teklifiniz (Min: {formatPrice(getMinimumBidAmount())})</PropertyLabel>
                                            <OfferInput 
                                                type="number"
                                                id="bidAmount"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min. ${formatPrice(getMinimumBidAmount())}`}
                                                step="any"
                                                required 
                                                disabled={submitLoading || authLoading}
                                            />
                                            {bidError && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>{bidError}</p>}
                                            <OfferButton type="submit" disabled={submitLoading || authLoading}>
                                                {submitLoading ? <LoadingIcon /> : 'Teklif Ver'}
                                            </OfferButton>
                                        </>
                                    )}
                                </form>
                            )}
                            
                            {/* Messages for non-active auctions */} 
                             {currentStatus !== 'active' && (
                                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                     {currentStatus === 'upcoming' ? 'Teklif verme henüz başlamadı.' : 'Teklif verme sona erdi.'}
                                </p>
                            )}
                            
                            {/* Bid History */} 
                             <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>Teklif Geçmişi</h3>
                             {bids.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '1rem 0' }}>
                                    <NoBidsIcon />
                                    <p>Henüz teklif yapılmadı.</p>
                                </div>
                            ) : (
                                <BidsList>
                                    {bids.map(bid => (
                                        <BidItem key={bid.id}>
                                            <BidUser>
                                                 <UserAvatar src={bid.profiles?.avatar_url || '/default-avatar.png'} alt={`${bid.profiles?.full_name || 'Kullanıcı'} avatar`} /> 
                                                 {bid.profiles?.full_name || 'Gizli Kullanıcı'}
                                            </BidUser>
                                            <BidAmount>{formatPrice(bid.amount)}</BidAmount>
                                            <BidTime>{formatDate(bid.created_at)}</BidTime>
                                        </BidItem>
                                    ))}
                                </BidsList>
                            )}
                        </>
                    )}
                    
                     {/* --- OFFER SUBMISSION UI --- */} 
                     {isOfferListing && (
                        <>
                            {/* Login prompt */} 
                            {!user && !authLoading && (
                                 <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                    Teklif yapmak için <a href="/login">giriş yapmanız</a> gerekmektedir.
                                 </p>
                            )}
                            
                            {/* Loading Auth prompt */} 
                            {authLoading && (
                                 <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                     Kullanıcı bilgileri yükleniyor...
                                 </p>
                            )}
                            
                            {/* Display existing pending/accepted offer */} 
                            {user && !authLoading && userActiveOffer && (
                                <OfferStatusMessage status={userActiveOffer.status}>
                                    Mevcut Teklifiniz: {formatPrice(userActiveOffer.amount)} 
                                    ({userActiveOffer.status === 'pending' ? 'Beklemede' : 'Kabul Edildi'})
                                </OfferStatusMessage>
                            )}
                            
                            {/* Message about rejected offer */} 
                            {user && !authLoading && showRejectedMessage && (
                                <OfferStatusMessage status="rejected">
                                     Önceki teklifiniz reddedildi. Yeni bir teklif yapabilirsiniz.
                                </OfferStatusMessage>
                            )}
                            
                            {/* Show Offer Form */} 
                            {showOfferForm && (
                                <form onSubmit={handleSubmitOffer} style={{ marginTop: showRejectedMessage ? '1.5rem' : '0' }}>
                                    <PropertyLabel htmlFor="offerAmount">Teklif Miktarınız</PropertyLabel>
                                    <OfferInput 
                                        type="number"
                                        id="offerAmount"
                                        value={offerAmount}
                                        onChange={(e) => setOfferAmount(e.target.value)}
                                        placeholder="Teklifinizi Girin (₺)"
                                        step="any"
                                        required 
                                        disabled={submitLoading}
                                    />
                                     {offerError && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>{offerError}</p>}
                                     <OfferButton type="submit" disabled={submitLoading}>
                                        {submitLoading ? <LoadingIcon /> : 'Teklifi Gönder'}
                                     </OfferButton>
                                </form>
                            )}
                        </>
                    )}
                 </CardContent>
             </Card>
        </Column>
        
      </AuctionContainer>
    </PageContainer>
  );
};

export default AuctionDetail; 