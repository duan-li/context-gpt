chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showDialog") {
    const dialog = document.createElement("div");
    dialog.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      padding: 20px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
    `;
    dialog.textContent = request.data;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close (Esc)";
    closeButton.style.cssText = `
      display: block;
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #f0f0f0;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    `;
    closeButton.onclick = () => document.body.removeChild(dialog);

    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);
  } else if (request.action === "closeDialog") {
    const existingDialog = document.querySelector('div[style*="position: fixed"]');
    if (existingDialog) {
      document.body.removeChild(existingDialog);
    }
  }
});

// Add event listener for the 'keydown' event
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const existingDialog = document.querySelector('div[style*="position: fixed"]');
    if (existingDialog) {
      document.body.removeChild(existingDialog);
    }
    }
});

// Add event listener for the 'click' event on the document
document.addEventListener('click', (event) => {
  const existingDialog = document.querySelector('div[style*="position: fixed"]');
  if (existingDialog && !existingDialog.contains(event.target)) {
    document.body.removeChild(existingDialog);
  }
});
