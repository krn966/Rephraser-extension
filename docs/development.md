# Development Guide

This guide covers the development workflow, architecture, and best practices for the Gemini Rephraser extension.

## Project Architecture

```
rephraser-extension/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── controllers/       # API route handlers
│   │   ├── services/          # Business logic (Gemini API)
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utility functions
│   │   └── app.js            # Express app setup
│   ├── server.js             # Server entry point
│   └── package.json
├── extensions/                 # Browser extensions
│   ├── shared/                # Shared code between Chrome and Firefox
│   │   ├── content/           # Shared content script logic
│   │   ├── background/        # Shared background script logic
│   │   ├── utils/             # Shared utilities
│   │   └── constants.js       # Shared constants
│   ├── chrome/                # Chrome-specific extension
│   └── firefox/               # Firefox-specific extension
└── scripts/                   # Build and deployment scripts
```

## Development Workflow

### 1. Backend Development

The backend follows a modular MVC pattern:

- **Controllers** (`backend/src/controllers/`): Handle HTTP requests and responses
- **Services** (`backend/src/services/`): Contain business logic and external API calls
- **Middleware** (`backend/src/middleware/`): Request validation and error handling
- **Utils** (`backend/src/utils/`): Helper functions and utilities

#### Adding New Features

1. **Create a new service** (if needed):
   ```javascript
   // backend/src/services/newService.js
   class NewService {
     async doSomething(data) {
       // Implementation
     }
   }
   module.exports = NewService;
   ```

2. **Create a controller**:
   ```javascript
   // backend/src/controllers/newController.js
   const NewService = require('../services/newService');
   
   class NewController {
     constructor(newService) {
       this.newService = newService;
     }
     
     async handleRequest(req, res) {
       // Implementation
     }
   }
   ```

3. **Add route in app.js**:
   ```javascript
   app.post('/new-endpoint', validateRequest, (req, res) => {
     newController.handleRequest(req, res);
   });
   ```

### 2. Extension Development

#### Shared Code

Most extension logic is shared between Chrome and Firefox:

- **Constants** (`extensions/shared/constants.js`): Configuration and constants
- **Utilities** (`extensions/shared/utils/`): Helper functions
- **Content Scripts** (`extensions/shared/content/`): Page interaction logic
- **Background Scripts** (`extensions/shared/background/`): Extension lifecycle and API calls

#### Browser-Specific Code

Only browser API differences are handled in separate files:

- **Chrome** (`extensions/chrome/`): Uses `chrome.*` API
- **Firefox** (`extensions/firefox/`): Uses `browser.*` API

#### Adding New Features

1. **Update shared constants**:
   ```javascript
   // extensions/shared/constants.js
   export const NEW_FEATURE = {
     // Configuration
   };
   ```

2. **Add shared utilities**:
   ```javascript
   // extensions/shared/utils/newUtils.js
   export function newUtility() {
     // Implementation
   }
   ```

3. **Update content script** (if needed):
   ```javascript
   // extensions/shared/content/contentScript.js
   import { newUtility } from '../utils/newUtils.js';
   ```

4. **Update background script** (if needed):
   ```javascript
   // extensions/shared/background/backgroundScript.js
   // Add new message handlers or API calls
   ```

## Code Style Guidelines

### JavaScript

- Use ES6+ features (const, let, arrow functions, etc.)
- Use async/await for asynchronous operations
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Use consistent indentation (2 spaces)

### File Organization

- One class/functionality per file
- Use descriptive file names
- Group related files in directories
- Keep files under 200 lines when possible

### Error Handling

- Always handle errors in async functions
- Use try-catch blocks for API calls
- Provide meaningful error messages
- Log errors for debugging

## Testing

### Backend Testing

1. **Manual testing:**
   ```bash
   # Start the server
   npm start
   
   # Test the API
   curl -X POST http://localhost:3000/rephrase \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello world"}'
   ```

2. **Health check:**
   ```bash
   curl http://localhost:3000/health
   ```

### Extension Testing

1. **Load extension in browser**
2. **Test context menu:** Right-click on selected text
3. **Test keyboard shortcut:** Select text and press Ctrl+Q
4. **Test different input types:** Textareas, input fields, contenteditable
5. **Check browser console** for errors

## Debugging

### Backend Debugging

- Check server logs for errors
- Use `console.log()` for debugging
- Check environment variables
- Verify API key is valid

### Extension Debugging

- **Chrome:** Open DevTools, go to Extensions tab
- **Firefox:** Open Browser Toolbox, check Console tab
- Check for CORS errors
- Verify backend is running

### Common Issues

1. **CORS errors:** Backend not running or wrong port
2. **API errors:** Invalid API key or network issues
3. **Extension not working:** Check permissions and manifest
4. **Text not replacing:** Check content script injection

## Building and Packaging

### Development Build

```bash
# Build Chrome extension
npm run build:chrome

# Build Firefox extension
npm run build:firefox
```

### Production Build

```bash
# Build both extensions
npm run build:chrome
npm run build:firefox

# Package into zip files
npm run package
```

## Deployment

### Backend Deployment

1. **Environment setup:**
   - Set `NODE_ENV=production`
   - Configure `GEMINI_API_KEY`
   - Set appropriate `PORT`

2. **Deploy to server:**
   - Upload `backend/` folder
   - Install dependencies: `npm install --production`
   - Start server: `npm start`

### Extension Deployment

1. **Chrome Web Store:**
   - Package extension: `npm run build:chrome`
   - Upload zip file to Chrome Web Store
   - Update version in manifest.json

2. **Firefox Add-ons:**
   - Package extension: `npm run build:firefox`
   - Upload zip file to Firefox Add-ons
   - Update version in manifest.json

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Pull Request Guidelines

- Include a clear description of changes
- Test on both Chrome and Firefox
- Update documentation if needed
- Follow the existing code style 