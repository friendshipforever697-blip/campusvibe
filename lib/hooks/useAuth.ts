import { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing authentication
    const checkAuth = async () => {
      // For now, we'll just simulate a quick check and set to not authenticated
      setTimeout(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      }, 100);
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}