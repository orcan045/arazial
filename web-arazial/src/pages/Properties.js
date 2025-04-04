import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';

const PropertiesContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
`;

const FilterGroup = styled.div`
  flex: 1 1 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 500;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-surface-secondary);
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-surface-secondary);
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const ApplyFiltersButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 1.5rem;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

const PropertyImageContainer = styled.div`
  position: relative;
  height: 200px;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PropertyPrice = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(15, 52, 96, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
`;

const PropertyContent = styled.div`
  padding: 1.25rem;
`;

const PropertyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
`;

const PropertyLocation = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
`;

const PropertyFeatures = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-surface-secondary);
`;

const PropertyFeature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  
  span:first-child {
    font-weight: 600;
    color: var(--color-text);
  }
  
  span:last-child {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
`;

const ViewDetailsButton = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background-color: var(--color-primary);
    color: white;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-surface-secondary);
  background-color: ${props => props.active ? 'var(--color-primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not([disabled]) {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-surface-secondary)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Properties = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockData = Array(12).fill().map((_, i) => ({
        id: i + 1,
        title: i % 3 === 0 
          ? 'Gaziantep Nizip\'te 14.054 m2 Fıstıklık Zeytinlik' 
          : i % 3 === 1 
            ? 'İzmir Seferihisar\'da 8.500 m2 Manzaralı Zeytinlik' 
            : 'Antalya Serik\'te 20.000 m2 Portakal Bahçesi',
        price: i % 3 === 0 
          ? '1.500.000 TL' 
          : i % 3 === 1 
            ? '950.000 TL' 
            : '2.250.000 TL',
        location: i % 3 === 0 
          ? 'Gaziantep, Nizip' 
          : i % 3 === 1 
            ? 'İzmir, Seferihisar' 
            : 'Antalya, Serik',
        size: i % 3 === 0 
          ? '14054m²' 
          : i % 3 === 1 
            ? '8500m²' 
            : '20000m²',
        propertyType: 'Arsa Tapusu',
        image: i % 3 === 0 
          ? 'https://upload.wikimedia.org/wikipedia/commons/6/60/Pistachio_orchard%2C_Gaziantep%2C_Turkey.jpg' 
          : i % 3 === 1 
            ? 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Oliven_mit_berg.jpg' 
            : 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Orange_grove.jpg',
      }));
      
      setProperties(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // In a real app, this would fetch the next page of results
  };
  
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationButton 
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationButton>
      );
    }
    return pages;
  };
  
  if (loading) {
    return (
      <Layout>
        <PropertiesContainer>
          <div>Yükleniyor...</div>
        </PropertiesContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PropertiesContainer>
        <PageHeader>
          <PageTitle>Mülklerimiz</PageTitle>
          <PageDescription>
            Türkiye'nin çeşitli bölgelerinde yer alan tarım arazileri, zeytinlikler, fıstıklıklar ve daha fazlasını keşfedin.
          </PageDescription>
        </PageHeader>
        
        <FiltersSection>
          <FilterGroup>
            <FilterLabel>Konum</FilterLabel>
            <FilterSelect>
              <option value="">Tüm Konumlar</option>
              <option value="gaziantep">Gaziantep</option>
              <option value="izmir">İzmir</option>
              <option value="antalya">Antalya</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Arazi Tipi</FilterLabel>
            <FilterSelect>
              <option value="">Tüm Tipler</option>
              <option value="zeytinlik">Zeytinlik</option>
              <option value="fistiklik">Fıstıklık</option>
              <option value="portakal">Portakal Bahçesi</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Min. Fiyat</FilterLabel>
            <FilterInput type="number" placeholder="Min TL" />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Max. Fiyat</FilterLabel>
            <FilterInput type="number" placeholder="Max TL" />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Min. Alan (m²)</FilterLabel>
            <FilterInput type="number" placeholder="Min m²" />
          </FilterGroup>
          
          <ApplyFiltersButton>
            Filtrele
          </ApplyFiltersButton>
        </FiltersSection>
        
        <PropertiesGrid>
          {properties.map((property) => (
            <PropertyCard key={property.id}>
              <PropertyImageContainer>
                <PropertyImage src={property.image} alt={property.title} />
                <PropertyPrice>{property.price}</PropertyPrice>
              </PropertyImageContainer>
              
              <PropertyContent>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocation>{property.location}</PropertyLocation>
                
                <PropertyFeatures>
                  <PropertyFeature>
                    <span>{property.size}</span>
                    <span>Alan</span>
                  </PropertyFeature>
                  
                  <PropertyFeature>
                    <span>{property.propertyType}</span>
                    <span>Tapu Tipi</span>
                  </PropertyFeature>
                </PropertyFeatures>
                
                <ViewDetailsButton to={`/properties/${property.id}`}>
                  Detayları Gör
                </ViewDetailsButton>
              </PropertyContent>
            </PropertyCard>
          ))}
        </PropertiesGrid>
        
        <Pagination>
          <PaginationButton 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt;
          </PaginationButton>
          
          {renderPagination()}
          
          <PaginationButton 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &gt;
          </PaginationButton>
        </Pagination>
      </PropertiesContainer>
    </Layout>
  );
};

export default Properties; 