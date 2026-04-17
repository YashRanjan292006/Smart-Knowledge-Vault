const { GoogleGenAI } = require('@google/genai');

const generateResponse = async (query, contextChunks) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in .env");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Stuff context into prompt securely preventing prompt injection
    const contextText = contextChunks.map((c, i) => `[Source ${i+1}]: ${c.text}`).join('\n\n');
    
    const prompt = `
You are an expert AI assistant for the Smart Knowledge Vault platform. 
Answer the user's query using ONLY the provided document context below. 
If the answer is not contained in the context, politely state that you do not have that information.
Always cite your sources using the source numbers provided (e.g. "According to [Source 1]...").
Format your output in clean Markdown.

Context:
${contextText}

User Query: ${query}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('LLM Generation Error:', error);
    throw new Error('Failed to generate answer from Gemini.');
  }
};

module.exports = { generateResponse };
