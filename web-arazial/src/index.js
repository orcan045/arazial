import { Buffer } from 'buffer';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import appState from './services/appState';

// Make Buffer available globally
window.Buffer = Buffer;

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register cleanup for when the app is unmounted or refreshed
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    // Clean up any global listeners or resources
    appState.cleanup();
  });
}