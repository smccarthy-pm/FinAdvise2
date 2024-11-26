import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['client', 'prospect', 'partner'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead'],
    default: 'lead'
  },
  notes: {
    type: String,
    trim: true
  },
  lastContact: {
    type: Date
  },
  nextFollowUp: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

contactSchema.index({ userId: 1, email: 1 }, { unique: true });
contactSchema.index({ userId: 1, type: 1 });
contactSchema.index({ userId: 1, status: 1 });

export const Contact = mongoose.model('Contact', contactSchema);