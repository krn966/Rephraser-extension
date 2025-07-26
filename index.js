const express = require('express');
const fetch = require('node-fetch');
const { marked } = require('marked');
require('dotenv').config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not set in environment variables.');
  process.exit(1);
}

app.post('/rephrase', async (req, res) => {
  const { text } = req.body;
  console.log('=== REPHRASE REQUEST ===');
  console.log('Received text:', text);
  
  if (!text) {
    console.log('Error: Missing text in request body.');
    return res.status(400).send('Missing text in request body.');
  }
  
  try {
    const prompt = `Rephrase the following text. Only return the rephrased version, nothing else:\n\n${text}`;
    console.log('Prompt sent to Gemini:', prompt);
    
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });
    
    const geminiData = await geminiRes.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    
    const rephrasedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: No result from Gemini API.';
    console.log('Extracted rephrased text:', rephrasedText);
    
    // Format the output as HTML using marked (React Markdown compatible)
    const html = marked.parse(rephrasedText);
    console.log('Final HTML response:', html);
    console.log('=== END REPHRASE REQUEST ===\n');
    
    res.send(html);
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).send('Failed to rephrase text.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rephraser backend running on port ${PORT}`);
}); 