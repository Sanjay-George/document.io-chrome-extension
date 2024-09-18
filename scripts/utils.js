async function highlightAnnotatedElements(annotations) {
    for (let annotation of annotations) {
        const { _id: id, target } = annotation;
        const element = document.querySelector(target);
        if (element && !element.classList.contains(ANNOTATED_ELEMENT_CLASS)) {
            element.classList.add(ANNOTATED_ELEMENT_CLASS);
            element.dataset.annotationId = id;

            // Add view icon
            const icon = document.createElement('div');
            icon.innerHTML = view_icon_svg;
            icon.classList.add(ANNOTATED_ELEMENT_ICON_CLASS);
            icon.onclick = () => {
                console.log('View annotation:', annotation);
            };
            icon.style.position = 'absolute';
            icon.style.top = '0';
            icon.style.right = '0';
            // Assign height and width based on element size
            icon.style.height = `min(20px, ${element.offsetHeight - 5}px)`;
            icon.style.width = `min(20px, ${element.offsetHeight - 5}px)`;
            icon.style.padding = '2px';
            icon.style.backgroundColor = 'rgba(0, 150, 255, 0.5)';
            icon.style.color = 'white';

            element.appendChild(icon);
            element.style.position = 'relative';
        }
    }
}

const view_icon_svg = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
`;

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
                    .filter(i => i !== HOVERD_ELEMENT_CLASS)
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


// Function to get the pageId from URL or session storage
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

// TODO: URL should be configurable from the extension settings
async function getAnnotations(pageId) {
    const response = await fetch(`http://localhost:5000/pages/${pageId}/annotations`);
    return response.json();
}

// debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}