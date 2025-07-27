# Setup Guide

This guide will help you set up the Gemini Rephraser browser extension for development and production use.

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Google Gemini API key
- Chrome or Firefox browser

## Quick Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd rephraser-extension
   ```

2. **Install dependencies:**
   ```bash
   npm run setup
   ```

3. **Configure environment:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

5. **Load the extension:**
   - **Chrome:** Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `extensions/chrome/`
   - **Firefox:** Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `extensions/firefox/manifest.json`

## Detailed Setup

### Backend Setup

The backend server handles API calls to Gemini and keeps your API key secure.

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get a Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

4. **Configure environment:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3000`

### Extension Setup

#### Chrome Extension

1. **Build the extension:**
   ```bash
   npm run build:chrome
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist/chrome` folder

3. **Verify installation:**
   - The extension icon should appear in your toolbar
   - Right-click on any text and you should see "Rephrase with Gemini"
   - Use Ctrl+Q to test keyboard shortcut

#### Firefox Extension

1. **Build the extension:**
   ```bash
   npm run build:firefox
   ```

2. **Load in Firefox:**
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `dist/firefox/manifest.json`

3. **Verify installation:**
   - The extension should appear in the list
   - Right-click on any text and you should see "Rephrase with Gemini"
   - Use Ctrl+Q to test keyboard shortcut

## Development Setup

For development, you can use the source files directly:

### Chrome Development

1. **Load from source:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extensions/chrome` folder

2. **Make changes:**
   - Edit files in `extensions/chrome/` or `extensions/shared/`
   - Click the refresh button on the extension card to reload

### Firefox Development

1. **Load from source:**
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `extensions/firefox/manifest.json`

2. **Make changes:**
   - Edit files in `extensions/firefox/` or `extensions/shared/`
   - Click "Reload" on the extension card

## Troubleshooting

### Backend Issues

- **Port already in use:** Change the PORT in `.env` file
- **API key error:** Verify your Gemini API key is correct
- **CORS errors:** Make sure the backend is running on the correct port

### Extension Issues

- **Extension not loading:** Check browser console for errors
- **Context menu not appearing:** Make sure you have the correct permissions
- **Keyboard shortcut not working:** Check if another extension is using Ctrl+Q

### Common Errors

- **"Backend server not running":** Start the backend with `npm start`
- **"Failed to rephrase text":** Check your API key and internet connection
- **"No text selected":** Make sure you have text selected before using the extension

## Production Deployment

For production deployment:

1. **Build extensions:**
   ```bash
   npm run build:chrome
   npm run build:firefox
   ```

2. **Package extensions:**
   ```bash
   npm run package
   ```

3. **Deploy backend:**
   - Deploy the `backend` folder to your server
   - Set environment variables on your server
   - Update API_CONFIG.BASE_URL in extension constants

4. **Publish extensions:**
   - Chrome: Upload to Chrome Web Store
   - Firefox: Upload to Firefox Add-ons 