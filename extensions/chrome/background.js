/**
 * Chrome-specific background script
 * Imports shared background logic and adds Chrome-specific features
 */

import "./background/backgroundScript.js"

// Chrome-specific keyboard shortcut handling
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "rephrase-text") {
    console.log("[Gemini Rephraser] Command received:", command);
    
    try {
      // Get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab) {
        console.error("[Gemini Rephraser] No active tab found");
        return;
      }
      
      // Get selected text from the page
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const active = document.activeElement;
          if (active && (active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && active.type === "text"))) {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            if (start !== end) {
              return active.value.substring(start, end);
            }
          } else {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              return sel.toString();
            }
          }
          return null;
        }
      });
      
      const selectedText = results[0].result;
      if (!selectedText) {
        console.log("[Gemini Rephraser] No text selected");
        return;
      }
      
      // Import and use shared logic
      const { handleRephraseRequest } = await import('./background/backgroundScript.js');
      await handleRephraseRequest(selectedText, activeTab.id);
    } catch (e) {
      console.error("[Gemini Rephraser] Failed to rephrase (keyboard shortcut):", e);
    }
  }
}); 