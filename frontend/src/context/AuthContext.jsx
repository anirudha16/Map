// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { supabase } from '../lib/supabase';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [session, setSession] = useState(null);
//   const [initializing, setInitializing] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     let subscription = null;

//     const init = async () => {
//       try {
//         // Check if Supabase is properly initialized
//         if (!supabase || !supabase.auth) {
//           console.warn('Supabase client not properly initialized');
//           if (mounted) {
//             setSession(null);
//             setInitializing(false);
//           }
//           return;
//         }

//         const { data, error } = await supabase.auth.getSession();
//         if (mounted) {
//           setSession(data?.session || null);
//           setInitializing(false);
//         }
//       } catch (err) {
//         console.error('Auth initialization error:', err);
//         if (mounted) {
//           setSession(null);
//           setInitializing(false);
//         }
//       }
//     };

//     init();

//     try {
//       const {
//         data: { subscription: authSubscription },
//       } = supabase.auth.onAuthStateChange((_event, newSession) => {
//         if (mounted) {
//           setSession(newSession);
//           setInitializing(false);
//         }
//       });
//       subscription = authSubscription;
//     } catch (err) {
//       console.error('Failed to set up auth state listener:', err);
//       if (mounted) {
//         setInitializing(false);
//       }
//     }

//     return () => {
//       mounted = false;
//       if (subscription) {
//         subscription.unsubscribe();
//       }
//     };
//   }, []);

//   const value = useMemo(
//     () => ({
//       session,
//       user: session?.user ?? null,
//       initializing,
//       signIn: (credentials) => supabase.auth.signInWithPassword(credentials),
//       signUp: (credentials) => supabase.auth.signUp(credentials),
//       signOut: () => supabase.auth.signOut(),
//     }),
//     [session, initializing]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
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
        if (!supabase || !supabase.auth) {
          console.warn('Supabase client not properly initialized');
          if (mounted) {
            setSession(null);
            setInitializing(false);
          }
          return;
        }

        const { data } = await supabase.auth.getSession();
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

  // ⭐ UPDATED SIGNUP FUNCTION
  const signUp = async ({ username, fullName, email, password }) => {
    try {
      // 1️⃣ Create user inside Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        return { error: signUpError };
      }

      const user = data?.user;
      if (!user) {
        return { error: new Error("User creation failed.") };
      }

      // 2️⃣ Insert into profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        full_name: fullName,
        email,
      });

      if (profileError) {
        console.error("Profile insert failed:", profileError);
        return { error: profileError };
      }

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // ⭐ NEW LOGIN (Instagram-style: Email OR Username)
  const signInWithIdentifier = async (identifier, password) => {
    try {
      let emailToUse = identifier;

      // 1️⃣ If identifier is NOT an email → look up username in profiles table
      if (!identifier.includes("@")) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .single();

        if (error || !profile) {
          return { error: { message: "Username not found." } };
        }

        emailToUse = profile.email;
      }

      // 2️⃣ Login with email + password
      return await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

    } catch (err) {
      return { error: err };
    }
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,

      // ⭐ Instagram-style login
      signInWithIdentifier,

      // Normal email/password signup
      signIn: (credentials) => supabase.auth.signInWithPassword(credentials),

      // Updated signup logic
      signUp,

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

