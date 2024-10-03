document.addEventListener("DOMContentLoaded", () => {
  const enabledCheckbox = document.getElementById("enabled");
  const apiKeyInput = document.getElementById("apiKey");
  const saveButton = document.getElementById("save");

  chrome.storage.local.get(["enabled", "apiKey"], (result) => {
    enabledCheckbox.checked = result.enabled || false;
    apiKeyInput.value = result.apiKey || "";
    updateInputStates();
  });

  enabledCheckbox.addEventListener("change", updateInputStates);

  function updateInputStates() {
    const isEnabled = enabledCheckbox.checked;
    apiKeyInput.disabled = !isEnabled;
  }

  saveButton.addEventListener("click", () => {
    const enabled = enabledCheckbox.checked;
    const apiKey = apiKeyInput.value;

    chrome.storage.local.set({ enabled, apiKey }, () => {
      chrome.runtime.sendMessage({ action: "updateContextMenu", enabled: enabled });
      alert("Settings saved!");
    });
  });
});