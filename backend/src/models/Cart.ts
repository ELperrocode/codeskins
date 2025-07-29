import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  templateId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  previewImages?: string[];
  category?: string;
  tags?: string[];
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string; // For guest users
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  previewImages: [{ type: String }],
  category: { type: String },
  tags: [{ type: String }]
});

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String }, // For guest users
  items: [cartItemSchema],
  total: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema); 