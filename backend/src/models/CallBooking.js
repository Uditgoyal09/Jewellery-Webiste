import mongoose from 'mongoose';

const callBookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferredDate: { type: String, default: null },
    preferredTime: { type: String, default: null },
    message: { type: String, default: null },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const CallBooking = mongoose.model('CallBooking', callBookingSchema);
