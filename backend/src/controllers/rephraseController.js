const GeminiService = require('../services/geminiService');

class RephraseController {
  constructor(geminiService) {
    this.geminiService = geminiService;
  }

  /**
   * Handle rephrase request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async rephrase(req, res) {
    console.log('=== REPHRASE REQUEST ===');
    console.log('Received text:', req.body.text);
    
    const { text } = req.body;
    
    if (!text) {
      console.log('Error: Missing text in request body.');
      return res.status(400).json({
        error: 'Missing text in request body'
      });
    }
    
    try {
      const rephrasedText = await this.geminiService.rephraseText(text);
      console.log('Rephrased text:', rephrasedText);
      console.log('=== END REPHRASE REQUEST ===\n');
      
      res.send(rephrasedText);
    } catch (error) {
      console.error('Rephrase error:', error.message);
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = RephraseController; 