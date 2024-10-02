// Initialize context menu and handle API requests
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "contextGPT",
        title: "ContextGPT",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {

  if (info.menuItemId === "contextGPT") {
    chrome.storage.local.get(["apiUrl", "apiKey", "enabled"], (result) => {
      if (result.enabled && result.apiUrl && result.apiKey) {
        fetch(result.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${result.apiKey}`,
          },
          body: JSON.stringify({ text: info.selectionText }),
        })
          .then((response) => response.text())
          .then((data) => {
            chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: data });
          })
          .catch((error) => {
            console.error("Error:", error);
            chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: "Error occurred while processing the request." });
          });
      } else {
        chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: "Please configure the extension settings." });
      }
    });
  }
});

/**
 * 
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateContextMenu") {
    chrome.contextMenus.update("contextGPT", { enabled: request.enabled });
  }
});

/**
 * 
 * @param {*} text 
 * @param {*} tabId 
 */
function sendToAPI(text, tabId) {
    chrome.storage.sync.get(["apiUrl", "apiKey"], (result) => {
      if (!result.apiUrl || !result.apiKey) {
        chrome.tabs.sendMessage(tabId, { action: "showDialog", text: "Please set API URL and API Key in the extension options." });
        return;
      }
  
      fetch(result.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${result.apiKey}`
        },
        body: JSON.stringify({ text: text })
      })
      .then(response => response.text())
      .then(data => {
        chrome.tabs.sendMessage(tabId, { action: "showDialog", text: data });
      })
      .catch(error => {
        chrome.tabs.sendMessage(tabId, { action: "showDialog", text: "Error: " + error.message });
      });
    });
  }