import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
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
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  height: fit-content;
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
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
`;

const ActionButton = styled(Button)`
  margin-right: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  
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
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
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
const StatCard = ({ title, value, icon }) => {
  return (
    <StatCardContainer>
      <StatIconWrapper>
        {icon}
      </StatIconWrapper>
      <StatContent>
        <StatTitle>{title}</StatTitle>
        <StatValue>{value}</StatValue>
      </StatContent>
    </StatCardContainer>
  );
};

const ImageUploadContainer = styled.div`
  margin-bottom: 1.5rem;
  
  .preview-area {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .image-preview {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .remove-btn {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.875rem;
    }
  }
  
  input[type="file"] {
    display: none;
  }
  
  .upload-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: var(--color-background);
    border: 1px dashed var(--color-border);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    
    svg {
      margin-right: 0.5rem;
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

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin: authIsAdmin, loading: authLoading, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
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
    images: []
  });
  
  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'user',
    phone: ''
  });
  
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
    
    // Load initial data for dashboard
    console.log("User is admin, loading dashboard data");
    fetchSectionData('dashboard');
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
  
  const fetchSectionData = async (section) => {
    setLoading(true);
    
    try {
      if (section === 'auctions' || section === 'dashboard') {
        const { data, error } = await supabase
          .from('auctions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error(`Error fetching auctions:`, error);
          setAuctions([]);
        } else {
          setAuctions(data || []);
        }
      } 
      
      if (section === 'users' || section === 'dashboard') {
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
      }
      
      if (section === 'payments' || section === 'dashboard') {
        await fetchPayments();
      }

      // Fetch ALL Offers (for dashboard and a potential 'offers' section)
      if (section === 'offers' || section === 'dashboard') { 
         const { data: offersData, error: offersError } = await supabase
           .from('offers')
           .select(`
             *,
             auctions ( id, title, start_price ),
             profiles ( id, full_name, email )
           `)
           .order('created_at', { ascending: false });

         if (offersError) {
           console.error('Error fetching offers:', offersError);
           setAllOffers([]);
         } else {
           console.log('Fetched offers:', offersData); // Log fetched offers
           setAllOffers(offersData || []);
         }
      }

    } catch (error) {
      console.error(`Error fetching data for ${section}:`, error);
    } finally {
      setLoading(false);
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

      // Create auction data object
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
        created_by: user?.id,
        images: imageUrls
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
      
      // Reset form
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
        images: []
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
      try {
        const { error } = await supabase
          .from('auctions')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Refresh auctions
        fetchSectionData('auctions');
        alert('İhale başarıyla silindi.');
      } catch (error) {
        console.error('Error deleting auction:', error);
        alert('İhale silinirken bir hata oluştu.');
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
        .eq('user_id', userId)
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
    setSelectedAuctionOffers([]); // Reset offers for the specific auction
    try {
      // Fetch auction details
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*') // Select all fields initially
        .eq('id', auctionId)
        .single();
        
      if (auctionError) throw auctionError;
      if (!auctionData) throw new Error("Auction not found");

      // Parse location into city and location details if possible
      let city = '';
      let locationDetails = '';
      
      if (auctionData.location) {
        // Try to extract city from location
        for (const turkishCity of turkishCities) {
          if (auctionData.location.includes(turkishCity)) {
            city = turkishCity;
            // Extract location details by removing the city
            locationDetails = auctionData.location.replace(`, ${city}`, '').replace(`${city}`, '').trim();
            if (locationDetails.endsWith(',')) {
              locationDetails = locationDetails.slice(0, -1).trim();
            }
            break;
          }
        }
        
        // If no city was found, use the full location as location details
        if (!city) {
          locationDetails = auctionData.location;
        }
      }
      
      // Set auction form data (including listingType)
      setAuctionForm({
        title: auctionData.title || '',
        description: auctionData.description || '',
        startingPrice: auctionData.start_price || 0,
        minIncrement: auctionData.min_increment || '', // Keep as string or handle null
        offerIncrement: auctionData.offer_increment || '', // Keep as string or handle null
        listingType: auctionData.listing_type || 'auction', // Make sure to fetch and set this
        startDate: formatDateForInput(auctionData.start_time) || '', // Use start_time for date input
        endDate: formatDateForInput(auctionData.end_time) || '',   // Use end_time for date input
        startTime: formatTimeForInput(auctionData.start_time) || '12:00',
        endTime: formatTimeForInput(auctionData.end_time) || '12:00',
        location: '', // Old field, now split into city and locationDetails
        city: city,
        locationDetails: locationDetails,
        status: auctionData.status || 'upcoming',
        images: auctionData.images || []
      });
      
      // Fetch bids for this auction (existing logic)
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('*, profiles(full_name, email)')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: false });
        
      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        setBids([]);
      } else {
        setBids(bidsData || []);
      }
      
      // Fetch payments for this auction (existing logic)
      // ... (keep existing payment fetch logic) ...
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*') // Fetch profiles later if needed
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });

      if (paymentsError) {
          console.error('Error fetching payments:', paymentsError);
          setPayments([]);
      } else {
          // Enhance payments with user details (simplified)
          let enhancedPayments = [];
          for (const payment of paymentsData || []) {
              if (payment.user_id) {
                  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', payment.user_id).single();
                  enhancedPayments.push({ ...payment, profiles: profile });
              } else {
                  enhancedPayments.push(payment);
              }
          }
          setPayments(enhancedPayments);
      }

      // ---- Fetch Offers for this auction IF it's an 'offer' type ----
      if (auctionData.listing_type === 'offer') {
        const { data: offersData, error: offersError } = await supabase
          .from('offers')
          .select(`
            *,
            profiles ( id, full_name, email )
          `)
          .eq('auction_id', auctionId)
          .order('created_at', { ascending: false });

        if (offersError) {
          console.error('Error fetching offers for auction:', offersError);
          setSelectedAuctionOffers([]); // Set to empty array on error
        } else {
          console.log('Fetched offers for auction', auctionId, ':', offersData);
          setSelectedAuctionOffers(offersData || []);
        }
      } else {
          setSelectedAuctionOffers([]); // Ensure it's empty for non-offer types
      }
      // --------------------------------------------------------------
      
      setSelectedAuctionId(auctionId);
      // setActiveSection('auction-details'); // No need to set section here, it's already set
    } catch (error) {
      console.error('Error fetching auction details:', error);
      alert('İhale detayları getirilirken bir hata oluştu.');
      // Optionally navigate back if fetch fails critically
      // handleSectionChange('auctions'); 
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

      // Update auction data
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
        images: imageUrls
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
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : (
              <>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <StatCard 
                    title="Toplam İhale"
                    value={auctions.length}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    }
                  />
                  
                  <StatCard 
                    title="Aktif İhale"
                    value={auctions.filter(a => a.status === 'active').length}
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
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    }
                  />
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr', 
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ 
                    backgroundColor: 'var(--color-background)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Son İhaleler</h3>
                    
                    {auctions.length > 0 ? (
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
                  </div>
                  
                  <div style={{ 
                    backgroundColor: 'var(--color-background)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.5rem'
                  }}>
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
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Son Kullanıcılar</h3>
                  
                  {users.length > 0 ? (
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
                </div>
              </>
            )}
          </>
        );
      case 'auctions':
        return (
          <>
            <SectionTitle>
              İhaleler
              <Button onClick={() => handleSectionChange('create-auction')}>Yeni İhale</Button>
            </SectionTitle>
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : auctions.length > 0 ? (
              <>
                <SearchInput 
                  type="text" 
                  placeholder="İhale ara..." 
                />
                
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
              </>
            ) : (
              <EmptyState>
                <p>Henüz oluşturulmuş ihale bulunmamaktadır.</p>
                <Button 
                  onClick={() => handleSectionChange('create-auction')}
                  style={{ marginTop: '1rem' }}
                >
                  İhale Oluştur
                </Button>
              </EmptyState>
            )}
          </>
        );
      case 'create-auction':
        return (
          <>
            <SectionTitle>
              Yeni İhale Oluştur
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('auctions')}
              >
                İhalelere Dön
              </Button>
            </SectionTitle>
            
            <form onSubmit={handleCreateAuction}>
              <FormGroup>
                <Label htmlFor="listingType">İlan Tipi</Label>
                <Select 
                  id="listingType" 
                  name="listingType"
                  value={auctionForm.listingType}
                  onChange={handleAuctionFormChange}
                  required
                >
                  <option value="auction">Açık Arttırma</option>
                  <option value="offer">Pazarlığa Başla</option>
                </Select>
              </FormGroup>

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
                <Label htmlFor="description">İlan Açıklaması</Label>
                <TextArea 
                  id="description" 
                  name="description"
                  value={auctionForm.description}
                  onChange={handleAuctionFormChange}
                  required
                />
              </FormGroup>
              
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
                    <option value="">Şehir Seçiniz</option>
                    {turkishCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="locationDetails">Konum Detayları</Label>
                  <Input 
                    type="text" 
                    id="locationDetails" 
                    name="locationDetails"
                    value={auctionForm.locationDetails}
                    onChange={handleAuctionFormChange}
                    placeholder="Mahalle, cadde, vs."
                  />
                </FormGroup>
              </FormRow>
              
              <ImageUploadContainer>
                <Label>İhale Görselleri</Label>
                <label className="upload-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Görsel Yükle
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
                
                {uploading && <p>Yükleniyor...</p>}
                
                {images.length > 0 && (
                  <div className="preview-area">
                    {images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                        <div className="remove-btn" onClick={() => removeImage(index)}>×</div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploadContainer>
              
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
              
              <Button type="submit" disabled={uploading}>İhale Oluştur</Button>
            </form>
          </>
        );
      case 'users':
        return (
          <>
            <SectionTitle>
              Kullanıcılar
              <Button onClick={() => handleSectionChange('create-user')}>Yeni Kullanıcı</Button>
            </SectionTitle>
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : users.length > 0 ? (
              <>
                <SearchInput 
                  type="text" 
                  placeholder="Kullanıcı ara..." 
                />
                
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
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.images && user.images.length > 0 ? (
                            <div style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: 'var(--border-radius-sm)',
                              overflow: 'hidden' 
                            }}>
                              <img 
                                src={user.images[0]} 
                                alt={user.full_name} 
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
              </>
            ) : (
              <EmptyState>
                <p>Henüz kayıtlı kullanıcı bulunmamaktadır.</p>
                <Button 
                  onClick={() => handleSectionChange('create-user')}
                  style={{ marginTop: '1rem' }}
                >
                  Kullanıcı Oluştur
                </Button>
              </EmptyState>
            )}
          </>
        );
      case 'create-user':
        return (
          <>
            <SectionTitle>
              Yeni Kullanıcı Oluştur
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('users')}
              >
                Kullanıcılara Dön
              </Button>
            </SectionTitle>
            
            <form onSubmit={handleCreateUser}>
              <FormGroup>
                <Label htmlFor="email">E-posta</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Şifre</Label>
                <Input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  required
                  minLength="6"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  value={userForm.fullName}
                  onChange={handleUserFormChange}
                  required
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="role">Rol</Label>
                  <Select 
                    id="role" 
                    name="role"
                    value={userForm.role}
                    onChange={handleUserFormChange}
                    required
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="admin">Yönetici</option>
                    <option value="moderator">Moderatör</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={userForm.phone}
                    onChange={handleUserFormChange}
                    placeholder="(555) 123 4567"
                  />
                </FormGroup>
              </FormRow>
              
              <Button type="submit">Kullanıcı Oluştur</Button>
            </form>
          </>
        );
      case 'user-details':
        return (
          <>
            <SectionTitle>
              Kullanıcı Detayları
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('users')}
              >
                Kullanıcılara Dön
              </Button>
            </SectionTitle>
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : selectedUser ? (
              <div>
                <div style={{ 
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{selectedUser.full_name || 'İsimsiz Kullanıcı'}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        variant={selectedUser.role === 'user' ? 'primary' : 'secondary'} 
                        size="small"
                        onClick={() => handleUpdateUserRole(selectedUser.id, 'user')}
                        disabled={selectedUser.role === 'user'}
                      >
                        Kullanıcı
                      </Button>
                      <Button 
                        variant={selectedUser.role === 'admin' ? 'primary' : 'secondary'} 
                        size="small"
                        onClick={() => handleUpdateUserRole(selectedUser.id, 'admin')}
                        disabled={selectedUser.role === 'admin'}
                      >
                        Yönetici
                      </Button>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1.5rem',
                  }}>
                    <div>
                      <p><strong>E-posta:</strong> {selectedUser.email || '-'}</p>
                      <p><strong>Telefon:</strong> {selectedUser.phone || '-'}</p>
                      <p><strong>Rol:</strong> {selectedUser.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
                    </div>
                    <div>
                      <p><strong>Kayıt Tarihi:</strong> {formatDate(selectedUser.created_at)}</p>
                      <p><strong>Son Güncelleme:</strong> {formatDate(selectedUser.updated_at)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '0.75rem 1.25rem', 
                    borderBottom: '2px solid var(--color-primary)', 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Teklifler
                  </div>
                  <div style={{ 
                    padding: '0.75rem 1.25rem',
                    cursor: 'pointer'
                  }}>
                    Ödemeler
                  </div>
                </div>
                
                {/* Bids Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Kullanıcı Teklifleri</h3>
                  </div>
                  
                  {userBids.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>İhale</TableHeader>
                          <TableHeader>Teklif Tutarı</TableHeader>
                          <TableHeader>Teklif Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {userBids.map(bid => (
                          <TableRow key={bid.id}>
                            <TableCell>{bid.auctions?.title || '-'}</TableCell>
                            <TableCell>{bid.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{formatDate(bid.created_at)}</TableCell>
                            <TableCell>
                              <StatusBadge status={bid.is_winning ? 'active' : 'completed'}>
                                {bid.is_winning ? 'Kazanan Teklif' : 'Normal Teklif'}
                              </StatusBadge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Kullanıcının henüz teklifi bulunmamaktadır.</p>
                  )}
                </div>
                
                {/* Payments Section */}
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Kullanıcı Ödemeleri</h3>
                  </div>
                  
                  {userPayments.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>İhale</TableHeader>
                          <TableHeader>Tutar</TableHeader>
                          <TableHeader>Açıklama</TableHeader>
                          <TableHeader>Ödeme Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {userPayments.map(payment => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.auctions?.title || '-'}</TableCell>
                            <TableCell>{payment.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{payment.description || '-'}</TableCell>
                            <TableCell>{formatDate(payment.created_at)}</TableCell>
                            <TableCell>
                              <StatusBadge status={payment.status === 'completed' ? 'active' : 'upcoming'}>
                                {payment.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                              </StatusBadge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Kullanıcının henüz ödeme kaydı bulunmamaktadır.</p>
                  )}
                </div>
              </div>
            ) : (
              <div>Kullanıcı bulunamadı.</div>
            )}
          </>
        );
      case 'auction-details':
        return (
          <>
            <SectionTitle>
              İhale Detayları
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('auctions')}
              >
                İhalelere Dön
              </Button>
            </SectionTitle>
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : (
              <div>
                <div style={{ 
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--border-radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{auctionForm.title}</h3>
                    <Button onClick={() => handleSectionChange('edit-auction')}>Düzenle</Button>
                  </div>
                  
                  {/* Show auction images in a gallery */}
                  {auctionForm.images && auctionForm.images.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>İhale Görselleri</h4>
                      <ImageGallery>
                        {auctionForm.images.map((imageUrl, index) => (
                          <div 
                            key={index} 
                            className="gallery-item"
                            onClick={() => handleImageClick(imageUrl)}
                          >
                            <img 
                              src={imageUrl} 
                              alt={`Auction ${index + 1}`} 
                            />
                          </div>
                        ))}
                      </ImageGallery>
                      
                      {activeImage && (
                        <div className="gallery-modal" onClick={handleCloseGallery}>
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={handleCloseGallery}>×</button>
                            
                            {auctionForm.images.length > 1 && (
                              <>
                                <button className="nav-button prev" onClick={handlePrevImage}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                  </svg>
                                </button>
                                <button className="nav-button next" onClick={handleNextImage}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            <img src={activeImage} alt="Enlarged auction" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1.5rem',
                  }}>
                    <div>
                      <p><strong>Başlangıç Fiyatı:</strong> {parseFloat(auctionForm.startingPrice).toLocaleString('tr-TR')} TL</p>
                      <p><strong>Minimum Artış:</strong> {parseFloat(auctionForm.minIncrement).toLocaleString('tr-TR')} TL</p>
                      <p><strong>Konum:</strong> {auctionForm.city ? `${auctionForm.locationDetails ? `${auctionForm.locationDetails}, ` : ''}${auctionForm.city}` : auctionForm.location}</p>
                      <p><strong>Durum:</strong> {getStatusText(auctionForm.status)}</p>
                    </div>
                    <div>
                      <p><strong>Başlangıç Tarihi:</strong> {formatDate(auctionForm.startDate)}</p>
                      <p><strong>Bitiş Tarihi:</strong> {formatDate(auctionForm.endDate)}</p>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Açıklama</h4>
                    <p>{auctionForm.description}</p>
                  </div>
                </div>
                
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '0.75rem 1.25rem', 
                    borderBottom: '2px solid var(--color-primary)', 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Teklif Verenler
                  </div>
                  <div style={{ 
                    padding: '0.75rem 1.25rem',
                    cursor: 'pointer'
                  }}>
                    Ödemeler
                  </div>
                </div>
                
                {/* Bidders Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Teklif Verenler</h3>
                  </div>
                  
                  {bids.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Kullanıcı</TableHeader>
                          <TableHeader>E-posta</TableHeader>
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
                            <TableCell>{bid.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{formatDate(bid.created_at)}</TableCell>
                            <TableCell>
                              <StatusBadge status={bid.is_winning ? 'active' : 'completed'}>
                                {bid.is_winning ? 'Kazanan Teklif' : 'Normal Teklif'}
                              </StatusBadge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Henüz teklif veren bulunmamaktadır.</p>
                  )}
                </div>
                
                {/* Payments Section */}
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Ödemeler</h3>
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => handleSectionChange('add-payment')}
                    >
                      Ödeme Ekle
                    </Button>
                  </div>
                  
                  {payments.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Kullanıcı</TableHeader>
                          <TableHeader>E-posta</TableHeader>
                          <TableHeader>Tutar</TableHeader>
                          <TableHeader>Açıklama</TableHeader>
                          <TableHeader>Ödeme Tarihi</TableHeader>
                          <TableHeader>Durum</TableHeader>
                        </TableRow>
                      </TableHead>
                      <tbody>
                        {payments.map(payment => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.profiles?.full_name || 'İsimsiz'}</TableCell>
                            <TableCell>{payment.profiles?.email || '-'}</TableCell>
                            <TableCell>{payment.amount?.toLocaleString('tr-TR')} TL</TableCell>
                            <TableCell>{payment.description || '-'}</TableCell>
                            <TableCell>{formatDate(payment.created_at)}</TableCell>
                            <TableCell>
                              <StatusBadge status={
                                payment.status === 'completed' ? 'active' : 
                                payment.status === 'canceled' ? 'completed' : 
                                'upcoming'
                              }>
                                {payment.status === 'completed' ? 'Tamamlandı' : 
                                 payment.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                              </StatusBadge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Henüz ödeme kaydı bulunmamaktadır.</p>
                  )}
                </div>

                {/* ---- Conditionally Display Bids OR Offers Table ---- */}
                {auctionForm.listingType === 'auction' && (
                     <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem' }}>Verilen Teklifler (Açık Artırma)</h3>
                        </div>
                        {/* ... (Keep Existing Bids Table Logic) ... */}
                         {bids.length > 0 ? (
                            <Table>
                                {/* ... bids table headers ... */} 
                                <tbody>
                                {bids.map(bid => (
                                    <TableRow key={bid.id}>
                                         {/* ... bid table cells ... */} 
                                    </TableRow>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Henüz teklif veren bulunmamaktadır.</p>
                        )}
                    </div>
                )}

                {auctionForm.listingType === 'offer' && (
                     <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem' }}>Gelen Teklifler (Pazarlık)</h3>
                        </div>
                        {selectedAuctionOffers.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeader>Kullanıcı</TableHeader>
                                        <TableHeader>Teklif Tutarı</TableHeader>
                                        <TableHeader>Teklif Tarihi</TableHeader>
                                        <TableHeader>Durum</TableHeader>
                                        <TableHeader>İşlemler</TableHeader>
                                    </TableRow>
                                </TableHead>
                                <tbody>
                                    {selectedAuctionOffers.map(offer => (
                                        <TableRow key={offer.id}>
                                            <TableCell>{offer.profiles?.full_name || 'İsimsiz'} ({offer.profiles?.email || '-'})</TableCell>
                                            <TableCell>{formatPrice(offer.amount)}</TableCell>
                                            <TableCell>{formatDate(offer.created_at)}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={offer.status}> 
                                                    {offer.status === 'pending' ? 'Beklemede' : 
                                                     offer.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                                                </StatusBadge>
                                            </TableCell>
                                            <TableCell>
                                                {offer.status === 'pending' && (
                                                    <>
                                                        <ActionButton 
                                                            variant="success" 
                                                            size="small"
                                                            onClick={() => handleAcceptOffer(offer.id)}
                                                            disabled={loading} // Disable buttons during action
                                                        >
                                                            Kabul Et
                                                        </ActionButton>
                                                        <ActionButton 
                                                            variant="danger" 
                                                            size="small"
                                                            onClick={() => handleRejectOffer(offer.id)}
                                                            disabled={loading}
                                                        >
                                                            Reddet
                                                        </ActionButton>
                                                    </>
                                                )}
                                                {offer.status !== 'pending' && '-'} 
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Bu ilan için henüz teklif gelmemiştir.</p>
                        )}
                     </div>
                )}
                {/* ----------------------------------------------- */}
              </div>
            )}
          </>
        );
      case 'edit-auction':
        return (
          <>
            <SectionTitle>
              İhale Düzenle
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('auction-details')}
              >
                İhale Detaylarına Dön
              </Button>
            </SectionTitle>
            
            <form onSubmit={handleUpdateAuction}>
              <FormGroup>
                <Label htmlFor="title">İhale Başlığı</Label>
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
                <Label htmlFor="description">İhale Açıklaması</Label>
                <TextArea 
                  id="description" 
                  name="description"
                  value={auctionForm.description}
                  onChange={handleAuctionFormChange}
                  required
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startingPrice">Başlangıç Fiyatı (TL)</Label>
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
                  <Label htmlFor="minIncrement">Minimum Artış Tutarı (TL)</Label>
                  <Input 
                    type="number" 
                    id="minIncrement" 
                    name="minIncrement"
                    value={auctionForm.minIncrement}
                    onChange={handleAuctionFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </FormRow>
              
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
                    <option value="">Şehir Seçiniz</option>
                    {turkishCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="locationDetails">Konum Detayları</Label>
                  <Input 
                    type="text" 
                    id="locationDetails" 
                    name="locationDetails"
                    value={auctionForm.locationDetails}
                    onChange={handleAuctionFormChange}
                    placeholder="Mahalle, cadde, vs."
                  />
                </FormGroup>
              </FormRow>
              
              <ImageUploadContainer>
                <Label>İhale Görselleri</Label>
                
                {/* Existing images */}
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
                
                {/* Upload new images */}
                <label className="upload-btn" style={{ marginTop: '1rem' }}>
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
                  />
                </label>
                
                {uploading && <p>Yükleniyor...</p>}
                
                {images.length > 0 && (
                  <>
                    <p>Yeni Görseller:</p>
                    <div className="preview-area">
                      {images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                          <div className="remove-btn" onClick={() => removeImage(index)}>×</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </ImageUploadContainer>
              
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
              
              <Button type="submit" disabled={uploading}>İhaleyi Güncelle</Button>
            </form>
          </>
        );
      case 'add-payment':
        return (
          <>
            <SectionTitle>
              Ödeme Ekle
              <Button 
                variant="secondary" 
                onClick={() => handleSectionChange('auction-details')}
              >
                İhale Detaylarına Dön
              </Button>
            </SectionTitle>
            
            <form onSubmit={handleCreatePayment}>
              <FormGroup>
                <Label htmlFor="userId">Kullanıcı</Label>
                <Select 
                  id="userId" 
                  name="userId"
                  required
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="amount">Ödeme Tutarı (TL)</Label>
                <Input 
                  type="number" 
                  id="amount" 
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Açıklama</Label>
                <Input 
                  type="text" 
                  id="description" 
                  name="description"
                  placeholder="İhale kazanım ödemesi"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="status">Durum</Label>
                <Select 
                  id="status" 
                  name="status"
                  required
                >
                  <option value="pending">Beklemede</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="canceled">İptal</option>
                </Select>
              </FormGroup>
              
              <Button type="submit">Ödeme Ekle</Button>
            </form>
          </>
        );
      case 'payments':
        return (
          <>
            <SectionTitle>
              Ödeme Takibi
            </SectionTitle>
            
            {loading ? (
              <div>Yükleniyor...</div>
            ) : payments.length > 0 ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <SearchInput 
                    type="text" 
                    placeholder="Ödeme ara..." 
                  />
                </div>
                
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>İhale</TableHeader>
                      <TableHeader>Kullanıcı</TableHeader>
                      <TableHeader>Tutar</TableHeader>
                      <TableHeader>Ödeme Tarihi</TableHeader>
                      <TableHeader>Durum</TableHeader>
                      <TableHeader>İşlemler</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {payments.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.auctions?.title || payment.auction_name || '-'}</TableCell>
                        <TableCell>{
                          (payment.profiles?.full_name && payment.profiles?.email) 
                            ? `${payment.profiles.full_name} (${payment.profiles.email})`
                            : payment.profiles?.full_name || payment.profiles?.email || payment.user_name || '-'
                        }</TableCell>
                        <TableCell>{payment.amount?.toLocaleString('tr-TR')} TL</TableCell>
                        <TableCell>{formatDate(payment.created_at)}</TableCell>
                        <TableCell>
                          <StatusBadge status={
                            payment.status === 'completed' ? 'active' : 
                            payment.status === 'canceled' ? 'completed' : 
                            'upcoming'
                          }>
                            {payment.status === 'completed' ? 'Tamamlandı' : 
                             payment.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <ActionButton 
                            variant="primary" 
                            size="small"
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'completed')}
                            disabled={payment.status === 'completed'}
                          >
                            Tamamla
                          </ActionButton>
                          <ActionButton 
                            variant="secondary" 
                            size="small"
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'pending')}
                            disabled={payment.status === 'pending'}
                          >
                            Beklet
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            size="small"
                            onClick={() => handleUpdatePaymentStatus(payment.id, 'canceled')}
                            disabled={payment.status === 'canceled'}
                          >
                            İptal
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <EmptyState>
                <p>Henüz ödeme kaydı bulunmamaktadır.</p>
              </EmptyState>
            )}
          </>
        );
      case 'settings':
        return (
          <>
            <SectionTitle>Sistem Ayarları</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="siteName">Site Adı</Label>
              <Input 
                type="text" 
                id="siteName" 
                defaultValue="Arazialcom"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="contactEmail">İletişim E-postası</Label>
              <Input 
                type="email" 
                id="contactEmail" 
                defaultValue="info@arazialcom.com"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="bidIncrement">Minimum Teklif Artışı (TL)</Label>
              <Input 
                type="number" 
                id="bidIncrement" 
                defaultValue="100"
                min="1"
              />
            </FormGroup>
            
            <Button>Ayarları Kaydet</Button>
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
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Kullanıcılar
          </SidebarButton>
          
          <SidebarButton 
            active={activeSection === 'payments' || activeSection === 'add-payment'} 
            onClick={() => handleSectionChange('payments')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Ödemeler
          </SidebarButton>
          
          <SidebarButton 
            active={activeSection === 'settings'} 
            onClick={() => handleSectionChange('settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Ayarlar
          </SidebarButton>
          
          <SidebarButton onClick={() => navigate('/dashboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Kullanıcı Paneline Dön
          </SidebarButton>
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
}

export default AdminDashboard; 