import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '../../services/api';
import { User, CreateUserData, UpdateUserData, UsersResponse } from '../../types';

interface UsersState {
  users: User[];
  filteredUsers: User[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  itemsPerPage: number;
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  searchTerm: '',
  itemsPerPage: 6,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await usersApi.getUsers(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      const response = await usersApi.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }: UpdateUserData, { rejectWithValue }) => {
    try {
      await usersApi.updateUser(id, userData);
      return { id, ...userData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      
      if (action.payload.trim() === '') {
        state.filteredUsers = state.users;
      } else {
        const searchLower = action.payload.toLowerCase();
        state.filteredUsers = state.users.filter(user =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
        );
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.users = [...state.users, ...action.payload.data];
        state.filteredUsers = state.searchTerm ? 
          state.filteredUsers : [...state.users, ...action.payload.data];
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const newUser = { ...action.payload, id: Date.now() };
        state.users.unshift(newUser);
        if (!state.searchTerm || 
            newUser.first_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            newUser.last_name.toLowerCase().includes(state.searchTerm.toLowerCase())) {
          state.filteredUsers.unshift(newUser);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, ...userData } = action.payload;
        const userIndex = state.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], ...userData };
        }
        const filteredIndex = state.filteredUsers.findIndex(user => user.id === id);
        if (filteredIndex !== -1) {
          state.filteredUsers[filteredIndex] = { ...state.filteredUsers[filteredIndex], ...userData };
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        const userId = action.payload;
        state.users = state.users.filter(user => user.id !== userId);
        state.filteredUsers = state.filteredUsers.filter(user => user.id !== userId);
      });
  },
});

export const { setSearchTerm, setCurrentPage, clearError } = usersSlice.actions;
export default usersSlice.reducer;