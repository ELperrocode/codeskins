import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  stripePaymentId: string;
  stripeSessionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  customerEmail: string;
  templateTitle: string;
  sellerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'usd',
    uppercase: true,
  },
  stripePaymentId: {
    type: String,
    required: true,
    unique: true,
  },
  stripeSessionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  templateTitle: {
    type: String,
    required: true,
  },
  sellerEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
}, {
  timestamps: true,
});

// Create indexes
orderSchema.index({ customerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ templateId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ stripePaymentId: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema); 