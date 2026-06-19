import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    calories: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

export const Food = mongoose.model('Food', foodSchema);
