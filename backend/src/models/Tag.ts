import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  templateCount: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 150,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  templateCount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    validate: {
      validator: function(v: string) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Color must be a valid hex color'
    }
  },
}, {
  timestamps: true,
});

// Create indexes
tagSchema.index({ slug: 1 });
tagSchema.index({ isActive: 1 });
tagSchema.index({ templateCount: -1 });

export const Tag = mongoose.model<ITag>('Tag', tagSchema); 