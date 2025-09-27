export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserData extends CreateUserData {
  id: number;
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}