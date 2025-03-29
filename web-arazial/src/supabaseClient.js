import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anonymous key from environment variables or use placeholders
// In a production environment, these should be set in environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 