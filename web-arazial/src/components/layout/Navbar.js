import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: ${props => props.$isFixed ? 'fixed' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  
  & + * {
    padding-top: ${props => props.$isFixed ? '60px' : '0'};
  }
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (min-width: 1024px) {
    padding: 1rem 3rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
  
  span {
    color: var(--color-primary);
  }
`;

const LogoIcon = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    height: 1.75rem;
    width: 1.75rem;
    color: var(--color-primary);
  }
`;

const NavMenu = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  padding: 0.5rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--color-primary);
  }
  
  &.active {
    color: var(--color-primary);
  }
`;

const NavButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  display: flex;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
  
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
  background-color: white;
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  z-index: 900;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  padding: 1rem 2rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  border-bottom: 1px solid var(--color-surface-secondary);
  
  &:hover {
    background-color: var(--color-surface-secondary);
  }
  
  &.active {
    color: var(--color-primary);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--color-text);
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
    setIsOpen(false);
  }, [location]);
  
  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <NavbarContainer $isFixed={isScrolled}>
      <NavbarContent>
        <Logo to="/">
          <LogoIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
            </svg>
          </LogoIcon>
          <span>Arazial</span>
        </Logo>
        
        <NavMenu>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Ana Sayfa
          </NavLink>
          <NavLink to="/auctions" className={location.pathname.includes('/auctions') ? 'active' : ''}>
            İhaleler
          </NavLink>
          <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            Hakkımızda
          </NavLink>
          <NavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            İletişim
          </NavLink>
        </NavMenu>
        
        <NavButtonsContainer>
          {user ? (
            <>
              <Button as={Link} to="/dashboard" variant="text">
                Dashboard
              </Button>
              {isAdmin && (
                <Button as={Link} to="/admin" variant="text">
                  Admin
                </Button>
              )}
              <Button onClick={handleSignOut} variant="secondary">
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="text">
                Giriş Yap
              </Button>
              <Button as={Link} to="/signup">
                Kayıt Ol
              </Button>
            </>
          )}
        </NavButtonsContainer>
        
        <MobileMenuButton onClick={() => setIsOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </MobileMenuButton>
      </NavbarContent>
      
      <MobileMenu $isOpen={isOpen}>
        <CloseButton onClick={() => setIsOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
        
        <MobileNavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
          Ana Sayfa
        </MobileNavLink>
        <MobileNavLink to="/auctions" className={location.pathname.includes('/auctions') ? 'active' : ''}>
          İhaleler
        </MobileNavLink>
        <MobileNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
          Hakkımızda
        </MobileNavLink>
        <MobileNavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
          İletişim
        </MobileNavLink>
        
        {user ? (
          <>
            <MobileNavLink to="/dashboard">
              Dashboard
            </MobileNavLink>
            {isAdmin && (
              <MobileNavLink to="/admin">
                Admin
              </MobileNavLink>
            )}
            <MobileNavLink as="button" onClick={handleSignOut}>
              Çıkış Yap
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/login">
              Giriş Yap
            </MobileNavLink>
            <MobileNavLink to="/signup">
              Kayıt Ol
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;