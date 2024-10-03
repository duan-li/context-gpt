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

/**
 * call gpt api and send response to the tab
 * 
 * @param {*} text 
 * @param {*} tabId 
 */
function sendToGPTAPI(apiKey, message, tab) {
  async function sendToChatGPT(apiKey, message) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "user", content: 'Summarize the text delimited by triple quotes with few sentences. """' + message + '"""' }
            ],
            max_tokens: 100
        })
    })
    .then((response) => response.text())
    .then((data) => {
      console.log(data.choices[0].message.content);
      chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: data.choices[0].message.content });
    })
    .catch((error) => {
      console.error("Error:", error);
      chrome.tabs.sendMessage(tab.id, { action: "showDialog", data: "Error occurred while processing the request." });
    });

    const data = await response.json();
    console.log(data.choices[0].message.content);
}

// Example usage:
// const apiKey = "your_openai_api_key"; // replace with your API key
// const userMessage = "What is the capital of France?";
// sendToChatGPT(apiKey, userMessage);

}

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