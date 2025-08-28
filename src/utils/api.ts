import axios from "axios"

const API_BASE = (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") || "/api"

export interface User {
  user_id: string;  // Keep as user_id to match backend response
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
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

export const apiService = {
  async login(credentials: { username: string; password: string }) {
    const response = await api.post('/users/login', credentials);
    // Ensure we get the raw response data first
    const data = response.data;
    
    // If the response has a nested user object, convert UUID to string
    if (data.user && data.user.user_id) {
      data.user.user_id = data.user.user_id.toString();
    }
    
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('authUser');
    if (!token || !username) {
      throw new Error('No auth token or username found');
    }
    const response = await api.get(`/users/me?username=${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = response.data;
    
    // Convert UUID to string if present
    if (data.user_id) {
      data.user_id = data.user_id.toString();
    }
    
    return data;
  }
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)