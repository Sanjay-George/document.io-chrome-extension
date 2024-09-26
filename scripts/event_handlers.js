const handleMouseOver = (event) => {
    if (isModalOpen || isContextMenuOpen) {
        return;
    }
    if (event.target.classList.contains(ANNOTATED_ELEMENT_CLASS)
        || event.target.classList.contains(ANNOTATED_ELEMENT_ICON_CLASS)) {
        return;
    }
    event.target.classList.add(HOVERD_ELEMENT_CLASS);
};

const handleMouseOut = (event) => {
    if (isModalOpen || isContextMenuOpen) {
        return;
    }
    event.target.classList.remove(HOVERD_ELEMENT_CLASS);
}

const handleMouseDown = (event) => {
    // set context menu open to false if the user clicks outside the context menu
    if (isContextMenuOpen) {
        isContextMenuOpen = false;
        return selectedElement?.classList?.remove(HOVERD_ELEMENT_CLASS);
    }
    if (isModalOpen) {
        return;
    }
};

const handleContextMenuClick = (event) => {
    isContextMenuOpen = true;
    selectedElement = event.target;

    console.log('User selected element:', selectedElement);
    const qs = getQuerySelector(selectedElement);
    console.log('Query selector:', qs);
    console.log('Element recorded:', document.querySelector(qs));
};


async function handlePageLoad() {
    const pageId = getPageId();
    if (!pageId) {
        removeEventListeners();
        return;
    }
    injectModal();
    addEventListeners();
    const annotations = await getAnnotations(pageId);
    await highlightAnnotatedElements(annotations);
    if (observer) {
        observer.observe(
            document.body,
            { childList: true, subtree: true }
        );
    }
}



async function handleMutations(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const annotations = await getAnnotations(getPageId());
            await highlightAnnotatedElements(annotations);

        }
    }
}
