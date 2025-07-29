import mongoose, { Document, Schema } from 'mongoose';

export interface IDownload extends Document {
  userId: string;
  templateId: string;
  licenseId: string;
  downloadCount: number;
  maxDownloads: number; // Copied from license for reference
  lastDownloadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const downloadSchema = new Schema<IDownload>({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  templateId: {
    type: String,
    ref: 'Template',
    required: true,
  },
  licenseId: {
    type: String,
    ref: 'License',
    required: true,
  },
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  maxDownloads: {
    type: Number,
    required: true,
    min: -1, // -1 means unlimited
  },
  lastDownloadAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create compound index to ensure one record per user-template-license combination
downloadSchema.index({ userId: 1, templateId: 1, licenseId: 1 }, { unique: true });

// Create indexes for efficient queries
downloadSchema.index({ userId: 1 });
downloadSchema.index({ templateId: 1 });
downloadSchema.index({ licenseId: 1 });

export const Download = mongoose.model<IDownload>('Download', downloadSchema); 