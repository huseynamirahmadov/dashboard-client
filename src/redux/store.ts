
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tradeReducer from './slices/tradeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        trades: tradeReducer,
    },
});

// Tipləri export edərkən də 'type' istifadə etmək daha təhlükəsizdir
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;