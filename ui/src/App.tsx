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

function App() {
    const [annotation, setAnnotation] = useState('');
    const [show, setShow] = useState(false);
    const [annotationMeta, setAnnotationMeta] = useState(null as any);

    const handleOpenModalMessage = async (event: MessageEvent) => {
        const { annotationId, target, url, pageId } = event.data;
        console.log('Open modal message parameters:', { annotationId, target, url, pageId });

        if (annotationId) {
            try {
                const res = await fetch(`http://localhost:5000/annotations/${annotationId}`);
                const data = await res.json();
                data && setAnnotation(data.value);
            }
            catch (error) {
                console.error(error);
            }
        }
        setAnnotationMeta({ id: annotationId, target, url, pageId } as any);
        setShow(true);
    }

    const handleClose = () => {
        resetModal();
        postMessage({ action: 'closeModal' });
    }

    const resetModal = () => {
        setAnnotation('');
        setAnnotationMeta(null);
        setShow(false);
    }

    const handleDelete = async () => {
        if (annotationMeta?.id) {
            try {
                await fetch(`http://localhost:5000/annotations/${annotationMeta.id}`, {
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

    const handleSave = async () => {
        const annotationObj = {
            target: annotationMeta?.target,
            url: annotationMeta?.url,
            value: annotation,
            pageId: annotationMeta?.pageId,
        } as any;

        if (annotationMeta?.id) {
            // Update annotation
            annotationObj['id'] = annotationMeta.id;
            try {
                await fetch(`http://localhost:5000/annotations/${annotationMeta.id}`, {
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
                await fetch(`http://localhost:5000/annotations`, {
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
                <ResizablePanel className='overlay-panel' minSize={25}>
                    <div style={{ height: '100%', width: '100%' }} className='p-8'>
                        <MDEditor height='90%' value={annotation} onChange={setAnnotation as any} preview='live' />
                        <div className='flex justify-end space-x-2'>
                            <button onClick={handleDelete} className='btn mt-2 mb-2 bg-red-500 hover:bg-red-600 text-white text-sm mr-10'><DeleteIcon /></button>
                            <button onClick={handleSave} id='dce-modal-save' className='btn mt-2 mb-2  bg-emerald-700 text-white'>
                                <SaveIcon />
                            </button>
                            <button onClick={handleClose} id='dce-modal-close' className='btn mt-2 mb-2 bg-slate-700 text-white text-sm'>
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default App
