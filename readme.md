# ContextGPT Chrome Extension

<p align="center">
    <a href="https://github.com/duan-li/context-gpt" target="_blank">
        <img src="https://github.com/duan-li/context-gpt/raw/main/icon128.png" width="128" alt="ContextGPT Logo">
    </a>
</p>


ContextGPT is a Chrome extension that allows users to send selected text from any webpage to a specified API and display the response in a dialog box.

## Features

- Right-click context menu integration
- Custom API URL and API Key configuration
- Popup dialog for displaying API responses
- Options page for managing extension settings

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Select text on any webpage.
2. Right-click and choose "ContextGPT" from the context menu.
3. The selected text will be sent to the configured API, and the response will be displayed in a popup dialog.

## Configuration

1. Click on the extension icon in the Chrome toolbar.
2. Click "Open Options" to access the options page.
3. Enable or disable the extension using the checkbox.
4. Enter your API URL and API Key.
5. Click "Save" to apply the changes.

## Files

- `manifest.json`: Extension configuration
- `background.js`: Background script for handling context menu and API requests
- `content.js`: Content script for creating and managing the response dialog
- `popup.html` and `popup.js`: Extension popup
- `options.html` and `options.js`: Options page for configuration
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
