
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Utility function for email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create test user and session for development purposes
export const createTestUserAndSession = (): { 
  user: User; 
  session: Session;
} => {
  console.log('Creating test user and session');
  
  // Create a complete mock User object for the test account
  const testUser = {
    id: 'test-user-id',
    aud: 'authenticated',
    email: 'test@example.com',
    phone: '',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { name: 'Test User' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    identities: [],
    role: 'authenticated',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    banned_until: null,
    confirmation_sent_at: null,
    recovery_sent_at: null,
    factors: null,
  } as User;
  
  // Create mock session
  const session = { 
    user: testUser,
    access_token: 'test-token',
    refresh_token: 'test-refresh-token',
    expires_at: Date.now() + 3600,
    expires_in: 3600
  } as Session;
  
  return { user: testUser, session };
};

// Sign up function
export const signUp = async (email: string, password: string) => {
  try {
    console.log('Signing up with email:', email);
    
    // Handle test account separately
    if (email === 'test@example.com' && password === 'password123') {
      console.log('Using test account - bypassing actual signup');
      return {
        error: null,
        success: true,
      };
    }
    
    // Validate email with a basic regex before sending to Supabase
    if (!validateEmail(email)) {
      return {
        error: new Error('Please enter a valid email address'),
        success: false,
      };
    }

    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log('Sign up response:', data ? 'Success' : 'Failed', error ? `Error: ${error.message}` : 'No error');
    
    if (error) {
      return {
        error,
        success: false,
      };
    }
    
    toast({
      title: "Signup Successful",
      description: "Your account has been created. You can now log in.",
    });
    
    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error('Error in sign up process:', error);
    return {
      error: error as Error,
      success: false,
    };
  }
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in with email:', email);
    
    // Standard sign in process for non-test accounts
    if (email !== 'test@example.com' || password !== 'password123') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in failed:', error);
        return {
          error,
          success: false,
        };
      }
      
      return {
        error: null,
        success: true,
      };
    }
    
    // Test account handling happens in the component
    return {
      error: null,
      success: true,
    };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      error: error as Error,
      success: false,
    };
  }
};

// Sign out function
export const signOut = async () => {
  console.log('Signing out');
  return await supabase.auth.signOut();
};
