document.getElementById('save-url').addEventListener('click', () => {
    const serverUrl = document.getElementById('server-url').value;
    if (serverUrl) {
        if (!isValidUrl(serverUrl)) {
            alert('Please enter a valid URL. eg: http://localhost:5000, https://example.com');
            return;
        }
        chrome.storage.sync.set({ serverUrl }, () => {
            alert('Server URL saved! Refresh the page to apply the changes.');
            window.close();
        });
    } else {
        alert('Please enter a valid URL.');
    }
});

function prefillServerUrl() {
    chrome.storage.sync.get('serverUrl', (data) => {
        if (data.serverUrl) {
            document.getElementById('server-url').value = data.serverUrl;
        }
    });
}

function isValidUrl(url) {
    try {
        const u = new URL(url);
        // expect http://localhost, not localhost
        if (u.origin === 'null') {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', prefillServerUrl);