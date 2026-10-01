import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
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
  url: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['link', 'pdf'],
    default: 'link',
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
resourceSchema.index({ userId: 1, subjectId: 1 });
resourceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Resource', resourceSchema);
