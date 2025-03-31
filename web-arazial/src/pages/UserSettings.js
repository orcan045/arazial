import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: var(--color-text-secondary);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  white-space: nowrap;
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
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  input {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    user-select: none;
  }
`;

const HelperText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #ecfdf5;
  border-radius: var(--border-radius-md);
`;

const DeleteAccountButton = styled(Button)`
  margin-top: 1rem;
`;

const UserSettings = () => {
  const { user, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    auctionReminders: true,
    marketingEmails: false,
    twoFactorAuth: false
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        
        // Fetch user settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows returned
          console.error('Error fetching user settings:', error);
          return;
        }
        
        if (data) {
          setUserSettings({
            emailNotifications: data.email_notifications,
            auctionReminders: data.auction_reminders,
            marketingEmails: data.marketing_emails,
            twoFactorAuth: data.two_factor_auth
          });
        } else {
          // Create default settings
          await supabase
            .from('user_settings')
            .insert([{
              user_id: user.id,
              email_notifications: true,
              auction_reminders: true,
              marketing_emails: false,
              two_factor_auth: false
            }]);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchUserSettings();
  }, [user]);
  
  const handleSettingsChange = async (e) => {
    const { name, checked } = e.target;
    
    try {
      const updatedSettings = {
        ...userSettings,
        [name]: checked
      };
      
      setUserSettings(updatedSettings);
      
      // Update in database
      const { error } = await supabase
        .from('user_settings')
        .update({
          [name.replace(/([A-Z])/g, "_$1").toLowerCase()]: checked
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setSuccess({
        ...success,
        settings: 'Ayarlarınız başarıyla güncellendi.'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, settings: null }));
      }, 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Mevcut şifrenizi giriniz';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Yeni şifrenizi giriniz';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    try {
      setLoading(true);
      
      const { error } = await updatePassword(passwordForm.newPassword);
      
      if (error) throw error;
      
      setSuccess({
        ...success,
        password: 'Şifreniz başarıyla güncellendi.'
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({
        ...errors,
        general: 'Şifre güncellenirken bir hata oluştu.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
    );
    
    if (confirmed) {
      try {
        setLoading(true);
        
        // In a real app, this should be implemented with a secure serverless function
        alert('Hesap silme özelliği şu anda aktif değildir. Lütfen destek ekibiyle iletişime geçin.');
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <SectionContainer>
            <SectionTitle>Bildirim Tercihleri</SectionTitle>
            
            {success.settings && <SuccessMessage>{success.settings}</SuccessMessage>}
            
            <Checkbox>
              <input 
                type="checkbox" 
                id="emailNotifications" 
                name="emailNotifications"
                checked={userSettings.emailNotifications}
                onChange={handleSettingsChange}
              />
              <label htmlFor="emailNotifications">E-posta Bildirimleri</label>
            </Checkbox>
            <HelperText>
              İhale durumları, teklifler ve hesap etkinlikleriyle ilgili e-posta bildirimleri alın.
            </HelperText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                id="auctionReminders" 
                name="auctionReminders"
                checked={userSettings.auctionReminders}
                onChange={handleSettingsChange}
              />
              <label htmlFor="auctionReminders">İhale Hatırlatıcıları</label>
            </Checkbox>
            <HelperText>
              Takip ettiğiniz ihaleler başlamadan önce hatırlatıcı e-postalar alın.
            </HelperText>
            
            <Checkbox>
              <input 
                type="checkbox" 
                id="marketingEmails" 
                name="marketingEmails"
                checked={userSettings.marketingEmails}
                onChange={handleSettingsChange}
              />
              <label htmlFor="marketingEmails">Pazarlama E-postaları</label>
            </Checkbox>
            <HelperText>
              Yeni özellikler, özel teklifler ve platformumuzla ilgili güncellemeler hakkında e-postalar alın.
            </HelperText>
          </SectionContainer>
        );
      case 'security':
        return (
          <>
            <SectionContainer>
              <SectionTitle>Güvenlik</SectionTitle>
              
              <Checkbox>
                <input 
                  type="checkbox" 
                  id="twoFactorAuth" 
                  name="twoFactorAuth"
                  checked={userSettings.twoFactorAuth}
                  onChange={handleSettingsChange}
                />
                <label htmlFor="twoFactorAuth">İki Faktörlü Kimlik Doğrulama</label>
              </Checkbox>
              <HelperText>
                Hesabınıza her giriş yaptığınızda, e-posta ile bir güvenlik kodu alın.
              </HelperText>
            </SectionContainer>
            
            <SectionContainer>
              <SectionTitle>Şifre Değiştirme</SectionTitle>
              
              {success.password && <SuccessMessage>{success.password}</SuccessMessage>}
              {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
              
              <form onSubmit={handlePasswordSubmit}>
                <FormGroup>
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input 
                    type="password" 
                    id="newPassword" 
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                </FormGroup>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </Button>
              </form>
            </SectionContainer>
          </>
        );
      case 'data':
        return (
          <SectionContainer>
            <SectionTitle>Hesap ve Veriler</SectionTitle>
            
            <p>
              Arazialcom platformuna kayıtlı verilerinizi yönetin. Burada hesabınızı silebilir veya 
              verilerinizin bir kopyasını indirebilirsiniz.
            </p>
            
            <Button variant="secondary" style={{ marginTop: '1.5rem' }}>
              Verilerimi İndir
            </Button>
            
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>Tehlikeli Bölge</h3>
              <p>
                Hesabınızı sildiğinizde, tüm verileriniz ve teklifleriniz kalıcı olarak silinecektir.
                Bu işlem geri alınamaz.
              </p>
              
              <DeleteAccountButton 
                variant="danger" 
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                Hesabımı Sil
              </DeleteAccountButton>
            </div>
          </SectionContainer>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Hesap Ayarları</PageTitle>
        <PageSubtitle>
          Bildirim tercihlerinizi yönetin, güvenlik ayarlarını değiştirin veya hesap bilgilerinizi güncelleyin.
        </PageSubtitle>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          Bildirim Tercihleri
        </Tab>
        <Tab 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
        >
          Güvenlik ve Şifre
        </Tab>
        <Tab 
          active={activeTab === 'data'} 
          onClick={() => setActiveTab('data')}
        >
          Hesap ve Veriler
        </Tab>
      </TabsContainer>
      
      {loading && !userSettings ? (
        <div>Yükleniyor...</div>
      ) : (
        renderTabContent()
      )}
    </PageContainer>
  );
};

export default UserSettings; 