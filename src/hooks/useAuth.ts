import { useState, useEffect } from 'react';
import { apiService, User } from '@/utils/api';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const currentUser = await apiService.getCurrentUser();
          setIsAuthenticated(true);
          setUser(currentUser);
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.login({ username, password });
      
      // Store authentication data
      localStorage.setItem('authToken', response.user_id); // Using user_id as token for now
      localStorage.setItem('authUser', response.username);
      localStorage.setItem('isAuthenticated', 'true');
      
      setIsAuthenticated(true);
      
      // Convert response to User format
      const user: User = {
        user_id: response.user_id,
        username: response.username,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        role: response.role,
        is_active: response.is_active,
        is_verified: true, // Default to true for now
        phone_number: undefined,
        department: undefined,
        position: undefined,
        profile_image_url: undefined,
        last_login: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser(user);
      
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error,
  };
}; 