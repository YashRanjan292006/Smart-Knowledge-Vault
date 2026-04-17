const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  // MongoDB Atlas Vector Search doesn't require a strict schema type definition, 
  // but we enforce it as an array of Number.
  embedding: { type: [Number], required: true }, 
  chunkIndex: { type: Number, required: true },
  metadata: {
    pageNumber: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Chunk', chunkSchema);
