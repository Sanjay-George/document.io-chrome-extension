let selectedElement = null;
let isModalOpen = false;

// Add an event listener to highlight elements on mouse hover
document.addEventListener("mouseover", (event) => {
    event.target.style.outline = "2px solid red";
});

// Remove the highlight when the mouse moves away
document.addEventListener("mouseout", (event) => {
    event.target.style.outline = "none";
});


// Right-click context menu handler
document.addEventListener('contextmenu', function (e) {
    // e.preventDefault();
    selectedElement = e.target;
    console.log('Selected element:', selectedElement);
    console.log('Query selector:', getQuerySelector(selectedElement));
});


// INJECTING REACT COMPONENTS



// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openModal') {
        const querySelector = getQuerySelector(selectedElement);
        console.log('Opening modal for:', querySelector);


        // TODO: fetch all annotations 
        openModal("test content");

        // // Fetch content for the modal from the API
        // fetch(`http://localhost:3000/api/fetchContent?selector=${encodeURIComponent(querySelector)}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         openModal(data.annotation);
        //     })
        //     .catch(error => console.error('Error fetching annotation:', error));
    }
});

// Function to get the query selector of the selected element
// TODO: Improve this logic. This is a basic implementation.
function getQuerySelector(element) {
    let selector = '';
    if (element.id) {
        selector = `#${element.id}`;
    } else if (element.className) {
        selector = `.${element.className.trim().split(' ').join('.')}`;
    } else {
        selector = element.tagName.toLowerCase();
    }
    return selector;
}


// Open a resizable modal at the bottom of the page
// TODO: Improve the modal - add a save button, edit button, etc.
function openModal(annotation) {
    isModalOpen = true;
    let modal = document.getElementById('annotation-modal');

    injectModal();

    // if (!modal) {
    //     modal = document.createElement('div');
    //     modal.id = 'annotation-modal';
    //     modal.style.position = 'fixed';
    //     modal.style.bottom = '0';
    //     modal.style.left = '0';
    //     modal.style.width = '100%';
    //     modal.style.height = '200px';
    //     modal.style.backgroundColor = '#f1f1f1';
    //     modal.style.borderTop = '1px solid #ccc';
    //     modal.style.zIndex = '10000';
    //     modal.innerHTML = `
    //     <textarea id="annotation-text" style="width: 100%; height: 80%;">${annotation}</textarea>
    //     <button id="minimize-modal">Minimize</button>
    //   `;
    //     document.body.appendChild(modal);

    //     // Handle minimize button
    //     document.getElementById('minimize-modal').addEventListener('click', function () {
    //         modal.style.height = '40px';
    //         isModalOpen = false;
    //     });

    //     // Make the modal resizable
    //     // TODO: improve the resizing UI/UX
    //     modal.style.resize = 'vertical';
    //     modal.style.overflow = 'auto';
    // } else {
    //     // Update the annotation text
    //     document.getElementById('annotation-text').value = annotation;
    // }
}


function injectModal() {

    // Check if the modal already exists
    if (!document.getElementById('dce-modal-root')) {
        // Create a div for the modal
        const modalContainer = document.createElement('div');
        modalContainer.id = 'dce-modal-root';

        console.log('Injecting modal...');

        // // Set basic styles for the container
        // modalContainer.style.position = 'fixed';
        // modalContainer.style.bottom = '0';
        // modalContainer.style.left = '0';
        // modalContainer.style.width = '100%';
        // modalContainer.style.zIndex = '-100000'; // Make sure it's above other content
        // modalContainer.style.backgroundColor = 'transparent'; // Make it transparent

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

    } else {
        // If modal already exists, toggle its visibility
        const modalContainer = document.getElementById('dce-modal-root');
        modalContainer.style.display = modalContainer.style.display === 'none' ? 'block' : 'none';
    }
}