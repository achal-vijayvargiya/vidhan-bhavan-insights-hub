
// FastAPI integration utilities
// Replace these URLs with your actual FastAPI backend endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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

// API functions for FastAPI integration
export const apiService = {
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
