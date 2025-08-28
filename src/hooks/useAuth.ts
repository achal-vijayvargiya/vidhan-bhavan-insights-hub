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
      
      // Backend returns { user: {...}, message: "Login successful" }
      // No success field, so we check if user exists
      if (!response.user) {
        throw new Error(response.message || 'Login failed');
      }

      // Get the user data from the response
      const userData = response.user;
      
      // Store authentication data
      localStorage.setItem('authToken', userData.user_id);
      localStorage.setItem('authUser', userData.username);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Convert response to User format
      const user: User = {
        user_id: userData.user_id.toString(),
        username: userData.username,
        email: userData.email || '',
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        is_active: true,
        is_verified: true,
        phone_number: undefined,
        department: undefined,
        position: undefined,
        profile_image_url: undefined,
        last_login: undefined,
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString()
      };
      
      // Set user first, then authentication status
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('Login successful, user:', user);
      console.log('isAuthenticated set to true');
      
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