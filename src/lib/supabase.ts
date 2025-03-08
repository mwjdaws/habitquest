
import { createClient } from '@supabase/supabase-js';

// Use the project values directly instead of environment variables
const supabaseUrl = 'https://apwaeetfagjhoxxqlbjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd2FlZXRmYWdqaG94eHFsYmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTY1MzEsImV4cCI6MjA1NzAzMjUzMX0.2dQCw2CkSRUBKuD5seNZ8nexqr7n1YB6NqUWELVeKLE';

// Log initialization for debugging
console.log('Initializing Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log successful initialization
console.log('Supabase client initialized');

// CSS variable mapping for habit colors
document.documentElement.style.setProperty('--habit-purple', '#8B5CF6');
document.documentElement.style.setProperty('--habit-soft-blue', '#0EA5E9');
document.documentElement.style.setProperty('--habit-orange', '#F97316');
