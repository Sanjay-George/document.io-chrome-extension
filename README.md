## Usage
Once the extension is installed, simply navigate to any page where Document.io annotations are supported. The extension will automatically inject the necessary tools, allowing you to view, edit, and manage your annotations without interruption.

### Additional Usage Notes
- The extension only activates on click, so it is recommended to pin it in your Chrome toolbar for quick access.
- Annotations only work if the tab was opened from the main Document.io application and are valid for the current session. If the same website is manually opened in a new tab, annotations cannot be interacted with.
- The API server URL can be updated by clicking the extension icon. The default API server URL is http://localhost:5000, but this can be changed if needed.


### How It Works
- The extension communicates directly with the Document.io backend to fetch and display annotations on the page.
- CSP restrictions that block iframe loading are bypassed using this localized solution, making the annotation interface accessible on any site.
