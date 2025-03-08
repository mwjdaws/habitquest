
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add proper error handling and logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required.');
  console.error('Make sure you have added the following to your .env file:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log successful initialization
console.log('Supabase client initialized');

// CSS variable mapping for habit colors
document.documentElement.style.setProperty('--habit-purple', '#8B5CF6');
document.documentElement.style.setProperty('--habit-soft-blue', '#0EA5E9');
document.documentElement.style.setProperty('--habit-orange', '#F97316');
