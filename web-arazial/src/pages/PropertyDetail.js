import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaLinkedin, FaChevronLeft, FaChevronRight, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Layout components
import Layout from '../components/layout/Layout';

const PropertyDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.7rem;
  color: var(--color-text-secondary);
`;

const PropertyDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const MainContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GalleryContainer = styled.div`
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    max-height: 220px;
  }
`;

const PropertyHeader = styled.div`
  margin-top: 1rem;
`;

const PropertyTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const FavoriteIcon = styled.span`
  color: #ccc;
  margin-left: 0.5rem;
  cursor: pointer;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SocialShareContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: ${props => props.bgColor || 'var(--color-primary)'};
  color: white;
  border-radius: 4px;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ThumbsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  overflow-x: auto;
  background-color: white;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border: 2px solid ${props => props.isActive ? 'var(--color-primary)' : 'transparent'};
  
  &:hover {
    opacity: 0.8;
  }
`;

const GalleryNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PropertyDetailsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow-md);
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
`;

const DetailsTable = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-surface-secondary);
`;

const DetailLabel = styled.span`
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: var(--color-text);
  font-weight: 600;
`;

const PriceSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    z-index: 10;
    border-radius: 0 0 8px 8px;
  }
`;

const PriceTitle = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const PriceAmount = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
`;

const PriceDetails = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
`;

const ContactForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
`;

const ContactHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-text);
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text);
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-surface-secondary);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-surface-secondary);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-surface-secondary);
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.85rem;
  }
`;

const PhoneNumber = styled.a`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    color: var(--color-primary);
  }
`;

// Lightbox components
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1500;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
`;

const LightboxControls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const LightboxClose = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const LightboxNav = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  transform: translateY(-50%);
`;

const LightboxNavButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const LightboxThumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 1rem;
  max-width: 90%;
  margin-top: 1rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
  }
`;

const LightboxThumbnail = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border: 2px solid ${props => props.isActive ? 'var(--color-primary)' : 'transparent'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  
  &:hover {
    opacity: 1;
  }
`;

const PropertyDetail = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  
  // Example property data - in a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperty({
        id: '22857',
        title: 'Gaziantep Nizip\'te 14.054 m2 Fıstıklık Zeytinlik',
        price: '1.500.000 TL',
        depositPrice: '72.000 TL',
        location: 'Sahibinden',
        size: '14054m²',
        propertyType: 'Arsa Tapusu',
        features: [
          { label: 'Tapu no', value: '22857' },
          { label: 'Hisse Oranı', value: 'Tam' },
          { label: 'Sahibi', value: 'Sahibinden' },
          { label: 'Metre Kare', value: '14054m²' },
          { label: 'Ada', value: '151' },
          { label: 'Parsel', value: '190' },
          { label: 'Tapu Tipi', value: 'Arsa Tapusu' },
        ],
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/6/60/Pistachio_orchard%2C_Gaziantep%2C_Turkey.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/7/71/Pistachio_grove_in_Gaziantep.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pistachios_harvest_%28Gaziantep%2C_Turkey%29.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/6/60/Pistachio_orchard%2C_Gaziantep%2C_Turkey.jpg',
        ],
        description: 'Gaziantep Nizip\'te 14.054 m2 Fıstıklık Zeytinlik satılıktır. Arsa tapuludur ve tam hisselidir.',
      });
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };
  
  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };
  
  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  
  if (loading) {
    return (
      <Layout>
        <PropertyDetailContainer>
          <div>Yükleniyor...</div>
        </PropertyDetailContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PropertyDetailContainer>
        <BreadcrumbsContainer>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}>Ana Sayfa</Link> &gt; 
          <Link to="/properties" style={{ textDecoration: 'none', color: 'inherit', margin: '0 0.5rem' }}>Mülkler</Link> &gt; 
          <Link to="/gaziantep-tarla" style={{ textDecoration: 'none', color: 'inherit', margin: '0 0.5rem' }}>Gaziantep Tarla</Link> &gt; 
          <span style={{ margin: '0 0.5rem' }}>Nizip Tarla</span>
        </BreadcrumbsContainer>
        
        <PropertyTitle>
          Gaziantep Nizip'te 14.054 m2 Fıstıklık Zeytinlik
        </PropertyTitle>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.25rem 0 0.75rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Sahibinden</span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3b5998" stroke="#3b5998" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </button>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2" stroke="#1DA1F2" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </button>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0077b5" stroke="#0077b5" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </button>
          </span>
        </div>
        
        <PropertyDetailsGrid>
          <MainContentSection>
            <GalleryContainer>
              <MainImage 
                src={property.images[activeImage]} 
                alt={property.title} 
                onClick={() => openLightbox(activeImage)}
              />
              
              <GalleryNavButton 
                direction="left" 
                onClick={prevImage}
                disabled={property.images.length <= 1}
              >
                <FaChevronLeft />
              </GalleryNavButton>
              
              <GalleryNavButton 
                direction="right" 
                onClick={nextImage}
                disabled={property.images.length <= 1}
              >
                <FaChevronRight />
              </GalleryNavButton>
              
              <div style={{ display: 'flex', marginTop: '0.5rem', gap: '0.5rem', overflowX: 'auto' }}>
                {property.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ 
                      width: '60px', 
                      height: '45px', 
                      objectFit: 'cover', 
                      cursor: 'pointer',
                      borderRadius: '4px',
                      border: index === activeImage ? '2px solid var(--color-primary)' : 'none' 
                    }}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </GalleryContainer>
            
            <PropertyDetailsSection>
              <SectionTitle>Özellikler</SectionTitle>
              <DetailsTable>
                {property.features.map((feature, index) => (
                  <DetailRow key={index}>
                    <DetailLabel>{feature.label}</DetailLabel>
                    <DetailValue>{feature.value}</DetailValue>
                  </DetailRow>
                ))}
              </DetailsTable>
            </PropertyDetailsSection>
            
            <PropertyDetailsSection>
              <SectionTitle>Açıklama</SectionTitle>
              <p>{property.description}</p>
            </PropertyDetailsSection>
          </MainContentSection>
          
          <div>
            <PriceSection>
              <PriceTitle>İstenen fiyat</PriceTitle>
              <PriceAmount>{property.price}</PriceAmount>
              <PriceDetails>
                <FaInfoCircle size={14} /> Hızmet Bedeli: {property.depositPrice}
              </PriceDetails>
              
              <SubmitButton>
                Pazarlığa Başla
              </SubmitButton>
              <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.875rem' }}>
                <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Nasıl pazarlık yapılır?</a>
              </div>
            </PriceSection>
            
            <ContactForm>
              <ContactHeader>İlgilendiğiniz bu tapuyla ilgili tüm sorularınız için sizi arayalım.</ContactHeader>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Ülke</span>
                <div style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '4px', 
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  flex: 1,
                  backgroundColor: '#f8fafc'
                }}>
                  Türkiye
                </div>
              </div>
              
              <FormGroup>
                <FormLabel>Cep Telefonu</FormLabel>
                <FormInput type="tel" placeholder="+90" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>İsim</FormLabel>
                <FormInput type="text" placeholder="İsim" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Soyisim</FormLabel>
                <FormInput type="text" placeholder="Soyisim" />
              </FormGroup>
              
              <SubmitButton>
                Beni Arayın
              </SubmitButton>
              
              <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.875rem' }}>
                Dilerseniz: <a href="tel:+902120658" style={{ color: 'var(--color-primary)' }}>0 212 706 58 49</a> numaralı telefondan da bize ulaşabilirsiniz
              </div>
            </ContactForm>
          </div>
        </PropertyDetailsGrid>
        
        {/* Lightbox */}
        <LightboxOverlay isOpen={lightboxOpen}>
          <LightboxControls>
            <div></div> {/* Empty div for flex spacing */}
            <LightboxClose onClick={closeLightbox}>
              <FaTimes />
            </LightboxClose>
          </LightboxControls>
          
          <LightboxImage src={property.images[lightboxImageIndex]} alt={property.title} />
          
          <LightboxNav>
            <LightboxNavButton onClick={prevLightboxImage}>
              <FaChevronLeft />
            </LightboxNavButton>
            <LightboxNavButton onClick={nextLightboxImage}>
              <FaChevronRight />
            </LightboxNavButton>
          </LightboxNav>
          
          <LightboxThumbnails>
            {property.images.map((img, index) => (
              <LightboxThumbnail 
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                isActive={index === lightboxImageIndex}
                onClick={() => setLightboxImageIndex(index)}
              />
            ))}
          </LightboxThumbnails>
        </LightboxOverlay>
      </PropertyDetailContainer>
    </Layout>
  );
};

export default PropertyDetail; 