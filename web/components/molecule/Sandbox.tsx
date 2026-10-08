"use client"
import Editor from '@monaco-editor/react'
import ThemeSelector from '@/components/molecule/ThemeSelector'
import TopTabs from './TopTabs'
import useActiveTabs from '@/store/useActiveTabs'
import { useLoadEditorTheme } from '@/hooks/useLoadEditorTheme'

const Sandbox = () => {
    const { workingTab, activeTabs } = useActiveTabs();
    const { isThemeLoaded, theme, editorBg, headerBg, toolbarBg, fgColor } = useLoadEditorTheme();

    if (!isThemeLoaded) return (
        <div className='flex flex-col h-screen w-[50vw] border-r border-border'></div>
    )

    return (
        <div className="flex flex-col h-screen w-[50vw] border-r border-border" style={{ backgroundColor: editorBg }}>
            {/* Top Toolbar */}
            <div 
                className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0"
                style={{ backgroundColor: toolbarBg, color: fgColor }}
            >
                <div className="flex items-center gap-2">
                    <ThemeSelector />
                </div>
                <div className="text-xs opacity-70 font-mono">
                    Theme: <span className="font-semibold">{theme}</span>
                </div>
            </div>
            
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