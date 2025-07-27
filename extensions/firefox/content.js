/**
 * Firefox-specific content script
 * Uses browser API instead of chrome API
 */

// Import shared constants
const MESSAGE_TYPES = {
  REPHRASE_KEYBOARD_SHORTCUT: 'REPHRASE_KEYBOARD_SHORTCUT',
  REPHRASE_REPLACE: 'REPHRASE_REPLACE',
  REPHRASE_ERROR: 'REPHRASE_ERROR'
};

const LOG_PREFIX = '[Gemini Rephraser]';

// Selection tracking variables
let lastSelection = null;
let lastActiveElement = null;

/**
 * Store the current text selection or cursor position
 */
function storeSelection() {
  lastActiveElement = document.activeElement;
  
  // Handle textareas and text inputs
  if (lastActiveElement && (lastActiveElement.tagName === "TEXTAREA" || (lastActiveElement.tagName === "INPUT" && lastActiveElement.type === "text"))) {
    lastSelection = {
      start: lastActiveElement.selectionStart,
      end: lastActiveElement.selectionEnd
    };
  } else {
    // Handle all other selectable content
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      lastSelection = sel.getRangeAt(0).cloneRange();
    } else {
      lastSelection = null;
    }
  }
}

/**
 * Get selected text from the current page
 */
function getSelectedText() {
  const active = document.activeElement;
  
  // Handle textareas and text inputs
  if (active && (active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && active.type === "text"))) {
    const start = active.selectionStart;
    const end = active.selectionEnd;
    if (start !== end) {
      return active.value.substring(start, end);
    }
  } else {
    // Handle all other selectable content
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      return sel.toString();
    }
  }
  
  return null;
}

/**
 * Replace selected text with new text
 */
function replaceSelectedText(newText) {
  if (!lastActiveElement && !lastSelection) {
    return false;
  }

  // Case 1: The selection is inside a textarea or input field
  if (lastActiveElement && (lastActiveElement.tagName === "TEXTAREA" || (lastActiveElement.tagName === "INPUT" && lastActiveElement.type === "text"))) {
    const value = lastActiveElement.value;
    const start = lastSelection ? lastSelection.start : lastActiveElement.selectionStart;
    const end = lastSelection ? lastSelection.end : lastActiveElement.selectionEnd;
    
    if (start !== end) {
      lastActiveElement.value = value.slice(0, start) + newText + value.slice(end);
      lastActiveElement.selectionStart = lastActiveElement.selectionEnd = start + newText.length;
      flashElement(lastActiveElement);
      return true;
    }
  }
  // Case 2: The selection is on regular page content
  else if (lastSelection && lastSelection.cloneContents) {
    try {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(lastSelection);
      lastSelection.deleteContents();
      lastSelection.insertNode(document.createTextNode(newText));
      lastSelection.collapse(false);
      flashElement(sel.anchorNode?.parentElement);
      return true;
    } catch (error) {
      console.error('Error replacing in contenteditable:', error);
      return false;
    }
  }
  
  return false;
}

/**
 * Flash an element with a highlight color
 */
function flashElement(element) {
  if (!element) return;
  const originalColor = element.style.backgroundColor;
  element.style.backgroundColor = "#ffe066";
  setTimeout(() => {
    element.style.backgroundColor = originalColor;
  }, 500);
}

/**
 * Initialize the content script
 */
function initialize() {
  console.log(`${LOG_PREFIX} Content script initialized`);
  
  // Add selection tracking listeners
  document.addEventListener("mouseup", storeSelection, true);
  document.addEventListener("keyup", storeSelection, true);
  document.addEventListener("contextmenu", storeSelection, true);
  
  // Add keyboard shortcut listener
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "q") {
      event.preventDefault();
      console.log(`${LOG_PREFIX} Keyboard shortcut triggered`);
      
      const selectedText = getSelectedText();
      if (selectedText && selectedText.trim()) {
        console.log(`${LOG_PREFIX} Selected text:`, selectedText);
        browser.runtime.sendMessage({
          type: MESSAGE_TYPES.REPHRASE_KEYBOARD_SHORTCUT,
          text: selectedText
        });
      } else {
        console.log(`${LOG_PREFIX} No text selected for keyboard shortcut`);
      }
    }
  });
  
  // Add message listener
  browser.runtime.onMessage.addListener((message) => {
    if (message && message.type === MESSAGE_TYPES.REPHRASE_REPLACE) {
      console.log(`${LOG_PREFIX} Received rephrase message:`, message.rephrasedText);
      replaceSelectedText(message.rephrasedText);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 