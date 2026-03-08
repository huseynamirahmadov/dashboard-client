import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios'; 
import type { AuthState, AuthResponse } from '../types'; 

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData: any, { rejectWithValue }) => {
    try {
      // Backend (AuthController) mütləq 'username' gözləyir
      const payload = {
        username: formData.username, // Burada 'name' yox, 'username' olmalıdır
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const response = await api.post('/register', payload);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errors = errorData.errors as Record<string, string[]>;
        const firstErrorArray = Object.values(errors)[0];
        return rejectWithValue(firstErrorArray[0]);
      }
      return rejectWithValue(errorData?.message || 'An error occurred during registration');
    }
  }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>('/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const getUser = createAsyncThunk(
    'auth/user',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user data');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.token = null;
                localStorage.removeItem('token');
            })
            .addCase(getUser.pending, (state) => { state.loading = true; })
            .addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                localStorage.removeItem('token');
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;