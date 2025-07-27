# Gemini Rephraser Browser Extension

A browser extension that rephrases selected text using Google's Gemini AI API through a secure backend server. Supports both Chrome and Firefox browsers.

## 🏗️ Project Structure

```
rephraser-extension/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── controllers/       # API route handlers
│   │   ├── services/          # Business logic (Gemini API)
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   └── app.js            # Express app setup
│   ├── package.json
│   └── .env.example
├── extensions/                 # Browser extensions
│   ├── shared/                # Shared code between Chrome and Firefox
│   │   ├── content/           # Shared content script logic
│   │   ├── background/        # Shared background script logic
│   │   ├── utils/             # Shared utilities
│   │   └── constants.js       # Shared constants
│   ├── chrome/                # Chrome-specific extension
│   │   ├── manifest.json
│   │   ├── background.js      # Chrome background script
│   │   ├── content.js         # Chrome content script
│   │   └── icon.png
│   └── firefox/               # Firefox-specific extension
│       ├── manifest.json
│       ├── background.js      # Firefox background script
│       ├── content.js         # Firefox content script
│       └── icon.png
├── docs/                      # Documentation
│   ├── setup.md              # Setup instructions
│   ├── development.md        # Development guide
│   └── deployment.md         # Deployment guide
├── scripts/                   # Build and deployment scripts
│   ├── build-chrome.js
│   ├── build-firefox.js
│   └── package-extensions.js
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on port 3000 by default.

### Extension Setup

1. **Chrome Extension:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extensions/chrome/` folder

2. **Firefox Extension:**
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on" and select `extensions/firefox/manifest.json`

## 🎯 Features

- **Text Rephrasing**: Select any text and rephrase it using Gemini AI
- **Multiple Input Methods**: 
  - Right-click context menu
  - Keyboard shortcut (Ctrl+Q)
  - Works in text inputs, textareas, and contenteditable elements
- **Cross-browser Support**: Chrome and Firefox
- **Secure API**: Backend handles API calls, keeping your API key secure
- **Visual Feedback**: Highlighted replacement with yellow flash

## 🔧 Development

### Backend API

- **POST /rephrase**
  - Request: `{ "text": "text to rephrase" }`
  - Response: HTML-formatted rephrased text

### Extension Architecture

- **Background Script**: Handles API calls and context menu
- **Content Script**: Manages text selection and replacement
- **Shared Code**: Common utilities and constants

## 📝 Usage

1. Select text on any webpage
2. Use one of these methods:
   - Right-click and select "Rephrase with Gemini"
   - Press Ctrl+Q (or Cmd+Q on Mac)
3. The selected text will be replaced with the rephrased version

## 🔒 Security

- API keys are stored securely on the backend
- No sensitive data is exposed in the browser extension
- All API calls go through the secure backend server

## 📦 Building Extensions

```bash
# Build Chrome extension
npm run build:chrome

# Build Firefox extension  
npm run build:firefox

# Package both extensions
npm run package
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both Chrome and Firefox
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 