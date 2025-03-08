
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

// Sign in function - simplified to be more reliable
export const signIn = async (email: string, password: string) => {
  console.log('Signing in with email:', email);
  
  try {
    // Handle test account separately to avoid network requests
    if (email === 'test@example.com' && password === 'password123') {
      console.log('Using test account login');
      const { user, session } = createTestUserAndSession();
      return {
        success: true,
        isTestAccount: true,
        user,
        session,
        error: null
      };
    }
    
    // For real users, attempt to sign in with Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase sign in error:', error.message);
        return {
          success: false,
          isTestAccount: false,
          error,
          user: null,
          session: null
        };
      }
      
      console.log('Sign in successful for user:', data.user?.email);
      return {
        success: true,
        isTestAccount: false,
        error: null,
        user: data.user,
        session: data.session
      };
    } catch (networkError) {
      console.error('Network error during sign in:', networkError);
      return {
        success: false,
        isTestAccount: false,
        error: new Error('Network error. Please check your connection and try again.'),
        user: null,
        session: null
      };
    }
  } catch (error) {
    console.error('Unexpected error in signIn function:', error);
    return {
      success: false,
      isTestAccount: false,
      error: error as Error,
      user: null,
      session: null
    };
  }
};

// Sign out function
export const signOut = async () => {
  console.log('Signing out');
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
