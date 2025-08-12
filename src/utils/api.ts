
// FastAPI integration utilities
// Replace these URLs with your actual FastAPI backend endpoints

const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || '/api';

export interface Session {
  id: number;
  session_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface Kramamk {
  id: number;
  session_id: number;
  kramamk_number: string;
  title: string;
  date: string;
  type: string;
}

export interface Debate {
  id: number;
  session_id: number;
  kramamk_id: number;
  debate_title: string;
  speaker: string;
  date: string;
  duration: string;
  content: string;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  phone_number?: string;
  department?: string;
  position?: string;
  profile_image_url?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  message: string;
}

// API functions for FastAPI integration
export const apiService = {
  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    
    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    const username = localStorage.getItem('authUser');
    if (!username) throw new Error('No authentication token');
    
    const response = await fetch(`${API_BASE_URL}/user/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch current user');
    const userData = await response.json();
    
    // Convert to User format
    return {
      user_id: userData.user_id,
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      is_active: userData.is_active,
      is_verified: true, // Default to true for now
      phone_number: userData.phone_number,
      department: userData.department,
      position: userData.position,
      profile_image_url: undefined,
      last_login: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },

  // Kramamk
  async getKramamk(): Promise<Kramamk[]> {
    const response = await fetch(`${API_BASE_URL}/kramamk`);
    if (!response.ok) throw new Error('Failed to fetch kramamk');
    return response.json();
  },

  async createKramamk(kramamk: Omit<Kramamk, 'id'>): Promise<Kramamk> {
    const response = await fetch(`${API_BASE_URL}/kramamk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kramamk),
    });
    if (!response.ok) throw new Error('Failed to create kramamk');
    return response.json();
  },

  // Debates
  async getDebates(): Promise<Debate[]> {
    const response = await fetch(`${API_BASE_URL}/debates`);
    if (!response.ok) throw new Error('Failed to fetch debates');
    return response.json();
  },

  async updateDebate(id: number, debate: Partial<Debate>): Promise<Debate> {
    const response = await fetch(`${API_BASE_URL}/debates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debate),
    });
    if (!response.ok) throw new Error('Failed to update debate');
    return response.json();
  },

  async createDebate(debate: Omit<Debate, 'id'>): Promise<Debate> {
    const response = await fetch(`${API_BASE_URL}/debates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debate),
    });
    if (!response.ok) throw new Error('Failed to create debate');
    return response.json();
  },
};

// Error handling wrapper
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
};
