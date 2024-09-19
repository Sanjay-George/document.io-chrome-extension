// Open a resizable modal at the bottom of the page
function openModal({ querySelector }) {
    isModalOpen = true;
    isContextMenuOpen = false;

    // Get the pageId from the URL
    const pageId = getPageId();
    const url = window.location.origin + window.location.pathname;
    const element = document.querySelector(querySelector);
    const annotationId = element.dataset.annotationId || null;

    postMessage({
        action: 'openModal',
        target: querySelector,
        annotationId,
        url,
        pageId,
    });
}

function handleCloseModalMessage() {
    isModalOpen = false;
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
}

function handleDeleteAnnotationMessage(annotationId) {
    selectedElement.classList.remove(ANNOTATED_ELEMENT_CLASS);
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
    isModalOpen = false;
}

function handleSaveAnnotationMessage(annotationId) {
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
    selectedElement.classList.add(ANNOTATED_ELEMENT_CLASS);
    selectedElement.dataset.annotationId = annotationId;
    isModalOpen = false;
}

function injectModal() {
    // Create the modal container if it doesn't exist
    if (!document.getElementById(MODAL_ROOT_ID)) {
        // Create a div for the modal
        const modalContainer = document.createElement('div');
        modalContainer.id = MODAL_ROOT_ID;

        // Append the container to the body
        document.body.appendChild(modalContainer);

        // Inject the React bundle JS file (generated by Vite)
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('ui/dist/assets/index.js'); // Adjust the path if needed
        document.body.appendChild(script);

        // Optionally, inject the React CSS (if you have styles)
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('ui/dist/assets/index.css'); // Adjust the path if needed
        document.head.appendChild(link);
    }
}