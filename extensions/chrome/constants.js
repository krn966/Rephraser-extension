/**
 * Shared constants for browser extensions
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    REPHRASE: '/rephrase',
    HEALTH: '/health'
  }
};

// Message Types
export const MESSAGE_TYPES = {
  REPHRASE_KEYBOARD_SHORTCUT: 'REPHRASE_KEYBOARD_SHORTCUT',
  REPHRASE_REPLACE: 'REPHRASE_REPLACE',
  REPHRASE_ERROR: 'REPHRASE_ERROR'
};

// Context Menu
export const CONTEXT_MENU = {
  ID: 'rephrase-gemini',
  TITLE: 'Rephrase with Gemini',
  CONTEXTS: ['selection']
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  REPHRASE: {
    DEFAULT: 'Ctrl+Q',
    MAC: 'Cmd+Q'
  }
};

// Visual Feedback
export const VISUAL_FEEDBACK = {
  HIGHLIGHT_COLOR: '#ffe066',
  HIGHLIGHT_DURATION: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  NO_TEXT_SELECTED: 'No text selected',
  API_ERROR: 'Failed to rephrase text',
  NETWORK_ERROR: 'Network error occurred'
};

// Logging
export const LOG_PREFIX = '[Gemini Rephraser]'; 