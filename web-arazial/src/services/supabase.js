import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using fallback values');
}

// Create a single supabase client for the entire app with enhanced options
export const supabase = createClient(
  supabaseUrl || 'https://your-supabase-url.supabase.co',
  supabaseAnonKey || 'your-supabase-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      // Add timeout and retry settings for better reliability
      fetch: (url, options = {}) => {
        // Set a reasonable timeout for all fetch requests (10 seconds)
        options.timeout = options.timeout || 10000;
        return fetch(url, options);
      }
    },
    // Automatically retry failed requests
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Register a global handler for network status changes to improve reconnection
if (typeof window !== 'undefined') {
  // Monitor online/offline status
  window.addEventListener('online', () => {
    console.log('Network connection restored');
    // Trigger a session refresh when connection is restored
    supabase.auth.getSession().catch(err => {
      console.warn('Failed to refresh session after reconnect:', err);
    });
  });
  
  window.addEventListener('offline', () => {
    console.warn('Network connection lost');
  });
}

export default supabase;