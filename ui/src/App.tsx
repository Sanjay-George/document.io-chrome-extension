import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import MDEditor from '@uiw/react-md-editor'

function App() {
    const [count, setCount] = useState(0);
    const [annotation, setAnnotation] = useState('');

    return (
        <>

            <div style={{ height: '50vh' }}>
                <div>
                    <a href="https://vitejs.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </div>


            <ResizablePanelGroup direction="vertical" style={{ position: "fixed", bottom: 0, left: 0, height: '100vh', width: '100vw' }}>
                <ResizablePanel className="transparent-panel"></ResizablePanel>
                <ResizableHandle withHandle className='overlay-handle' />
                <ResizablePanel className='overlay-panel'>
                    <div style={{ height: '100%', width: '100%' }} className='p-8'>
                        <MDEditor height='100%' value={annotation} onChange={setAnnotation} preview='live' />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>



        </>
    )
}

export default App
