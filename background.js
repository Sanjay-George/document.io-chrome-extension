chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");

    chrome.contextMenus.create({
        id: "addEditAnnotation",
        title: "Add / Edit Annotation",
        contexts: ["all"]
    });
});

// Access the URL of the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0]; // Get the active tab
    if (currentTab) {
        console.log("Current URL: ", currentTab.url); // Logs the current tab's URL
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log('Current tab:', tab.url);
    }
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addEditAnnotation") {
        console.log('Context menu - add / edit annotation clicked');
        // Send message to content script to open the modal
        chrome.tabs.sendMessage(tab.id, { action: "annotate", targetElement: info.targetElementId });
    }
});