import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeMessage = styled.h1`
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const AuctionImage = styled.div`
  height: 150px;
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

const Dashboard = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // This would be replaced with a real API call to Supabase
        // const { data, error } = await supabase
        //   .from('auctions')
        //   .select('*')
        //   .limit(10);
        
        // if (error) throw error;
        
        // For demonstration, using mock data
        const mockAuctions = [
          {
            id: 1,
            title: 'Tarım Arazisi - Antalya',
            location: 'Antalya, Serik',
            price: '₺350,000',
            status: 'active',
            endsAt: '2023-12-25'
          },
          {
            id: 2,
            title: 'Villa Arsası - Bodrum',
            location: 'Muğla, Bodrum',
            price: '₺1,250,000',
            status: 'upcoming',
            endsAt: '2024-01-15'
          },
          {
            id: 3,
            title: 'Sanayi Arsası - Kocaeli',
            location: 'Kocaeli, Gebze',
            price: '₺850,000',
            status: 'active',
            endsAt: '2023-12-20'
          }
        ];
        
        setAuctions(mockAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctions();
  }, []);
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeMessage>Hoş Geldiniz, {user?.email}</WelcomeMessage>
        <Subtitle>İhaleleri takip edin ve tekliflerinizi yönetin</Subtitle>
      </DashboardHeader>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Aktif İhaleler</StatTitle>
          <StatValue>12</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Katıldığınız İhaleler</StatTitle>
          <StatValue>5</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Kazandığınız İhaleler</StatTitle>
          <StatValue>2</StatValue>
        </StatCard>
        
        <StatCard>
          <StatTitle>Yaklaşan İhaleler</StatTitle>
          <StatValue>8</StatValue>
        </StatCard>
      </StatsGrid>
      
      <SectionTitle>Aktif İhaleler</SectionTitle>
      
      {loading ? (
        <div>Yükleniyor...</div>
      ) : auctions.length > 0 ? (
        <AuctionsGrid>
          {auctions.map(auction => (
            <AuctionCard key={auction.id}>
              <AuctionImage>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </AuctionImage>
              <AuctionContent>
                <AuctionTitle>{auction.title}</AuctionTitle>
                <AuctionLocation>{auction.location}</AuctionLocation>
                <AuctionDetails>
                  <AuctionPrice>{auction.price}</AuctionPrice>
                  <AuctionStatus status={auction.status}>
                    {auction.status === 'active' ? 'Aktif' : 
                     auction.status === 'upcoming' ? 'Yaklaşan' : 'Sonlandı'}
                  </AuctionStatus>
                </AuctionDetails>
              </AuctionContent>
            </AuctionCard>
          ))}
        </AuctionsGrid>
      ) : (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Henüz Aktif İhale Bulunmuyor</EmptyStateTitle>
          <EmptyStateMessage>
            Şu anda aktif durumda ihale bulunmuyor. Lütfen daha sonra tekrar kontrol ediniz veya yeni ihalelerin bildirimleri için ayarlarınızı güncelleyin.
          </EmptyStateMessage>
        </EmptyState>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;