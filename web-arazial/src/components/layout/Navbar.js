import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { resetAllAuthStorage } from '../../services/appState';
import logoImage from '../../assets/logo.png';

const NavbarContainer = styled.nav`
  background-color: ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--color-surface)'};
  box-shadow: ${props => props.$isScrolled ? 'var(--shadow-md)' : 'none'};
  border-bottom: ${props => props.$isScrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'};
  position: ${props => props.$isFixed ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  
  & + * {
    padding-top: ${props => props.$isFixed ? '80px' : '0'};
    
    @media (max-width: 767px) {
      padding-top: ${props => props.$isFixed ? '70px' : '0'};
    }
  }
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.$isScrolled ? '0.75rem 2rem' : '1.25rem 2rem'};
  max-width: 1400px;
  margin: 0 auto;
  height: ${props => props.$isScrolled ? '70px' : '80px'};
  transition: all 0.3s ease;
  
  @media (min-width: 1024px) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  
  @media (max-width: 767px) {
    padding: ${props => props.$isScrolled ? '0.75rem 1.5rem' : '1rem 1.5rem'};
    height: ${props => props.$isScrolled ? '60px' : '70px'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.$isScrolled ? '0.75rem 1rem' : '1rem 1rem'};
    height: ${props => props.$isScrolled ? '56px' : '64px'};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  span {
    color: var(--color-primary);
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 359px) {
    span {
      display: none;
    }
  }
`;

const LogoIcon = styled.div`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  
  img {
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    
    @media (max-width: 767px) {
      height: 2.75rem;
      width: 2.75rem;
    }
  }
  
  @media (max-width: 359px) {
    margin-right: 0;
  }
`;

const NavMenu = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  border-radius: var(--border-radius-md);
  
  &:hover {
    color: var(--color-primary);
    background-color: rgba(15, 52, 96, 0.04);
  }
  
  &.active {
    color: var(--color-primary);
    font-weight: 600;
    background-color: rgba(15, 52, 96, 0.06);
  }
`;

const NavButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
  
  /* Hide buttons on very small screens, show only hamburger menu */
  @media (max-width: 359px) {
    > a {
      display: none;
    }
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  display: flex;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(15, 52, 96, 0.06);
  }
  
  @media (min-width: 768px) {
    display: none;
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-surface);
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 900;
  box-shadow: var(--shadow-lg);
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  padding: 1.25rem 2rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  border-bottom: 1px solid var(--color-surface-secondary);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-surface-secondary);
    color: var(--color-primary);
    padding-left: 2.5rem;
  }
  
  &.active {
    color: var(--color-primary);
    font-weight: 600;
    border-left: 3px solid var(--color-primary);
    background-color: rgba(15, 52, 96, 0.04);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background-color: rgba(15, 52, 96, 0.06);
    transform: rotate(90deg);
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: var(--border-radius-md);
  
  &:hover {
    background-color: rgba(15, 52, 96, 0.04);
  }
  
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-surface);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .user-name {
    margin-left: 0.5rem;
    font-weight: 500;
    display: none;
    
    @media (min-width: 1024px) {
      display: block;
    }
  }
  
  .dropdown-icon {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 220px;
  overflow: hidden;
  z-index: 100;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.1s ease;
  font-weight: 500;
  
  svg {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
  }
  
  &:hover {
    background-color: var(--color-surface-secondary);
    color: var(--color-primary);
    
    svg {
      color: var(--color-primary);
    }
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: var(--color-surface-secondary);
  margin: 0.25rem 0;
`;

const UserMenuSignOutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  transition: all 0.1s ease;
  font-weight: 500;
  
  svg {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-error);
  }
  
  &:hover {
    background-color: var(--color-surface-secondary);
  }
`;

const PremiumBadge = styled.span`
  background: linear-gradient(90deg, var(--color-gold-dark) 0%, var(--color-gold) 100%);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  margin-left: 0.5rem;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`;

// Add styled components for disabled menu items
const DisabledUserMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  opacity: 0.6;
  cursor: not-allowed;
  
  svg {
    margin-right: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
  }
`;

const DisabledMobileNavLink = styled.div`
  padding: 1.25rem 2rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  border-bottom: 1px solid var(--color-surface-secondary);
  opacity: 0.6;
  cursor: not-allowed;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, signOut, isAdmin, loading, reloadUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  
  useEffect(() => {
    // This effect will run whenever the user state changes
    console.log("Auth state in Navbar changed:", user ? "logged in" : "logged out");
    // Reset UI state when auth changes
    setIsUserMenuOpen(false);
    setIsOpen(false);
  }, [user]);
  
  // Add a timeout effect to avoid UI getting stuck in loading state
  useEffect(() => {
    // If loading takes too long, we'll assume there's a problem and force reset
    let loadingTimeout;
    let resetButtonTimeout;
    
    if (loading) {
      loadingTimeout = setTimeout(() => {
        console.log("Navbar loading timeout reached - force resetting UI state");
        // Force UI into a consistent state rather than showing perpetual loading
        setIsUserMenuOpen(false);
        setIsOpen(false);
      }, 8000); // 8 seconds max loading time
      
      // Show reset button after 5 seconds of loading
      resetButtonTimeout = setTimeout(() => {
        setShowResetButton(true);
      }, 5000);
    } else {
      setShowResetButton(false);
    }
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (resetButtonTimeout) clearTimeout(resetButtonTimeout);
    };
  }, [loading]);
  
  // Handler to reset the session
  const handleResetSession = async () => {
    console.log("User initiated session reset");
    try {
      // First try to force sign out 
      try {
        await signOut();
      } catch (error) {
        console.error("Error during forced sign out:", error);
      }
      
      // Force reset all auth storage
      resetAllAuthStorage();
      
      // Force reload user profile
      await reloadUserProfile();
      
      // Redirect to home page
      navigate('/');
      
      // If still loading after a moment, suggest page refresh
      setTimeout(() => {
        if (loading) {
          alert("Oturum sıfırlanamadı. Sayfayı yenilemek için tamam'a basın.");
          window.location.reload();
        }
      }, 3000); 
    } catch (error) {
      console.error("Session reset failed:", error);
      alert("Oturum sıfırlanamadı. Sayfayı yenilemek için tamam'a basın.");
      window.location.reload();
    } finally {
      setShowResetButton(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  
  return (
    <NavbarContainer $isFixed={true} $isScrolled={isScrolled}>
      <NavbarContent $isScrolled={isScrolled}>
        <Logo to="/">
          <LogoIcon>
            <img src={logoImage} alt="Arazialcom Logo" />
          </LogoIcon>
          <span>Arazialcom</span>
        </Logo>
        
        <NavMenu>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Ana Sayfa
          </NavLink>
          <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            Hakkımızda
          </NavLink>
          <NavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            İletişim
          </NavLink>
          <NavLink to="/sss" className={location.pathname === '/sss' ? 'active' : ''}>
            SSS
          </NavLink>
        </NavMenu>
        
        <NavButtonsContainer>
          {loading ? (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                border: '2px solid var(--color-surface-secondary)',
                borderTopColor: 'var(--color-primary)',
                animation: 'navbarSpin 1s linear infinite'
              }} />
              
              {showResetButton && (
                <button 
                  onClick={handleResetSession}
                  style={{
                    background: 'var(--color-surface-secondary)',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: 'var(--color-text)'
                  }}
                >
                  Oturumu Sıfırla
                </button>
              )}
            </div>
          ) : !user ? (
            <>
              <Button 
                as={Link} 
                to="/login" 
                variant="secondary" 
                size="small"
                minWidth="auto"
                style={{ 
                  padding: windowWidth < 480 ? '0.4rem 0.75rem' : '0.5rem 1.25rem',
                  fontSize: windowWidth < 480 ? '0.8rem' : '0.875rem',
                  minHeight: windowWidth < 480 ? '32px' : '36px'
                }}
              >
                Giriş Yap
              </Button>
              <Button 
                as={Link} 
                to="/signup" 
                variant="primary" 
                size="small"
                minWidth="auto"
                style={{ 
                  padding: windowWidth < 480 ? '0.4rem 0.75rem' : '0.5rem 1.25rem',
                  fontSize: windowWidth < 480 ? '0.8rem' : '0.875rem',
                  minHeight: windowWidth < 480 ? '32px' : '36px'
                }}
              >
                Kayıt Ol
              </Button>
            </>
          ) : (
            <UserMenuContainer className="user-menu-container">
              <UserMenuButton 
                onClick={toggleUserMenu}
                $isOpen={isUserMenuOpen}
              >
                <img 
                  src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + user.email?.charAt(0) + "&background=0F3460&color=fff"} 
                  alt="User avatar" 
                />
                <span className="user-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                <span className="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                  </svg>
                </span>
              </UserMenuButton>
              
              <UserMenu $isOpen={isUserMenuOpen}>
                <UserMenuItem to="/profile">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profilim
                </UserMenuItem>
                <DisabledUserMenuItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ayarlar
                </DisabledUserMenuItem>
                <UserMenuItem to="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Panelim
                </UserMenuItem>
                
                {isAdmin && (
                  <>
                    <UserMenuDivider />
                    <UserMenuItem to="/admin/dashboard">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Admin Paneli
                      <PremiumBadge>Admin</PremiumBadge>
                    </UserMenuItem>
                  </>
                )}
                
                <UserMenuDivider />
                <UserMenuSignOutButton onClick={handleSignOut}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Çıkış Yap
                </UserMenuSignOutButton>
              </UserMenu>
            </UserMenuContainer>
          )}
          
          <MobileMenuButton onClick={() => setIsOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </MobileMenuButton>
        </NavButtonsContainer>
      </NavbarContent>
      
      <MobileMenu $isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
        
        <MobileNavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
          Ana Sayfa
        </MobileNavLink>
        <MobileNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          Hakkımızda
        </MobileNavLink>
        <MobileNavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
          İletişim
        </MobileNavLink>
        <MobileNavLink to="/sss" className={location.pathname === '/sss' ? 'active' : ''}>
          SSS
        </MobileNavLink>
        
        {loading ? (
          <div style={{ 
            padding: '1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              border: '2px solid var(--color-surface-secondary)',
              borderTopColor: 'var(--color-primary)',
              animation: 'navbarSpin 1s linear infinite'
            }} />
            
            {showResetButton && (
              <button 
                onClick={handleResetSession}
                style={{
                  background: 'var(--color-surface-secondary)',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px',
                  color: 'var(--color-text)'
                }}
              >
                Oturumu Sıfırla
              </button>
            )}
          </div>
        ) : !user ? (
          <>
            <MobileNavLink to="/login">
              Giriş Yap
            </MobileNavLink>
            <MobileNavLink to="/signup">
              Kayıt Ol
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/profile">
              Profilim
            </MobileNavLink>
            <DisabledMobileNavLink>
              Ayarlar
            </DisabledMobileNavLink>
            <MobileNavLink to="/dashboard">
              Panelim
            </MobileNavLink>
            
            {isAdmin && (
              <MobileNavLink to="/admin/dashboard">
                Admin Paneli
              </MobileNavLink>
            )}
            
            <MobileNavLink as="button" onClick={handleSignOut}>
              Çıkış Yap
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </NavbarContainer>
  );
};

// Add keyframes for spinner animation
const GlobalStyle = styled.div`
  @keyframes navbarSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default () => (
  <>
    <GlobalStyle />
    <Navbar />
  </>
);