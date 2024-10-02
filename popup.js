document.addEventListener("DOMContentLoaded", () => {
  const optionsLink = document.getElementById("options");
  optionsLink.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});