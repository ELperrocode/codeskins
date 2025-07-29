import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
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
}, {
  timestamps: true,
});

// Create compound index to ensure one favorite per user per template
favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

// Create indexes for efficient queries
favoriteSchema.index({ userId: 1 });
favoriteSchema.index({ templateId: 1 });
favoriteSchema.index({ createdAt: -1 });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema); 