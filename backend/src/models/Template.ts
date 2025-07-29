import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  tags: string[];
  fileUrl: string;
  previewImages?: string[];
  previewUrl?: string; // Live preview URL
  isActive: boolean;
  // License and download tracking
  licenseId: mongoose.Types.ObjectId;
  price: number; // Template-specific price (can override license price)
  downloads: number; // Current downloads
  maxDownloads: number; // -1 for unlimited
  // Metrics
  sales: number;
  rating: number;
  reviewCount: number;
  // Additional fields from CodeSkins
  features: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  fileUrl: { type: String, required: true },
  previewImages: [{ type: String }],
  previewUrl: { type: String }, // Live preview URL
  isActive: { type: Boolean, default: true },
  licenseId: { type: Schema.Types.ObjectId, ref: 'License', required: true },
  price: { type: Number, required: true, min: 0 },
  downloads: { type: Number, default: 0 },
  maxDownloads: { type: Number, default: -1 }, // -1 for unlimited
  sales: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  features: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' }
}, {
  timestamps: true
});

// Index for better query performance
templateSchema.index({ category: 1, isActive: 1 });
templateSchema.index({ ownerId: 1, isActive: 1 });
templateSchema.index({ price: 1 });
templateSchema.index({ rating: -1 });

export const Template = mongoose.model<ITemplate>('Template', templateSchema); 