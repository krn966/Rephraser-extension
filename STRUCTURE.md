# Rephraser Extension - Systematic Structure

This document outlines the new systematic structure of the Gemini Rephraser browser extension project.

## 🏗️ New Project Structure

```
rephraser-extension/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── controllers/       # API route handlers
│   │   │   └── rephraseController.js
│   │   ├── services/          # Business logic (Gemini API)
│   │   │   └── geminiService.js
│   │   ├── middleware/        # Express middleware
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── utils/             # Utility functions
│   │   │   └── logger.js
│   │   └── app.js            # Express app setup
│   ├── server.js             # Server entry point
│   ├── package.json          # Backend dependencies
│   └── env.example           # Environment configuration example
├── extensions/                 # Browser extensions
│   ├── shared/                # Shared code between Chrome and Firefox
│   │   ├── content/           # Shared content script logic
│   │   │   └── contentScript.js
│   │   ├── background/        # Shared background script logic
│   │   │   └── backgroundScript.js
│   │   ├── utils/             # Shared utilities
│   │   │   ├── textUtils.js
│   │   │   ├── selectionUtils.js
│   │   │   └── visualUtils.js
│   │   └── constants.js       # Shared constants
│   ├── chrome/                # Chrome-specific extension
│   │   ├── manifest.json
│   │   ├── background.js      # Chrome background script
│   │   ├── content.js         # Chrome content script
│   │   ├── popup.html         # Extension popup
│   │   ├── popup.js           # Popup script
│   │   └── icon.png
│   └── firefox/               # Firefox-specific extension
│       ├── manifest.json
│       ├── background.js      # Firefox background script
│       ├── content.js         # Firefox content script
│       └── icon.png
├── docs/                      # Documentation
│   ├── setup.md              # Setup instructions
│   └── development.md        # Development guide
├── scripts/                   # Build and deployment scripts
│   ├── build-chrome.js
│   ├── build-firefox.js
│   └── package-extensions.js
├── package.json              # Main project configuration
├── README.md                 # Project overview
└── STRUCTURE.md              # This file
```

## 🔄 Migration Summary

### What Changed

1. **Backend Restructuring:**
   - Moved from flat `index.js` to modular MVC structure
   - Separated concerns: controllers, services, middleware, utils
   - Added proper error handling and validation
   - Added logging and health check endpoints

2. **Extension Restructuring:**
   - Created shared code to eliminate duplication
   - Separated Chrome and Firefox specific code
   - Added proper module imports and exports
   - Improved code organization and maintainability

3. **Build System:**
   - Added automated build scripts
   - Added packaging scripts for distribution
   - Created proper development workflow

4. **Documentation:**
   - Comprehensive setup guide
   - Development workflow documentation
   - Architecture explanations

### Benefits of New Structure

1. **Maintainability:**
   - Shared code reduces duplication
   - Modular backend is easier to extend
   - Clear separation of concerns

2. **Scalability:**
   - Easy to add new features
   - Simple to add new browser support
   - Modular architecture supports growth

3. **Developer Experience:**
   - Clear project structure
   - Automated build process
   - Comprehensive documentation

4. **Code Quality:**
   - Consistent error handling
   - Proper validation
   - Better logging and debugging

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm run setup
   ```

2. **Configure backend:**
   ```bash
   cd backend
   cp env.example .env
   # Add your GEMINI_API_KEY to .env
   ```

3. **Start backend:**
   ```bash
   npm start
   ```

4. **Load extension:**
   - Chrome: Load `extensions/chrome/` folder
   - Firefox: Load `extensions/firefox/manifest.json`

## 📝 Development Workflow

1. **Make changes** in shared code or browser-specific files
2. **Test** on both Chrome and Firefox
3. **Build** extensions: `npm run build:chrome` and `npm run build:firefox`
4. **Package** for distribution: `npm run package`

## 🔧 Key Files

### Backend
- `backend/src/app.js` - Main Express application
- `backend/src/services/geminiService.js` - Gemini API integration
- `backend/src/controllers/rephraseController.js` - API endpoint handler

### Extensions
- `extensions/shared/constants.js` - Shared configuration
- `extensions/shared/content/contentScript.js` - Page interaction logic
- `extensions/shared/background/backgroundScript.js` - Extension lifecycle

### Build
- `scripts/build-chrome.js` - Chrome extension build
- `scripts/build-firefox.js` - Firefox extension build
- `scripts/package-extensions.js` - Create distribution packages

## 🎯 Next Steps

1. **Test the new structure** thoroughly
2. **Update any existing documentation** references
3. **Consider adding automated testing**
4. **Plan for future features** using the new modular structure

The new structure provides a solid foundation for continued development and maintenance of the Gemini Rephraser extension. 