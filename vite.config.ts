import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/gemini/reflect', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { quoteText, author, discipline, contextNote } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                synthesis: `This quote by ${author} highlights how human perception, language, and internal states shape our experience of reality.`,
                crossParadigmInsight: `When viewed through Neurolinguistic Programming, Systems Theory, and Patristic theology, we see a unified truth: changing the inner context or structural representation fundamentally reorganizes outer experience.`,
                practicalAction: `Pause today whenever you feel reactive. Ask yourself: 'Am I reacting to the territory itself, or merely my map/evaluation of it?'`,
              }));
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
            });

            const prompt = `
You are a master scholar in Neurolinguistic Programming (NLP), General Semantics, Systems Theory, Werner Erhard's Ontological Inquiry, Gospel logia, and Early Church Fathers (Patristics).

Analyze the following quote:
Quote: "${quoteText}"
Author: ${author}
Discipline: ${discipline}
Context: ${contextNote || 'N/A'}

Provide a structured, deep, highly illuminating synthesis in JSON format with exactly 3 keys:
1. "synthesis": A concise (2-3 sentences) philosophical breakdown of the quote's core mechanics.
2. "crossParadigmInsight": A profound connection (2-3 sentences) bridging this quote with another discipline.
3. "practicalAction": One concrete, 1-sentence contemplative practice or reframing micro-exercise.

Respond ONLY with valid JSON.
`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: prompt,
              config: { responseMimeType: 'application/json' },
            });

            res.setHeader('Content-Type', 'application/json');
            return res.end(response.text || '{}');
          } catch (err: any) {
            console.error('API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      server.middlewares.use('/api/gemini/generate-quote', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end('Method Not Allowed');
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { discipline, author, topic } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                quote: `In any system, when you alter the context of evaluation, the problem ceases to exist in its original form and becomes a catalyst for transformation.`,
                author: author || 'Modern Synthesis',
                discipline: discipline || 'systems_theory',
                contextNote: `Generated synthesis on ${topic || 'Transformation'}.`,
              }));
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
            });

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
              config: { responseMimeType: 'application/json' },
            });

            res.setHeader('Content-Type', 'application/json');
            return res.end(response.text || '{}');
          } catch (err: any) {
            console.error('API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
