import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { completeAuction } from '../services/auctionService';

const TimerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-family-mono, monospace);
  font-weight: 600;
  padding: ${props => props.compact ? '0.25rem 0.5rem' : '0.5rem 0.75rem'};
  background-color: ${props => props.isExpiring ? 'rgba(220, 38, 38, 0.1)' : 'rgba(17, 24, 39, 0.1)'};
  color: ${props => props.isExpiring ? 'rgb(220, 38, 38)' : 'rgb(17, 24, 39)'};
  border-radius: var(--border-radius-md);
  font-size: ${props => props.compact ? '0.75rem' : '0.875rem'};
  line-height: 1.25;
  letter-spacing: 0.025em;
  ${props => props.alwaysVisible ? '' : 'opacity: 0.9;'}
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const TimerIcon = styled.span`
  margin-right: 0.5rem;
  display: ${props => props.compact ? 'none' : 'inline'};
`;

const CountdownTimer = ({ 
  endTime, 
  onComplete, 
  compact = false,
  alwaysVisible = true,
  showSeconds = true,
  auctionId = null
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  
  useEffect(() => {
    let intervalId;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const difference = end - now;
      
      if (difference <= 0) {
        clearInterval(intervalId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        
        // If an auction ID is provided, try to complete the auction
        if (auctionId) {
          console.log(`Auction timer ended for auction ${auctionId}, completing auction...`);
          completeAuction(auctionId)
            .then(result => {
              console.log('Auction completion result:', result);
              if (result.success) {
                console.log(`Auction ${auctionId} completed successfully`);
              } else {
                console.error(`Failed to complete auction ${auctionId}:`, result.error);
              }
            })
            .catch(err => {
              console.error(`Error in auction completion for ${auctionId}:`, err);
            });
        }
        
        if (onComplete) onComplete();
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        total: difference
      });
    };
    
    calculateTimeLeft();
    intervalId = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(intervalId);
  }, [endTime, onComplete, auctionId]);
  
  const formatTime = () => {
    const { days, hours, minutes, seconds } = timeLeft;
    
    if (days > 0) {
      return compact 
        ? `${days}g ${hours}s` 
        : `${days}g ${hours}s ${minutes}d ${showSeconds ? seconds + 'sn' : ''}`;
    }
    
    if (hours > 0 || !compact) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Show nothing if there's no time left
  if (timeLeft.total <= 0 && !alwaysVisible) {
    return null;
  }
  
  // Determine if time is running out (less than 5 minutes)
  const isExpiring = timeLeft.total > 0 && timeLeft.total < 5 * 60 * 1000;
  
  return (
    <TimerContainer 
      compact={compact} 
      isExpiring={isExpiring}
      alwaysVisible={alwaysVisible}
    >
      <TimerIcon compact={compact}>⏱️</TimerIcon>
      {timeLeft.total <= 0 ? 'Süre doldu' : formatTime()}
    </TimerContainer>
  );
};

export default CountdownTimer; 