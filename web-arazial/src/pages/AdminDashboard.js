import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { fetchAuctions as fetchAuctionsService, fetchNegotiations } from '../services/auctionService';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 240px 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  height: fit-content;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 1023px) {
    margin-bottom: 2rem;
  }
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background-color: ${props => props.active ? 'var(--color-background)' : 'transparent'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text)'};
  font-weight: ${props => props.active ? '600' : '400'};
  border-radius: var(--border-radius-md);
  text-align: left;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-background);
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
  }
`;

const ContentArea = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
`;

const TableHead = styled.thead`
  background-color: var(--color-background);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  
  &:last-child {
    @media (max-width: 767px) {
      display: flex;
      flex-wrap: wrap;
    }
  }
`;

const ActionButton = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  white-space: nowrap;
  
  &:last-child {
    margin-right: 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#ecfdf5';
      case 'upcoming':
        return '#eff6ff';
      case 'completed':
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return '#065f46';
      case 'upcoming':
        return '#1e40af';
      case 'completed':
        return '#4b5563';
      default:
        return '#4b5563';
    }
  }};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 15, 52, 96), 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 15, 52, 96), 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-text-light);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 15, 52, 96), 0.2);
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  width: 100%;
  max-width: 300px;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-secondary);
`;

const EmptyStateIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-text-secondary);
  }
`;

const EmptyStateTitle = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const StatCardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const StatIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 50%;
  margin-right: 1rem;
  
  svg {
    color: var(--color-primary);
  }
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

// StatCard component
const StatCard = ({ title, value, icon, loading }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: 'var(--border-radius-md)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative'
    }}>
      {loading && (
        <LoadingOverlay>
          <div>Yükleniyor...</div>
        </LoadingOverlay>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
            {value}
          </div>
        </div>
        <div style={{ 
          backgroundColor: 'var(--color-background)', 
          borderRadius: '50%',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ImageUploadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: var(--color-background);
  
  @media (max-width: 767px) {
    height: 120px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background-color: white;
    }
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  
  .gallery-item {
    aspect-ratio: 1;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  .gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    
    .modal-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
      
      img {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: var(--border-radius-md);
      }
      
      .close-button {
        position: absolute;
        top: -2rem;
        right: 0;
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
      }
      
      .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
        &.prev {
          left: -4rem;
        }
        
        &.next {
          right: -4rem;
        }
      }
    }
  }
`;

// Add Turkish cities list after the CloseIcon component
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Turkish cities list in alphabetical order
const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

// This is a styled component to handle the dashboard grid item layout
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: ${props => props.columns || '1fr'};
  }
`;

const StatCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

// Add loading overlay component for card sections
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: var(--border-radius-md);
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-background);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Fix order - CardContainer needs to be defined before RelativeContainer
// Update CardContainer to support relative positioning for the loading overlay
const CardContainer = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  position: relative;
  min-height: 100px;
`;

const RelativeContainer = styled(CardContainer)`
  position: relative;
  min-height: 150px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Add tab button styled component
const TabButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text)'};
  border-bottom: ${props => props.active ? '2px solid var(--color-primary)' : 'none'};
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: var(--color-primary);
  }
`;

// Add filter button styled component
const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--color-border)'};
  background: ${props => props.active ? 'var(--color-primary-light)' : 'white'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text)'};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
`;

// Define Enum options based on migration - REMOVED Emlak Tipi, Kept Imar Durumu (but won't be used on auctions table)
/*
const emlakTipiOptions = [
  { value: 'ARSA', label: 'Arsa' },
];
*/
const imarDurumuOptions = [
  { value: 'KONUT', label: 'Konut' },
  { value: 'TICARI', label: 'Ticari' },
  { value: 'KARMA', label: 'Karma' },
  { value: 'SANAYI', label: 'Sanayi' },
  { value: 'TARIMSAL', label: 'Tarımsal' }
];

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin: authIsAdmin, loading: authLoading, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('auctions');
  const [auctions, setAuctions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBids, setUserBids] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [selectedAuctionOffers, setSelectedAuctionOffers] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Add section-specific loading states
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  
  // Add state for tabs and filters
  const [auctionFilter, setAuctionFilter] = useState('all');
  
  const [auctionForm, setAuctionForm] = useState({
    title: '',
    description: '',
    startingPrice: '',
    minIncrement: '',
    startDate: '',
    endDate: '',
    startTime: '12:00',
    endTime: '12:00',
    location: '',
    city: '',
    locationDetails: '',
    status: 'upcoming',
    listingType: 'auction',
    offerIncrement: '',
    ada_no: '',
    parsel_no: '',
    images: [],
    area_size: '',
    area_unit: 'm2',
    emlak_tipi: '',
    imar_durumu: '',
    ilan_sahibi: ''
  });
  
  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user',
    phone: ''
  });
  
  // Add new state variables at the top with other state declarations
  const [deposits, setDeposits] = useState([]);
  const [depositStats, setDepositStats] = useState(null);
  
  useEffect(() => {
    // Wait for auth state to be fully loaded
    if (authLoading) {
      console.log("Auth is still loading, waiting...");
      return;
    }
    
    console.log("Auth loaded, checking admin status:", { user: !!user, userRole, authIsAdmin });
    
    // Redirect non-admin users
    if (!user) {
      console.log("No user, redirecting to login");
      navigate('/login');
      return;
    }
    
    if (!authIsAdmin) {
      console.log("User is not admin, redirecting to dashboard");
      navigate('/dashboard');
      return;
    }
    
    // Initialize storage bucket for auction images if needed
    initializeStorage();
    
    // Load initial data for auctions
    console.log("User is admin, loading auctions data");
    fetchSectionData('auctions');
    setLoading(false);
  }, [user, userRole, authIsAdmin, authLoading, navigate]);
  
  // Function to initialize storage bucket
  const initializeStorage = async () => {
    try {
      // Check if bucket exists by trying to list files in it
      const { error } = await supabase
        .storage
        .from('auction-images')
        .list('');
        
      if (error && error.message.includes('The resource was not found')) {
        console.log('auction-images bucket doesn\'t exist. Using default bucket.');
        // We'll use the default 'storage' bucket instead for uploads
      } else {
        console.log('auction-images bucket exists or there was a different error:', error?.message || 'No error');
      }
    } catch (error) {
      console.error('Error checking storage:', error);
    }
  };
  
  // Function to fetch auctions from the database or service
  const fetchAuctions = async () => {
    try {
      setAuctionsLoading(true);
      
      // Use the imported fetchAuctions function from auctionService
      const { data: auctionData, error: auctionError } = await fetchAuctionsService(true);
      
      if (auctionError) {
        console.error('Error fetching auctions:', auctionError);
        return;
      }
      
      // Get negotiations (offer) listings as well
      const { data: offerData, error: offerError } = await fetchNegotiations(true);
      
      if (offerError) {
        console.error('Error fetching offers:', offerError);
        // Continue with just auctions data
      }
      
      // Combine both types
      const allListings = [
        ...(auctionData || []),
        ...(offerData || [])
      ];
      
      // Set auctions state
      setAuctions(allListings);
      
      // Process and count different statuses
      const now = new Date();
      const counts = {
        active: 0,
        upcoming: 0,
        ended: 0
      };
      
      allListings.forEach(auction => {
        const startTime = new Date(auction.start_time || auction.startTime);
        const endTime = new Date(auction.end_time || auction.endTime);
        
        if (now >= startTime && now <= endTime) {
          counts.active++;
        } else if (now < startTime) {
          counts.upcoming++;
        } else {
          counts.ended++;
        }
      });
      
      setStatusCounts(counts);
      setAuctionsLoading(false);
    } catch (error) {
      console.error('Error in fetchAuctions function:', error);
      setAuctionsLoading(false);
    }
  };
  
  const fetchSectionData = async (section) => {
    switch (section) {
      case 'dashboard':
        setDashboardLoading(true);
        await fetchDashboardStats();
        setDashboardLoading(false);
        break;
      case 'auctions':
      case 'create-auction':
      case 'auction-details':
        setAuctionsLoading(true);
        await fetchAuctions();
        setAuctionsLoading(false);
        break;
      case 'users':
      case 'create-user':
      case 'user-details':
        setUsersLoading(true);
        await fetchUsers();
        setUsersLoading(false);
        break;
      case 'payments':
        setPaymentsLoading(true);
        await fetchPayments();
        setPaymentsLoading(false);
        break;
      default:
        break;
    }
  };
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    if (authIsAdmin) {
      fetchSectionData(section);
    }
  };
  
  const handleAuctionFormChange = (e) => {
    const { name, value } = e.target;
    setAuctionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateAuction = async (e) => {
    e.preventDefault();
    
    try {
      // First upload images if any
      let imageUrls = [];
      
      if (images.length > 0) {
        setUploading(true);
        
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          // Use the bucket that exists - either auction-images or storage
          const bucketName = 'auction-images';  // we'll try this first
          const filePath = `${fileName}`;
          
          try {
            // Try uploading to auction-images bucket first
            const { data, error } = await supabase.storage
              .from(bucketName)
              .upload(filePath, image, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) {
              if (error.message.includes('The resource was not found')) {
                // If auction-images bucket doesn't exist, try the default 'storage' bucket
                console.log("Trying to upload to default bucket instead");
                const { data: defaultData, error: defaultError } = await supabase.storage
                  .from('storage')
                  .upload(`auction-images/${filePath}`, image, {
                    cacheControl: '3600',
                    upsert: false
                  });
                  
                if (defaultError) {
                  // If that failed too, try the 'images' bucket which is often a default in Supabase
                  console.log("Trying to upload to images bucket instead");
                  const { data: imagesData, error: imagesError } = await supabase.storage
                    .from('images')
                    .upload(`auction-images/${filePath}`, image, {
                      cacheControl: '3600',
                      upsert: false
                    });
                    
                  if (imagesError) {
                    console.error('Error uploading to images bucket:', imagesError);
                    continue;
                  }
                  
                  // Get public URL from the images bucket
                  const { data: imagesUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(`auction-images/${filePath}`);
                    
                  imageUrls.push(imagesUrlData.publicUrl);
                  continue;
                }
                
                // Get public URL from the default bucket
                const { data: defaultUrlData } = supabase.storage
                  .from('storage')
                  .getPublicUrl(`auction-images/${filePath}`);
                  
                imageUrls.push(defaultUrlData.publicUrl);
              } else {
                console.error('Error uploading image:', error);
                continue;
              }
            } else {
              // Get public URL from auction-images bucket
              const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);
                
              imageUrls.push(urlData.publicUrl);
            }
          } catch (uploadError) {
            console.error('Exception during upload:', uploadError);
            continue;
          }
        }
        
        setUploading(false);
      }
      
      // Improve the formatDateForDatabase function to handle time correctly
      const formatDateForDatabase = (dateStr, timeStr) => {
        if (!dateStr) return null;
        
        try {
          // If we have a time string, combine it with the date
          if (timeStr) {
            const combinedStr = `${dateStr}T${timeStr}:00`;
            return new Date(combinedStr).toISOString();
          }
          
          // Otherwise just format the date
          return new Date(dateStr).toISOString();
        } catch (e) {
          console.error('Date formatting error:', e);
          return null;
        }
      };
      
      // Parse the prices
      const price = auctionForm.startingPrice ? parseFloat(auctionForm.startingPrice.replace(',', '.')) : 0;
      const minIncrement = auctionForm.minIncrement ? parseFloat(auctionForm.minIncrement.replace(',', '.')) : 0;
      const offerIncrement = auctionForm.offerIncrement ? parseFloat(auctionForm.offerIncrement.replace(',', '.')) : 0;

      // Create combined location string with city and location details
      const locationString = auctionForm.city 
        ? (auctionForm.locationDetails 
            ? `${auctionForm.locationDetails}, ${auctionForm.city}` 
            : auctionForm.city)
        : auctionForm.locationDetails;

      // Create auction data object - Adjust fields
      const auctionData = {
        title: auctionForm.title,
        description: auctionForm.description,
        starting_price: price,
        start_price: price,
        min_increment: auctionForm.listingType === 'auction' ? minIncrement : null,
        offer_increment: auctionForm.listingType === 'offer' ? offerIncrement : null,
        listing_type: auctionForm.listingType,
        start_date: formatDateForDatabase(auctionForm.startDate),
        end_date: formatDateForDatabase(auctionForm.endDate),
        start_time: formatDateForDatabase(auctionForm.startDate, auctionForm.startTime) || new Date().toISOString(),
        end_time: formatDateForDatabase(auctionForm.endDate, auctionForm.endTime) || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        location: locationString,
        status: auctionForm.status,
        created_by: user?.id, // Use created_by
        ada_no: auctionForm.ada_no,
        parsel_no: auctionForm.parsel_no,
        images: imageUrls,
        area_size: parseFloat(auctionForm.area_size) || 0, // Use area_size
        area_unit: auctionForm.area_unit || 'm2', // ADDED area_unit
        emlak_tipi: auctionForm.emlak_tipi,
        imar_durumu: auctionForm.imar_durumu,
        ilan_sahibi: auctionForm.ilan_sahibi
      };
      
      console.log("Attempting to create auction with data:", auctionData);
      // Add more detailed logging for dates and times
      console.log("Date/time details:", {
        startDate: auctionForm.startDate,
        endDate: auctionForm.endDate,
        startTime: auctionForm.startTime,
        endTime: auctionForm.endTime,
        formattedStartTime: formatDateForDatabase(auctionForm.startDate, auctionForm.startTime),
        formattedEndTime: formatDateForDatabase(auctionForm.endDate, auctionForm.endTime),
        now: new Date().toISOString()
      });
      
      // Create auction with image URLs
      const { data, error } = await supabase
        .from('auctions')
        .insert([auctionData]);
        
      if (error) {
        console.error('Detailed error creating auction:', {
          code: error.code,
          details: error.details,
          hint: error.hint,
          message: error.message
        });
        throw error;
      }
      
      console.log("Auction created successfully:", data);
      
      // Reset form - Adjust fields
      setAuctionForm({
        title: '',
        description: '',
        startingPrice: '',
        minIncrement: '',
        offerIncrement: '',
        startDate: '',
        endDate: '',
        startTime: '12:00',
        endTime: '12:00',
        location: '',
        city: '',
        locationDetails: '',
        status: 'upcoming',
        listingType: 'auction',
        ada_no: '',
        parsel_no: '',
        images: [],
        area_size: '', // Use area_size
        area_unit: 'm2', // ADDED area_unit
        emlak_tipi: '',
        imar_durumu: '',
        ilan_sahibi: ''
      });
      setImages([]);
      
      fetchSectionData('auctions');
      alert('İlan başarıyla oluşturuldu.');
    } catch (error) {
      console.error('Error creating auction:', error);
      alert(`İlan oluşturulurken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    }
  };
  
  const handleDeleteAuction = async (id) => {
    if (window.confirm('Bu ihaleyi silmek istediğinize emin misiniz?')) {
      setActionLoading(true);
      try {
        const { error } = await supabase
          .from('auctions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Update auctions list
        setAuctions(auctions.filter(auction => auction.id !== id));
        alert('İhale başarıyla silindi');
      } catch (error) {
        console.error('Error deleting auction:', error);
        alert('İhale silinirken bir hata oluştu');
      } finally {
        setActionLoading(false);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'upcoming':
        return 'Yaklaşan';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };
  
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userForm.email,
        password: userForm.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // Add additional user data to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: authData.user.id,
            full_name: userForm.fullName,
            role: userForm.role,
            phone: userForm.phone,
            email: userForm.email
          }
        ]);
        
      if (profileError) throw profileError;
      
      // Reset form and refresh users
      setUserForm({
        email: '',
        password: '',
        fullName: '',
        role: 'user',
        phone: ''
      });
      
      fetchSectionData('users');
      alert('Kullanıcı başarıyla oluşturuldu.');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Kullanıcı oluşturulurken bir hata oluştu: ${error.message}`);
    }
  };
  
  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      // Fetch user details
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user details:', userError);
        return;
      }
      
      // Fetch user bids
      const { data: userBids, error: bidsError } = await supabase
        .from('bids')
        .select('*, auctions(title)')
        .eq('bidder_id', userId)
        .order('created_at', { ascending: false });
        
      if (bidsError) {
        console.error('Error fetching user bids:', bidsError);
        setUserBids([]);
      } else {
        setUserBids(userBids || []);
      }
      
      // Fetch user payments
      const { data: userPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*, auctions(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (paymentsError) {
        console.error('Error fetching user payments:', paymentsError);
        setUserPayments([]);
      } else {
        setUserPayments(userPayments || []);
      }
      
      setSelectedUserId(userId);
      setSelectedUser(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewUserDetails = (userId) => {
    fetchUserDetails(userId);
    setActiveSection('user-details');
  };
  
  const handleUpdateUserRole = async (userId, role) => {
    setLoading(true);
    try {
      // Get the user's session token for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Oturum bilgisi alınamadı. Lütfen tekrar giriş yapın.');
      }
      
      console.log("Updating user role:", { userId, role });
      console.log("Using URL:", `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/update-user-role`);
      
      // Call the Edge Function to update the user role
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/update-user-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId, role })
      });
      
      // Try to parse the response as JSON
      let result;
      const responseText = await response.text();
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error(`Sunucu yanıtı ayrıştırılamadı: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error("Error response:", result);
        throw new Error(result.error || result.message || `Sunucu hatası: ${response.status}`);
      }
      
      // Refresh the user data after successful update
      if (activeSection === 'users') {
        fetchUsers();
      } else if (activeSection === 'user-details' && selectedUserId === userId) {
        fetchUserDetails(userId);
      }
      
      console.log("Role update successful:", result);
      alert(`Kullanıcı rolü ${role === 'admin' ? 'Admin' : 'Kullanıcı'} olarak güncellendi!`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(`Rol güncelleme hatası: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAuctionDetails = async (auctionId) => {
    setLoading(true);
    try {
      // First fetch the auction details
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*, profiles ( full_name, avatar_url )')
        .eq('id', auctionId)
        .single();

      if (auctionError || !auctionData) {
        throw auctionError || new Error('İlan bulunamadı.');
      }

      console.log("AUCTION DATA FETCHED:", {
        id: auctionData.id,
        title: auctionData.title,
        price: auctionData.price,
        hasPrice: !!auctionData.price,
        listingType: auctionData.listing_type
      });

      // Parse location into city and details if it exists
      let city = '';
      let locationDetails = '';
      if (auctionData.location) {
        const locationParts = auctionData.location.split(',').map(part => part.trim());
        if (locationParts.length > 1) {
          city = locationParts[locationParts.length - 1];
          locationDetails = locationParts.slice(0, -1).join(', ');
        } else {
          city = locationParts[0];
        }
      }

      // Set auction form data - Adjust fields
      setAuctionForm({
        title: auctionData.title || '',
        description: auctionData.description || '',
        startingPrice: auctionData.starting_price || auctionData.start_price || 0,
        minIncrement: auctionData.min_increment || '',
        offerIncrement: auctionData.offer_increment || '',
        listingType: auctionData.listing_type || 'auction',
        startDate: formatDateForInput(auctionData.start_time) || '',
        endDate: formatDateForInput(auctionData.end_time) || '',
        startTime: formatTimeForInput(auctionData.start_time) || '12:00',
        endTime: formatTimeForInput(auctionData.end_time) || '12:00',
        city: city,
        locationDetails: locationDetails,
        status: auctionData.status || 'upcoming',
        images: auctionData.images || [],
        ada_no: auctionData.ada_no || '',
        parsel_no: auctionData.parsel_no || '',
        area_size: auctionData.area_size || '', // Use area_size
        area_unit: auctionData.area_unit || 'm2', // ADDED area_unit
        emlak_tipi: auctionData.emlak_tipi || '',
        imar_durumu: auctionData.imar_durumu || '',
        ilan_sahibi: auctionData.ilan_sahibi || ''
      });

      setSelectedAuctionId(auctionId);

      // 2. Fetch Bids OR Offers based on type
      if (auctionData.listing_type === 'auction') {
        // Fetch bids with user details - exactly matching public auction page
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            *,
            profiles!bids_bidder_id_fkey (
              id,
              full_name,
              phone_number,
              avatar_url
            )
          `)
          .eq('auction_id', auctionId)
          .order('amount', { ascending: false });

        if (bidsError) {
          console.error('Error fetching bids:', bidsError);
          setBids([]);
        } else {
          // Process bids to maintain consistent data structure
          const processedBids = (bidsData || []).map((bid, index) => ({
            ...bid,
            isHighestBid: index === 0 // Mark the first bid as highest since we ordered by amount desc
          }));
          console.log("Processed bids:", processedBids);
          setBids(processedBids);
        }
      } else if (auctionData.listing_type === 'offer') {
        // Fetch all offers for this listing
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select(`
            *,
            profiles:user_id (
              id,
              full_name,
              phone_number,
              avatar_url
            )
          `)
          .eq('auction_id', auctionId)
          .order('created_at', { ascending: false });

        if (offersError) {
          console.error('Error fetching offers:', offersError);
          setSelectedAuctionOffers([]);
        } else {
          // Process offers to maintain consistent data structure
          const processedOffers = (offersData || []).map(offer => ({
            ...offer
          }));
          console.log("Processed offers:", processedOffers);
          setSelectedAuctionOffers(processedOffers);
        }
      }

    } catch (error) {
      console.error('Error fetching auction details:', error);
      alert('İhale detayları getirilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewAuctionDetails = (auctionId) => {
    fetchAuctionDetails(auctionId);
    setActiveSection('auction-details');
  };
  
  const handleUpdateAuction = async (e) => {
    e.preventDefault();
    
    try {
      // First upload new images if any
      let imageUrls = auctionForm.images || [];
      
      if (images.length > 0) {
        setUploading(true);
        
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          // Use the bucket that exists - either auction-images or storage
          const bucketName = 'auction-images';  // we'll try this first
          const filePath = `${fileName}`;
          
          try {
            // Try uploading to auction-images bucket first
            const { data, error } = await supabase.storage
              .from(bucketName)
              .upload(filePath, image, {
                cacheControl: '3600',
                upsert: false
              });
              
            if (error) {
              if (error.message.includes('The resource was not found')) {
                // If auction-images bucket doesn't exist, try the default 'storage' bucket
                console.log("Trying to upload to default bucket instead");
                const { data: defaultData, error: defaultError } = await supabase.storage
                  .from('storage')
                  .upload(`auction-images/${filePath}`, image, {
                    cacheControl: '3600',
                    upsert: false
                  });
                  
                if (defaultError) {
                  // If that failed too, try the 'images' bucket which is often a default in Supabase
                  console.log("Trying to upload to images bucket instead");
                  const { data: imagesData, error: imagesError } = await supabase.storage
                    .from('images')
                    .upload(`auction-images/${filePath}`, image, {
                      cacheControl: '3600',
                      upsert: false
                    });
                    
                  if (imagesError) {
                    console.error('Error uploading to images bucket:', imagesError);
                    continue;
                  }
                  
                  // Get public URL from the images bucket
                  const { data: imagesUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(`auction-images/${filePath}`);
                    
                  imageUrls.push(imagesUrlData.publicUrl);
                  continue;
                }
                
                // Get public URL from the default bucket
                const { data: defaultUrlData } = supabase.storage
                  .from('storage')
                  .getPublicUrl(`auction-images/${filePath}`);
                  
                imageUrls.push(defaultUrlData.publicUrl);
              } else {
                console.error('Error uploading image:', error);
                continue;
              }
            } else {
              // Get public URL from auction-images bucket
              const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);
                
              imageUrls.push(urlData.publicUrl);
            }
          } catch (uploadError) {
            console.error('Exception during upload:', uploadError);
            continue;
          }
        }
        
        setUploading(false);
      }
      
      // Format dates correctly
      const formatDateForDatabase = (dateStr, timeStr) => {
        if (!dateStr) return null;
        
        try {
          // If we have a time string, combine it with the date
          if (timeStr) {
            const combinedStr = `${dateStr}T${timeStr}:00`;
            return new Date(combinedStr).toISOString();
          }
          
          // Otherwise just format the date
          return new Date(dateStr).toISOString();
        } catch (e) {
          console.error('Date formatting error:', e);
          return null;
        }
      };
      
      // Parse the price
      const price = auctionForm.startingPrice ? parseFloat(auctionForm.startingPrice.replace(',', '.')) : 0;
      const minIncrement = auctionForm.minIncrement ? parseFloat(auctionForm.minIncrement.replace(',', '.')) : 0;
      const offerIncrement = auctionForm.offerIncrement ? parseFloat(auctionForm.offerIncrement.replace(',', '.')) : 0;

      // Create combined location string with city and location details
      const locationString = auctionForm.city 
        ? (auctionForm.locationDetails 
            ? `${auctionForm.locationDetails}, ${auctionForm.city}` 
            : auctionForm.city)
        : auctionForm.locationDetails;

      // Update auction data - Adjust fields
      const auctionData = {
        title: auctionForm.title,
        description: auctionForm.description,
        starting_price: price,
        min_increment: auctionForm.listingType === 'auction' ? minIncrement : null,
        offer_increment: auctionForm.listingType === 'offer' ? offerIncrement : null,
        listing_type: auctionForm.listingType,
        start_date: formatDateForDatabase(auctionForm.startDate),
        end_date: formatDateForDatabase(auctionForm.endDate),
        start_time: formatDateForDatabase(auctionForm.startDate, auctionForm.startTime),
        end_time: formatDateForDatabase(auctionForm.endDate, auctionForm.endTime),
        location: locationString,
        status: auctionForm.status,
        images: imageUrls,
        area_size: parseFloat(auctionForm.area_size) || 0, // Use area_size
        area_unit: auctionForm.area_unit || 'm2', // ADDED area_unit
        emlak_tipi: auctionForm.emlak_tipi,
        imar_durumu: auctionForm.imar_durumu,
        ilan_sahibi: auctionForm.ilan_sahibi
      };
      
      console.log("Attempting to update auction with data:", auctionData);
      
      const { data, error } = await supabase
        .from('auctions')
        .update(auctionData)
        .eq('id', selectedAuctionId);
        
      if (error) {
        console.error('Detailed error updating auction:', {
          code: error.code,
          details: error.details,
          hint: error.hint,
          message: error.message
        });
        throw error;
      }
      
      console.log("Auction updated successfully:", data);
      
      setImages([]);
      fetchSectionData('auctions');
      alert('İhale başarıyla güncellendi.');
      handleSectionChange('auctions');
    } catch (error) {
      console.error('Error updating auction:', error);
      alert(`İhale güncellenirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    }
  };
  
  const handleCreatePayment = async (e) => {
    e.preventDefault();
    
    const paymentForm = {
      userId: e.target.userId.value,
      auctionId: selectedAuctionId,
      amount: parseFloat(e.target.amount.value),
      status: e.target.status.value,
      description: e.target.description.value
    };
    
    try {
      const { error } = await supabase
        .from('payments')
        .insert([
          {
            user_id: paymentForm.userId,
            auction_id: paymentForm.auctionId,
            amount: paymentForm.amount,
            status: paymentForm.status,
            description: paymentForm.description
          }
        ]);
        
      if (error) throw error;
      
      fetchAuctionDetails(selectedAuctionId);
      alert('Ödeme başarıyla kaydedildi.');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Ödeme kaydedilirken bir hata oluştu.');
    }
  };
  
  const fetchPayments = async () => {
    setLoading(true);
    try {
      // First fetch the payments without related data
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching payments:', error);
        setPayments([]);
        return;
      }
      
      // Then fetch related data separately if needed
      let enhancedPayments = [...data];
      
      // Try to enhance with auction data if auction_id exists
      for (let i = 0; i < enhancedPayments.length; i++) {
        const payment = enhancedPayments[i];
        
        // Add user data if user_id exists
        if (payment.user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', payment.user_id)
              .single();
              
            if (!userError && userData) {
              enhancedPayments[i].profiles = userData;
            }
          } catch (e) {
            console.error('Error fetching user data for payment:', e);
          }
        }
        
        // Add auction data if auction_id exists
        if (payment.auction_id) {
          try {
            const { data: auctionData, error: auctionError } = await supabase
              .from('auctions')
              .select('title')
              .eq('id', payment.auction_id)
              .single();
              
            if (!auctionError && auctionData) {
              enhancedPayments[i].auctions = auctionData;
            }
          } catch (e) {
            console.error('Error fetching auction data for payment:', e);
          }
        }
      }
      
      setPayments(enhancedPayments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);
        
      if (error) throw error;
      
      if (activeSection === 'payments') {
        fetchPayments();
      } else if (activeSection === 'auction-details') {
        fetchAuctionDetails(selectedAuctionId);
      }
      
      alert('Ödeme durumu güncellendi.');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Ödeme durumu güncellenirken bir hata oluştu.');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      setActionLoading(true);
      
      // Call the accept_offer RPC function
      const { data, error } = await supabase.rpc('accept_offer', {
        offer_id: offerId
      });

      if (error) throw error;

      // Show success message
      alert('Teklif başarıyla kabul edildi');
      
      // Refresh the offers list
      if (selectedAuctionId) {
        await fetchAuctionDetails(selectedAuctionId);
      }
      
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert(error.message || 'Teklif kabul edilirken bir hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      setActionLoading(true);
      
      // Update the offer status to rejected
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      // Show success message
      alert('Teklif reddedildi');
      
      // Refresh the offers list
      if (selectedAuctionId) {
        await fetchAuctionDetails(selectedAuctionId);
      }
      
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert(error.message || 'Teklif reddedilirken bir hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch auction stats
      const { data: auctionsData, error: auctionsError } = await supabase
        .from('auctions')
        .select('id, status');
        
      if (auctionsError) throw auctionsError;
      
      // Fetch user stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id');
        
      if (usersError) throw usersError;
      
      // Fetch bids stats
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('id, created_at');
        
      if (bidsError) throw bidsError;
      
      // Fetch payments stats
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('id, amount, status');
        
      if (paymentsError) throw paymentsError;
      
      // Calculate stats
      const stats = {
        totalAuctions: auctionsData?.length || 0,
        activeAuctions: auctionsData?.filter(a => a.status === 'active').length || 0,
        completedAuctions: auctionsData?.filter(a => a.status === 'completed').length || 0,
        totalUsers: usersData?.length || 0,
        totalBids: bidsData?.length || 0,
        recentBids: bidsData?.filter(b => {
          const bidDate = new Date(b.created_at);
          const now = new Date();
          const daysDiff = (now - bidDate) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }).length || 0,
        totalPayments: paymentsData?.length || 0,
        totalPaymentAmount: paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0,
        completedPaymentAmount: paymentsData?.filter(p => p.status === 'completed')
          .reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching users:`, error);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Format as YYYY-MM-DD for date input
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date for input:', e);
      return '';
    }
  };

  const formatTimeForInput = (dateString) => {
    if (!dateString) return '12:00';
    try {
      const date = new Date(dateString);
      // Format as HH:MM for time input
      return date.toISOString().split('T')[1].substring(0, 5);
    } catch (e) {
      console.error('Error formatting time for input:', e);
      return '12:00';
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };
  
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index) => {
    setAuctionForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const [activeImage, setActiveImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const handleCloseGallery = () => {
    setActiveImage(null);
  };

  const handlePrevImage = () => {
    if (!activeImage || !auctionForm.images) return;
    
    const currentIndex = auctionForm.images.findIndex(img => img === activeImage);
    if (currentIndex > 0) {
      setActiveImage(auctionForm.images[currentIndex - 1]);
    } else {
      // Loop to the end if at the beginning
      setActiveImage(auctionForm.images[auctionForm.images.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (!activeImage || !auctionForm.images) return;
    
    const currentIndex = auctionForm.images.findIndex(img => img === activeImage);
    if (currentIndex < auctionForm.images.length - 1) {
      setActiveImage(auctionForm.images[currentIndex + 1]);
    } else {
      // Loop to the beginning if at the end
      setActiveImage(auctionForm.images[0]);
    }
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <SectionTitle>Genel Bakış</SectionTitle>
            
            <StatCardGrid>
              <StatCard 
                title="Toplam İhale"
                value={auctions.length}
                loading={dashboardLoading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                }
              />
              
              <StatCard 
                title="Aktif İhale"
                value={auctions.filter(a => a.status === 'active').length}
                loading={dashboardLoading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              
              <StatCard 
                title="Toplam Kullanıcı"
                value={users.length}
                loading={dashboardLoading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />
              
              <StatCard 
                title="Toplam Ödeme"
                value={`${payments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString('tr-TR')} TL`}
                loading={dashboardLoading}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                }
              />
            </StatCardGrid>
            
            <GridContainer columns="2fr 1fr">
              <CardContainer>
                {dashboardLoading && (
                  <LoadingOverlay>
                    <div>Yükleniyor...</div>
                  </LoadingOverlay>
                )}
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Son İhaleler</h3>
                
                {auctions.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader style={{ width: '60px' }}></TableHeader>
                          <TableHeader>Başlık</TableHeader>
                          <TableHeader>Başlangıç Fiyatı</TableHeader>
                          <TableHeader>Başlangıç Tarihi</TableHeader>
                          <TableHeader>Bitiş Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                          <TableHeader>İşlemler</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {auctions.map(auction => (
                          <TableRow key={auction.id}>
                            <TableCell>
                              {auction.images && auction.images.length > 0 ? (
                                <div style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  borderRadius: 'var(--border-radius-sm)',
                                  overflow: 'hidden' 
                                }}>
                                  <img 
                                    src={auction.images[0]} 
                                    alt={auction.title} 
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'cover'
                                    }} 
                                  />
                                </div>
                              ) : (
                                <div style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  backgroundColor: 'var(--color-background)',
                                  borderRadius: 'var(--border-radius-sm)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{auction.title}</TableCell>
                            <TableCell>{auction.starting_price?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{formatDate(auction.start_date)}</TableCell>
                            <TableCell>{formatDate(auction.end_date)}</TableCell>
                            <TableCell>
                              <StatusBadge status={auction.status}>
                                {getStatusText(auction.status)}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <ActionButton 
                                variant="primary" 
                                size="small"
                                onClick={() => handleViewAuctionDetails(auction.id)}
                              >
                                Detaylar
                              </ActionButton>
                              <ActionButton 
                                variant="secondary" 
                                size="small"
                                onClick={() => navigate(`/auctions/${auction.id}`)}
                              >
                                Görüntüle
                              </ActionButton>
                              <ActionButton 
                                variant="danger" 
                                size="small"
                                onClick={() => handleDeleteAuction(auction.id)}
                              >
                                Sil
                              </ActionButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <p>Henüz oluşturulmuş ihale bulunmamaktadır.</p>
                )}
                
                <div style={{ marginTop: '1rem' }}>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleSectionChange('auctions')}
                  >
                    Tüm İhaleleri Görüntüle
                  </Button>
                </div>
              </CardContainer>
              
              <CardContainer>
                {dashboardLoading && (
                  <LoadingOverlay>
                    <div>Yükleniyor...</div>
                  </LoadingOverlay>
                )}
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>İhale Durumu</h3>
                
                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Aktif</span>
                      <span>{auctions.filter(a => a.status === 'active').length}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${auctions.length ? (auctions.filter(a => a.status === 'active').length / auctions.length) * 100 : 0}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Yaklaşan</span>
                      <span>{auctions.filter(a => a.status === 'upcoming').length}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${auctions.length ? (auctions.filter(a => a.status === 'upcoming').length / auctions.length) * 100 : 0}%`, 
                        height: '100%', 
                        backgroundColor: '#3182ce',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Tamamlanan</span>
                      <span>{auctions.filter(a => a.status === 'completed').length}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${auctions.length ? (auctions.filter(a => a.status === 'completed').length / auctions.length) * 100 : 0}%`, 
                        height: '100%', 
                        backgroundColor: '#2d9547',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </div>
                </div>
              </CardContainer>
            </GridContainer>
            
            <CardContainer>
              {dashboardLoading && (
                <LoadingOverlay>
                  <div>Yükleniyor...</div>
                </LoadingOverlay>
              )}
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Son Kullanıcılar</h3>
              
              {users.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Ad Soyad</TableHeader>
                        <TableHeader>E-posta</TableHeader>
                        <TableHeader>Telefon</TableHeader>
                        <TableHeader>Rol</TableHeader>
                        <TableHeader>Kayıt Tarihi</TableHeader>
                        <TableHeader>İşlemler</TableHeader>
                      </TableRow>
                    </TableHead>
                    <tbody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.full_name || '-'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            <StatusBadge status={user.role === 'admin' ? 'active' : 'completed'}>
                              {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            <ActionButton 
                              variant="primary" 
                              size="small"
                              onClick={() => handleViewUserDetails(user.id)}
                            >
                              Detaylar
                            </ActionButton>
                            <ActionButton 
                              variant={user.role === 'admin' ? 'secondary' : 'primary'} 
                              size="small"
                              onClick={() => handleUpdateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                            >
                              {user.role === 'admin' ? 'Kullanıcı Yap' : 'Yönetici Yap'}
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              ) : (
                <p>Henüz kayıtlı kullanıcı bulunmamaktadır.</p>
              )}
              
              <div style={{ marginTop: '1rem' }}>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => handleSectionChange('users')}
                >
                  Tüm Kullanıcıları Görüntüle
                </Button>
              </div>
            </CardContainer>
          </>
        );
      case 'auctions':
        return (
          <>
            <SectionTitle>
              İlanlar
              <Button onClick={() => handleSectionChange('create-auction')}>Yeni İlan</Button>
            </SectionTitle>
            
            {/* Replace the multiple tabs with a single "Listings" tab */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              <TabButton 
                active={true} 
                style={{ 
                  marginRight: '1rem',
                  borderBottom: '2px solid var(--color-primary)',
                  fontWeight: 'bold'
                }}
              >
                İlanlar
              </TabButton>
            </div>
            
            {/* Keep just the filters - same for all listing types */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <FilterButton 
                active={auctionFilter === 'all'} 
                onClick={() => setAuctionFilter('all')}
              >
                Tümü
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'active'} 
                onClick={() => setAuctionFilter('active')}
              >
                Aktif
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'upcoming'} 
                onClick={() => setAuctionFilter('upcoming')}
              >
                Yaklaşan
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'completed'} 
                onClick={() => setAuctionFilter('completed')}
              >
                Tamamlanan
              </FilterButton>
            </div>
            
            <CardContainer>
              {auctionsLoading && (
                <LoadingOverlay>
                  <div>İlanlar yükleniyor...</div>
                </LoadingOverlay>
              )}
              
              {/* Single table for all listings */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader style={{ width: '60px' }}></TableHeader>
                      <TableHeader>Başlık</TableHeader>
                      <TableHeader>Tür</TableHeader>
                      <TableHeader>Fiyat</TableHeader>
                      <TableHeader>Bitiş Tarihi</TableHeader>
                      <TableHeader>Durum</TableHeader>
                      <TableHeader>İşlemler</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {auctions
                      .filter(auction => auctionFilter === 'all' || auction.status === auctionFilter)
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.images && item.images.length > 0 ? (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: 'var(--border-radius-sm)',
                                overflow: 'hidden' 
                              }}>
                                <img 
                                  src={item.images[0]} 
                                  alt={item.title} 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover'
                                  }} 
                                />
                              </div>
                            ) : (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                backgroundColor: 'var(--color-background)',
                                borderRadius: 'var(--border-radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.listing_type === 'auction' || item.listingType === 'auction' ? 'İhale' : 'Pazarlık'}</TableCell>
                          <TableCell>{item.starting_price?.toLocaleString('tr-TR') || item.start_price?.toLocaleString('tr-TR')} TL</TableCell>
                          <TableCell>{formatDate(item.end_date || item.endDate)}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status}>
                              {getStatusText(item.status)}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <ActionButton 
                              variant="primary" 
                              size="small"
                              onClick={() => handleViewAuctionDetails(item.id)}
                              disabled={actionLoading}
                            >
                              Detaylar
                            </ActionButton>
                            <ActionButton 
                              variant="secondary" 
                              size="small"
                              onClick={() => navigate(`/auctions/${item.id}`)}
                              disabled={actionLoading}
                            >
                              Görüntüle
                            </ActionButton>
                            <ActionButton 
                              variant="danger" 
                              size="small"
                              onClick={() => handleDeleteAuction(item.id)}
                              disabled={actionLoading}
                            >
                              Sil
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardContainer>
          </>
        );
      case 'create-auction':
        return (
          <>
            <SectionTitle>
              Yeni İlan Oluştur
              <Button variant="secondary" onClick={() => handleSectionChange('auctions')}>İlanlara Dön</Button>
            </SectionTitle>
            
            <form onSubmit={handleCreateAuction}>
              {/* Basic Info */}
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="title">İlan Başlığı</Label>
                  <Input 
                    type="text" 
                    id="title" 
                    name="title"
                    value={auctionForm.title}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="listingType">İlan Tipi</Label>
                  <Select 
                    id="listingType" 
                    name="listingType"
                    value={auctionForm.listingType}
                    onChange={handleAuctionFormChange}
                  >
                    <option value="auction">İhale (Açık Artırma)</option>
                    <option value="offer">Teklif Usulü (Pazarlık)</option>
                  </Select>
                </FormGroup>
              </FormGrid>

              {/* Property Details - Using Correct Schema Columns */}
              <FormGrid>               
                <FormGroup>
                  <Label htmlFor="area_size">Alan (m²)</Label>
                  <Input 
                    type="number" 
                    id="area_size" 
                    name="area_size"
                    value={auctionForm.area_size}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Örn: 150.50"
                  />
                </FormGroup>
                 <FormGroup>
                   <Label htmlFor="area_unit">Alan Birimi</Label>
                   <Input 
                     type="text" 
                     id="area_unit" 
                     name="area_unit"
                     value={auctionForm.area_unit}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: m2, dönüm"
                     required // Make unit required
                   />
                 </FormGroup>
                 {/* === ADDED TEXT FIELDS === */}
                 <FormGroup>
                   <Label htmlFor="emlak_tipi">Emlak Tipi (Metin)</Label>
                   <Input 
                     type="text" 
                     id="emlak_tipi" 
                     name="emlak_tipi"
                     value={auctionForm.emlak_tipi}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Arsa, Tarla"
                   />
                 </FormGroup>
                 <FormGroup>
                   <Label htmlFor="imar_durumu">İmar Durumu (Metin)</Label>
                   <Input 
                     type="text" 
                     id="imar_durumu" 
                     name="imar_durumu"
                     value={auctionForm.imar_durumu}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Konut, Ticari+Konut"
                   />
                 </FormGroup>
                 <FormGroup>
                   <Label htmlFor="ilan_sahibi">İlan Sahibi (Metin)</Label>
                   <Input 
                     type="text" 
                     id="ilan_sahibi" 
                     name="ilan_sahibi"
                     value={auctionForm.ilan_sahibi}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Firma Adı, Kişi Adı"
                   />
                 </FormGroup>
                 {/* === END ADDED TEXT FIELDS === */}
              </FormGrid>

              {/* Description */}
              <FormGroup>
                <Label htmlFor="description">İlan Açıklaması</Label>
                <TextArea 
                  id="description" 
                  name="description"
                  value={auctionForm.description}
                  onChange={handleAuctionFormChange}
                  required
                />
              </FormGroup>
              
              {/* Pricing */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startingPrice">
                    {auctionForm.listingType === 'auction' ? 'Başlangıç Fiyatı (TL)' : 'Liste Fiyatı (TL)'}
                  </Label>
                  <Input 
                    type="number" 
                    id="startingPrice" 
                    name="startingPrice"
                    value={auctionForm.startingPrice}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}>
                    {auctionForm.listingType === 'auction' ? 'Minimum Artış Tutarı (TL)' : 'Teklif Artış Tutarı (TL)'}
                  </Label>
                  <Input 
                    type="number" 
                    id={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}
                    name={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}
                    value={auctionForm.listingType === 'auction' ? auctionForm.minIncrement : auctionForm.offerIncrement}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </FormRow>
              
              {/* Dates & Times */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input 
                    type="date" 
                    id="startDate" 
                    name="startDate"
                    value={auctionForm.startDate}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="startTime">Başlangıç Saati</Label>
                  <Input 
                    type="time" 
                    id="startTime" 
                    name="startTime"
                    value={auctionForm.startTime}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input 
                    type="date" 
                    id="endDate" 
                    name="endDate"
                    value={auctionForm.endDate}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="endTime">Bitiş Saati</Label>
                  <Input 
                    type="time" 
                    id="endTime" 
                    name="endTime"
                    value={auctionForm.endTime}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              {/* Location */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="city">Şehir</Label>
                   <Select 
                      id="city" 
                      name="city"
                      value={auctionForm.city}
                      onChange={handleAuctionFormChange}
                      required
                    >
                      <option value="" disabled>Şehir Seçiniz...</option>
                      {turkishCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="locationDetails">Konum Detayları (Mahalle, Cadde vb.)</Label>
                  <Input 
                    type="text" 
                    id="locationDetails" 
                    name="locationDetails"
                    value={auctionForm.locationDetails}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: Ulu Cami Mah. 389 Sk."
                  />
                </FormGroup>
              </FormRow>

              {/* Ada/Parsel */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="ada_no">Ada No</Label>
                  <Input 
                    type="text" 
                    id="ada_no" 
                    name="ada_no"
                    value={auctionForm.ada_no}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: 123"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="parsel_no">Parsel No</Label>
                  <Input 
                    type="text" 
                    id="parsel_no" 
                    name="parsel_no"
                    value={auctionForm.parsel_no}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: 456"
                  />
                </FormGroup>
              </FormRow>

              {/* Image Upload */}
              <ImageUploadContainer>
                 <Label>İhale Görselleri</Label>
                
                {/* Existing images - Needed for edit form, maybe remove from create? */}
                {/* Consider removing this section for the create form 
                {auctionForm.images && auctionForm.images.length > 0 && (
                  <>
                    <p>Mevcut Görseller:</p>
                    <div className="preview-area">
                      {auctionForm.images.map((imageUrl, index) => (
                        <div key={index} className="image-preview">
                          <img src={imageUrl} alt={`Auction ${index}`} />
                          <div className="remove-btn" onClick={() => removeExistingImage(index)}>×</div>
                        </div>
                      ))}
                    </div>
                  </>
                )} 
                */} 
                
                {/* Upload new images */}
                <label className="upload-btn" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: '1px dashed var(--color-text-light)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Yeni Görsel Yükle
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Hide default input 
                  />
                </label>
                
                {uploading && <p>Yükleniyor...</p>}
                
                {images.length > 0 && (
                  <>
                    <p>Yeni Yüklenecek Görseller:</p>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '1rem'
                      }}>
                      {images.map((image, index) => (
                        <ImagePreview key={index}>
                          <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                          <button type="button" onClick={() => removeImage(index)}>
                             <CloseIcon />
                          </button>
                        </ImagePreview>
                      ))}
                    </div>
                  </>
                )}
              </ImageUploadContainer>
              
              {/* Status */}
              <FormGroup>
                <Label htmlFor="status">Durum</Label>
                <Select 
                  id="status" 
                  name="status"
                  value={auctionForm.status}
                  onChange={handleAuctionFormChange}
                  required
                >
                  <option value="upcoming">Yaklaşan</option>
                  <option value="active">Aktif</option>
                  <option value="completed">Tamamlandı</option>
                </Select>
              </FormGroup>
              
              <Button type="submit" disabled={uploading}>İhaleyi Oluştur</Button>
            </form>
          </>
        );
      case 'edit-auction':
          // Previous edit added this case, let's ensure it's using correct fields
        return (
          <>
            <SectionTitle>
              İlanı Düzenle
              <Button variant="secondary" onClick={() => handleSectionChange('auctions')}>İlanlara Dön</Button>
            </SectionTitle>
            
            <form onSubmit={handleUpdateAuction}>
              {/* Basic Info */}
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="title">İlan Başlığı</Label>
                  <Input 
                    type="text" 
                    id="title" 
                    name="title"
                    value={auctionForm.title}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="listingType">İlan Tipi</Label>
                  <Select 
                    id="listingType" 
                    name="listingType"
                    value={auctionForm.listingType}
                    onChange={handleAuctionFormChange}
                  >
                    <option value="auction">İhale (Açık Artırma)</option>
                    <option value="offer">Teklif Usulü (Pazarlık)</option>
                  </Select>
                </FormGroup>
              </FormGrid>

              {/* Property Details - Using Correct Schema Columns */}
              <FormGrid>               
                <FormGroup>
                  <Label htmlFor="area_size">Alan (m²)</Label>
                  <Input 
                    type="number" 
                    id="area_size" 
                    name="area_size"
                    value={auctionForm.area_size}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Örn: 150.50"
                  />
                </FormGroup>
                 <FormGroup>
                   <Label htmlFor="area_unit">Alan Birimi</Label>
                   <Input 
                     type="text" 
                     id="area_unit" 
                     name="area_unit"
                     value={auctionForm.area_unit}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: m2, dönüm"
                     required
                   />
                 </FormGroup>
                 {/* === ADDED TEXT FIELDS === */}
                 <FormGroup>
                   <Label htmlFor="emlak_tipi">Emlak Tipi (Metin)</Label>
                   <Input 
                     type="text" 
                     id="emlak_tipi" 
                     name="emlak_tipi"
                     value={auctionForm.emlak_tipi}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Arsa, Tarla"
                   />
                 </FormGroup>
                 <FormGroup>
                   <Label htmlFor="imar_durumu">İmar Durumu (Metin)</Label>
                   <Input 
                     type="text" 
                     id="imar_durumu" 
                     name="imar_durumu"
                     value={auctionForm.imar_durumu}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Konut, Ticari+Konut"
                   />
                 </FormGroup>
                 <FormGroup>
                   <Label htmlFor="ilan_sahibi">İlan Sahibi (Metin)</Label>
                   <Input 
                     type="text" 
                     id="ilan_sahibi" 
                     name="ilan_sahibi"
                     value={auctionForm.ilan_sahibi}
                     onChange={handleAuctionFormChange}
                     placeholder="Örn: Firma Adı, Kişi Adı"
                   />
                 </FormGroup>
                 {/* === END ADDED TEXT FIELDS === */}
              </FormGrid>

              {/* Description */}
              <FormGroup>
                <Label htmlFor="description">İlan Açıklaması</Label>
                <TextArea 
                  id="description" 
                  name="description"
                  value={auctionForm.description}
                  onChange={handleAuctionFormChange}
                  required
                />
              </FormGroup>
              
              {/* Pricing */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startingPrice">
                    {auctionForm.listingType === 'auction' ? 'Başlangıç Fiyatı (TL)' : 'Liste Fiyatı (TL)'}
                  </Label>
                  <Input 
                    type="number" 
                    id="startingPrice" 
                    name="startingPrice"
                    value={auctionForm.startingPrice}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}>
                    {auctionForm.listingType === 'auction' ? 'Minimum Artış Tutarı (TL)' : 'Teklif Artış Tutarı (TL)'}
                  </Label>
                  <Input 
                    type="number" 
                    id={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}
                    name={auctionForm.listingType === 'auction' ? 'minIncrement' : 'offerIncrement'}
                    value={auctionForm.listingType === 'auction' ? auctionForm.minIncrement : auctionForm.offerIncrement}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </FormRow>
              
              {/* Dates & Times */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input 
                    type="date" 
                    id="startDate" 
                    name="startDate"
                    value={auctionForm.startDate}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="startTime">Başlangıç Saati</Label>
                  <Input 
                    type="time" 
                    id="startTime" 
                    name="startTime"
                    value={auctionForm.startTime}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input 
                    type="date" 
                    id="endDate" 
                    name="endDate"
                    value={auctionForm.endDate}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="endTime">Bitiş Saati</Label>
                  <Input 
                    type="time" 
                    id="endTime" 
                    name="endTime"
                    value={auctionForm.endTime}
                    onChange={handleAuctionFormChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              {/* Location */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="city">Şehir</Label>
                   <Select 
                      id="city" 
                      name="city"
                      value={auctionForm.city}
                      onChange={handleAuctionFormChange}
                      required
                    >
                      <option value="" disabled>Şehir Seçiniz...</option>
                      {turkishCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="locationDetails">Konum Detayları (Mahalle, Cadde vb.)</Label>
                  <Input 
                    type="text" 
                    id="locationDetails" 
                    name="locationDetails"
                    value={auctionForm.locationDetails}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: Ulu Cami Mah. 389 Sk."
                  />
                </FormGroup>
              </FormRow>

              {/* Ada/Parsel */}
              <FormRow>
                <FormGroup>
                  <Label htmlFor="ada_no">Ada No</Label>
                  <Input 
                    type="text" 
                    id="ada_no" 
                    name="ada_no"
                    value={auctionForm.ada_no}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: 123"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="parsel_no">Parsel No</Label>
                  <Input 
                    type="text" 
                    id="parsel_no" 
                    name="parsel_no"
                    value={auctionForm.parsel_no}
                    onChange={handleAuctionFormChange}
                    placeholder="Örn: 456"
                  />
                </FormGroup>
              </FormRow>

              {/* Image Upload */}
              <ImageUploadContainer>
                 <Label>İhale Görselleri</Label>
                
                {/* Existing images */}
                {auctionForm.images && auctionForm.images.length > 0 && (
                  <>
                    <p>Mevcut Görseller:</p>
                     <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '1rem'
                      }}>
                      {auctionForm.images.map((imageUrl, index) => (
                        <ImagePreview key={index}>
                          <img src={imageUrl} alt={`Auction ${index}`} />
                          <button type="button" onClick={() => removeExistingImage(index)}>
                             <CloseIcon />
                          </button>
                        </ImagePreview>
                      ))}
                    </div>
                  </>
                )}
                
                {/* Upload new images */}
                <label className="upload-btn" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: '1px dashed var(--color-text-light)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  justifyContent: 'center'
                }}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Yeni Görsel Yükle
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Hide default input 
                  />
                </label>
                
                {uploading && <p>Yükleniyor...</p>}
                
                {images.length > 0 && (
                  <>
                    <p>Yeni Yüklenecek Görseller:</p>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '1rem'
                      }}>
                      {images.map((image, index) => (
                        <ImagePreview key={index}>
                          <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                          <button type="button" onClick={() => removeImage(index)}>
                             <CloseIcon />
                          </button>
                        </ImagePreview>
                      ))}
                    </div>
                  </>
                )}
              </ImageUploadContainer>
              
              {/* Status */}
              <FormGroup>
                <Label htmlFor="status">Durum</Label>
                <Select 
                  id="status" 
                  name="status"
                  value={auctionForm.status}
                  onChange={handleAuctionFormChange}
                  required
                >
                  <option value="upcoming">Yaklaşan</option>
                  <option value="active">Aktif</option>
                  <option value="completed">Tamamlandı</option> {/* Enable completed for editing */} 
                </Select>
              </FormGroup>
              
              <Button type="submit" disabled={uploading}>İlanı Güncelle</Button>
            </form>
          </>
        );
      case 'users':
      case 'create-user':
      case 'user-details':
        return (
          <>
            <SectionTitle>
              Kullanıcılar
              <Button onClick={() => handleSectionChange('create-user')}>Yeni Kullanıcı</Button>
            </SectionTitle>
            
            {/* Replace the multiple tabs with a single "Listings" tab */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              <TabButton 
                active={true} 
                style={{ 
                  marginRight: '1rem',
                  borderBottom: '2px solid var(--color-primary)',
                  fontWeight: 'bold'
                }}
              >
                Kullanıcılar
              </TabButton>
            </div>
            
            {/* Keep just the filters - same for all listing types */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <FilterButton 
                active={auctionFilter === 'all'} 
                onClick={() => setAuctionFilter('all')}
              >
                Tümü
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'active'} 
                onClick={() => setAuctionFilter('active')}
              >
                Aktif
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'upcoming'} 
                onClick={() => setAuctionFilter('upcoming')}
              >
                Yaklaşan
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'completed'} 
                onClick={() => setAuctionFilter('completed')}
              >
                Tamamlanan
              </FilterButton>
            </div>
            
            <CardContainer>
              {usersLoading && (
                <LoadingOverlay>
                  <div>Kullanıcılar yükleniyor...</div>
                </LoadingOverlay>
              )}
              
              {/* Single table for all listings */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader style={{ width: '60px' }}></TableHeader>
                      <TableHeader>Ad Soyad</TableHeader>
                      <TableHeader>E-posta</TableHeader>
                      <TableHeader>Telefon</TableHeader>
                      <TableHeader>Rol</TableHeader>
                      <TableHeader>Kayıt Tarihi</TableHeader>
                      <TableHeader>İşlemler</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {users
                      .filter(user => auctionFilter === 'all' || user.role === auctionFilter)
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.images && item.images.length > 0 ? (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: 'var(--border-radius-sm)',
                                overflow: 'hidden' 
                              }}>
                                <img 
                                  src={item.images[0]} 
                                  alt={item.title} 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover'
                                  }} 
                                />
                              </div>
                            ) : (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                backgroundColor: 'var(--color-background)',
                                borderRadius: 'var(--border-radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{item.full_name || '-'}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.phone || '-'}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.role === 'admin' ? 'active' : 'completed'}>
                              {item.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{formatDate(item.created_at)}</TableCell>
                          <TableCell>
                            <ActionButton 
                              variant="primary" 
                              size="small"
                              onClick={() => handleViewUserDetails(item.id)}
                            >
                              Detaylar
                            </ActionButton>
                            <ActionButton 
                              variant={item.role === 'admin' ? 'secondary' : 'primary'} 
                              size="small"
                              onClick={() => handleUpdateUserRole(item.id, item.role === 'admin' ? 'user' : 'admin')}
                            >
                              {item.role === 'admin' ? 'Kullanıcı Yap' : 'Yönetici Yap'}
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardContainer>
          </>
        );
      case 'payments':
        return (
          <>
            <SectionTitle>
              Ödemeler
              <Button onClick={() => handleSectionChange('create-payment')}>Yeni Ödeme</Button>
            </SectionTitle>
            
            {/* Replace the multiple tabs with a single "Listings" tab */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              <TabButton 
                active={true} 
                style={{ 
                  marginRight: '1rem',
                  borderBottom: '2px solid var(--color-primary)',
                  fontWeight: 'bold'
                }}
              >
                Ödemeler
              </TabButton>
            </div>
            
            {/* Keep just the filters - same for all listing types */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <FilterButton 
                active={auctionFilter === 'all'} 
                onClick={() => setAuctionFilter('all')}
              >
                Tümü
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'active'} 
                onClick={() => setAuctionFilter('active')}
              >
                Aktif
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'upcoming'} 
                onClick={() => setAuctionFilter('upcoming')}
              >
                Yaklaşan
              </FilterButton>
              <FilterButton 
                active={auctionFilter === 'completed'} 
                onClick={() => setAuctionFilter('completed')}
              >
                Tamamlanan
              </FilterButton>
            </div>
            
            <CardContainer>
              {paymentsLoading && (
                <LoadingOverlay>
                  <div>Ödemeler yükleniyor...</div>
                </LoadingOverlay>
              )}
              
              {/* Single table for all listings */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader style={{ width: '60px' }}></TableHeader>
                      <TableHeader>Kullanıcı</TableHeader>
                      <TableHeader>İhale</TableHeader>
                      <TableHeader>Ödeme Tutarı</TableHeader>
                      <TableHeader>Durum</TableHeader>
                      <TableHeader>Ödeme Tarihi</TableHeader>
                      <TableHeader>İşlemler</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {payments
                      .filter(payment => auctionFilter === 'all' || payment.status === auctionFilter)
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.images && item.images.length > 0 ? (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: 'var(--border-radius-sm)',
                                overflow: 'hidden' 
                              }}>
                                <img 
                                  src={item.images[0]} 
                                  alt={item.title} 
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover'
                                  }} 
                                />
                              </div>
                            ) : (
                              <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                backgroundColor: 'var(--color-background)',
                                borderRadius: 'var(--border-radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{item.profiles?.full_name || '-'}</TableCell>
                          <TableCell>{item.auctions?.title || '-'}</TableCell>
                          <TableCell>{item.amount?.toLocaleString('tr-TR')} TL</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status}>
                              {getStatusText(item.status)}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{formatDate(item.created_at)}</TableCell>
                          <TableCell>
                            <ActionButton 
                              variant="primary" 
                              size="small"
                              onClick={() => handleViewPaymentDetails(item.id)}
                            >
                              Detaylar
                            </ActionButton>
                            <ActionButton 
                              variant="secondary" 
                              size="small"
                              onClick={() => handleUpdatePaymentStatus(item.id, 'completed')}
                            >
                              Tamamla
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardContainer>
          </>
        );
      case 'settings':
        return (
          <>
            <SectionTitle>Ayarlar</SectionTitle>
            
            {/* Add your settings form components here */}
          </>
        );
      case 'auction-details':
        // Find the actual auction data from the auctions list for potentially more fields
        const currentAuction = auctions.find(a => a.id === selectedAuctionId);
        return (
          <>
            <SectionTitle>
              İlan Detayları: {auctionForm.title}
              <div>
                <Button 
                  variant="secondary" 
                  onClick={() => handleSectionChange('auctions')}
                  style={{ marginRight: '1rem' }}
                >
                  İlanlara Dön
                </Button>
                <Button onClick={() => handleSectionChange('edit-auction')}>
                  İlanı Düzenle
                </Button>
              </div>
            </SectionTitle>

            {/* Auction Information */}
            <CardContainer style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Genel Bilgiler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div><strong>Başlık:</strong> {auctionForm.title}</div>
                <div><strong>Durum:</strong> <StatusBadge status={auctionForm.status}>{getStatusText(auctionForm.status)}</StatusBadge></div>
                <div><strong>Tür:</strong> {auctionForm.listingType === 'auction' ? 'İhale' : 'Pazarlık'}</div>
                <div><strong>Başlangıç/Liste Fiyatı:</strong> {auctionForm.startingPrice?.toLocaleString('tr-TR')} TL</div>
                {auctionForm.listingType === 'auction' && 
                  <div><strong>Min. Artış:</strong> {auctionForm.minIncrement?.toLocaleString('tr-TR')} TL</div>
                }
                {auctionForm.listingType === 'offer' && 
                  <div><strong>Teklif Artış:</strong> {auctionForm.offerIncrement?.toLocaleString('tr-TR')} TL</div>
                }
                <div><strong>Başlangıç:</strong> {formatDate(auctionForm.startDate)} {auctionForm.startTime}</div>
                <div><strong>Bitiş:</strong> {formatDate(auctionForm.endDate)} {auctionForm.endTime}</div>
                <div><strong>Konum:</strong> {auctionForm.locationDetails ? `${auctionForm.locationDetails}, ${auctionForm.city}` : auctionForm.city}</div>
                {auctionForm.ada_no && <div><strong>Ada No:</strong> {auctionForm.ada_no}</div>}
                {auctionForm.parsel_no && <div><strong>Parsel No:</strong> {auctionForm.parsel_no}</div>}
                {/* Display new TEXT fields */}
                <div><strong>Alan:</strong> {auctionForm.area_size} {auctionForm.area_unit}</div>
                <div><strong>Emlak Tipi:</strong> {auctionForm.emlak_tipi || '-'}</div>
                <div><strong>İmar Durumu:</strong> {auctionForm.imar_durumu || '-'}</div>
                <div><strong>İlan Sahibi:</strong> {auctionForm.ilan_sahibi || '-'}</div>
                {/* Display original creator if different */}
                {currentAuction?.created_by && currentAuction.created_by !== auctionForm.ilan_sahibi && 
                  <div><strong>Oluşturan:</strong> {currentAuction.profiles?.full_name || currentAuction.created_by}</div>
                }
              </div>
               <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Açıklama:</h4>
               <p style={{ marginBottom: '0' }}>{auctionForm.description || '-'}</p>
            </CardContainer>
            
            {/* Image Gallery */}
            {auctionForm.images && auctionForm.images.length > 0 && (
              <CardContainer style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Görseller</h3>
                <ImageGallery>
                    {auctionForm.images.map((imageUrl, index) => (
                        <div key={index} className="gallery-item" onClick={() => handleImageClick(imageUrl)}>
                          <img src={imageUrl} alt={`Auction Image ${index + 1}`} />
                        </div>
                    ))}
                </ImageGallery>
              </CardContainer>
            )}
            
            {/* Modal for viewing full image */}
            {activeImage && (
                <div className="gallery-modal" onClick={handleCloseGallery}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
                        <button className="close-button" onClick={handleCloseGallery}>&times;</button>
                        <button className="nav-button prev" onClick={handlePrevImage}>&#10094;</button>
                        <img src={activeImage} alt="Full Size Auction Image" />
                        <button className="nav-button next" onClick={handleNextImage}>&#10095;</button>
                    </div>
                </div>
            )}

            {/* Bids/Offers Section based on listing type */}
            {auctionForm.listingType === 'auction' ? (
              <CardContainer>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Teklifler (İhale)</h3>
                {bids && bids.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Teklif Veren</TableHeader>
                          <TableHeader>E-posta</TableHeader>
                          <TableHeader>Telefon</TableHeader>
                          <TableHeader>Teklif Tutarı</TableHeader>
                          <TableHeader>Teklif Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {bids.map(bid => (
                          <TableRow key={bid.id}>
                            <TableCell>{bid.profiles?.full_name || 'İsimsiz'}</TableCell>
                            <TableCell>{bid.profiles?.email || '-'}</TableCell>
                            <TableCell>{bid.profiles?.phone_number || '-'}</TableCell>
                            <TableCell>{bid.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{formatDate(bid.created_at)}</TableCell>
                            <TableCell>
                              {bid.isHighestBid ? (
                                <StatusBadge status={'active'}>En Yüksek</StatusBadge>
                              ) : (
                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Daha Düşük</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <EmptyState>
                    <EmptyStateIcon>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </EmptyStateIcon>
                    <EmptyStateTitle>Bu ihale için henüz teklif verilmemiştir.</EmptyStateTitle>
                  </EmptyState>
                )}
              </CardContainer>
            ) : (
              <CardContainer>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Teklifler (Pazarlık)</h3>
                {selectedAuctionOffers && selectedAuctionOffers.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Teklif Veren</TableHeader>
                          <TableHeader>E-posta</TableHeader>
                          <TableHeader>Telefon</TableHeader>
                          <TableHeader>Teklif Tutarı</TableHeader>
                          <TableHeader>Teklif Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                          <TableHeader>İşlemler</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {selectedAuctionOffers.map(offer => (
                          <TableRow key={offer.id}>
                            <TableCell>{offer.profiles?.full_name || 'İsimsiz'}</TableCell>
                            <TableCell>{offer.profiles?.email || '-'}</TableCell>
                            <TableCell>{offer.profiles?.phone_number || '-'}</TableCell>
                            <TableCell>{offer.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{formatDate(offer.created_at)}</TableCell>
                            <TableCell>
                              <StatusBadge status={
                                offer.status === 'accepted' ? 'completed' :
                                offer.status === 'rejected' ? 'error' :
                                'pending'
                              }>
                                {offer.status === 'accepted' ? 'Kabul Edildi' :
                                 offer.status === 'rejected' ? 'Reddedildi' :
                                 'Beklemede'}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              {offer.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <ActionButton
                                    size="small"
                                    variant="primary"
                                    onClick={() => handleAcceptOffer(offer.id)}
                                    disabled={actionLoading}
                                  >
                                    Kabul Et
                                  </ActionButton>
                                  <ActionButton
                                    size="small"
                                    variant="danger"
                                    onClick={() => handleRejectOffer(offer.id)}
                                    disabled={actionLoading}
                                  >
                                    Reddet
                                  </ActionButton>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <EmptyState>
                    <EmptyStateIcon>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </EmptyStateIcon>
                    <EmptyStateTitle>Bu ilan için henüz teklif (pazarlık) alınmamıştır.</EmptyStateTitle>
                  </EmptyState>
                )}
              </CardContainer>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  // Render loading state while auth is being checked
  if (authLoading || loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Admin Dashboard</PageTitle>
        </PageHeader>
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p>Yükleniyor...</p>
        </div>
      </PageContainer>
    );
  }
  
  // Render content only if user is admin
  return (
    <PageContainer>
      <PageHeader>
        <h1>Yönetici Paneli</h1>
      </PageHeader>
      
      <DashboardGrid>
        <Sidebar>
          <SidebarButton 
            active={activeSection === 'dashboard'} 
            onClick={() => handleSectionChange('dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Genel Bakış
          </SidebarButton>
          
          {/* Fix for mobile display - make the menu collapse if screen is small */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <SidebarButton 
              active={activeSection === 'auctions' || activeSection === 'create-auction' || activeSection === 'auction-details' || activeSection === 'edit-auction'} 
              onClick={() => handleSectionChange('auctions')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              İhaleler
            </SidebarButton>
            
            <SidebarButton 
              active={activeSection === 'users' || activeSection === 'create-user' || activeSection === 'user-details'} 
              onClick={() => handleSectionChange('users')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Kullanıcılar
            </SidebarButton>
            
            <SidebarButton 
              active={activeSection === 'payments' || activeSection === 'create-payment'} 
              onClick={() => handleSectionChange('payments')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Ödemeler
            </SidebarButton>
            
            <SidebarButton onClick={() => navigate('/dashboard')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Kullanıcı Paneline Dön
            </SidebarButton>
          </div>
        </Sidebar>
        
        <ContentArea>
          {!authIsAdmin ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Erişim Reddedildi</h2>
              <p>Bu sayfayı görüntülemek için yönetici haklarına sahip olmalısınız.</p>
              <Button onClick={() => navigate('/dashboard')}>Kullanıcı Paneline Dön</Button>
            </div>
          ) : (
            renderContent()
          )}
        </ContentArea>
      </DashboardGrid>
    </PageContainer>
  );
} // Added missing closing brace for the function component

export default AdminDashboard; 