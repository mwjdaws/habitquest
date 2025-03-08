
import { createClient } from '@supabase/supabase-js';

// Use the project values directly instead of environment variables
const supabaseUrl = 'https://apwaeetfagjhoxxqlbjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwd2FlZXRmYWdqaG94eHFsYmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTY1MzEsImV4cCI6MjA1NzAzMjUzMX0.2dQCw2CkSRUBKuD5seNZ8nexqr7n1YB6NqUWELVeKLE';

// Initialize Supabase client (removed excessive logging)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize CSS variables for habit colors only once on page load
(() => {
  if (typeof document !== 'undefined') {
    // CSS variable mapping for habit colors
    const habitColors = {
      'habit-purple': '#8B5CF6',
      'habit-soft-blue': '#0EA5E9',
      'habit-orange': '#F97316'
    };
    
    // Efficiently set all variables at once
    Object.entries(habitColors).forEach(([name, value]) => {
      document.documentElement.style.setProperty(`--${name}`, value);
    });
  }
})();
