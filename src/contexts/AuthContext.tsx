
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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
      // Modified to automatically sign in after sign up (no email confirmation)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // This option skips the email verification flow
          data: {
            confirmed_at: new Date().toISOString(),
          }
        }
      });
      
      // If sign up is successful, immediately sign in
      if (!error) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError) {
          navigate('/dashboard');
        }
        
        return {
          error: signInError,
          success: !signInError,
        };
      }
      
      return {
        error,
        success: !error,
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        error: error as Error,
        success: false,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        navigate('/dashboard');
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
    await supabase.auth.signOut();
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
