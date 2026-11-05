const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

// Create compound text index for keyword search across title & content
noteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
