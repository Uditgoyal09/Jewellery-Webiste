import mongoose from 'mongoose';

const contactQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    subject: { type: String, default: null },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);
