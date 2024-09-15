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

function App() {
    const [annotation, setAnnotation] = useState('');
    const [show, setShow] = useState(false);


    const handleOpenModalMessage = (_: MessageEvent) => {
        // query selector will be an input
        // Fetch annotations from the server
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        postMessage({ action: 'closeModal' });
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
                <ResizableHandle withHandle className='overlay-handle bg-emerald-800' />
                <ResizablePanel className='overlay-panel' minSize={25}>
                    <div style={{ height: '100%', width: '100%' }} className='p-8'>
                        <MDEditor height='90%' value={annotation} onChange={setAnnotation as any} preview='live' />
                        <div className='flex justify-end space-x-2'>
                            <button id='dce-modal-save' className='btn mt-2 mb-2 bg-emerald-700 text-white'>
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
