import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAuctions } from '../services/auctionService';
import { supabase } from '../services/supabase';
import appState from '../services/appState';
import CountdownTimer from '../components/CountdownTimer';
import Button from '../components/ui/Button';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1.25rem;
    left: 0;
    width: 80px;
    height: 4px;
    background: var(--color-primary);
    border-radius: 2px;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const PageDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  max-width: 800px;
  line-height: 1.6;
`;

const FiltersAndContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 320px 1fr;
  }
`;

const FiltersPanel = styled.aside`
  background-color: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  letter-spacing: 0.05em;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  color: var(--color-text);
  background-color: var(--color-background);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.95rem;
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236E6E6E' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
  }
`;

const PriceRangeInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
`;

const RangeSeparator = styled.span`
  text-align: center;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const MainContentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding-bottom: 0.25rem;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  border-bottom: 3px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  position: relative;
  
  &:hover {
    color: var(--color-primary);
  }
  
  &:focus {
    outline: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--color-primary);
    transform: scaleX(${props => props.active ? 1 : 0});
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const TabCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.active ? 'white' : 'var(--color-text-secondary)'};
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  padding: 0 0.5rem;
  transition: all 0.25s ease;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SortLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`;

const SortSelect = styled.select`
  padding: 0.65rem 1.25rem 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.875rem;
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236E6E6E' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
  }
`;

const ResultsCount = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: 0.5rem 0;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ViewToggleButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--color-text-secondary)'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-background-hover)'};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.active ? 'inset 0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none'};
  }
`;

const AuctionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }
`;

// Add a grid item wrapper component to limit width
const GridItemWrapper = styled.div`
  max-width: 380px;
  width: 100%;
  justify-self: center;
`;

const AuctionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 3rem;
`;

const AuctionCard = styled.div`
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--color-primary-light);
  }
  
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 16px;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15);
    transition: opacity 0.3s ease-in-out;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const AuctionListItem = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: 180px 1fr auto;
  overflow: hidden;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border-color: var(--color-primary-light);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 769px) and (max-width: 1200px) {
    grid-template-columns: 140px 1fr auto;
  }
`;

const ListItemImage = styled.div`
  background-color: var(--color-background);
  height: 100%;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  ${AuctionListItem}:hover &::before {
    opacity: 1;
  }
  
  svg {
    width: 3rem;
    height: 3rem;
    color: var(--color-primary);
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
`;

const ListItemContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListItemActions = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--color-border);
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const AuctionImage = styled.div`
  height: 200px;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  ${AuctionCard}:hover &::before {
    opacity: 1;
  }
  
  svg {
    width: 3.5rem;
    height: 3.5rem;
    color: var(--color-primary);
    opacity: 0.5;
  }
`;

const PropertyTypeTag = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const AuctionContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const AuctionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text);
  line-height: 1.4;
  
  ${AuctionCard}:hover &, ${AuctionListItem}:hover & {
    color: var(--color-primary);
  }
`;

const AuctionLocation = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.375rem;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }
`;

const AuctionDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

const AuctionPrice = styled.p`
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.125rem;
`;

const AuctionStatus = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const ListItemPriceAndStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const CountdownWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const PropertyInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin: 0.5rem 0 1.25rem;
`;

const PropertyInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  svg {
    width: 1rem;
    height: 1rem;
    color: var(--color-text-tertiary);
    flex-shrink: 0;
  }
`;

const EmptyState = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px dashed var(--color-border);
  margin: 1rem 0 3rem;
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 2rem;
  
  svg {
    width: 5rem;
    height: 5rem;
    color: var(--color-text-secondary);
    opacity: 0.3;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
`;

const EmptyStateMessage = styled.p`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const RefreshButton = styled.button`
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  color: var(--color-text);
  
  &:hover {
    background-color: var(--color-background-hover);
    border-color: var(--color-text-secondary);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const ApplyFiltersButton = styled(Button)`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.25);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(var(--color-primary-rgb), 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    color: var(--color-primary-dark);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

const PageButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? 'var(--color-primary)' : 'var(--color-border)'};
  background-color: ${props => props.active ? 'var(--color-primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--color-text)'};
  border-radius: 10px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary);
    color: ${props => props.active ? 'white' : 'var(--color-primary)'};
    background-color: ${props => props.active ? 'var(--color-primary)' : 'rgba(var(--color-primary-rgb), 0.05)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: var(--color-border);
    color: var(--color-text-secondary);
    background-color: white;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const PaginationEllipsis = styled.span`
  color: var(--color-text-secondary);
  padding: 0 0.5rem;
  font-weight: 600;
`;

const MobileFilterButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text);
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  &:hover {
    background-color: var(--color-background-hover);
    border-color: var(--color-text-secondary);
  }
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileFilterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
  opacity: ${props => props.isOpen ? 1 : 0};
`;

const MobileFilterPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.75rem;
  z-index: 101;
  max-height: 85vh;
  overflow-y: auto;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
`;

const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

const MobileFilterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 50%;
  transition: all 0.2s ease;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &:hover {
    color: var(--color-text);
    background-color: var(--color-background-hover);
  }
`;

const MobileFilterActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  position: sticky;
  bottom: 0;
  background-color: white;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

const BadgeCount = styled.span`
  background-color: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  min-width: 1.5rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  
  &:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid var(--color-primary);
    border-color: var(--color-primary) transparent var(--color-primary) transparent;
    animation: spinner 1.2s infinite;
  }
  
  @keyframes spinner {
    0% {
      transform: rotate(0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const RangeSlider = styled.div`
  margin: 2rem 0 1rem;
  position: relative;
`;

const SliderTrack = styled.div`
  height: 6px;
  background-color: var(--color-background);
  border-radius: 3px;
  position: relative;
`;

const SliderRange = styled.div`
  position: absolute;
  height: 6px;
  background-color: var(--color-primary);
  border-radius: 3px;
`;

const SliderThumb = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--color-primary);
  position: absolute;
  top: -7px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(1.15);
  }
`;

const SliderValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

// Icon components for better UI
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const GridViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AreaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <polyline points="23 20 23 14 17 14"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
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

const DesktopFilterContainer = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const MultiSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const MultiSelectBox = styled.div`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.95rem;
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
  }
`;

const SelectedCities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 95%;
`;

const CityTag = styled.span`
  background-color: rgba(var(--color-primary-rgb), 0.15);
  color: var(--color-primary-dark);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 0.25rem;
    color: var(--color-primary);
    
    &:hover {
      color: var(--color-primary-dark);
    }
    
    svg {
      width: 0.9rem;
      height: 0.9rem;
    }
  }
`;

const DropdownIcon = styled.div`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
  display: flex;
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const CityDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.95rem;
  background-color: white;
  
  &:focus {
    outline: none;
  }
`;

const CityOption = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
  
  input {
    margin-right: 0.75rem;
  }
`;

const Auctions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [auctions, setAuctions] = useState({
    active: [],
    upcoming: [],
    past: []
  });
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and sorting state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    location: '',
    cities: [],
    minPrice: '',
    maxPrice: '',
    status: 'all'
  });
  const [sortOption, setSortOption] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // City dropdown state
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileCityDropdownOpen, setMobileCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [mobileCitySearch, setMobileCitySearch] = useState('');
  
  // Filter cities based on search
  const filteredCities = citySearch 
    ? turkishCities.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()))
    : turkishCities;
    
  const filteredMobileCities = mobileCitySearch 
    ? turkishCities.filter(city => city.toLowerCase().includes(mobileCitySearch.toLowerCase()))
    : turkishCities;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 8;
  
  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'cities' && value.length > 0) return count + 1;
      if (key !== 'cities' && value && value !== 'all') return count + 1;
      return count;
    }, 0);
  };
  
  // Function to load auctions
  const loadAuctions = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // First get all auctions, passing the forceRefresh parameter
      const { data, error } = await fetchAuctions(forceRefresh);
      
      if (error) throw error;
      
      // Add debug logging to see all auctions and their details
      console.log('All auctions from database:', data);
      
      // Get the highest bid for each auction
      const auctionsWithHighestBids = await Promise.all(
        data.map(async (auction) => {
          try {
            // Fetch the highest bid for this auction
            const { data: bids } = await supabase
              .from('bids')
              .select('amount')
              .eq('auction_id', auction.id)
              .order('amount', { ascending: false })
              .limit(1);
            
            // If there's a highest bid, use it as the current price
            if (bids && bids.length > 0) {
              auction.highest_bid = bids[0].amount;
            }
            
            // Add property type if it doesn't exist
            if (!auction.property_type) {
              auction.property_type = "Arsa";
            }
            
          } catch (err) {
            console.error(`Error fetching bids for auction ${auction.id}:`, err);
          }
          return auction;
        })
      );
      
      // Modify the filtering logic to ensure auctions appear in only one tab
      // with a clear priority: active > upcoming > past
      const now = new Date();
      
      // 1. First, filter active auctions - status is 'active' OR current time is within window
      const active = auctionsWithHighestBids.filter(auction => {
        const startTime = new Date(auction.start_time || auction.startTime);
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        
        // Either explicitly marked as active
        if (status === 'active') return true;
        
        // OR current time is within auction window AND not marked as upcoming/ended
        return status !== 'upcoming' && status !== 'ended' && 
               now >= startTime && now <= endTime;
      });
      
      // 2. Then upcoming auctions - those NOT in active that are either:
      // - have status 'upcoming' OR 
      // - start time is in the future
      const activeIds = new Set(active.map(a => a.id));
      const upcoming = auctionsWithHighestBids.filter(auction => {
        // Skip if already in active tab
        if (activeIds.has(auction.id)) return false;
        
        const startTime = new Date(auction.start_time || auction.startTime);
        const status = auction.status;
        
        // Either explicitly marked as upcoming
        if (status === 'upcoming') return true;
        
        // OR start time is in the future AND not marked as ended
        return status !== 'ended' && now < startTime;
      });
      
      // 3. Finally, past auctions - anything not in active or upcoming that:
      // - has status 'ended' OR
      // - current time is after end time
      const upcomingIds = new Set(upcoming.map(a => a.id));
      const past = auctionsWithHighestBids.filter(auction => {
        // Skip if already in active or upcoming tabs
        if (activeIds.has(auction.id) || upcomingIds.has(auction.id)) return false;
        
        const endTime = new Date(auction.end_time || auction.endTime);
        const status = auction.status;
        
        // Either explicitly marked as ended
        if (status === 'ended') return true;
        
        // OR current time is after end time
        return now > endTime;
      });
      
      const newAuctions = {
        active,
        upcoming,
        past
      };
      
      setAuctions(newAuctions);
      applyFiltersAndSort(newAuctions[activeTab]);
      setError(null);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setError('Açık arttırma verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to apply filters and sorting
  const applyFiltersAndSort = (auctionsList) => {
    if (!auctionsList) return;
    
    setIsFiltering(true);
    
    // Use setTimeout to ensure the filtering spinner shows up
    setTimeout(() => {
      // First apply filters
      let filtered = [...auctionsList];
      
      // Filter by location text search
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        filtered = filtered.filter(auction => 
          auction.location && auction.location.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by cities - match any of the selected cities
      if (filters.cities && filters.cities.length > 0) {
        filtered = filtered.filter(auction => {
          if (!auction.location) return false;
          
          // Check if any of the selected cities match
          return filters.cities.some(city => 
            auction.location.toLowerCase().includes(city.toLowerCase())
          );
        });
      }
      
      // Filter by minimum price
      if (filters.minPrice) {
        const minPrice = parseFloat(filters.minPrice);
        filtered = filtered.filter(auction => {
          const price = auction.highest_bid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice;
          return price >= minPrice;
        });
      }
      
      // Filter by maximum price
      if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        filtered = filtered.filter(auction => {
          const price = auction.highest_bid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice;
          return price <= maxPrice;
        });
      }
      
      // Apply sorting
      switch (sortOption) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case 'price_high_low':
          filtered.sort((a, b) => {
            const priceA = a.highest_bid || a.final_price || a.finalPrice || a.start_price || a.startPrice;
            const priceB = b.highest_bid || b.final_price || b.finalPrice || b.start_price || b.startPrice;
            return priceB - priceA;
          });
          break;
        case 'price_low_high':
          filtered.sort((a, b) => {
            const priceA = a.highest_bid || a.final_price || a.finalPrice || a.start_price || a.startPrice;
            const priceB = b.highest_bid || b.final_price || b.finalPrice || b.start_price || b.startPrice;
            return priceA - priceB;
          });
          break;
        case 'end_date':
          filtered.sort((a, b) => {
            const dateA = new Date(a.end_time || a.endTime);
            const dateB = new Date(b.end_time || b.endTime);
            return dateA - dateB;
          });
          break;
        default:
          // Default to newest
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      
      setFilteredAuctions(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setIsFiltering(false);
    }, 400); // Small delay to show loading state for better UX
  };
  
  // Functions to handle city selection
  const handleCitySelect = (city) => {
    setFilters(prev => {
      // If city is already selected, remove it
      if (prev.cities.includes(city)) {
        return {
          ...prev,
          cities: prev.cities.filter(c => c !== city)
        };
      }
      // Otherwise add it
      return {
        ...prev,
        cities: [...prev.cities, city]
      };
    });
  };
  
  const handleRemoveCity = (city) => {
    setFilters(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  };
  
  // Function to clear all cities
  const clearSelectedCities = () => {
    setFilters(prev => ({
      ...prev,
      cities: []
    }));
    setCitySearch('');
    setMobileCitySearch('');
  };
  
  // Function to handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Function to apply filters
  const applyFilters = () => {
    applyFiltersAndSort(auctions[activeTab]);
    setMobileFiltersOpen(false);
  };
  
  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      location: '',
      cities: [],
      minPrice: '',
      maxPrice: '',
      status: 'all'
    });
    
    setCitySearch('');
    setMobileCitySearch('');
    
    // Apply the cleared filters
    setTimeout(() => {
      applyFiltersAndSort(auctions[activeTab]);
    }, 0);
  };
  
  // Get paginated auctions
  const getPaginatedAuctions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAuctions.slice(startIndex, endIndex);
  };
  
  // Get total pages
  const getTotalPages = () => {
    return Math.ceil(filteredAuctions.length / itemsPerPage);
  };
  
  // Add event listeners for page visibility changes
  useEffect(() => {
    // Initial data load
    loadAuctions();
    
    // Subscribe to refresh events from the central system
    const unsubscribe = appState.onRefresh(() => {
      console.log("[Auctions] Received refresh notification");
      loadAuctions();
    });
    
    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Effect to update filtered auctions when active tab or filters change
  useEffect(() => {
    if (auctions[activeTab]) {
      applyFiltersAndSort(auctions[activeTab]);
    }
  }, [activeTab, sortOption]);
  
  // Effect to update items per page when view mode changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when view mode changes
  }, [viewMode]);
  
  // Handle tab switch
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };
  
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '₺0';
    
    // If price is already a string with currency formatting, return it
    if (typeof price === 'string' && price.includes('₺')) {
      return price;
    }
    
    // Convert to number if it's a string number
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    
    // Handle NaN
    if (isNaN(price)) return '₺0';
    
    // Format the number
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleAuctionClick = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'upcoming': return 'Yaklaşan';
      case 'ended': case 'past': return 'Sonlandı';
      default: return '';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        );
      case 'upcoming':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
    }
  };
  
  // Render auction in grid view
  const renderAuctionCard = (auction) => {
      return (
      <AuctionCard onClick={() => handleAuctionClick(auction.id)}>
        <AuctionImage>
          {auction.property_type && (
            <PropertyTypeTag>{auction.property_type}</PropertyTypeTag>
          )}
          {auction.images && auction.images.length > 0 ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url(${auction.images[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          )}
        </AuctionImage>
        <AuctionContent>
          <AuctionTitle>{auction.title || 'Arsa'}</AuctionTitle>
          <AuctionLocation>
            <LocationIcon />
            {auction.location || 'Konum bilgisi yok'}
          </AuctionLocation>
          
          <PropertyInfoGrid>
            {auction.area_size && (
              <PropertyInfoItem>
                <AreaIcon />
                <span>{auction.area_size} {auction.area_unit || 'm²'}</span>
              </PropertyInfoItem>
            )}
            {auction.document_type && (
              <PropertyInfoItem>
                <DocumentIcon />
                <span>{auction.document_type}</span>
              </PropertyInfoItem>
            )}
          </PropertyInfoGrid>
          
          <AuctionDetails>
            <AuctionPrice>
              {formatPrice(
                activeTab === 'upcoming' 
                  ? (auction.start_price || auction.startPrice)
                  : (auction.highest_bid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice)
              )}
            </AuctionPrice>
            <AuctionStatus status={activeTab}>
              {getStatusIcon(activeTab)}
              {getStatusText(activeTab)}
            </AuctionStatus>
          </AuctionDetails>
          {activeTab === 'active' && (auction.end_time || auction.endTime) && (
            <CountdownWrapper>
              <CountdownTimer 
                endTime={auction.end_time || auction.endTime || auction.end_date} 
                compact={true}
                auctionId={auction.id}
              />
            </CountdownWrapper>
          )}
        </AuctionContent>
      </AuctionCard>
    );
  };
  
  // Render auction in list view
  const renderAuctionListItem = (auction) => {
    return (
      <AuctionListItem key={auction.id} onClick={() => handleAuctionClick(auction.id)}>
        <ListItemImage>
          {auction.property_type && (
            <PropertyTypeTag>{auction.property_type}</PropertyTypeTag>
          )}
          {auction.images && auction.images.length > 0 ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url(${auction.images[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          )}
        </ListItemImage>
        <ListItemContent>
          <AuctionTitle>{auction.title || 'Arsa'}</AuctionTitle>
          <AuctionLocation>
            <LocationIcon />
            {auction.location || 'Konum bilgisi yok'}
          </AuctionLocation>
          
          <PropertyInfoGrid>
            {auction.area_size && (
              <PropertyInfoItem>
                <AreaIcon />
                <span>{auction.area_size} {auction.area_unit || 'm²'}</span>
              </PropertyInfoItem>
            )}
            {auction.document_type && (
              <PropertyInfoItem>
                <DocumentIcon />
                <span>{auction.document_type}</span>
              </PropertyInfoItem>
            )}
          </PropertyInfoGrid>
        </ListItemContent>
        <ListItemActions>
          <ListItemPriceAndStatus>
            <AuctionPrice>
              {formatPrice(
                activeTab === 'upcoming' 
                  ? (auction.start_price || auction.startPrice)
                  : (auction.highest_bid || auction.final_price || auction.finalPrice || auction.start_price || auction.startPrice)
              )}
            </AuctionPrice>
            <AuctionStatus status={activeTab}>
              {getStatusIcon(activeTab)}
              {getStatusText(activeTab)}
            </AuctionStatus>
          </ListItemPriceAndStatus>
          {activeTab === 'active' && (auction.end_time || auction.endTime) && (
            <CountdownTimer 
              endTime={auction.end_time || auction.endTime || auction.end_date} 
              compact={true}
              auctionId={auction.id}
            />
          )}
        </ListItemActions>
      </AuctionListItem>
    );
  };
  
  // Render auctions based on view mode
  const renderAuctions = () => {
    if (loading) {
      return (
        <EmptyState>
          <LoadingSpinner />
          <EmptyStateTitle>Veriler Yükleniyor</EmptyStateTitle>
          <EmptyStateMessage>Lütfen bekleyin, ihale bilgileri yükleniyor...</EmptyStateMessage>
        </EmptyState>
      );
    }
    
    if (error) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>Hata Oluştu</EmptyStateTitle>
          <EmptyStateMessage>{error}</EmptyStateMessage>
          <RefreshButton onClick={() => loadAuctions(true)}>
            <RefreshIcon />
            Yenile
          </RefreshButton>
        </EmptyState>
      );
    }
    
    if (isFiltering) {
      return (
        <EmptyState>
          <LoadingSpinner />
          <EmptyStateTitle>Filtreleniyor</EmptyStateTitle>
          <EmptyStateMessage>İhaleler filtreleniyor, lütfen bekleyin...</EmptyStateMessage>
        </EmptyState>
      );
    }
    
    const paginatedAuctions = getPaginatedAuctions();
    
    if (filteredAuctions.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </EmptyStateIcon>
          <EmptyStateTitle>
            {Object.values(filters).some(value => value && value !== 'all') 
              ? 'Arama Kriterlerine Uygun İhale Bulunamadı'
              : activeTab === 'active' 
                ? 'Aktif İhale Bulunamadı' 
                : activeTab === 'upcoming' 
                  ? 'Yaklaşan İhale Bulunamadı' 
                  : 'Geçmiş İhale Bulunamadı'
            }
          </EmptyStateTitle>
          <EmptyStateMessage>
            {Object.values(filters).some(value => value && value !== 'all')
              ? 'Lütfen farklı filtreleme kriterleri ile tekrar deneyin veya tüm filtreleri temizleyin.'
              : activeTab === 'active' 
                ? 'Şu anda aktif bir ihale bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.' 
                : activeTab === 'upcoming' 
                  ? 'Şu anda planlanmış yaklaşan ihale bulunmamaktadır.' 
                  : 'Geçmiş ihaleler bulunamadı.'
            }
          </EmptyStateMessage>
          {Object.values(filters).some(value => value && value !== 'all') && (
            <RefreshButton onClick={clearFilters}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
              Filtreleri Temizle
          </RefreshButton>
          )}
        </EmptyState>
      );
    }
    
    if (viewMode === 'grid') {
    return (
        <>
      <AuctionsGrid>
            {paginatedAuctions.map(auction => (
              <GridItemWrapper key={auction.id}>
                {renderAuctionCard(auction)}
              </GridItemWrapper>
            ))}
          </AuctionsGrid>
          {renderPagination()}
        </>
      );
    } else {
      return (
        <>
          <AuctionsList>
            {paginatedAuctions.map(auction => renderAuctionListItem(auction))}
          </AuctionsList>
          {renderPagination()}
        </>
      );
    }
  };
  
  // Render pagination
  const renderPagination = () => {
    const totalPages = getTotalPages();
    
    if (totalPages <= 1) return null;
    
    // Logic to determine which page buttons to show
    const renderPageButtons = () => {
      const buttons = [];
      
      if (totalPages <= 5) {
        // Show all pages if total is 5 or less
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(
            <PageButton 
              key={i} 
              active={currentPage === i} 
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PageButton>
          );
        }
      } else {
        // Always show first page
        buttons.push(
          <PageButton 
            key={1} 
            active={currentPage === 1} 
            onClick={() => setCurrentPage(1)}
          >
            1
          </PageButton>
        );
        
        // Show ellipsis if current page is > 3
        if (currentPage > 3) {
          buttons.push(<PaginationEllipsis key="ellipsis1">...</PaginationEllipsis>);
        }
        
        // Show pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(
            <PageButton 
              key={i} 
              active={currentPage === i} 
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PageButton>
          );
        }
        
        // Show ellipsis if current page is < totalPages - 2
        if (currentPage < totalPages - 2) {
          buttons.push(<PaginationEllipsis key="ellipsis2">...</PaginationEllipsis>);
        }
        
        // Always show last page
        buttons.push(
          <PageButton 
            key={totalPages} 
            active={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PageButton>
        );
      }
      
      return buttons;
    };
    
    return (
      <Pagination>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </PageButton>
        
        {renderPageButtons()}
        
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </PageButton>
      </Pagination>
    );
  };
  
  // Render filter panel
  const renderFilterPanel = () => {
    return (
      <FiltersPanel>
        <FilterSection>
          <FilterSectionTitle>Filtreler</FilterSectionTitle>
          <FilterGroup>
            <FilterLabel htmlFor="city-select">Şehir Seçiniz</FilterLabel>
            <MultiSelectWrapper className="city-dropdown">
              <MultiSelectBox 
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              >
                <SelectedCities>
                  {filters.cities.length === 0 ? (
                    <span style={{ color: 'var(--color-text-tertiary)' }}>Tüm Şehirler</span>
                  ) : (
                    filters.cities.map(city => (
                      <CityTag key={city}>
                        {city}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCity(city);
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                        </button>
                      </CityTag>
                    ))
                  )}
                </SelectedCities>
                <DropdownIcon isOpen={cityDropdownOpen}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </DropdownIcon>
              </MultiSelectBox>
              
              <CityDropdown isOpen={cityDropdownOpen} className="city-dropdown">
                <SearchInput 
                  placeholder="Şehir ara..." 
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredCities.map(city => (
                    <CityOption key={city} onClick={(e) => {
                      e.stopPropagation();
                      handleCitySelect(city);
                    }}>
                      <input 
                        type="checkbox" 
                        checked={filters.cities.includes(city)}
                        onChange={() => {}} // Handled by the parent click
                      />
                      {city}
                    </CityOption>
                  ))}
                  {filteredCities.length === 0 && (
                    <div style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)' }}>
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              </CityDropdown>
            </MultiSelectWrapper>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="location">Konum Ara</FilterLabel>
            <FilterInput 
              id="location" 
              type="text" 
              placeholder="Konum detayı ara..." 
              value={filters.location}
              onChange={e => handleFilterChange('location', e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Fiyat Aralığı</FilterLabel>
            <PriceRangeInputs>
              <FilterInput 
                type="number" 
                placeholder="Min ₺" 
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
              />
              <FilterInput 
                type="number" 
                placeholder="Max ₺" 
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
              />
            </PriceRangeInputs>
          </FilterGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterSectionTitle>Sıralama</FilterSectionTitle>
          <FilterGroup>
            <FilterSelect 
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price_high_low">Fiyat (Yüksek-Düşük)</option>
              <option value="price_low_high">Fiyat (Düşük-Yüksek)</option>
              <option value="end_date">Bitiş Tarihine Göre</option>
            </FilterSelect>
          </FilterGroup>
        </FilterSection>
        
        <ApplyFiltersButton onClick={applyFilters} variant="primary">
          Filtreleri Uygula
        </ApplyFiltersButton>
        
        {getActiveFilterCount() > 0 && (
          <ClearFiltersButton onClick={clearFilters}>
            Tüm Filtreleri Temizle
          </ClearFiltersButton>
        )}
      </FiltersPanel>
    );
  };

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if we're clicking inside any city dropdown component
      if (event.target.closest('.city-dropdown') || event.target.closest('.mobile-city-dropdown')) {
        return;
      }
      
      // Only close dropdowns if we clicked outside
      setCityDropdownOpen(false);
      setMobileCityDropdownOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <PageContainer>
      <PageHeader>
          <div>
            <PageTitle>Arsa İhaleleri</PageTitle>
            <PageDescription>
              Türkiye genelinde mevcut arsa ihalelerini görüntüleyin ve tekliflerinizi verin.
            </PageDescription>
        </div>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => handleTabSwitch('active')}
        >
          Aktif İhaleler
          {auctions.active.length > 0 && (
            <TabCount active={activeTab === 'active'}>{auctions.active.length}</TabCount>
          )}
        </Tab>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => handleTabSwitch('upcoming')}
        >
          Yaklaşan İhaleler
          {auctions.upcoming.length > 0 && (
            <TabCount active={activeTab === 'upcoming'}>{auctions.upcoming.length}</TabCount>
          )}
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => handleTabSwitch('past')}
        >
          Sonlanan İhaleler
          {auctions.past.length > 0 && (
            <TabCount active={activeTab === 'past'}>{auctions.past.length}</TabCount>
          )}
        </Tab>
      </TabsContainer>
      
      <FiltersAndContentWrapper>
        {/* Desktop Filter Panel */}
        <DesktopFilterContainer>
          {renderFilterPanel()}
        </DesktopFilterContainer>
        
        <MainContentArea>
          <ContentHeader>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <MobileFilterButton onClick={() => setMobileFiltersOpen(true)}>
                <FilterIcon />
                Filtreler
                {getActiveFilterCount() > 0 && (
                  <BadgeCount>
                    {getActiveFilterCount()}
                  </BadgeCount>
                )}
              </MobileFilterButton>
              
              <ResultsCount>
                {filteredAuctions.length} sonuç bulundu
              </ResultsCount>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <SortContainer>
                <SortLabel>Sırala:</SortLabel>
                <SortSelect 
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="price_high_low">Fiyat (Yüksek-Düşük)</option>
                  <option value="price_low_high">Fiyat (Düşük-Yüksek)</option>
                  <option value="end_date">Bitiş Tarihine Göre</option>
                </SortSelect>
              </SortContainer>
              
              <ViewToggle>
                <ViewToggleButton 
                  active={viewMode === 'grid'} 
                  onClick={() => setViewMode('grid')}
                >
                  <GridViewIcon />
                </ViewToggleButton>
                <ViewToggleButton 
                  active={viewMode === 'list'} 
                  onClick={() => setViewMode('list')}
                >
                  <ListViewIcon />
                </ViewToggleButton>
              </ViewToggle>
              
              <RefreshButton onClick={() => loadAuctions(true)}>
                <RefreshIcon />
                Yenile
              </RefreshButton>
            </div>
          </ContentHeader>
      
      {renderAuctions()}
        </MainContentArea>
      </FiltersAndContentWrapper>
      
      {/* Mobile Filter Panel */}
      <MobileFilterOverlay isOpen={mobileFiltersOpen} onClick={() => setMobileFiltersOpen(false)} />
      <MobileFilterPanel isOpen={mobileFiltersOpen}>
        <MobileFilterHeader>
          <MobileFilterTitle>Filtreler</MobileFilterTitle>
          <CloseButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </CloseButton>
        </MobileFilterHeader>
        
        <FilterGroup>
          <FilterLabel htmlFor="mobile-city-select">Şehir Seçiniz</FilterLabel>
          <MultiSelectWrapper className="mobile-city-dropdown">
            <MultiSelectBox 
              onClick={() => setMobileCityDropdownOpen(!mobileCityDropdownOpen)}
              className="mobile-city-dropdown"
            >
              <SelectedCities>
                {filters.cities.length === 0 ? (
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Tüm Şehirler</span>
                ) : (
                  filters.cities.map(city => (
                    <CityTag key={city}>
                      {city}
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCity(city);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </CityTag>
                  ))
                )}
              </SelectedCities>
              <DropdownIcon isOpen={mobileCityDropdownOpen}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </DropdownIcon>
            </MultiSelectBox>
            
            <CityDropdown isOpen={mobileCityDropdownOpen} className="mobile-city-dropdown">
              <SearchInput 
                placeholder="Şehir ara..." 
                value={mobileCitySearch}
                onChange={(e) => setMobileCitySearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredMobileCities.map(city => (
                  <CityOption key={city} onClick={(e) => {
                    e.stopPropagation();
                    handleCitySelect(city);
                  }}>
                    <input 
                      type="checkbox" 
                      checked={filters.cities.includes(city)}
                      onChange={() => {}} // Handled by the parent click
                    />
                    {city}
                  </CityOption>
                ))}
                {filteredMobileCities.length === 0 && (
                  <div style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)' }}>
                    Sonuç bulunamadı
                  </div>
                )}
              </div>
            </CityDropdown>
          </MultiSelectWrapper>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="mobile-location">Konum Ara</FilterLabel>
          <FilterInput 
            id="mobile-location" 
            type="text" 
            placeholder="Konum detayı ara..." 
            value={filters.location}
            onChange={e => handleFilterChange('location', e.target.value)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Fiyat Aralığı</FilterLabel>
          <PriceRangeInputs>
            <FilterInput 
              type="number" 
              placeholder="Min ₺" 
              value={filters.minPrice}
              onChange={e => handleFilterChange('minPrice', e.target.value)}
            />
            <FilterInput 
              type="number" 
              placeholder="Max ₺" 
              value={filters.maxPrice}
              onChange={e => handleFilterChange('maxPrice', e.target.value)}
            />
          </PriceRangeInputs>
        </FilterGroup>
        
        <MobileFilterActions>
          <Button 
            onClick={clearFilters} 
            variant="secondary" 
            style={{ flex: 1 }}
          >
            Temizle
          </Button>
          <Button 
            onClick={applyFilters} 
            variant="primary" 
            style={{ flex: 1 }}
          >
            Uygula
          </Button>
        </MobileFilterActions>
      </MobileFilterPanel>
    </PageContainer>
  );
};

export default Auctions; 