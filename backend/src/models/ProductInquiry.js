import mongoose from 'mongoose';

const productInquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null },
    inquiryType: { type: String, enum: ['buy', 'custom'], required: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'contacted', 'closed'], default: 'pending' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const ProductInquiry = mongoose.model('ProductInquiry', productInquirySchema);
