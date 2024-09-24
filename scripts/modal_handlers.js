// Open a resizable modal at the bottom of the page
function openModal(querySelector, annotationId = null) {
    isModalOpen = true;
    isContextMenuOpen = false;

    // Viewing / Editing existing annotation
    if (annotationId) {
        postMessage({
            action: 'openModal',
            annotationId,
            serverUrl: SERVER_URL,
        });
        return;
    }

    // Adding a new annotation
    const pageId = getPageId();
    const url = window.location.origin + window.location.pathname;
    const element = document.querySelector(querySelector);
    postMessage({
        action: 'openModal',
        target: querySelector,
        annotationId: annotationId || element.dataset.annotationId || null,
        url,
        pageId,
        serverUrl: SERVER_URL,
    });
}

function handleCloseModalMessage() {
    isModalOpen = false;
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
}

function handleDeleteAnnotationMessage(annotationId) {
    isModalOpen = false;
    if (!selectedElement) {
        return;
    }
    selectedElement.classList.remove(ANNOTATED_ELEMENT_CLASS);
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
}

function handleSaveAnnotationMessage(annotationId) {
    isModalOpen = false;
    if (!selectedElement) {
        return;
    }
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
    selectedElement.classList.add(ANNOTATED_ELEMENT_CLASS);
    selectedElement.dataset.annotationId = annotationId;
}

function injectModal() {
    if (!document.getElementById(MODAL_ROOT_ID)) {
        const modalContainer = document.createElement('div');
        modalContainer.id = MODAL_ROOT_ID;
        document.body.appendChild(modalContainer);

        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('ui/dist/assets/index.js');
        document.body.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('ui/dist/assets/index.css');
        document.head.appendChild(link);
    }
}