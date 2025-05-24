import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAuctions, fetchNegotiations } from '../services/auctionService';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import Button from '../components/ui/Button';

// Hero section and modern homepage styling
const HeroSection = styled.section`
  height: 600px;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 320px;
    padding: 1rem;
    justify-content: flex-start;
    padding-top: 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  max-width: 800px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 1rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--color-primary-dark, #003366);
  margin-bottom: 2.5rem;
  max-width: 700px;
  line-height: 1.6;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  max-width: 900px;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SearchTab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--color-primary-dark)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const SearchInputGroup = styled.div`
  width: 100%;
`;

const SearchInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    width: 1.25rem;
    height: 1.25rem;
  }
  
  select, input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
    }
    
    @media (max-width: 768px) {
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      font-size: 0.9rem;
    }
  }
  
  select {
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236E6E6E' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
  }
  
  @media (max-width: 768px) {
    svg {
      left: 0.75rem;
      width: 1rem;
      height: 1rem;
    }
    
    select {
      background-position: right 0.75rem center;
    }
  }
`;

const SearchButton = styled(Button)`
  padding: 1rem 2rem;
  min-height: auto;
  border-radius: 6px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    min-height: 45px;
    padding: 0.5rem 1.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  position: relative;
  width: 100%;
  gap: 0.5rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 0;
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.$isActive ? 'white' : 'var(--color-text)'};
  background: ${props => props.$isActive ? 'var(--color-primary)' : 'white'};
  border: 1px solid ${props => props.$isActive ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$isActive ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    background: ${props => props.$isActive ? 'var(--color-primary-dark)' : 'rgba(0, 0, 0, 0.02)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

const StatusTabs = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-top: 0.5rem;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 1rem;
    padding-top: 0;
  }
`;

const StatusTab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? 'var(--color-primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    background: ${props => props.active ? 'var(--color-primary-dark)' : 'rgba(0, 0, 0, 0.02)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const PopularSearches = styled.div`
  margin-top: 1.5rem;
  
  span {
    color: var(--color-primary-dark, #003366);
    font-size: 0.9rem;
    margin-right: 0.5rem;
    font-weight: 500;
  }
  
  a {
    color: var(--color-primary-dark, #003366);
    margin-right: 1.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: var(--color-primary);
      text-decoration: underline;
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 0.25rem;
    margin-bottom: 0;
    
    a {
      margin-right: 1rem;
      font-size: 0.85rem;
    }
  }
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 2rem;
  background-color: #f9fafb;
  border-radius: 16px;
  margin-top: -3rem;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-top: -1rem;
    border-radius: 0;
    box-shadow: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const SectionDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AuctionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const AuctionCard = styled.div`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const AuctionImage = styled.div`
  height: 200px;
  background-color: #f9fafb;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${AuctionCard}:hover & img {
    transform: scale(1.05);
  }
`;

const AuctionStatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.type === 'offer' ? 'rgba(234, 88, 12, 0.9)' :  // Orange for offers
    props.status === 'active' ? 'rgba(5, 150, 105, 0.9)' : // Green for active
    props.status === 'upcoming' ? 'rgba(37, 99, 235, 0.9)' : // Blue for upcoming
    props.status === 'completed' || props.status === 'ended' ? 'rgba(107, 114, 128, 0.9)' : // Gray for completed
    'rgba(239, 68, 68, 0.9)' // Red for others
  };
  color: white;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const AuctionContent = styled.div`
  padding: 1.5rem;
`;

const AuctionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuctionLocation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`;

const AuctionDetails = styled.div`
  border-top: 1px solid #eaeaea;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuctionPrice = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-text);
`;

const AuctionCountdown = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  span {
    color: var(--color-primary);
    font-weight: 600;
  }
`;

const ViewMoreButton = styled(Button)`
  margin: 3rem auto 1.5rem;
  display: block;
  min-width: 200px;
`;

// Icons
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const AuctionTypeTag = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  z-index: 1;
`;

const AuctionStatus = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => 
    props.status === 'active' ? 'rgb(5, 150, 105)' : 
    props.status === 'upcoming' ? 'rgb(37, 99, 235)' : 
    props.status === 'offer' ? 'rgb(234, 88, 12)' :
    'rgb(107, 114, 128)'
  };
`;

const ResponsiveButton = styled(Button)`
  min-height: auto;
  padding: 1rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [listingType, setListingType] = useState('new'); // 'new', 'auction', 'offer'
  const [auctionStatus, setAuctionStatus] = useState('active'); // 'active', 'upcoming', 'ended'
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Turkish cities data for the dropdown
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
    'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
    'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
    'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
    'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
    'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
    'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
  ];
  
  // Sample districts for many cities - in a real app, this would be a complete database
  const districts = {
    'İstanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Sarıyer', 'Beyoğlu', 'Fatih', 'Bahçelievler', 'Bakırköy', 'Ataşehir'],
    'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı', 'Pursaklar', 'Polatlı'],
    'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Bayraklı', 'Menemen', 'Karabağlar', 'Torbalı'],
    'Antalya': ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 'Kaş', 'Kemer', 'Kumluca', 'Aksu'],
    'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'İnegöl', 'Mudanya', 'Kestel', 'Mustafakemalpaşa', 'Gürsu', 'Karacabey'],
    'Adana': ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Ceyhan', 'Kozan', 'İmamoğlu', 'Karataş', 'Pozantı', 'Karaisalı'],
    'Konya': ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Çumra', 'Seydişehir', 'Ilgın', 'Kulu'],
    'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Araban', 'Oğuzeli', 'Nurdağı', 'Karkamış', 'Yavuzeli'],
    'Mersin': ['Akdeniz', 'Mezitli', 'Yenişehir', 'Toroslar', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur', 'Mut', 'Gülnar'],
    'Kayseri': ['Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Bünyan', 'Pınarbaşı', 'Tomarza', 'Yeşilhisar', 'İncesu']
  };
  
  useEffect(() => {
    loadListings();
  }, [listingType, auctionStatus]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      let data = [], error = null;

      if (listingType === 'auction' || listingType === 'new') {
        // Load auctions
        const { data: auctionData, error: auctionError } = await fetchAuctions();
        if (auctionError) {
          error = auctionError;
        } else if (auctionData) {
          // Tag each item as an auction for display purposes
          data = [...data, ...auctionData.map(item => ({
            ...item,
            _display_type: 'auction'
          }))];
        }
      }

      if (listingType === 'offer' || listingType === 'new') {
        // Load negotiation offers
        const { data: offerData, error: offerError } = await fetchNegotiations();
        if (offerError) {
          error = offerError || error;
        } else if (offerData) {
          // Tag each item as an offer for display purposes
          data = [...data, ...offerData.map(item => ({
            ...item,
            _display_type: 'offer'
          }))];
        }
      }

      if (error) throw error;

      // Sort by recently added first for all listings
      const sortedData = data.sort((a, b) => {
        return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
      });

      // Debug: Log location data structures
      console.log("Listings sample:", sortedData.slice(0, 5).map(listing => ({
        id: listing.id,
        type: listing._display_type,
        location: listing.location,
        city: listing.city,
        status: listing.status,
        listing_type: listing.listing_type
      })));

      setAuctions(sortedData);
      filterAuctions(sortedData);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Normalize city names to handle special characters and common variations
  const normalizeCity = (city) => {
    if (!city) return '';
    
    // Lowercase and trim
    let normalized = city.toLowerCase().trim();
    
    // Handle special cases with Turkish characters
    const replacements = {
      'istanbul': 'istanbul',
      'İstanbul': 'istanbul',
      'ıstanbul': 'istanbul',
      'izmir': 'izmir',
      'İzmir': 'izmir',
      'izmır': 'izmir',
      'ankara': 'ankara'
    };
    
    return replacements[normalized] || normalized;
  };
  
  // Normalize district names to handle special characters and common variations
  const normalizeDistrict = (district) => {
    if (!district) return '';
    
    // Lowercase and trim
    let normalized = district.toLowerCase().trim();
    
    // Remove accent marks from Turkish characters
    const replacements = {
      'kadıköy': 'kadikoy',
      'üsküdar': 'uskudar',
      'şişli': 'sisli',
      'beşiktaş': 'besiktas',
      'bayraklı': 'bayrakli',
      'çankaya': 'cankaya',
      'keçiören': 'kecioren'
    };
    
    return replacements[normalized] || normalized;
  };
  
  // Filter auctions based on criteria
  const filterAuctions = (dataToFilter = auctions) => {
    console.log('Starting filtering with', dataToFilter.length, 'total listings');
    let filtered = [...dataToFilter];
    
    // Filter by listing type if not "new" (new shows both types)
    if (listingType === 'auction') {
      filtered = filtered.filter(item => 
        item._display_type === 'auction' || item.listing_type === 'auction'
      );
      console.log('After listing type filter:', filtered.length, 'listings left');
    } else if (listingType === 'offer') {
      filtered = filtered.filter(item => 
        item._display_type === 'offer' || item.listing_type === 'offer'
      );
      console.log('After listing type filter:', filtered.length, 'listings left');
    }
    
    // Filter by auction status for auction listings
    if (listingType === 'auction') {
      const now = new Date();
      
      filtered = filtered.filter(auction => {
        const status = auction.status;
        const startTime = auction.start_time ? new Date(auction.start_time) : 
                          auction.startTime ? new Date(auction.startTime) : null;
        const endTime = auction.end_time ? new Date(auction.end_time) : 
                        auction.endTime ? new Date(auction.endTime) : 
                        auction.end_date ? new Date(auction.end_date) : null;
        
        switch (auctionStatus) {
          case 'active':
            // Either explicitly marked as active or current time is within auction window
            return status === 'active' || 
                   (startTime && endTime && now >= startTime && now <= endTime);
          case 'upcoming':
            // Either explicitly marked as upcoming or start time is in the future
            return status === 'upcoming' || 
                   (startTime && now < startTime);
          case 'ended':
            // Either explicitly marked as ended or end time is in the past
            return status === 'ended' || status === 'completed' || 
                   (endTime && now > endTime);
          default:
            return true;
        }
      });
      console.log('After status filter:', filtered.length, 'listings left');
    }
    
    // Filter by city
    if (selectedCity) {
      const normalizedSelectedCity = normalizeCity(selectedCity);
      console.log('Filtering by city:', selectedCity);
      
      filtered = filtered.filter(listing => {
        // Check if the location contains the city name
        if (typeof listing.location === 'string' && listing.location) {
          if (listing.location.toLowerCase().includes(normalizedSelectedCity)) {
            return true;
          }
        }
        
        // Check location as object
        if (listing.location && typeof listing.location === 'object') {
          const locationCity = normalizeCity(listing.location.city || '');
          if (locationCity && locationCity.includes(normalizedSelectedCity)) {
            return true;
          }
        }
        
        // Check separate city field
        if (listing.city && normalizeCity(listing.city).includes(normalizedSelectedCity)) {
          return true;
        }
        
        // Check neighborhood field that might contain city info
        if (listing.neighborhood_name || listing.neighborhoodName) {
          const neighborhood = normalizeCity(listing.neighborhood_name || listing.neighborhoodName);
          if (neighborhood && neighborhood.includes(normalizedSelectedCity)) {
            return true;
          }
        }
        
        // Check address field that might contain city
        if (listing.address && typeof listing.address === 'string') {
          if (listing.address.toLowerCase().includes(normalizedSelectedCity)) {
            return true;
          }
        }
        
        return false;
      });
      console.log('After city filter:', filtered.length, 'listings left');
    }
    
    setFilteredAuctions(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Apply filters when search form is submitted
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting search with city:', selectedCity);
    filterAuctions();
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCity('');
    filterAuctions();
    setCurrentPage(1);
  };
  
  // Get paginated results
  const getPaginatedAuctions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAuctions.slice(startIndex, endIndex);
  };
  
  // Handle city change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };
  
  // Handle listing type change
  const handleListingTypeChange = (type) => {
    setListingType(type);
    setCurrentPage(1);
  };
  
  // Handle auction status change
  const handleStatusChange = (status) => {
    setAuctionStatus(status);
    setCurrentPage(1);
  };
  
  const handleAuctionClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0) + ' ₺';
  };
  
  const getStatusText = (status, itemType) => {
    if (itemType === 'offer') return 'Pazarlık';
    
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'upcoming':
        return 'Yakında';
      case 'completed':
      case 'ended':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };
  
  const getStatusIcon = (status, listingType) => {
    if (listingType === 'offer') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}>
          <path d="M2 9h20M2 15h20" />
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="20" />
        </svg>
      );
    }
    
    switch (status) {
      case 'active':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'upcoming':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
    }
  };
  
  // Get formatted location from auction
  const getAuctionLocation = (auction) => {
    if (!auction) return 'Konum bilgisi yok';
    
    // If location is an object with city and district
    if (auction.location && typeof auction.location === 'object') {
      const city = auction.location.city;
      const district = auction.location.district;
      if (city && district) return `${city}, ${district}`;
      if (city) return city;
    }
    
    // If location is a string with commas, split and reverse to put city first
    if (auction.location && typeof auction.location === 'string' && auction.location.includes(',')) {
      return auction.location.split(',').reverse().join(', ').trim();
    }
    
    // If location is a simple string without commas
    if (auction.location && typeof auction.location === 'string') {
      return auction.location;
    }
    
    // If neighborhood is specified
    if (auction.neighborhood_name || auction.neighborhoodName) {
      const neighborhood = auction.neighborhood_name || auction.neighborhoodName;
      
      // If we also have city/district
      if (auction.city || auction.district) {
        const parts = [];
        if (auction.city) parts.push(auction.city);
        if (auction.district) parts.push(auction.district);
        if (neighborhood) parts.push(neighborhood);
        return parts.join(', ');
      }
      
      return neighborhood;
    }
    
    // If separate city/district fields
    if (auction.city || auction.district) {
      const parts = [];
      if (auction.city) parts.push(auction.city);
      if (auction.district) parts.push(auction.district);
      return parts.join(', ');
    }
    
    // If we have address but no location
    if (auction.address && typeof auction.address === 'string') {
      // Split by comma and reverse to put city first
      const addressParts = auction.address.split(',');
      if (addressParts.length > 1) {
        return addressParts.reverse().join(', ').trim();
      }
      return auction.address;
    }
    
    return 'Konum bilgisi yok';
  };
  
  return (
    <>
      <HeroSection>
        <HeroContent>

          <HeroSubtitle>
          Türkiye'nin dört bir yanındaki değerli araziler için ihale tekliflerinizi verin.  
          </HeroSubtitle>
          
          <SearchContainer>
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchInputGroup>
                <SearchInput>
                  <SearchIcon />
                  <select 
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="">Tüm Şehirler</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </SearchInput>
              </SearchInputGroup>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <SearchButton type="submit" variant="primary" size="large">
                  Ara
                </SearchButton>
                
                <ResponsiveButton 
                  type="button" 
                  variant="secondary" 
                  size="large" 
                  onClick={resetFilters}
                >
                  Sıfırla
                </ResponsiveButton>
              </div>
            </SearchForm>
          </SearchContainer>
          
          <PopularSearches>
            <span>Popüler:</span>
            <a href="#" onClick={(e) => {e.preventDefault(); setSelectedCity('Kütahya'); filterAuctions();}}>Kütahya</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setSelectedCity('Konya'); filterAuctions();}}>Konya</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setSelectedCity('Uşak'); filterAuctions();}}>Uşak</a>
            <a href="#" onClick={(e) => {e.preventDefault(); setSelectedCity(''); filterAuctions();}}>Tüm Şehirler</a>
          </PopularSearches>
        </HeroContent>
      </HeroSection>
      
      <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '3rem' }}>
        <PageContainer>
          <TabsContainer>
            <TabButton 
              $isActive={listingType === 'new'} 
              onClick={() => handleListingTypeChange('new')}
            >
              Yeni Eklenenler
            </TabButton>
            <TabButton 
              $isActive={listingType === 'auction'} 
              onClick={() => handleListingTypeChange('auction')}
            >
              Açık Arttırma
            </TabButton>
            <TabButton 
              $isActive={listingType === 'offer'} 
              onClick={() => handleListingTypeChange('offer')}
            >
              Pazarlık Yap
            </TabButton>
          </TabsContainer>
          
          {listingType === 'auction' && (
            <StatusTabs>
              <StatusTab
                active={auctionStatus === 'active'}
                onClick={() => handleStatusChange('active')}
              >
                Aktif Açık Arttırmalar
              </StatusTab>
              <StatusTab
                active={auctionStatus === 'upcoming'}
                onClick={() => handleStatusChange('upcoming')}
              >
                Yakında Başlayacak
              </StatusTab>
              <StatusTab
                active={auctionStatus === 'ended'}
                onClick={() => handleStatusChange('ended')}
              >
                Tamamlanmış
              </StatusTab>
            </StatusTabs>
          )}
          
          <AuctionsGrid>
            {isLoading ? (
              // Show skeletons while loading
              Array(6).fill(0).map((_, index) => (
                <AuctionCard key={`skeleton-${index}`} style={{ opacity: 0.7 }}>
                  <AuctionImage style={{ backgroundColor: '#f0f0f0' }} />
                  <AuctionContent>
                    <div style={{ height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '12px' }}></div>
                    <div style={{ height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '24px', width: '60%' }}></div>
                    <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                  </AuctionContent>
                </AuctionCard>
              ))
            ) : getPaginatedAuctions().length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0' }}>
                <p>Arama kriterlerinize uygun aktif emlak açık arttırma bulunamadı.</p>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={resetFilters}
                  style={{ marginTop: '1rem' }}
                >
                  Tüm Açık Arttırmaları Göster
                </Button>
              </div>
            ) : (
              getPaginatedAuctions().map(listing => (
                <AuctionCard key={listing.id} onClick={() => handleAuctionClick(listing.id)}>
                  <AuctionImage>
                    <img 
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={listing.title} 
                    />
                    <AuctionStatusBadge status={listing.status} type={listing._display_type}>
                      {getStatusText(listing.status, listing._display_type)}
                    </AuctionStatusBadge>
                    {listingType === 'new' && listing._display_type !== 'offer' && (
                      <AuctionTypeTag>
                        Açık Arttırma
                      </AuctionTypeTag>
                    )}
                  </AuctionImage>
                  <AuctionContent>
                    <AuctionTitle>{listing.title || 'Emlak İlanı'}</AuctionTitle>
                    <AuctionLocation>
                      <LocationIcon />
                      {getAuctionLocation(listing)}
                    </AuctionLocation>
                    <AuctionDetails>
                      <AuctionPrice>
                        {formatPrice(
                          listing.highest_bid || 
                          listing.final_price || 
                          listing.finalPrice || 
                          listing.starting_price || 
                          listing.startingPrice || 
                          listing.starting_bid || 
                          0
                        )}
                      </AuctionPrice>
                      <AuctionStatus status={listing._display_type === 'offer' ? 'offer' : listing.status}>
                        {getStatusIcon(listing.status, listing._display_type)}
                        {listing._display_type === 'offer' ? 'Pazarlık Yap' : 
                          listing.status === 'active' && (listing.end_time || listing.endTime || listing.end_date) ? (
                            <span>Kalan: <CountdownTimer 
                              endTime={new Date(listing.end_time || listing.endTime || listing.end_date).toISOString()} 
                              compact={true}
                            /></span>
                          ) : getStatusText(listing.status, listing._display_type)
                        }
                      </AuctionStatus>
                    </AuctionDetails>
                  </AuctionContent>
                </AuctionCard>
              ))
            )}
          </AuctionsGrid>
          
          {/* Pagination Controls */}
          {filteredAuctions.length > itemsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Önceki
              </Button>
              
              {Array.from({ length: Math.ceil(filteredAuctions.length / itemsPerPage) }, (_, i) => (
                <Button 
                  key={i + 1}
                  variant={currentPage === i + 1 ? "primary" : "secondary"} 
                  size="small"
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ minWidth: '40px' }}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAuctions.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredAuctions.length / itemsPerPage)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </PageContainer>
      </div>
    </>
  );
};

export default Home; 