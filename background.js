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
      if (result.enabled && result.apiKey) {
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${result.apiKey}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                  { role: "user", content: 'Summarize the text """' + info.selectionText + '"""' }
              ],
              max_tokens: 100
          })
      })
      .then((response) => response.text())
      .then((data) => {
        console.log("data");
        console.log(data);
        const dataObj = JSON.parse(data);

        if (dataObj.error) {
          chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: dataObj.error.message });
        } else {
          chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: dataObj.choices[0].message.content });
        }
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
