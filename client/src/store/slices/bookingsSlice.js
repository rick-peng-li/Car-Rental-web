import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '@/services/bookingService';

const initialState = {
  bookings: [],
  status: 'idle',
  submitting: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getMine();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await bookingService.create(payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await bookingService.cancel(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    resetBookings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.submitting = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload ? { ...booking, status: 'cancelled' } : booking
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
