import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 2rem;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`;

const MemberSince = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SectionContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
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

const BidsTable = styled.table`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
`;

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          console.error('No user ID available for profile fetch');
          return;
        }
        
        console.log('[UserProfile] Fetching profile data for user:', user.id);
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('[UserProfile] Error fetching profile:', profileError);
          throw profileError;
        }
        
        if (!profileData) {
          console.warn('[UserProfile] No profile data found, may need to create one');
        }
        
        // Fetch user bids
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            id,
            amount,
            created_at,
            auctions (
              id,
              title,
              status
            )
          `)
          .eq('bidder_id', user.id)
          .order('created_at', { ascending: false });
          
        if (bidsError) {
          console.error('[UserProfile] Error fetching bids:', bidsError);
          throw bidsError;
        }
        
        console.log('[UserProfile] Successfully loaded profile data');
        setProfile(profileData);
        setBids(bidsData || []);
        
        // Check if columns exist in the profileData and set default values if not
        setFormData({
          fullName: profileData?.full_name || '',
          phone: profileData?.phone_number || '',
          address: profileData?.address || '',
          city: profileData?.city || '',
          postalCode: profileData?.postal_code || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchUserProfile();
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // First, ensure the columns exist in the database
      const { error: schemaError } = await supabase.rpc('ensure_profile_columns');
      if (schemaError) console.error('Error ensuring schema:', schemaError);
      
      // Then update the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone_number: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          updated_at: new Date()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      alert('Profil bilgileriniz başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profil güncellenirken bir hata oluştu.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <SectionContainer>
            <SectionTitle>Profil Bilgileri</SectionTitle>
            <form onSubmit={handleProfileUpdate}>
              <FormGroup>
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={user?.email || ''}
                  disabled
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Telefon</Label>
                <Input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address">Adres</Label>
                <Input 
                  type="text" 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="city">Şehir</Label>
                  <Input 
                    type="text" 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="postalCode">Posta Kodu</Label>
                  <Input 
                    type="text" 
                    id="postalCode" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
              
              <Button type="submit">Bilgileri Güncelle</Button>
            </form>
          </SectionContainer>
        );
      case 'bids':
        return (
          <SectionContainer>
            <SectionTitle>Teklif Geçmişim</SectionTitle>
            {bids.length > 0 ? (
              <BidsTable>
                <TableHead>
                  <TableRow>
                    <TableHeader>İhale</TableHeader>
                    <TableHeader>Teklif Tutarı</TableHeader>
                    <TableHeader>Tarih</TableHeader>
                    <TableHeader>Durum</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {bids.map(bid => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.auctions.title}</TableCell>
                      <TableCell>{bid.amount.toLocaleString('tr-TR')} TL</TableCell>
                      <TableCell>{formatDate(bid.created_at)}</TableCell>
                      <TableCell>
                        {bid.auctions.status === 'active' ? 'Aktif' : 
                         bid.auctions.status === 'completed' ? 'Tamamlandı' : 'Yaklaşan'}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </BidsTable>
            ) : (
              <EmptyState>
                <p>Henüz teklif verdiğiniz bir ihale bulunmamaktadır.</p>
              </EmptyState>
            )}
          </SectionContainer>
        );
      case 'settings':
        return (
          <SectionContainer>
            <SectionTitle>Hesap Ayarları</SectionTitle>
            <FormGroup>
              <Button variant="secondary">Şifremi Değiştir</Button>
            </FormGroup>
            <FormGroup>
              <Button variant="danger">Hesabımı Sil</Button>
            </FormGroup>
          </SectionContainer>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageContainer>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar 
            src={profile?.avatar_url || 'https://via.placeholder.com/150'} 
            alt={profile?.full_name || 'User'} 
          />
        </AvatarContainer>
        <ProfileInfo>
          <UserName>{profile?.full_name || user?.email}</UserName>
          <UserEmail>{user?.email}</UserEmail>
          <MemberSince>
            {profile?.created_at ? `Üyelik Tarihi: ${formatDate(profile.created_at)}` : ''}
          </MemberSince>
        </ProfileInfo>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profil Bilgileri
        </Tab>
        <Tab 
          active={activeTab === 'bids'} 
          onClick={() => setActiveTab('bids')}
        >
          Teklif Geçmişim
        </Tab>
        <Tab 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
        >
          Hesap Ayarları
        </Tab>
      </TabsContainer>
      
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        renderTabContent()
      )}
    </PageContainer>
  );
};

export default UserProfile; 