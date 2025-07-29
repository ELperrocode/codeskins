import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  templateId: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  isVerified: boolean; // Whether the user has purchased/downloaded the template
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create compound index to ensure one review per user per template
reviewSchema.index({ userId: 1, templateId: 1 }, { unique: true });

// Create indexes for efficient queries
reviewSchema.index({ templateId: 1, isActive: 1 });
reviewSchema.index({ userId: 1, isActive: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema); 