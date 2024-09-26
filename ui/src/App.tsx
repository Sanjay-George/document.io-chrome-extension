import { useState } from 'react'
import './App.css'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import MDEditor from '@uiw/react-md-editor'
import CloseIcon from './components/close_icon';
import SaveIcon from './components/save_icon';
import DeleteIcon from './components/delete_icon';

let API_URL = '';

function App() {
    const [annotation, setAnnotation] = useState('');
    const [show, setShow] = useState(false);
    const [annotationMeta, setAnnotationMeta] = useState(null as any);
    const [isPageLevel, setIsPageLevel] = useState(false);

    const handleOpenModalMessage = async (event: MessageEvent) => {
        const { annotationId, target, url, pageId, serverUrl } = event.data;
        console.log('Open modal message parameters:', { annotationId, target, url, pageId, serverUrl });
        API_URL = serverUrl;
        let data = null;
        if (annotationId) {
            try {
                const res = await fetch(`${API_URL}/annotations/${annotationId}`);
                data = await res.json();
                data && setAnnotation(data.value);
                data && setIsPageLevel(data.type === 'page');
            }
            catch (error) {
                console.error(error);
            }
        }
        setAnnotationMeta({
            id: annotationId,
            target: target || data.target,
            url: url || data.url,
            pageId: pageId || data.pageId,
        } as any);
        setShow(true);
    }

    const handleClose = () => {
        resetModal();
        postMessage({ action: 'closeModal' });
    }

    const resetModal = () => {
        setAnnotation('');
        setAnnotationMeta(null);
        setIsPageLevel(false);
        setShow(false);
    }

    const handleDelete = async () => {
        if (annotationMeta?.id) {
            try {
                await fetch(`${API_URL}/annotations/${annotationMeta.id}`, {
                    method: 'DELETE',
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        resetModal();
        // postMessage({ action: 'closeModal' });
        postMessage({ action: 'deleteAnnotation', annotationId: annotationMeta.id });
    }

    const handleAnnotationTypeChange = (event: any) => {
        setIsPageLevel(event.target.checked);
    }

    const handleSave = async () => {
        const annotationObj = {
            target: annotationMeta?.target,
            url: annotationMeta?.url,
            value: annotation,
            pageId: annotationMeta?.pageId,
            type: isPageLevel ? 'page' : 'component',
        } as any;

        if (annotationMeta?.id) {
            // Update annotation
            annotationObj['id'] = annotationMeta.id;
            try {
                await fetch(`${API_URL}/annotations/${annotationMeta.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(annotationObj)
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            // Insert annotation
            try {
                await fetch(`${API_URL}/annotations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(annotationObj)
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        resetModal();
        // postMessage({ action: 'closeModal' });
        postMessage({ action: 'saveAnnotation', annotationId: annotationObj.id });
    }

    window.onmessage = (event) => {
        const { action } = event.data;
        if (action === 'openModal') {
            handleOpenModalMessage(event);
        }
    }

    return (show &&
        <>
            <ResizablePanelGroup
                direction="vertical"
                style={{ position: "fixed", bottom: 0, left: 0, height: '100vh', width: '100vw' }}
            >
                <ResizablePanel className="transparent-panel"></ResizablePanel>
                <ResizableHandle withHandle className='overlay-handle hover:bg-emerald-800' />
                <ResizablePanel className='overlay-panel' minSize={10}>
                    <div style={{ height: '100%', width: '100%' }} className='p-8'>
                        <MDEditor height='90%'
                            value={annotation} onChange={setAnnotation as any}
                            preview='live' />
                        <div className='flex flex-row'>
                            <div className='w-8/12 flex items-center'>
                                <label className="h-full inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isPageLevel} onChange={handleAnnotationTypeChange} />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600" />
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {isPageLevel ? 'Page' : 'Component'} Level Annotation
                                    </span>
                                </label>
                            </div>
                            <div className='w-4/12 flex justify-end space-x-2'>
                                <button onClick={handleDelete}
                                    className='btn mt-2 mb-2 bg-red-500 hover:bg-red-600 text-white text-sm mr-10'>
                                    <DeleteIcon />
                                </button>
                                <button onClick={handleSave} id='dce-modal-save' className='btn mt-2 mb-2  bg-emerald-700 text-white'>
                                    <SaveIcon />
                                </button>
                                <button onClick={handleClose} id='dce-modal-close' className='btn mt-2 mb-2 bg-slate-700 text-white'>
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default App
