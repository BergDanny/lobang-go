import apiClient from '../lib/api-client';
import type { ApiResponse, AuthData, LoginCredentials, RegisterData, Quest } from '../types/api';

// Helper function to handle API responses
const handleResponse = <T>(response: { data: ApiResponse<T> }): T => {
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'An error occurred');
};

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<AuthData> => {
    const response = await apiClient.post<ApiResponse<AuthData[]>>('/auth/register', data);
    const result = handleResponse<AuthData[]>(response);
    // Backend returns array with one AuthData object, get first item
    const authData = Array.isArray(result) && result.length > 0 ? result[0] : result;
    
    if (!authData || typeof authData !== 'object' || !authData.token) {
      throw new Error('Invalid response format from server');
    }
    
    // Store token and user
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  },

  login: async (credentials: LoginCredentials): Promise<AuthData> => {
    const response = await apiClient.post<ApiResponse<AuthData[]>>('/auth/login', credentials);
    const result = handleResponse<AuthData[]>(response);
    // Backend returns array with one AuthData object, get first item
    const authData = Array.isArray(result) && result.length > 0 ? result[0] : result;
    
    if (!authData || typeof authData !== 'object' || !authData.token) {
      throw new Error('Invalid response format from server');
    }
    
    // Store token and user
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  },

  logout: async (): Promise<void> => {
    await apiClient.delete('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

// Quest API
export const questApi = {
  getAll: async (): Promise<Quest[]> => {
    const response = await apiClient.get<ApiResponse<Quest[]>>('/quests');
    return handleResponse<Quest[]>(response);
  },

  getById: async (id: string): Promise<Quest> => {
    const response = await apiClient.get<ApiResponse<Quest>>(`/quests/${id}`);
    return handleResponse<Quest>(response);
  },

  create: async (data: Partial<Quest>): Promise<Quest> => {
    const response = await apiClient.post<ApiResponse<Quest>>('/quests', data);
    return handleResponse<Quest>(response);
  },

  update: async (id: string, data: Partial<Quest>): Promise<Quest> => {
    const response = await apiClient.put<ApiResponse<Quest>>(`/quests/${id}`, data);
    return handleResponse<Quest>(response);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/quests/${id}`);
  },
};

