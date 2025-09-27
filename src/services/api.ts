import axios from 'axios';
import { LoginData, AuthResponse, UsersResponse, CreateUserData, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (API_KEY) {
    config.headers['X-API-Key'] = API_KEY;
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
  
  updateUser: async (userId: number, userData: CreateUserData): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};