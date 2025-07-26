// Complete and final corrected background.js

/**
 * Creates the context menu item when the extension is installed or updated.
 */
browser.runtime.onInstalled.addListener(() => {
  console.log("Gemini Rephraser: Creating context menu item.");
  browser.contextMenus.create({
    id: "rephrase-gemini",
    title: "Rephrase with Gemini",
    contexts: ["selection"]
  });
});

/**
 * Listens for a click on the context menu item.
 */
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message && message.type === "REPHRASE_KEYBOARD_SHORTCUT") {
    try {
      console.log("Selected text (keyboard shortcut):", message.text);
      
      // Send selected text to backend
      const response = await fetch("http://localhost:3000/rephrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.text })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rephrasedText = await response.text();
      console.log("Rephrased text (raw):", rephrasedText);
      
      if (rephrasedText && rephrasedText.trim() !== '') {
        // Extract plain text from HTML response
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rephrasedText;
        const plainText = tempDiv.textContent || tempDiv.innerText || rephrasedText;
        console.log("Plain text to replace:", plainText);
        
        // Send message to content script to replace text
        await browser.tabs.sendMessage(sender.tab.id, {
          type: "REPHRASE_REPLACE",
          rephrasedText: plainText
        });
      } else {
        throw new Error("Empty response from backend");
      }
    } catch (e) {
      console.error("Failed to rephrase (keyboard shortcut):", e);
      // Show error to user
      await browser.tabs.executeScript(sender.tab.id, {
        code: `
          alert("Failed to rephrase text: " + "${e.message.replace(/"/g, '\\"')}");
        `
      });
    }
  }
});

/**
 * Listens for a click on the context menu item.
 */
browser.contextMenus.onClicked.addListener(async (info, tab) => {
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
        // Extract plain text from HTML response
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rephrasedText;
        const plainText = tempDiv.textContent || tempDiv.innerText || rephrasedText;
        console.log("Plain text to replace:", plainText);
        
        // Send message to content script to replace text
        await browser.tabs.sendMessage(tab.id, {
          type: "REPHRASE_REPLACE",
          rephrasedText: plainText
        });
      } else {
        throw new Error("Empty response from backend");
      }
    } catch (e) {
      console.error("Failed to rephrase:", e);
      // Show error to user
      await browser.tabs.executeScript(tab.id, {
        code: `
          alert("Failed to rephrase text: " + "${e.message.replace(/"/g, '\\"')}");
        `
      });
    }
  }
});
