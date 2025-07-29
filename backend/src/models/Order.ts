import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  templateId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  currency: string;
  stripePaymentId: string;
  stripeSessionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  customerEmail: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 }
});

const orderSchema = new Schema<IOrder>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  stripePaymentId: { type: String, required: true },
  stripeSessionId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'stripe' },
  customerEmail: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ stripePaymentId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ ownerId: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema); 