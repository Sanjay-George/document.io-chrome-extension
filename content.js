let selectedElement = null;
let isModalOpen = false;
let isContextMenuOpen = false;
let SERVER_URL = 'http://localhost:5000';

const MODAL_ROOT_ID = 'dce-modal-root';
const HOVERD_ELEMENT_CLASS = 'dce-hovered-element';
const ANNOTATED_ELEMENT_CLASS = 'dce-annotated-element';
const ANNOTATED_ELEMENT_ICON_CLASS = 'dce-annotated-element-icon';


// Create a MutationObserver to watch for changes in the body
const observer = new MutationObserver(debounce(handleMutations, 200));

function addEventListeners() {
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener('contextmenu', handleContextMenuClick);
}

function removeEventListeners() {
    document.removeEventListener("mouseover", handleMouseOver);
    document.removeEventListener("mouseout", handleMouseOut);
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener('contextmenu', handleContextMenuClick);
}

// Listen for messages from the React component
window.onmessage = (event) => {
    const { action } = event.data;
    if (action === 'closeModal') {
        handleCloseModalMessage();
    }
    else if (action === 'deleteAnnotation') {
        handleDeleteAnnotationMessage(event.data.annotationId);
    }
    else if (action === 'saveAnnotation') {
        handleSaveAnnotationMessage(event.data.annotationId);
    }
};

// Listen for the messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'annotate') {
        const querySelector = getQuerySelector(selectedElement);
        openModal(querySelector);
    }
});

// Inject react component into the page on page load
https://stackoverflow.com/a/43245774/6513094
if (document.readyState !== 'complete') {
    window.addEventListener('load', handlePageLoad);
} else {
    handlePageLoad();
}
