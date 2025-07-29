import mongoose, { Document, Schema } from 'mongoose';

export interface ILicense extends Document {
  name: string;
  description: string;
  maxDownloads: number; // -1 for unlimited
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
  maxDownloads: {
    type: Number,
    required: true,
    default: 1,
    min: -1, // -1 means unlimited
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
licenseSchema.index({ maxDownloads: 1 });

export const License = mongoose.model<ILicense>('License', licenseSchema); 