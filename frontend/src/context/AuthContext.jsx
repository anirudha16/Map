import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription = null;

    const init = async () => {
      try {
        // Check if Supabase is properly initialized
        if (!supabase || !supabase.auth) {
          console.warn('Supabase client not properly initialized');
          if (mounted) {
            setSession(null);
            setInitializing(false);
          }
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data?.session || null);
          setInitializing(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setSession(null);
          setInitializing(false);
        }
      }
    };

    init();

    try {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setInitializing(false);
        }
      });
      subscription = authSubscription;
    } catch (err) {
      console.error('Failed to set up auth state listener:', err);
      if (mounted) {
        setInitializing(false);
      }
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,
      signIn: (credentials) => supabase.auth.signInWithPassword(credentials),
      signUp: (credentials) => supabase.auth.signUp(credentials),
      signOut: () => supabase.auth.signOut(),
    }),
    [session, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


