import { useState } from 'react'
import './App.css'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import MDEditor from '@uiw/react-md-editor'

function App() {
    const [annotation, setAnnotation] = useState('');

    return (
        <>

            <ResizablePanelGroup direction="vertical" style={{ position: "fixed", bottom: 0, left: 0, height: '100vh', width: '100vw' }}>
                <ResizablePanel className="transparent-panel"></ResizablePanel>
                <ResizableHandle withHandle className='overlay-handle' />
                <ResizablePanel className='overlay-panel'>
                    <div style={{ height: '100%', width: '100%' }} className='p-8'>
                        <MDEditor height='100%' value={annotation} onChange={setAnnotation as any} preview='live' />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>



        </>
    )
}

export default App
