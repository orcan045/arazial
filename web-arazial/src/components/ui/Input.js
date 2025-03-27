import styled from 'styled-components';

const InputWrapper = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  ${props => props.className && ''}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? 'var(--color-error)' : '#e5e7eb'};
  border-radius: var(--border-radius-md);
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color: var(--color-error);
  font-size: 0.875rem;
`;

const Input = ({
  id,
  label,
  error,
  className,
  ...props
}) => {
  return (
    <InputWrapper className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;