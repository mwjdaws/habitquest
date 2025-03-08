
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required. Set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CSS variable mapping for habit colors
document.documentElement.style.setProperty('--habit-purple', '#8B5CF6');
document.documentElement.style.setProperty('--habit-soft-blue', '#0EA5E9');
document.documentElement.style.setProperty('--habit-orange', '#F97316');
