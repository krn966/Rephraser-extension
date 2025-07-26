// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rephrase-gemini",
    title: "Rephrase with Gemini",
    contexts: ["selection"]
  });
  console.log("Extension installed, context menu created");
});

// Listen for keyboard shortcut (Ctrl+Q) via commands API
chrome.commands.onCommand.addListener(async (command) => {
  console.log("Command received:", command);
  if (command === "rephrase-text") {
    console.log("Processing rephrase-text command");
    await handleRephraseRequest();
  }
});

// Listen for keyboard shortcut messages from content script (fallback)
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message && message.type === "REPHRASE_KEYBOARD_SHORTCUT") {
    console.log("Processing keyboard shortcut from content script");
    await handleRephraseRequestWithText(message.text, sender.tab.id);
  }
});

// Common function to handle rephrase requests
async function handleRephraseRequest() {
  try {
    // Get the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    
    if (!activeTab) {
      console.error("No active tab found");
      return;
    }
    
    console.log("Active tab:", activeTab.id);
    
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
      console.log("No text selected");
      return;
    }
    
    await handleRephraseRequestWithText(selectedText, activeTab.id);
  } catch (e) {
    console.error("Failed to rephrase (keyboard shortcut):", e);
    await showError(e.message);
  }
}

// Function to handle rephrase with given text
async function handleRephraseRequestWithText(selectedText, tabId) {
  try {
    console.log("Selected text:", selectedText);
    
    // Send selected text to backend
    const response = await fetch("http://localhost:3000/rephrase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rephrasedText = await response.text();
    console.log("Rephrased text (raw):", rephrasedText);
    
    if (rephrasedText && rephrasedText.trim() !== '') {
      // Send raw HTML response to content script for parsing
      await chrome.tabs.sendMessage(tabId, {
        type: "REPHRASE_REPLACE",
        rephrasedText: rephrasedText,
        isHtml: true
      });
      console.log("Message sent to content script for replacement");
    } else {
      throw new Error("Empty response from backend");
    }
  } catch (e) {
    console.error("Failed to rephrase:", e);
    await showError(e.message);
  }
}

// Function to show error
async function showError(errorMessage) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (message) => alert(message),
      args: [`Failed to rephrase text: ${errorMessage}`]
    });
  }
}

// Listen for context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "rephrase-gemini" && info.selectionText) {
    try {
      console.log("Selected text:", info.selectionText);
      
      // Send selected text to backend
      const response = await fetch("http://localhost:3000/rephrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: info.selectionText })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rephrasedText = await response.text();
      console.log("Rephrased text (raw):", rephrasedText);
      
      if (rephrasedText && rephrasedText.trim() !== '') {
        // Send raw HTML response to content script for parsing
        await chrome.tabs.sendMessage(tab.id, {
          type: "REPHRASE_REPLACE",
          rephrasedText: rephrasedText,
          isHtml: true
        });
      } else {
        throw new Error("Empty response from backend");
      }
    } catch (e) {
      console.error("Failed to rephrase:", e);
      // Show error to user
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (errorMessage) => alert(errorMessage),
        args: [`Failed to rephrase text: ${e.message}`]
      });
    }
  }
}); 