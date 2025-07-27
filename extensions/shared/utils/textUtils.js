/**
 * Shared text utility functions
 */

/**
 * Get selected text from the current page
 * @returns {string|null} Selected text or null if no selection
 */
export function getSelectedText() {
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
 * Parse HTML response to plain text
 * @param {string} html - HTML string to parse
 * @returns {string} Plain text
 */
export function parseHtmlToText(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || html;
}

/**
 * Validate text before sending to API
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid
 */
export function validateText(text) {
  return text && typeof text === 'string' && text.trim().length > 0;
} 