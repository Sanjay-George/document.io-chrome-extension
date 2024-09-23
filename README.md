# Document.io - Companion Chrome Extension

This companion Chrome extension enables users to **view** and **edit annotations** directly on web pages. Due to certain websites’ strong Content Security Policies (CSP), this extension is required to bypass these restrictions, allowing the annotation interface to work seamlessly with the main Document.io application.

## 🎯 Motivation

Many websites implement strict CSP rules that prevent loading external resources, such as iframes, directly into their pages. This makes it difficult to integrate the annotation interface into the main Document.io platform. By using this Chrome extension, users can circumvent these restrictions and still annotate content directly on the pages they visit. 

The extension ensures secure and localized interaction with the web page, keeping your browsing experience safe and private.


## 🚀 Features

- **View annotations** on any supported web page.
- **Edit and create annotations** in real-time.
- **Secure and localized** – all interactions are processed safely within your browser.

<br />


## 📦 Getting Started

Setting up the extension is easy and quick. Follow these steps to install it locally:

### Prerequisites

- **Google Chrome** browser (latest version recommended)

### Steps to Install

1. **Download or Clone the Extension**:
   - Clone the repository or download the extension folder located at `chrome-extension/` within the project.

2. **Open Chrome Extensions Page**:
   - In Chrome, navigate to `chrome://extensions/` or go to the menu: `More Tools` → `Extensions`.

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner of the Extensions page.

4. **Load Unpacked Extension**:
   - Click on the "Load unpacked" button and select the `chrome-extension/` folder from your downloaded project.

5. **Verify Installation**:
   - The extension should now be visible in your Chrome toolbar, ready to work with the application.

<br />

## Usage
Once the extension is installed, simply navigate to any page where Document.io annotations are supported. The extension will automatically inject the necessary tools, allowing you to view, edit, and manage your annotations without interruption.

### Additional Usage Notes
- The extension only activates on click, so it is recommended to pin it in your Chrome toolbar for quick access.
- Annotations only work if the tab was opened from the main Document.io application and are valid for the current session. If the same website is manually opened in a new tab, annotations cannot be interacted with.
- The API server URL can be updated by clicking the extension icon. The default API server URL is http://localhost:5000, but this can be changed if needed.


### How It Works
- The extension communicates directly with the Document.io backend to fetch and display annotations on the page.
- CSP restrictions that block iframe loading are bypassed using this localized solution, making the annotation interface accessible on any site.
