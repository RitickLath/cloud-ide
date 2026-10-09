"use client"
import Editor from '@monaco-editor/react'
import TopTabs from './TopTabs'
import useActiveTabs from '@/store/useActiveTabs'
import { useLoadEditorTheme } from '@/hooks/useLoadEditorTheme'

const Sandbox = () => {
    const { workingTab, activeTabs } = useActiveTabs();
    const { isThemeLoaded, theme, editorBg, headerBg, toolbarBg, fgColor } = useLoadEditorTheme();

    if (!isThemeLoaded) return (
        <div className='flex flex-col h-full w-full'></div>
    )

    return (
        <div className="flex flex-col h-full w-full" style={{ backgroundColor: editorBg }}>
            
            {/* Tabs Container */}
            <div className='flex gap-0 overflow-x-auto border-b border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' style={{ backgroundColor: headerBg }}>
                {activeTabs.map((tab: any) => (
                    <TopTabs 
                        key={tab.filename}
                        filename={tab.filename} 
                        fileIcon={tab.fileIcon} 
                        extension={tab.extension} 
                    />
                ))}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 w-full overflow-hidden relative">
                <Editor
                    height="100%"
                    width="100%"
                    language="javascript"
                    theme="prefix"
                    defaultValue={`// JavaScript Sandbox\n// Select any theme from the dropdown above to change it live!\nconsole.log("Current theme: ${theme}");\n`}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    )
}

export default Sandbox