let pipeline;

/**
 * Initializes the feature-extraction pipeline using a lightweight all-MiniLM-L6-v2.
 * This runs locally in Node.js, providing completely free embeddings without external API limits.
 */
const initPipeline = async () => {
  if (!pipeline) {
    // Dynamic import to support ES Modules in CommonJS
    const transformers = await import('@xenova/transformers');
    pipeline = await transformers.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return pipeline;
};

/**
 * Generates a semantic vector representation (embedding) for a specific text chunk.
 */
const generateEmbedding = async (text) => {
  try {
    const extractor = await initPipeline();
    // Use mean pooling and normalization for high-quality sentence embeddings
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // Convert TypedArray to standard JavaScript Array for MongoDB
    return Array.from(output.data);
  } catch (error) {
    console.error('Embedding Error:', error);
    throw new Error('Failed to generate vector embedding.');
  }
};

module.exports = { generateEmbedding };
