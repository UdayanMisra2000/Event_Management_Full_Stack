import mongoose from 'mongoose'
import validator from 'validator'

const TimeSlotSchema = new mongoose.Schema(
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    { _id: false }
  );
  
  const AvailabilitySchema = new mongoose.Schema(
    {
      Sun: { type: [TimeSlotSchema], default: [] }, // Sunday unavailable by default
      Mon: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
      Tue: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
      Wed: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
      Thu: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
      Fri: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
      Sat: { type: [TimeSlotSchema], default: [{ from: "", to: "" }] },
    },
    { _id: false }
  );

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    category: {
        type: String,
        enum: [
            'Sales',
            'Education',
            'Finance',
            'Government&Politics',
            'Consulting',
            'Recruiting',
            'Tech',
            'Marketing',
        ],
    },
    availability: {
        type: AvailabilitySchema,
        default: {
          Sun: [],
          Mon: [{ from: "", to: "" }],
          Tue: [{ from: "", to: "" }],
          Wed: [{ from: "", to: "" }],
          Thu: [{ from: "", to: "" }],
          Fri: [{ from: "", to: "" }],
          Sat: [{ from: "", to: "" }],
        },
      },
}, { timestamps: true });

const Users = mongoose.model('User', userSchema);

export default Users;