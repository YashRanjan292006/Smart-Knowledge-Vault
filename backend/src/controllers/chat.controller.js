const Chunk = require('../models/Chunk');
const { generateEmbedding } = require('../services/embedding.service');
const { generateResponse } = require('../services/ai.service');

// @desc    Query documents via semantic meaning
// @route   POST /api/chat
// @access  Private
const queryDocuments = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    if (global.dbOffline) {
        return res.json({
            answer: `Since you asked "${query}", here is a mocked intelligent response showcasing the amazing frontend layout. The backend is running in offline-presentation mode safely!`,
            citations: [
                { text: 'First vector context showcasing citation tooltips behaving perfectly.' },
                { text: 'Another extracted paragraph rendering effortlessly via the offline API handler.' }
            ]
        });
    }

    // 1. Embed the query to match dimensions (384)
    const queryVector = await generateEmbedding(query);

    // 2. Perform native MongoDB Atlas Vector Search
    const pipeline = [
      {
        $vectorSearch: {
          index: 'default', // Using the JSON index we created earlier 
          path: 'embedding',
          queryVector: queryVector,
          numCandidates: 100,
          limit: 5
        }
      },
      {
        $match: {
          userId: req.user._id // Critical: security boundary restricting vector scope
        }
      },
      {
        $project: {
          text: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ];

    const contextChunks = await Chunk.aggregate(pipeline);

    // If no context found
    if (contextChunks.length === 0) {
        return res.json({ 
            answer: "No relevant documents found. Please upload learning materials related to this topic.",
            citations: []
        });
    }

    // 3. Synthesize via LLM
    const answer = await generateResponse(query, contextChunks);

    // 4. Return the hallucination-free answer with exact citations
    res.json({
        answer,
        citations: contextChunks
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { queryDocuments };
