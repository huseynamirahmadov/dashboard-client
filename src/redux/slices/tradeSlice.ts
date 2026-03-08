import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { TradeData } from '../../types/trade.types';

interface TradeState {
    trades: TradeData[];
    loading: boolean;
    error: string | null;
}

const initialState: TradeState = {
    trades: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchTrades = createAsyncThunk(
    'trades/fetchTrades',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/trades');
            return response.data as TradeData[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch trades');
        }
    }
);

export const createTrade = createAsyncThunk(
    'trades/createTrade',
    async (tradeData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/trades', tradeData);
            return response.data; // Server might return the created trade, but we will re-fetch or append
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create trade');
        }
    }
);

export const updateTrade = createAsyncThunk(
    'trades/updateTrade',
    async ({ id, tradeData }: { id: number; tradeData: any }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/trades/${id}`, tradeData);
            return { id, data: response.data }; // Assume success
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update trade');
        }
    }
);

export const deleteTrade = createAsyncThunk(
    'trades/deleteTrade',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/trades/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete trade');
        }
    }
);

const tradeSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        clearTradeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchTrades
            .addCase(fetchTrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrades.fulfilled, (state, action: PayloadAction<TradeData[]>) => {
                state.loading = false;
                state.trades = action.payload;
            })
            .addCase(fetchTrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // createTrade
            .addCase(createTrade.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTrade.fulfilled, (state) => {
                state.loading = false;
                // Note: instead of pushing, we can either return the exact trade or expect component to refetch
                // Based on UI behavior, component calls refetch after success.
            })
            .addCase(createTrade.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // updateTrade
            .addCase(updateTrade.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrade.fulfilled, (state) => {
                state.loading = false;
                // Component will trigger refetch, or we can update directly if API returns full trade
            })
            .addCase(updateTrade.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // deleteTrade
            .addCase(deleteTrade.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrade.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.trades = state.trades.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTrade.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearTradeError } = tradeSlice.actions;
export default tradeSlice.reducer;
