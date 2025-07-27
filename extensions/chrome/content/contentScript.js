/**
 * Shared content script for both Chrome and Firefox extensions
 */

import { MESSAGE_TYPES, KEYBOARD_SHORTCUTS, LOG_PREFIX } from '../constants.js';
import { getSelectedText, parseHtmlToText, validateText } from '../utils/textUtils.js';
import { addSelectionListeners, replaceSelectedText } from '../utils/selectionUtils.js';
import { flashElement, showNotification } from '../utils/visualUtils.js';

// Browser API detection
const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

/**
 * Initialize the content script
 */
function initialize() {
  console.log(`${LOG_PREFIX} Content script initialized`);
  
  // Add selection tracking listeners
  addSelectionListeners();
  
  // Add keyboard shortcut listener
  addKeyboardShortcutListener();
  
  // Add message listener
  addMessageListener();
}

/**
 * Add keyboard shortcut listener for Ctrl+Q
 */
function addKeyboardShortcutListener() {
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "q") {
      event.preventDefault();
      console.log(`${LOG_PREFIX} Keyboard shortcut triggered`);
      
      const selectedText = getSelectedText();
      if (selectedText && validateText(selectedText)) {
        console.log(`${LOG_PREFIX} Selected text:`, selectedText);
        browserAPI.runtime.sendMessage({
          type: MESSAGE_TYPES.REPHRASE_KEYBOARD_SHORTCUT,
          text: selectedText
        });
      } else {
        console.log(`${LOG_PREFIX} No valid text selected`);
        showNotification('No text selected', 'info');
      }
    }
  });
}

/**
 * Add message listener for communication with background script
 */
function addMessageListener() {
  browserAPI.runtime.onMessage.addListener((message) => {
    if (message && message.type === MESSAGE_TYPES.REPHRASE_REPLACE) {
      console.log(`${LOG_PREFIX} Received rephrase message:`, message.rephrasedText);
      
      // Parse HTML response if needed
      let plainText = message.rephrasedText;
      if (message.isHtml) {
        plainText = parseHtmlToText(message.rephrasedText);
      }
      
      // Replace the selected text
      const success = replaceSelectedText(plainText);
      
      if (success) {
        // Flash the element for visual feedback
        const { lastActiveElement } = getStoredSelection();
        if (lastActiveElement) {
          flashElement(lastActiveElement);
        }
        showNotification('Text rephrased successfully!', 'success');
      } else {
        showNotification('Failed to replace text', 'error');
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 