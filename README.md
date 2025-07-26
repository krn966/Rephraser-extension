# Rephraser Backend

This is the backend for the Gemini Rephraser browser extension. It securely handles Gemini API requests.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your Gemini API key:**
   Create a `.env` file in this directory with the following content:
   ```env
   GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
   ```

3. **Run the backend server:**
   ```bash
   npm start
   ```
   The server will run on port 3000 by default.

## Endpoint

- **POST /rephrase**
  - Request body: `{ "text": "..." }`
  - Response: `{ "result": "Rephrased version" }`

## Notes
- Never expose your Gemini API key in the browser extension. Only use it in this backend.
- Update your extension's backend URL to point to this server (e.g., `http://localhost:3000/rephrase` for local testing). 