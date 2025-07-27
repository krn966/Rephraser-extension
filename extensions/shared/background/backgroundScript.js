/**
 * Shared background script logic for both Chrome and Firefox extensions
 */

import { API_CONFIG, MESSAGE_TYPES, CONTEXT_MENU, LOG_PREFIX } from '../constants.js';

// Browser API detection
const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

/**
 * Initialize the background script
 */
function initialize() {
  console.log(`${LOG_PREFIX} Background script initialized`);
  
  // Create context menu
  createContextMenu();
  
  // Add message listeners
  addMessageListeners();
  
  // Add context menu listener
  addContextMenuListener();
}

/**
 * Create context menu item
 */
function createContextMenu() {
  browserAPI.runtime.onInstalled.addListener(() => {
    browserAPI.contextMenus.create({
      id: CONTEXT_MENU.ID,
      title: CONTEXT_MENU.TITLE,
      contexts: CONTEXT_MENU.CONTEXTS
    });
    console.log(`${LOG_PREFIX} Context menu created`);
  });
}

/**
 * Add message listeners for communication with content script
 */
function addMessageListeners() {
  browserAPI.runtime.onMessage.addListener(async (message, sender) => {
    if (message && message.type === MESSAGE_TYPES.REPHRASE_KEYBOARD_SHORTCUT) {
      console.log(`${LOG_PREFIX} Processing keyboard shortcut request`);
      await handleRephraseRequest(message.text, sender.tab.id);
    }
  });
}

/**
 * Add context menu click listener
 */
function addContextMenuListener() {
  browserAPI.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === CONTEXT_MENU.ID && info.selectionText) {
      console.log(`${LOG_PREFIX} Context menu clicked`);
      await handleRephraseRequest(info.selectionText, tab.id);
    }
  });
}

/**
 * Handle rephrase request
 * @param {string} text - Text to rephrase
 * @param {number} tabId - Tab ID to send response to
 */
async function handleRephraseRequest(text, tabId) {
  try {
    console.log(`${LOG_PREFIX} Rephrasing text:`, text);
    
    // Send request to backend
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPHRASE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rephrasedText = await response.text();
    console.log(`${LOG_PREFIX} Received rephrased text:`, rephrasedText);
    
    if (rephrasedText && rephrasedText.trim() !== '') {
      // Send response to content script
      await browserAPI.tabs.sendMessage(tabId, {
        type: MESSAGE_TYPES.REPHRASE_REPLACE,
        rephrasedText: rephrasedText,
        isHtml: true
      });
      console.log(`${LOG_PREFIX} Message sent to content script`);
    } else {
      throw new Error("Empty response from backend");
    }
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to rephrase:`, error);
    await showError(error.message, tabId);
  }
}

/**
 * Show error message to user
 * @param {string} errorMessage - Error message to show
 * @param {number} tabId - Tab ID to show error in
 */
async function showError(errorMessage, tabId) {
  try {
    await browserAPI.tabs.executeScript(tabId, {
      code: `
        alert("Failed to rephrase text: ${errorMessage.replace(/"/g, '\\"')}");
      `
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to show error:`, error);
  }
}

// Initialize when extension loads
initialize(); 