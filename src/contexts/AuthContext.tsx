
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
      
      // Handle test account separately
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test account - bypassing actual signup');
        return {
          error: null,
          success: true,
        };
      }
      
      // Validate email with a basic regex before sending to Supabase
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
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

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      
      // Handle test account login
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test account credentials');
        
        // We'll simulate a successful login without contacting Supabase
        toast({
          title: "Test Account Login",
          description: "You are now logged in with the test account.",
        });
        
        // Create a fake session for the test account
        const testUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' },
          app_metadata: { role: 'user' },
          created_at: new Date().toISOString(),
        };
        
        // Set the user and session manually
        setUser(testUser as User);
        setSession({ user: testUser as User, access_token: 'test-token', refresh_token: 'test-refresh-token', expires_at: Date.now() + 3600 } as Session);
        
        console.log('Test account sign in successful, navigating to dashboard');
        navigate('/dashboard');
        
        return {
          error: null,
          success: true,
        };
      }
      
      // Standard sign in process for non-test accounts
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
      
      console.log('Sign in successful, navigating to dashboard');
      navigate('/dashboard');
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

  const signOut = async () => {
    console.log('Signing out');
    
    // Handle test account signout
    if (user?.email === 'test@example.com') {
      setUser(null);
      setSession(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out of the test account.",
      });
      navigate('/login');
      return;
    }
    
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
