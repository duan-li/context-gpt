document.addEventListener("DOMContentLoaded", () => {
  const enabledCheckbox = document.getElementById("enabled");
  const apiUrlInput = document.getElementById("apiUrl");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("save");

  chrome.storage.local.get(["enabled", "apiUrl", "apiKey"], (result) => {
    enabledCheckbox.checked = result.enabled || false;
    apiUrlInput.value = result.apiUrl || "";
    apiKeyInput.value = result.apiKey || "";
    updateInputStates();
  });

  enabledCheckbox.addEventListener("change", updateInputStates);

  function updateInputStates() {
    const isEnabled = enabledCheckbox.checked;
    apiUrlInput.disabled = !isEnabled;
    apiKeyInput.disabled = !isEnabled;
  }

  saveButton.addEventListener("click", () => {
    const enabled = enabledCheckbox.checked;
    const apiUrl = apiUrlInput.value;
    const apiKey = apiKeyInput.value;

    chrome.storage.local.set({ enabled, apiUrl, apiKey }, () => {
      chrome.runtime.sendMessage({ action: "updateContextMenu", enabled: enabled });
      alert("Settings saved!");
    });
  });
});