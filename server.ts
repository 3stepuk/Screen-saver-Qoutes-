import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Lazy-initialize GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Route 1: Cross-Disciplinary Philosophical Mirror / Reflection
app.post('/api/gemini/reflect', async (req, res) => {
  try {
    const { quoteText, author, discipline, contextNote } = req.body;
    
    if (!quoteText || !author) {
      return res.status(400).json({ error: 'Quote text and author are required' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(200).json({
        synthesis: `This quote by ${author} highlights how human perception, language, and internal states shape our experience of reality.`,
        crossParadigmInsight: `When viewed through Neurolinguistic Programming, Systems Theory, and Patristic theology, we see a unified truth: changing the inner context or structural representation fundamentally reorganizes outer experience.`,
        practicalAction: `Pause today whenever you feel reactive. Ask yourself: 'Am I reacting to the territory itself, or merely my map/evaluation of it?'`,
      });
    }

    const prompt = `
You are a master scholar in Neurolinguistic Programming (NLP), General Semantics, Systems Theory, Werner Erhard's Ontological Inquiry, Gospel logia, and Early Church Fathers (Patristics).

Analyze the following quote:
Quote: "${quoteText}"
Author: ${author}
Discipline: ${discipline}
Context: ${contextNote || 'N/A'}

Provide a structured, deep, highly illuminating synthesis in JSON format with exactly 3 keys:
1. "synthesis": A concise (2-3 sentences) philosophical breakdown of the quote's core mechanics (e.g. how language, feedback, state, or ontology operates here).
2. "crossParadigmInsight": A profound connection (2-3 sentences) bridging this quote with another discipline (e.g., how Korzybski's Map vs Territory matches Gregory of Nyssa's Apophatic Wonder, or how Bandler's Reframing echoes Patristic Metanoia or Werner Erhard's Context vs Content).
3. "practicalAction": One concrete, 1-sentence contemplative practice or reframing micro-exercise the user can perform right now.

Respond ONLY with valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating reflection:', error);
    return res.status(500).json({
      error: 'Failed to generate reflection from Gemini AI',
      details: error.message,
    });
  }
});

// Route 2: Generate Original Quote in authentic tradition style
app.post('/api/gemini/generate-quote', async (req, res) => {
  try {
    const { discipline, author, topic } = req.body;

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(200).json({
        quote: `In any system, when you alter the context of evaluation, the problem ceases to exist in its original form and becomes a catalyst for transformation.`,
        author: author || 'Modern Synthesis',
        discipline: discipline || 'systems_theory',
        contextNote: `Generated synthesis on ${topic || 'Transformation'}.`,
      });
    }

    const prompt = `
Generate an original, deeply authentic, rigorous aphorism / quote inspired by ${author ? author : discipline} addressing the topic: "${topic || 'Human Transformation & Clarity'}".

Requirements:
1. Capture the exact vocabulary, structural rigor, and intellectual depth of the tradition (${discipline}).
2. Include a 1-sentence historical/epistemological context note explaining the quote's insight.
3. Return JSON with keys:
   - "quote": The generated quote text (15-30 words)
   - "author": "${author || 'Axiom Synthesis'}"
   - "discipline": "${discipline || 'nlp'}"
   - "contextNote": The 1-sentence context explanation

Respond ONLY with valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating custom quote:', error);
    return res.status(500).json({ error: 'Failed to generate custom quote' });
  }
});

// In production or when running standalone node server
const PORT = process.env.PORT || 3000;

// Export app or listen if standalone
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Axiom Studio Server running on port ${PORT}`);
});

export default app;
