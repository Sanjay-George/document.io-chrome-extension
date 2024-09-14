chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");

    chrome.contextMenus.create({
        id: "addEditAnnotation",
        title: "Add / Edit Annotation",
        contexts: ["all"]
    });

    // Listen for when the user clicks on the context menu item
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "addEditAnnotation") {
            // Send message to content script to open the modal
            chrome.tabs.sendMessage(tab.id, { action: "openModal", targetElement: info.targetElementId });
        }
    });

    // // Function to send the ping request
    // const sendPingRequest = () => {
    //     console.log('Sending ping request...');
    //     fetch('http://localhost:5000/pages/?documentationId=66d70df18125285844d41c3f')
    //         .then(response => response.json())
    //         .then(data => console.log('Ping response:', data))
    //         .catch(error => console.error('Error:', error));
    // };

    // // Send the ping request every 30 seconds
    // setInterval(sendPingRequest, 30000); // 30 seconds = 30,000 milliseconds
});

// Access the URL of the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0]; // Get the active tab
    if (currentTab) {
        console.log("Current URL: ", currentTab.url); // Logs the current tab's URL
    }
});