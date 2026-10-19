import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const AuthContext = createContext();

const DEMO_USER_STORAGE_KEY = 'soncaney_demo_user';

/**
 * Validates password strength:
 * - At least 6 characters
 * - At least one letter (a-z, A-Z)
 * - At least one number (0-9)
 * - At least one symbol (!@#$%^&*...)
 */
export const validatePassword = (password) => {
  const str = String(password || '');
  const hasLetter = /[a-zA-Z]/.test(str);
  const hasNumber = /[0-9]/.test(str);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(str);
  const hasLength = str.length >= 6;

  if (!hasLength) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long.',
      hasLetter,
      hasNumber,
      hasSymbol,
      hasLength,
    };
  }

  if (!hasLetter || !hasNumber || !hasSymbol) {
    const missing = [];
    if (!hasLetter) missing.push('at least one letter');
    if (!hasNumber) missing.push('at least one number');
    if (!hasSymbol) missing.push('at least one symbol (e.g. !@#$%)');

    return {
      isValid: false,
      message: `Password must include ${missing.join(', ')}.`,
      hasLetter,
      hasNumber,
      hasSymbol,
      hasLength,
    };
  }

  return {
    isValid: true,
    message: '',
    hasLetter: true,
    hasNumber: true,
    hasSymbol: true,
    hasLength: true,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (!isSupabaseConfigured || !supabase) {
          // Check for stored demo user
          const storedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (storedDemo && mounted) {
            const parsed = JSON.parse(storedDemo);
            setUser(parsed);
            setIsAuthenticated(true);
          }
          if (mounted) setIsLoadingAuth(false);
          return;
        }

        // Get current Supabase session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Supabase getSession error:', error);
        }

        if (currentSession?.user && mounted) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
        } else {
          // Fallback to local demo user if present
          const storedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (storedDemo && mounted) {
            try {
              const parsed = JSON.parse(storedDemo);
              setUser(parsed);
              setIsAuthenticated(true);
            } catch (e) {
              localStorage.removeItem(DEMO_USER_STORAGE_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (mounted) {
          setIsLoadingAuth(false);
        }
      }
    }

    initializeAuth();

    // Listen to Supabase auth state changes
    let authListener = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
          setIsAuthenticated(true);
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        } else {
          // If no active supabase session, check demo user
          const storedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (storedDemo) {
            try {
              setUser(JSON.parse(storedDemo));
              setIsAuthenticated(true);
            } catch {
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
        setIsLoadingAuth(false);
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // 1. Log in with Supabase Email & Password
  const login = async (email, password) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase client is not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { data: null, error };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAuthenticated(true);
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      return { data, error: null };
    } catch (err) {
      const errMsg = err.message || 'Login failed';
      setAuthError(errMsg);
      return { data: null, error: err };
    }
  };

  // 2. Sign up with Supabase Email, Password & Profile Data
  const signUp = async (email, password, { fullName, phone } = {}) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Supabase client is not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName || '',
            phone: phone || '',
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { data: null, error };
      }

      // If Supabase has email confirmation enabled, data.session might be null
      if (data.session) {
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
      }

      return {
        data,
        error: null,
        requiresConfirmation: !data.session,
      };
    } catch (err) {
      const errMsg = err.message || 'Sign up failed';
      setAuthError(errMsg);
      return { data: null, error: err };
    }
  };

  // 3. Quick Demo / Test User Login (allows instant testing of the orders system)
  const loginAsDemo = (email = 'isra@soncaney.co.uk', name = 'Israel Romero', phone = '+44 7700 900888') => {
    const demoUser = {
      id: `usr-demo-${Date.now()}`,
      email: email.toLowerCase(),
      user_metadata: {
        full_name: name,
        phone: phone,
      },
      is_demo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setIsAuthenticated(true);
    setAuthError(null);
    return demoUser;
  };

  // 4. Update Profile Data (Full Name, Phone)
  const updateProfile = async ({ fullName, phone }) => {
    setAuthError(null);
    try {
      if (user?.is_demo || !isSupabaseConfigured || !supabase) {
        const updatedUser = {
          ...user,
          user_metadata: {
            ...user?.user_metadata,
            full_name: fullName !== undefined ? fullName : user?.user_metadata?.full_name,
            phone: phone !== undefined ? phone : user?.user_metadata?.phone,
          },
        };
        localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { data: { user: updatedUser }, error: null };
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
        },
      });

      if (error) {
        setAuthError(error.message);
        return { data: null, error };
      }

      if (data?.user) {
        setUser(data.user);
      }
      return { data, error: null };
    } catch (err) {
      const errMsg = err.message || 'Failed to update profile';
      setAuthError(errMsg);
      return { data: null, error: err };
    }
  };

  // 5. Update Password with strict requirements
  const updatePassword = async (newPassword) => {
    setAuthError(null);
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setAuthError(validation.message);
      return { data: null, error: new Error(validation.message) };
    }

    try {
      if (user?.is_demo || !isSupabaseConfigured || !supabase) {
        return { data: { success: true }, error: null };
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setAuthError(error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      const errMsg = err.message || 'Failed to update password';
      setAuthError(errMsg);
      return { data: null, error: err };
    }
  };

  // 6. Log out
  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    } finally {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setAuthError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoadingAuth,
        authError,
        login,
        signUp,
        updateProfile,
        updatePassword,
        validatePassword,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
