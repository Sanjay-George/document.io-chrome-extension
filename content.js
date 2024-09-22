let selectedElement = null;
let isModalOpen = false;
let isContextMenuOpen = false;
let SERVER_URL = 'http://localhost:5000';

const MODAL_ROOT_ID = 'dce-modal-root';
const HOVERD_ELEMENT_CLASS = 'dce-hovered-element';
const ANNOTATED_ELEMENT_CLASS = 'dce-annotated-element';
const ANNOTATED_ELEMENT_ICON_CLASS = 'dce-annotated-element-icon';

// TODO: If pageID is null, deactivate the extension
document.addEventListener("mouseover", (event) => {
    if (isModalOpen || isContextMenuOpen) {
        return;
    }
    if (event.target.classList.contains(ANNOTATED_ELEMENT_CLASS)
        || event.target.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS)) {
        return;
    }
    event.target.classList.add(HOVERD_ELEMENT_CLASS);
});

document.addEventListener("mouseout", (event) => {
    if (isModalOpen || isContextMenuOpen) {
        return;
    }
    event.target.classList.remove(HOVERD_ELEMENT_CLASS);
});

document.addEventListener("mousedown", (event) => {
    // set context menu open to false if the user clicks outside the context menu
    if (isContextMenuOpen) {
        isContextMenuOpen = false;
        if (!selectedElement) {
            return;
        }
        return selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
    }
    if (isModalOpen) {
        return;
    }
});

document.addEventListener('contextmenu', function (e) {
    isContextMenuOpen = true;
    selectedElement = e.target;

    console.log();
    console.log('User selected element:', selectedElement);
    const qs = getQuerySelector(selectedElement);
    console.log('Query selector:', qs);
    console.log('Element recorded:', document.querySelector(qs));
    console.log();

});

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
