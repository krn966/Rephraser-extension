/**
 * Shared selection utility functions
 */

let lastSelection = null;
let lastActiveElement = null;

/**
 * Store the current text selection or cursor position
 */
export function storeSelection() {
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
 * Get the stored selection information
 * @returns {Object} Selection info
 */
export function getStoredSelection() {
  return {
    lastSelection,
    lastActiveElement
  };
}

/**
 * Replace selected text with new text
 * @param {string} newText - Text to replace selection with
 * @returns {boolean} Success status
 */
export function replaceSelectedText(newText) {
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
      return true;
    } catch (error) {
      console.error('Error replacing in contenteditable:', error);
      return false;
    }
  }
  
  return false;
}

/**
 * Add selection tracking event listeners
 */
export function addSelectionListeners() {
  document.addEventListener("mouseup", storeSelection, true);
  document.addEventListener("keyup", storeSelection, true);
  document.addEventListener("contextmenu", storeSelection, true);
} 