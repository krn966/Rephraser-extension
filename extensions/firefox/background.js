/**
 * Firefox-specific background script
 * Uses browser API instead of chrome API
 */

// Import shared constants
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    REPHRASE: '/rephrase',
    HEALTH: '/health'
  }
};

const MESSAGE_TYPES = {
  REPHRASE_KEYBOARD_SHORTCUT: 'REPHRASE_KEYBOARD_SHORTCUT',
  REPHRASE_REPLACE: 'REPHRASE_REPLACE',
  REPHRASE_ERROR: 'REPHRASE_ERROR'
};

const CONTEXT_MENU = {
  ID: 'rephrase-gemini',
  TITLE: 'Rephrase with Gemini',
  CONTEXTS: ['selection']
};

const LOG_PREFIX = '[Gemini Rephraser]';

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
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
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
  browser.runtime.onMessage.addListener(async (message, sender) => {
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
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
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
      // Extract plain text from HTML response
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = rephrasedText;
      const plainText = tempDiv.textContent || tempDiv.innerText || rephrasedText;
      
      // Send response to content script
      await browser.tabs.sendMessage(tabId, {
        type: MESSAGE_TYPES.REPHRASE_REPLACE,
        rephrasedText: plainText
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
    await browser.tabs.executeScript(tabId, {
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