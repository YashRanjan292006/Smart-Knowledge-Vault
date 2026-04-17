const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Extracts raw string text from diverse file types
 */
const extractText = async (filePath, mimeType) => {
  if (mimeType.includes('pdf')) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } else if (mimeType.includes('text')) {
    return fs.readFileSync(filePath, 'utf-8');
  } else {
    throw new Error('Unsupported extraction file type');
  }
};

/**
 * Intelligently chunks text by paragraphs up to an approximate token limit.
 * Perfect for semantic embedding preservation.
 */
const chunkText = (text, maxTokens = 500) => {
  // Normalize whitespace and split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = '';

  // Approximate tokens: 1 token ~= 4 chars of English text
  for (const paragraph of paragraphs) {
    if ((currentChunk.length + paragraph.length) / 4 > maxTokens) {
      if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());
      currentChunk = paragraph + '\n\n';
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

module.exports = { extractText, chunkText };
