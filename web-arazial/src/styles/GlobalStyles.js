import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #4f46e5;
    --color-primary-light: #6366f1;
    --color-primary-dark: #4338ca;
    
    --color-surface: #ffffff;
    --color-background: #f9fafb;
    --color-surface-secondary: #f3f4f6;
    
    --color-text: #111827;
    --color-text-secondary: #4b5563;
    
    --color-error: #ef4444;
    --color-success: #10b981;
    
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }
  
  body {
    height: 100%;
    width: 100%;
    font-family: 'Inter', sans-serif;
    background-color: var(--color-background);
    color: var(--color-text);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
  }
  
  #root {
    min-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }
  
  button {
    cursor: pointer;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
  }

  img {
    max-width: 100%;
    height: auto;
  }
  
  section {
    scroll-margin-top: 80px;
    width: 100%;
  }
`;

export default GlobalStyles;