import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import appState from '../services/appState';
import CountdownTimer from '../components/CountdownTimer';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-primary-dark);
  }
`;

const AuctionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 0.75rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 7fr 3fr;
  }
  
  @media (max-width: 1023px) {
    display: flex;
    flex-direction: column-reverse; /* Show the action column first on mobile */
  }
`;

const AuctionTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0.25rem 0 0.25rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const AuctionLocation = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0;
  
  svg {
    color: var(--color-primary);
    width: 14px;
    height: 14px;
  }
`;

const AuctionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const MetaValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
`;

const AuctionStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  gap: 0.5rem;
  margin-bottom: 0;
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
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const TimerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-radius: var(--border-radius-lg);
  margin-right: auto;
  
  @media (max-width: 768px) {
    margin-right: 0;
    width: 100%;
    justify-content: center;
    padding: 0.5rem 1rem;
  }
`;

const TimerLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-right: 0.75rem;
  font-weight: 500;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &:last-child {
    gap: 0;
  }
`;

const Card = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
  overflow: hidden;
  
  /* Special styling for the bid card on mobile */
  &.bid-card {
    margin-bottom: 0 !important;
    @media (max-width: 1023px) {
      position: sticky;
      top: 0;
      z-index: 10;
      margin-bottom: 1rem;
      border-radius: 0 0 8px 8px;
    }
    
    /* Ensure no elements in the bid card add extra space */
    & > div > *:last-child {
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
  }
  
  /* Remove bottom margin for the last card in a column */
  ${Column}:last-child &:last-child {
    margin-bottom: 0;
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background);
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: var(--color-primary);
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  padding-bottom: 0.5rem;
  
  .bid-card & {
    padding-bottom: 0 !important;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PropertyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PropertyLabel = styled.label`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  display: block;
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
`;

const HighlightedValue = styled(PropertyValue)`
  font-size: 1.125rem;
  color: var(--color-primary);
  font-weight: 600;
`;

const Description = styled.div`
  line-height: 1.7;
  color: var(--color-text);
  white-space: pre-line;
`;

// Add these new styled components for the main gallery
const MainGalleryContainer = styled.div`
  position: relative;
  width: 100%;
`;

const MainImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  background-color: #f8f9fa;
  
  @media (max-width: 768px) {
    max-height: 220px;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow-x: auto;
  
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

const ImageThumbnail = styled.div`
  width: 60px;
  height: 45px;
  border-radius: 4px;
  background-position: center;
  background-size: cover;
  cursor: pointer;
  border: 2px solid ${props => props.isActive ? 'var(--color-primary)' : 'transparent'};
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
  
  svg {
    width: 20px;
    height: 20px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
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
  justify-content: flex-end;
  padding: 1rem;
`;

const LightboxClose = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  svg {
    width: 20px;
    height: 20px;
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
  
  svg {
    width: 20px;
    height: 20px;
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

const LightboxThumbnail = styled.div`
  width: 80px;
  height: 60px;
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  border: 2px solid ${props => props.isActive ? 'var(--color-primary)' : 'transparent'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  
  &:hover {
    opacity: 1;
  }
`;

const BidContainer = styled.div`
  background: linear-gradient(to bottom, rgba(var(--color-primary-rgb), 0.05), white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  border: 1px solid rgba(var(--color-primary-rgb), 0.1);
`;

const CurrentPrice = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const PriceAmount = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.1;
`;

const MinimumIncrement = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  text-align: center;
`;

const BidForm = styled.form`
  margin-top: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1.125rem;
  text-align: center;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
`;

const BidButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
    transform: none;
  }
`;

const Error = styled.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: rgba(var(--color-error-rgb), 0.05);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-error);
`;

const BidsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 !important;
  padding: 0 !important;
  
  & > *:last-child {
    margin-bottom: 0 !important;
  }
`;

const BidItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  position: relative;
  
  &:nth-child(1) {
    background-color: rgba(255, 215, 0, 0.1);
    border-left: 3px solid gold;
  }
  
  &:nth-child(2) {
    background-color: rgba(192, 192, 192, 0.1);
    border-left: 3px solid silver;
  }
  
  &:nth-child(3) {
    background-color: rgba(205, 127, 50, 0.1);
    border-left: 3px solid #cd7f32;
  }
`;

const BidAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  
  ${BidItem}:nth-child(1) & {
    color: var(--color-primary);
    font-size: 1.25rem;
  }
  
  ${BidItem}:nth-child(2) & {
    color: var(--color-primary-dark);
  }
  
  ${BidItem}:nth-child(3) & {
    color: var(--color-primary-dark);
  }
`;

const BidTime = styled.div`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem;
  margin-bottom: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
  transition: background-color 0.2s ease;
  border-radius: var(--border-radius-md);
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-left: 0.5rem;
  }
`;

const EmptyBids = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.4;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  
  svg {
    animation: spin 1.5s linear infinite;
    width: 40px;
    height: 40px;
    color: var(--color-primary);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1rem;
  color: var(--color-text-secondary);
`;

// Icon components for better UI
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const PropertyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BidsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const NoBidsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

// --- Add New Styled Components for Offer Section ---
const OfferInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const OfferButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    margin-top: 0.25rem;
    padding: 0.75rem;
  }
`;

const OfferStatusMessage = styled.div`
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
  background-color: ${props => 
    props.status === 'pending' ? 'rgba(251, 191, 36, 0.1)' :
    props.status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' :
    props.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' :
    'var(--color-background)'
  };
  color: ${props => 
    props.status === 'pending' ? '#D97706' :
    props.status === 'accepted' ? '#059669' :
    props.status === 'rejected' ? '#DC2626' :
    'var(--color-text-secondary)'
  };
`;

// --- Add New Icon Component --- 
const OfferIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.536c.445.272.99.272 1.435 0l.879-.536M7.5 14.25a3 3 0 0 0-3 3h15a3 3 0 0 0-3-3m-10.5-1.5a3 3 0 0 1 3-3h7.5a3 3 0 0 1 3 3" />
  </svg>
);

// --- Loading Spinner Component (Add this back) ---
const LoadingSpinner = ({ message }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
    <LoadingIcon />
    <p>{message || 'Yükleniyor...'}</p>
  </div>
);

// Add this to the icon components section
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Create a new integrated header for the main card
const IntegratedHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  }
`;

// Create a minimal header for the content cards
const MinimalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-border);
`;

// Add this title styles for minimal header
const MinimalTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, profile } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // --- New State for Offers ---
  const [userOffers, setUserOffers] = useState([]);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerError, setOfferError] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBidError(null);
    setOfferError(null);
    setUserOffers([]);

    try {
      // 1. Fetch Auction Details
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*, profiles ( full_name, avatar_url )')
        .eq('id', id)
        .single();

      if (auctionError || !auctionData) {
        throw auctionError || new Error('İlan bulunamadı.');
      }
      setAuction(auctionData);

      // 2. Fetch Bids OR Offers based on type
      if (auctionData.listing_type === 'auction') {
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select('*, profiles ( full_name, avatar_url )')
          .eq('auction_id', auctionData.id)
          .order('amount', { ascending: false });

        if (bidsError) {
          console.error('Error fetching bids:', bidsError);
        }
        setBids(bidsData || []);
        setIsExpanded(false);
      } else if (auctionData.listing_type === 'offer') {
        // Fetch user's offers for THIS listing if logged in
        if (user?.id) {
            const { data: offersData, error: offersError } = await supabase
                .from('offers')
                .select('*')
                .eq('auction_id', id)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (offersError) {
                console.error("Error fetching user's offers:", offersError);
            } else {
                setUserOffers(offersData || []);
            }
        } else {
             // Not logged in, cannot fetch or make offers
             setUserOffers([]);
        }
      }

    } catch (err) {
      console.error('Error fetching auction details:', err);
      setError(err.message || 'İlan detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data when app becomes visible again
  useEffect(() => {
    const unsubscribe = appState.onVisibilityChange((isVisible) => {
      if (isVisible) {
        console.log('Tab became visible, refreshing auction details...');
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [fetchData]);

  const refreshBids = async () => {
    if (!auction || auction.listing_type !== 'auction') return;
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*, profiles ( full_name, avatar_url )')
        .eq('auction_id', auction.id)
        .order('amount', { ascending: false });
      if (error) throw error;
      setBids(data || []);
      setIsExpanded(false);
    } catch (error) {
      console.error('Error refreshing bids:', error);
    }
  };

  const handleSubmitBid = async (e) => {
    console.log("--- Executing handleSubmitBid ---");
    e.preventDefault();
    if (!user) {
      setBidError('Teklif vermek için giriş yapmalısınız.');
      return;
    }
    if (!auction || auction.listing_type !== 'auction') {
      setBidError('Bu ilana teklif verilemez.');
      return;
    }
    
    const amount = parseFloat(bidAmount);
    const minimumBid = getMinimumBidAmount();
    
    if (isNaN(amount) || amount <= 0) {
      setBidError('Geçerli bir teklif miktarı girin.');
      return;
    }
    
    if (amount < minimumBid) {
      setBidError(`Minimum teklif ${formatPrice(minimumBid)} olmalıdır.`);
      return;
    }
    
    const currentStatus = getAuctionStatus();
    if (currentStatus !== 'active') {
       setBidError('Teklif verme süresi dolmuş veya henüz başlamamıştır.');
       return;
    }
    
    setSubmitLoading(true);
    setBidError(null);
    
    try {
      const { error: insertError } = await supabase.from('bids').insert({
        auction_id: auction.id,
        user_id: user.id,
        amount: amount,
      });
      
      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
           throw new Error('Kısa süre içinde birden fazla teklif veremezsiniz veya teklifiniz çok düşük.');
        } else {
           throw insertError;
        }
      }
      
      setBidAmount('');
      await refreshBids();
      
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError(error.message || 'Teklif gönderilirken bir hata oluştu.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const refreshOffers = useCallback(async () => {
    if (!auction || auction.listing_type !== 'offer' || !user?.id) return;
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('auction_id', auction.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserOffers(data || []);
    } catch (error) {
      console.error("Error refreshing user's offers:", error);
    }
  }, [auction, user?.id]);

  const handleSubmitOffer = async (e) => {
    console.log("--- Executing handleSubmitOffer ---");
    e.preventDefault();
    if (!user) {
      setOfferError('Teklif vermek için giriş yapmalısınız.');
      return;
    }
    if (!auction || auction.listing_type !== 'offer') {
      setOfferError('Bu ilana teklif verilemez.');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setOfferError('Lütfen geçerli bir teklif miktarı girin.');
      return;
    }

    // Double-check if user already has a pending or accepted offer just before submitting
    const { data: existingOffers, error: checkError } = await supabase
        .from('offers')
        .select('id, status')
        .eq('auction_id', auction.id)
        .eq('user_id', user.id)
        .in('status', ['pending', 'accepted'])
        .limit(1);

    if (checkError) {
        console.error('Error checking existing offers before submit:', checkError);
        setOfferError('Teklif durumu kontrol edilirken hata oluştu. Lütfen tekrar deneyin.');
        return;
    }

    if (existingOffers && existingOffers.length > 0) {
        const existingOffer = existingOffers[0];
        setOfferError(`Zaten ${existingOffer.status === 'pending' ? 'beklemede olan' : 'kabul edilmiş'} bir teklifiniz var.`);
        await refreshOffers(); // Refresh state to be sure
        return;
    }

    setSubmitLoading(true);
    setOfferError(null);

    try {
      const { error: insertError } = await supabase.from('offers').insert({
        auction_id: auction.id,
        user_id: user.id,
        amount: amount,
        // status defaults to 'pending' in the database
      });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation code for unique_pending_offer_per_user_auction
            throw new Error('Bu ilan için zaten beklemede olan bir teklifiniz var. Sayfayı yenileyin.');
        } else {
            throw insertError;
        }
      }

      setOfferAmount(''); // Clear input
      await refreshOffers(); // Refresh offers to show the new pending one

    } catch (error) {
      console.error('Error submitting offer:', error);
      setOfferError(error.message || 'Teklif gönderilirken bir hata oluştu.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Belirtilmemiş';
    try {
        return `₺${parseFloat(price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch { 
        return 'Hatalı Fiyat';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('tr-TR', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    } catch (e) {
      return 'Geçersiz Tarih';
    }
  };

  const getAuctionStatus = useCallback(() => {
    if (!auction) return 'loading';
    // For 'offer' type, status might be less relevant, but we keep the date logic for consistency
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);

    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    return 'active'; // Even offers can be considered 'active' during their listing window
  }, [auction]);

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'upcoming': return 'Yakında';
      case 'ended': return 'Sona Erdi';
      default: return 'Yükleniyor...';
    }
  };
  
  const getStatusIcon = (status) => {
      // Using same icons for simplicity, could be customized for offers
      switch (status) {
        case 'active': return <TimerIcon />;
        case 'upcoming': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
        case 'ended': return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
        default: return null;
      }
    };

  // Only relevant for auctions
  const getMinimumBidAmount = useCallback(() => {
    if (!auction || auction.listing_type !== 'auction') return 0;
    const highestBid = bids[0]?.amount || 0;
    const startPrice = auction.start_price || 0;
    const minIncrement = auction.min_increment || 1;
    const currentPrice = Math.max(highestBid, startPrice);
    return currentPrice === startPrice ? startPrice : currentPrice + minIncrement; // Can bid start price initially
  }, [auction, bids]);

  const handleTimerComplete = useCallback(() => {
    console.log('Timer completed, refetching data...');
    fetchData();
  }, [fetchData]);
  
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  const nextImage = () => {
    if (!auction || !auction.images || auction.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % auction.images.length);
  };
  
  const prevImage = () => {
    if (!auction || !auction.images || auction.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? auction.images.length - 1 : prev - 1));
  };
  
  // Add keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen]);

  // Debug the bid card's DOM structure
  useEffect(() => {
    if (!loading && auction) {
      console.log('Debugging bid card structure:');
      const bidCard = document.querySelector('.bid-card');
      if (bidCard) {
        console.log('Bid card found:', bidCard);
        console.log('Bid card computed style:', window.getComputedStyle(bidCard));
        console.log('Bid card children:', bidCard.children);
        
        // Log all children with computed heights
        Array.from(bidCard.querySelectorAll('*')).forEach(el => {
          const style = window.getComputedStyle(el);
          console.log(el.tagName, {
            marginBottom: style.marginBottom,
            paddingBottom: style.paddingBottom,
            height: style.height,
            content: el.textContent?.substring(0, 20) + '...'
          });
        });
      }
    }
  }, [loading, auction]);
  
  if (loading && !auction) {
      return <PageContainer><LoadingSpinner message="İlan yükleniyor..." /></PageContainer>;
  }

  if (error) {
      return <PageContainer><p style={{ color: 'red' }}>Hata: {error}</p></PageContainer>;
  }

  if (!auction) {
      return <PageContainer><p>İlan bulunamadı.</p></PageContainer>;
  }

  const currentStatus = getAuctionStatus();
  const isOfferListing = auction.listing_type === 'offer';
  
  // Determine offer state for rendering
  const userActiveOffer = isOfferListing ? userOffers.find(o => o.status === 'pending' || o.status === 'accepted') : null;
  const showOfferForm = isOfferListing && user && !authLoading && !userActiveOffer;
  const showRejectedMessage = isOfferListing && user && !authLoading && userOffers.find(o => o.status === 'rejected') && !userActiveOffer;

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg> Geri Dön
      </BackButton>
      
      <AuctionTitle>{auction.title}</AuctionTitle>
      
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
        <AuctionStatus status={currentStatus}>
          {getStatusIcon(currentStatus)}
          {getStatusText(currentStatus)}
        </AuctionStatus>
        
        <AuctionLocation>
          <LocationIcon /> {auction.location || 'Konum belirtilmemiş'}
        </AuctionLocation>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#3b5998" stroke="#3b5998" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1DA1F2" stroke="#1DA1F2" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </button>
          <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#0077b5" stroke="#0077b5" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </button>
        </div>
      </div>
      
      <AuctionContainer>
        {/* --- Left Column (Details) --- */} 
        <Column>
          <Card>
            <MainGalleryContainer>
              <MainImage 
                src={auction.images[currentImageIndex]} 
                alt={auction.title} 
                onClick={() => openLightbox(currentImageIndex)}
              />
              
              <GalleryNavButton 
                direction="left" 
                onClick={prevImage}
                disabled={auction.images.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </GalleryNavButton>
              
              <GalleryNavButton 
                direction="right" 
                onClick={nextImage}
                disabled={auction.images.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </GalleryNavButton>
            </MainGalleryContainer>
            
            <ImageGallery>
              {auction.images.map((img, index) => (
                <ImageThumbnail 
                  key={index} 
                  style={{ backgroundImage: `url(${img})` }} 
                  title={`Resim ${index + 1}`}
                  isActive={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </ImageGallery>
          </Card>

          <Card>
            <CardHeader><CardTitle><PropertyIcon/> İlan Detayları</CardTitle></CardHeader>
            <CardContent>
              <PropertyGrid>
                <PropertyItem>
                  <PropertyLabel>Konum</PropertyLabel>
                  <PropertyValue>{auction.location || '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>Emlak Tipi</PropertyLabel>
                  <PropertyValue>{auction.property_type || '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>Alan (m²)</PropertyLabel>
                  <PropertyValue>{auction.area_sqm ? `${auction.area_sqm} m²` : '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>İmar Durumu</PropertyLabel>
                  <PropertyValue>{auction.zoning_status || '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>Ada No</PropertyLabel>
                  <PropertyValue>{auction.parcel_island || '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>Parsel No</PropertyLabel>
                  <PropertyValue>{auction.parcel_number || '-'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>İlan Sahibi</PropertyLabel>
                  <PropertyValue>{auction.profiles?.full_name || 'Bilinmiyor'}</PropertyValue>
                </PropertyItem>
                <PropertyItem>
                  <PropertyLabel>İlan Tarihi</PropertyLabel>
                  <PropertyValue>{formatDate(auction.created_at)}</PropertyValue>
                </PropertyItem>
                {/* Show Auction Times only for Auctions */}
                {!isOfferListing && (
                  <>
                  <PropertyItem>
                    <PropertyLabel>Başlangıç Zamanı</PropertyLabel>
                    <PropertyValue>{formatDate(auction.start_time)}</PropertyValue>
                  </PropertyItem>
                  <PropertyItem>
                    <PropertyLabel>Bitiş Zamanı</PropertyLabel>
                    <PropertyValue>{formatDate(auction.end_time)}</PropertyValue>
                  </PropertyItem>
                  </>
                )}
              </PropertyGrid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle><InfoIcon/> İlan Açıklaması</CardTitle></CardHeader>
            <CardContent>
              <Description>{auction.description || 'Açıklama girilmemiş.'}</Description>
            </CardContent>
          </Card>
          
        </Column>

        {/* --- Right Column (Actions) --- */} 
        <Column style={{ position: 'sticky', top: '2rem', height: 'min-content', marginBottom: 0, padding: 0 }}>
          {/* Action Card (Bids or Offers) */} 
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: 'var(--shadow-md)', 
            overflow: 'hidden',
            margin: 0,
            padding: 0
          }}>
            <div style={{ 
              padding: '1.25rem', 
              borderBottom: '1px solid var(--color-border)', 
              backgroundColor: 'var(--color-background)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600, 
                color: 'var(--color-text)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                margin: 0
              }}>
                {isOfferListing ? (
                  <>
                    <OfferIcon/> Teklif Yap
                  </>
                ) : (
                  <>
                    <BidsIcon/> Teklifler
                  </>
                )}
              </h2>
            </div>
            
            <div style={{ padding: '1rem 1rem 0 1rem', display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
              {/* AUCTION BIDDING UI */}
              {!isOfferListing && (
                <>
                  {/* Bid Form for Active Auctions */} 
                  {currentStatus === 'active' && (
                    <form onSubmit={handleSubmitBid} style={{ marginBottom: '1rem' }}>
                      {!user && !authLoading && (
                        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Teklif vermek için <a href="/login">giriş yapın</a>.</p>
                      )}
                      {user && (
                        <>
                          <PropertyLabel htmlFor="bidAmount">Teklifiniz (Min: {formatPrice(getMinimumBidAmount())})</PropertyLabel>
                          <OfferInput 
                            type="number"
                            id="bidAmount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`Min. ${formatPrice(getMinimumBidAmount())}`}
                            step="any"
                            required 
                            disabled={submitLoading || authLoading}
                          />
                          {bidError && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{bidError}</p>}
                          <OfferButton type="submit" disabled={submitLoading || authLoading}>
                            {submitLoading ? <LoadingIcon /> : 'Teklif Ver'}
                          </OfferButton>
                        </>
                      )}
                    </form>
                  )}
                  
                  {/* Messages for non-active auctions */} 
                  {currentStatus !== 'active' && (
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      {currentStatus === 'upcoming' ? 'Teklif verme henüz başlamadı.' : 'Teklif verme sona erdi.'}
                    </p>
                  )}
                  
                  {/* Bid History - COMPLETELY REDONE */}
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '1rem 0 0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    Teklif Geçmişi
                  </h3>
                  
                  {bids.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', margin: 0, padding: 0 }}>
                      <NoBidsIcon />
                      <p style={{ margin: 0 }}>Henüz teklif yapılmadı.</p>
                    </div>
                  )}
                  
                  {bids.length > 0 && (
                    <div style={{ margin: 0, padding: 0 }}>
                      {(isExpanded ? bids : bids.slice(0, 3)).map((bid, index, array) => (
                        <BidItem 
                          key={bid.id} 
                          style={index === array.length - 1 && !isExpanded && array.length <= 3 ? { marginBottom: 0 } : {}}
                        >
                          <BidAmount>{formatPrice(bid.amount)}</BidAmount>
                          <BidTime>{formatDate(bid.created_at)}</BidTime>
                        </BidItem>
                      ))}
                      
                      {bids.length > 3 && (
                        <div style={{
                          borderTop: '1px solid var(--color-border)',
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          paddingBottom: '0.5rem',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={() => setIsExpanded(prev => !prev)} 
                            style={{
                              background: 'rgba(var(--color-primary-rgb), 0.05)',
                              border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                              borderRadius: '0.375rem',
                              color: 'var(--color-primary)',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              padding: '0.5rem 1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'rgba(var(--color-primary-rgb), 0.1)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'rgba(var(--color-primary-rgb), 0.05)';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                            }}
                          >
                            {isExpanded ? 'Daha Az Göster' : `Daha Fazla Göster (${bids.length - 3} teklif daha)`}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                              {isExpanded ? (
                                <polyline points="18 15 12 9 6 15" />
                              ) : (
                                <polyline points="6 9 12 15 18 9" />
                              )}
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              
              {/* OFFER SUBMISSION UI */}
              {isOfferListing && (
                <>
                  {/* Login prompt */} 
                  {!user && !authLoading && (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      Teklif yapmak için <a href="/login">giriş yapmanız</a> gerekmektedir.
                    </p>
                  )}
                  
                  {/* Loading Auth prompt */} 
                  {authLoading && (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      Kullanıcı bilgileri yükleniyor...
                    </p>
                  )}
                  
                  {/* Display existing pending/accepted offer */} 
                  {user && !authLoading && userActiveOffer && (
                    <OfferStatusMessage status={userActiveOffer.status}>
                      Mevcut Teklifiniz: {formatPrice(userActiveOffer.amount)} 
                      ({userActiveOffer.status === 'pending' ? 'Beklemede' : 'Kabul Edildi'})
                    </OfferStatusMessage>
                  )}
                  
                  {/* Message about rejected offer */} 
                  {user && !authLoading && showRejectedMessage && (
                    <OfferStatusMessage status="rejected">
                      Önceki teklifiniz reddedildi. Yeni bir teklif yapabilirsiniz.
                    </OfferStatusMessage>
                  )}
                  
                  {/* Show Offer Form */} 
                  {showOfferForm && (
                    <form onSubmit={handleSubmitOffer} style={{ marginTop: showRejectedMessage ? '1.5rem' : '0' }}>
                      <PropertyLabel htmlFor="offerAmount">Teklif Miktarınız</PropertyLabel>
                      <OfferInput 
                        type="number"
                        id="offerAmount"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="Teklifinizi Girin (₺)"
                        step="any"
                        required 
                        disabled={submitLoading}
                      />
                       {offerError && <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>{offerError}</p>}
                       <OfferButton type="submit" disabled={submitLoading}>
                          {submitLoading ? <LoadingIcon /> : 'Teklifi Gönder'}
                       </OfferButton>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </Column>
        
      </AuctionContainer>

      {/* Lightbox */}
      {lightboxOpen && auction?.images?.length > 0 && (
        <LightboxOverlay isVisible={lightboxOpen}>
          <LightboxControls>
            <LightboxClose onClick={closeLightbox}>
              <CloseIcon />
            </LightboxClose>
          </LightboxControls>
          
          <LightboxImage 
            src={auction.images[currentImageIndex]} 
            alt={`Resim ${currentImageIndex + 1}`} 
          />
          
          <LightboxNav>
            <LightboxNavButton onClick={prevImage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </LightboxNavButton>
            <LightboxNavButton onClick={nextImage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </LightboxNavButton>
          </LightboxNav>
          
          <LightboxThumbnails>
            {auction.images.map((img, index) => (
              <LightboxThumbnail 
                key={index}
                style={{ backgroundImage: `url(${img})` }}
                isActive={index === currentImageIndex}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </LightboxThumbnails>
        </LightboxOverlay>
      )}
    </PageContainer>
  );
};

export default AuctionDetail; 