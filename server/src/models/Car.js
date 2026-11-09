import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false }
);

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image url is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      trim: true,
    },
    rentPerHour: {
      type: Number,
      required: [true, 'Rent per hour is required'],
      min: [0, 'Rent per hour cannot be negative'],
    },
    bookedTimeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Car = mongoose.model('Car', carSchema);
