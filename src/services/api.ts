import axios from 'axios';
import { LoginData, AuthResponse, UsersResponse, CreateUserData, UpdateUserData, User } from '../types';

const API_BASE_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },
};

export const usersApi = {
  getUsers: async (page: number = 1): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>(`/users?page=${page}`);
    return response.data;
  },
  
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },
  
  updateUser: async (userId: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};