const fetch = require('node-fetch');

class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  /**
   * Rephrase text using Gemini API
   * @param {string} text - Text to rephrase
   * @returns {Promise<string>} - HTML formatted rephrased text
   */
  async rephraseText(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided');
    }

    const prompt = `Rephrase the following text. Only return the rephrased version, nothing else:\n\n${text}`;
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey
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

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rephrasedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rephrasedText) {
        throw new Error('No result from Gemini API');
      }

      // Return plain text for now (can add markdown conversion later)
      return rephrasedText;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Failed to rephrase text: ${error.message}`);
    }
  }
}

module.exports = GeminiService; 