
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { signIn, signUp, signOut as authSignOut, createTestUserAndSession } from '@/lib/authUtils';

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

  const handleSignUp = async (email: string, password: string) => {
    return await signUp(email, password);
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Handle test account login
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test account credentials');
        
        // We'll simulate a successful login without contacting Supabase
        toast({
          title: "Test Account Login",
          description: "You are now logged in with the test account.",
        });
        
        // Create a complete mock User object for the test account
        const { user: testUser, session: testSession } = createTestUserAndSession();
        
        // Set the user and session manually
        setUser(testUser);
        setSession(testSession);
        
        console.log('Test account sign in successful, navigating to dashboard');
        navigate('/dashboard');
        
        return {
          error: null,
          success: true,
        };
      }
      
      // Standard sign in process for non-test accounts
      const result = await signIn(email, password);
      
      if (result.success) {
        console.log('Sign in successful, navigating to dashboard');
        navigate('/dashboard');
      }
      
      return result;
    } catch (error) {
      console.error('Error in handleSignIn:', error);
      return {
        error: error as Error,
        success: false,
      };
    }
  };

  const handleSignOut = async () => {
    console.log('Handling sign out');
    
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
    
    await authSignOut();
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
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export the useAuth hook from this file
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
