async function handlePageLoad() {
    const pageId = getPageId();
    if (!pageId) {
        return;
    }
    injectModal();
    observer.observe(
        document.body,
        { childList: true, subtree: true }
    );
    const annotations = await getAnnotations(pageId);
    await highlightAnnotatedElements(annotations);
}


// Create a MutationObserver to watch for changes in the body
const observer = new MutationObserver(async (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const annotations = await getAnnotations(getPageId());
            await highlightAnnotatedElements(annotations);
        }
    }
});
