import { useState, useEffect } from 'react';
import { SiweAuth, type SiweAuthState } from '../lib/siwe';

export function useSiwe() {
  const [authState, setAuthState] = useState<SiweAuthState>({
    isAuthenticated: false,
    address: null,
    message: null,
    nonce: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const siweAuth = SiweAuth.getInstance();
    
    // Set initial state
    setAuthState(siweAuth.getState());

    // Subscribe to state changes
    const unsubscribe = siweAuth.subscribe((newState) => {
      setAuthState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authenticate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const siweAuth = SiweAuth.getInstance();
      const success = await siweAuth.authenticate();
      
      if (!success) {
        setError('Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    const siweAuth = SiweAuth.getInstance();
    await siweAuth.signOut();
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    ...authState,
    isLoading,
    error,
    authenticate,
    signOut,
    clearError,
  };
}
