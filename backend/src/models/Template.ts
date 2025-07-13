import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  fileUrl: string;
  previewImage?: string;
  isActive: boolean;
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['landing-page', 'ecommerce', 'blog', 'portfolio', 'dashboard', 'other'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  fileUrl: {
    type: String,
    required: true,
  },
  previewImage: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes
templateSchema.index({ sellerId: 1 });
templateSchema.index({ category: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ isActive: 1 });
templateSchema.index({ price: 1 });
templateSchema.index({ rating: 1 });
templateSchema.index({ createdAt: -1 });

// Text search index
templateSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
});

export const Template = mongoose.model<ITemplate>('Template', templateSchema); 