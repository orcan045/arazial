import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background-color: var(--color-primary);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-dark);
    }
    
    &:disabled {
      background-color: var(--color-primary-light);
      opacity: 0.7;
      cursor: not-allowed;
    }
  `,
  secondary: css`
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    
    &:hover {
      background-color: var(--color-primary-light);
      color: white;
    }
    
    &:disabled {
      border-color: #ccc;
      color: #999;
      cursor: not-allowed;
    }
  `,
  text: css`
    background-color: transparent;
    color: var(--color-primary);
    padding: 0.5rem;
    
    &:hover {
      text-decoration: underline;
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    &:disabled {
      color: #999;
      cursor: not-allowed;
    }
  `,
};

const sizes = {
  small: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `,
};

const Button = styled.button`
  display: ${props => props.fullWidth ? 'block' : 'inline-block'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  font-weight: 500;
  text-align: center;
  border: none;
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  
  ${props => variants[props.variant || 'primary']}
  ${props => sizes[props.size || 'medium']}
  
  ${props => props.loading && css`
    opacity: 0.7;
    cursor: wait;
  `}
  
  ${props => props.className && ''}
`;

export default Button;
