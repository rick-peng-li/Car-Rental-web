import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { carService } from '@/services/carService';

const initialState = {
  cars: [],
  status: 'idle',
  mutationLoading: false,
  error: null,
};

const toRejected = (error) => error.message;

export const fetchCars = createAsyncThunk('cars/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await carService.getAll();
  } catch (error) {
    return rejectWithValue(toRejected(error));
  }
});

export const addCar = createAsyncThunk('cars/add', async (payload, { rejectWithValue }) => {
  try {
    return await carService.create(payload);
  } catch (error) {
    return rejectWithValue(toRejected(error));
  }
});

export const updateCar = createAsyncThunk(
  'cars/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await carService.update(id, payload);
    } catch (error) {
      return rejectWithValue(toRejected(error));
    }
  }
);

export const removeCar = createAsyncThunk('cars/remove', async (id, { rejectWithValue }) => {
  try {
    await carService.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(toRejected(error));
  }
});

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCar.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.cars.unshift(action.payload);
      })
      .addCase(addCar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCar.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.cars = state.cars.map((car) =>
          car._id === action.payload._id ? action.payload : car
        );
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      })
      .addCase(removeCar.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(removeCar.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.cars = state.cars.filter((car) => car._id !== action.payload);
      })
      .addCase(removeCar.rejected, (state, action) => {
        state.mutationLoading = false;
        state.error = action.payload;
      });
  },
});

export default carsSlice.reducer;
