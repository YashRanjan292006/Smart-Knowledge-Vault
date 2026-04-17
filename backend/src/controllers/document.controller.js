const Document = require('../models/Document');
const Chunk = require('../models/Chunk');
const { extractText, chunkText } = require('../services/extraction.service');
const { generateEmbedding } = require('../services/embedding.service');
const fs = require('fs');

// @desc    Upload document, extract text, chunk, embed, and store
// @route   POST /api/docs/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 1. Create Initial Document Record
    const newDoc = await Document.create({
      userId: req.user._id,
      title: req.body.title || req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      status: 'PROCESSING'
    });

    // Respond immediately for great UX. Async processing continues in background.
    res.status(202).json({ 
      message: 'Document uploaded and processing has started', 
      documentId: newDoc._id 
    });

    // Run processing in background
    processDocument(newDoc, req.user._id);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processDocument = async (doc, userId) => {
  try {
    // 2. Extract Text
    const rawText = await extractText(doc.filePath, doc.mimeType);

    // 3. Chunk Text
    const chunks = chunkText(rawText);

    // 4. Generate Embeddings & Prepare for MongoDB Atlas Vector storing
    const chunkDocs = [];
    for (let i = 0; i < chunks.length; i++) {
        const text = chunks[i];
        const embedding = await generateEmbedding(text);
        
        chunkDocs.push({
            documentId: doc._id,
            userId: userId,
            text: text,
            embedding: embedding,
            chunkIndex: i
        });
    }

    // Batch insert chunks
    await Chunk.insertMany(chunkDocs);

    // 5. Update Status
    await Document.findByIdAndUpdate(doc._id, { status: 'COMPLETED' });

  } catch (error) {
    console.error(`Document Processing Error [${doc._id}]:`, error);
    await Document.findByIdAndUpdate(doc._id, { 
      status: 'FAILED',
      errorLogs: error.message 
    });
  }
};

// @desc    Get User Documents
// @route   GET /api/docs
// @access  Private
const getDocuments = async (req, res) => {
    try {
        const docs = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadDocument, getDocuments };
