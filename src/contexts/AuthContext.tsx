
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { signIn, signUp, signOut as authSignOut } from '@/lib/authUtils';
import { handleError } from '@/lib/error-utils';

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
  const location = useLocation();

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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Redirect to login page if signed out
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !user && !location.pathname.includes('/login')) {
      console.log('User not authenticated, redirecting to login page');
      navigate('/login');
    }
  }, [user, isLoading, navigate, location.pathname]);

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
    try {
      return await signUp(email, password);
    } catch (error) {
      console.error('Error in handleSignUp:', error);
      return {
        error: error instanceof Error ? error : new Error('Unknown error during sign up'),
        success: false,
      };
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Set user and session data
        setUser(result.user);
        setSession(result.session);
        
        // Show success toast
        toast({
          title: "Login Successful",
          description: result.isTestAccount 
            ? "You are now logged in with the test account." 
            : "Welcome back!",
        });
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
      
      return {
        error: result.error,
        success: result.success,
      };
    } catch (error) {
      console.error('Error in handleSignIn:', error);
      handleError(error, 'Login failed');
      return {
        error: error instanceof Error ? error : new Error('Unknown error during sign in'),
        success: false,
      };
    }
  };

  const handleSignOut = async () => {
    console.log('Handling sign out');
    
    try {
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
      
      // Handle regular account signout
      await authSignOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      // We don't need to navigate here because the onAuthStateChange listener will do it
    } catch (error) {
      console.error('Error during sign out:', error);
      handleError(error, 'Sign out failed');
    }
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

// Export the useAuth hook 
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
