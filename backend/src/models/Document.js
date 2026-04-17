const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  filePath: { type: String, required: true }, // Path to the file stored locally or S3
  status: { type: String, enum: ['PROCESSING', 'COMPLETED', 'FAILED'], default: 'PROCESSING' },
  errorLogs: { type: String }, // If processing failed
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
