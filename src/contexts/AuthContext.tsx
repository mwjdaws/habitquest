import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider initializing...');
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session loaded:', session ? 'Session found' : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setInitError(error instanceof Error ? error : new Error('Unknown error during authentication'));
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    try {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          console.log('Auth state changed:', _event);
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth subscription:', error);
      setInitError(error instanceof Error ? error : new Error('Unknown error during authentication setup'));
      setIsLoading(false);
    }
  }, []);

  // Show initialization error if auth setup failed
  if (initError && !isLoading) {
    console.error('Authentication initialization error:', initError);
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <h2 className="text-xl font-bold text-red-500 mb-2">Authentication Error</h2>
        <p className="text-gray-700 mb-4">Failed to initialize authentication.</p>
        <code className="bg-gray-100 p-2 rounded text-sm">{initError.message}</code>
      </div>
    );
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Signing up with email:', email);
      
      // Create test user if using test credentials
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test credentials for sign up');
        
        // First check if the test user already exists by trying to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If sign in worked, the user exists already
        if (!signInError) {
          console.log('Test user already exists, signing in instead');
          navigate('/dashboard');
          return {
            error: null,
            success: true,
          };
        }
        
        // Otherwise create the test user
        console.log('Creating test user account');
      }
      
      // Try sign up with auto-confirm option
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            confirmed_at: new Date().toISOString(),
          }
        }
      });
      
      console.log('Sign up response:', data ? 'Success' : 'Failed', error ? `Error: ${error.message}` : 'No error');
      
      if (!error && data.user) {
        console.log('Sign up successful, attempting to sign in automatically');
        // Auto sign in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Auto sign in failed:', signInError);
          return {
            error: signInError,
            success: false,
          };
        }
        
        console.log('Auto sign in successful, navigating to dashboard');
        navigate('/dashboard');
        return {
          error: null,
          success: true,
        };
      }
      
      return {
        error,
        success: !error,
      };
    } catch (error) {
      console.error('Error in sign up process:', error);
      return {
        error: error as Error,
        success: false,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      
      // Special handling for test account
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test credentials');
        
        // First try to sign in normally
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        // If the test account doesn't exist yet, create it
        if (error && error.message.toLowerCase().includes('invalid login')) {
          console.log('Test account not found, creating it now');
          
          // Create the test account
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                confirmed_at: new Date().toISOString(),
              }
            }
          });
          
          if (signUpError) {
            console.error('Failed to create test account:', signUpError);
            return {
              error: signUpError,
              success: false,
            };
          }
          
          // Try signing in again
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) {
            console.error('Failed to sign in with newly created test account:', retryError);
            return {
              error: retryError,
              success: false,
            };
          }
          
          console.log('Successfully created and signed in with test account');
          navigate('/dashboard');
          return {
            error: null,
            success: true,
          };
        }
        
        if (!error) {
          console.log('Sign in with test account successful');
          navigate('/dashboard');
        }
        
        return {
          error,
          success: !error,
        };
      }
      
      // Normal sign in process
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log('Sign in successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.error('Sign in failed:', error);
      }
      
      return {
        error,
        success: !error,
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        error: error as Error,
        success: false,
      };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/login');
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
