
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Tipləri export edərkən də 'type' istifadə etmək daha təhlükəsizdir
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;