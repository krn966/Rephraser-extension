// content.js

let lastSelection = null;
let lastActiveElement = null;

/**
 * Tracks the user's current text selection or cursor position.
 * This runs on mouse up, key up, and right-clicks to ensure we always
 * know where to replace the text.
 */
function storeSelection() {
  lastActiveElement = document.activeElement;
  // Handle textareas and text inputs
  if (lastActiveElement && (lastActiveElement.tagName === "TEXTAREA" || (lastActiveElement.tagName === "INPUT" && lastActiveElement.type === "text"))) {
    lastSelection = {
      start: lastActiveElement.selectionStart,
      end: lastActiveElement.selectionEnd
    };
    console.log("Stored selection for input:", lastSelection);
  } else {
    // Handle all other selectable content (e.g., paragraphs, divs)
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      lastSelection = sel.getRangeAt(0).cloneRange();
      console.log("Stored selection for contenteditable:", lastSelection.toString());
    } else {
      lastSelection = null;
      console.log("No selection found");
    }
  }
}

// Add event listeners to track the selection
document.addEventListener("mouseup", storeSelection, true);
document.addEventListener("keyup", storeSelection, true);
document.addEventListener("contextmenu", storeSelection, true);

// Add keyboard shortcut listener for Ctrl+Q
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "q") {
    event.preventDefault();
    console.log("Ctrl+Q pressed, triggering rephrase");
    
    // Get selected text
    let selectedText = null;
    const active = document.activeElement;
    
    if (active && (active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && active.type === "text"))) {
      const start = active.selectionStart;
      const end = active.selectionEnd;
      if (start !== end) {
        selectedText = active.value.substring(start, end);
      }
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        selectedText = sel.toString();
      }
    }
    
    if (selectedText && selectedText.trim()) {
      console.log("Selected text for keyboard shortcut:", selectedText);
      // Send message to background script to rephrase
      browser.runtime.sendMessage({
        type: "REPHRASE_KEYBOARD_SHORTCUT",
        text: selectedText
      });
    } else {
      console.log("No text selected for keyboard shortcut");
    }
  }
});

/**
 * Listens for the message from the background script containing the rephrased text.
 */
browser.runtime.onMessage.addListener((message) => {
  if (message && message.type === "REPHRASE_REPLACE") {
    console.log("Content script received rephrase message:", message.rephrasedText);
    // This calls the replacement function below
    replaceSelectedText(message.rephrasedText);
  }
});

/**
 * This is the function that performs the actual text replacement on the page.
 * The error "replaceSelectedText is not defined" means this function was missing.
 */
function replaceSelectedText(rephrasedText) {
  console.log("Attempting to replace text with:", rephrasedText);
  console.log("Last active element:", lastActiveElement);
  console.log("Last selection:", lastSelection);
  
  if (!lastActiveElement && !lastSelection) {
    console.warn("No active element or selection found");
    return;
  }

  // Case 1: The selection is inside a textarea or input field
  if (lastActiveElement && (lastActiveElement.tagName === "TEXTAREA" || (lastActiveElement.tagName === "INPUT" && lastActiveElement.type === "text"))) {
    console.log("Replacing in input/textarea");
    const value = lastActiveElement.value;
    const start = lastSelection ? lastSelection.start : lastActiveElement.selectionStart;
    const end = lastSelection ? lastSelection.end : lastActiveElement.selectionEnd;
    
    console.log("Input value:", value);
    console.log("Selection range:", start, "to", end);
    
    if (start !== end) {
      lastActiveElement.value = value.slice(0, start) + rephrasedText + value.slice(end);
      lastActiveElement.selectionStart = lastActiveElement.selectionEnd = start + rephrasedText.length;
      flashElement(lastActiveElement);
      console.log("Successfully replaced in input/textarea");
    } else {
      console.warn("No text selected in input");
    }
  }
  // Case 2: The selection is on regular page content (contenteditable, etc.)
  else if (lastSelection && lastSelection.cloneContents) {
    console.log("Replacing in contenteditable");
    try {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(lastSelection);
      lastSelection.deleteContents();
      lastSelection.insertNode(document.createTextNode(rephrasedText));
      lastSelection.collapse(false);
      flashElement(sel.anchorNode?.parentElement);
      console.log("Successfully replaced in contenteditable");
    } catch (error) {
      console.error("Error replacing in contenteditable:", error);
    }
  } else {
    console.warn("No valid selection found for replacement");
  }
}

/**
 * Briefly highlights the element where text was replaced for user feedback.
 */
function flashElement(el) {
  if (!el) return;
  const originalColor = el.style.backgroundColor;
  el.style.backgroundColor = "#ffe066"; // A yellow highlight color
  setTimeout(() => {
    el.style.backgroundColor = originalColor;
  }, 500);
}
