import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, subjectId: 1 });
noteSchema.index({ userId: 1, isPinned: 1 });
noteSchema.index({ userId: 1, isFavorite: 1 });
noteSchema.index({ tags: 1 });

export default mongoose.model('Note', noteSchema);
