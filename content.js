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
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'annotation-modal';
        modal.style.position = 'fixed';
        modal.style.bottom = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '200px';
        modal.style.backgroundColor = '#f1f1f1';
        modal.style.borderTop = '1px solid #ccc';
        modal.style.zIndex = '10000';
        modal.innerHTML = `
        <textarea id="annotation-text" style="width: 100%; height: 80%;">${annotation}</textarea>
        <button id="minimize-modal">Minimize</button>
      `;
        document.body.appendChild(modal);

        // Handle minimize button
        document.getElementById('minimize-modal').addEventListener('click', function () {
            modal.style.height = '40px';
            isModalOpen = false;
        });

        // Make the modal resizable
        // TODO: improve the resizing UI/UX
        modal.style.resize = 'vertical';
        modal.style.overflow = 'auto';
    } else {
        // Update the annotation text
        document.getElementById('annotation-text').value = annotation;
    }
}