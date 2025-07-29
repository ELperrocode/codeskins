import mongoose, { Document, Schema } from 'mongoose';

export interface ILicense extends Document {
  name: string;
  description: string;
  price: number; // Price for this license type
  maxSales?: number; // Maximum number of sales allowed (-1 for unlimited)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const licenseSchema = new Schema<ILicense>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  maxSales: {
    type: Number,
    default: -1, // -1 means unlimited sales
    min: -1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes
licenseSchema.index({ isActive: 1 });
licenseSchema.index({ price: 1 });

export const License = mongoose.model<ILicense>('License', licenseSchema); 