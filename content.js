let selectedElement = null;
let isModalOpen = false;
let isContextMenuOpen = false;

const MODAL_ROOT_ID = 'dce-modal-root';
const HOVERD_ELEMENT_CLASS = 'dce-hovered-element';
const ANNOTATED_ELEMENT_CLASS = 'dce-annotated-element';

// TODO: handle incremental client side rendering (HTML below the viewport is loaded later, so annotations are not highlighted)
// TODO: If pageID is null, deactivate the extension

// Add an event listener to highlight elements on mouse hover
document.addEventListener("mouseover", (event) => {
    if (isModalOpen || isContextMenuOpen) {
        return;
    }
    if (event.target.classList.contains(ANNOTATED_ELEMENT_CLASS)) {
        return;
    }
    event.target.classList.add(HOVERD_ELEMENT_CLASS);
});

// Remove the highlight when the mouse moves away
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
        if (selectedElement) {
            selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
        }
        return;
    }
    if (isModalOpen) {
        return;
    }

});


// Right-click context menu handler
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

// Message handler
window.onmessage = (event) => {
    const { action } = event.data;
    if (action === 'closeModal') {
        handleCloseModalMessage();
    }
};

// Inject react component into the page on page load
https://stackoverflow.com/a/43245774/6513094
if (document.readyState !== 'complete') {
    window.addEventListener('load', handlePageLoad);
} else {
    handlePageLoad();
}

function handlePageLoad() {
    console.log('Page loaded');

    const pageId = getPageId();
    if (!pageId) {
        return;
    }
    injectModal();
    highlightAnnotatedElements();
}

async function highlightAnnotatedElements() {
    const pageId = getPageId();
    const annotations = await fetch(`http://localhost:5000/pages/${pageId}/annotations`);
    const annotationsJson = await annotations.json();

    for (let annotation of annotationsJson) {
        const { _id: id, target } = annotation;
        const element = document.querySelector(target);
        if (element) {
            element.classList.add(ANNOTATED_ELEMENT_CLASS);
            element.dataset.annotationId = id;
        }
    }
}


// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'annotate') {
        const querySelector = getQuerySelector(selectedElement);
        openModal({ querySelector });
    }
});

// Open a resizable modal at the bottom of the page
function openModal({ querySelector }) {
    isModalOpen = true;

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

function getPageId() {
    let pageId = sessionStorage.getItem('dce_pageId');
    if (pageId && pageId.length > 0) {
        return pageId;
    }

    const urlParams = new URLSearchParams(window.location.search);
    pageId = urlParams.get('pageId');
    if (pageId) {
        sessionStorage.setItem('dce_pageId', pageId);
    }
    return pageId;
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


function handleCloseModalMessage() {
    isModalOpen = false;
    selectedElement.classList.remove(HOVERD_ELEMENT_CLASS);
}

// Function to get the query selector of the selected element
function getQuerySelector(element) {
    if (!(element instanceof Element)) {
        throw new Error('The provided input is not a DOM element');
    }

    function getPathTo(element) {
        if (element.id) {
            return `#${CSS.escape(element.id)}`;
        }

        if (element === document.body) {
            return 'body';
        }

        let path = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.className && typeof element.className === 'string') {
                const classSelector = `${Array.from(element.classList)
                    .filter(i => i.trim().length > 0)
                    .map(i => CSS.escape(i))
                    .join('.')}`;
                classSelector.length > 0 && (selector += `.${classSelector}`);
            }
            if (element !== document.documentElement) {
                let sibling = element;
                let nth = 1;
                while (sibling = sibling.previousElementSibling) {
                    if (sibling.nodeName.toLowerCase() === selector.split('.')[0]) {
                        nth++;
                    }
                }
                selector += `:nth-of-type(${nth})`;
            }
            path.unshift(selector);
            element = element.parentNode;

            // TODO: check performance impact.
            if (document.querySelectorAll(path.join(' > ')).length === 1) {
                break;
            }
        }
        return path.join(' > ');
    }

    return getPathTo(element);
}
