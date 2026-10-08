"use client"
import React, { useEffect, useRef, useState } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { useEditorTheme } from '@/store/useEditorTheme'
import axios from 'axios'
import ThemeSelector from '@/components/molecule/ThemeSelector'
import TopTabs from './TopTabs'
import useActiveTabs from '@/store/useActiveTabs'

const Sandbox = () => {
    const { theme, setThemeData, themeData } = useEditorTheme((state) => state)
    const monaco = useMonaco()
    const { workingTab, activeTabs } = useActiveTabs();

    useEffect(() => {
        if (!monaco || !theme) return
        console.log("active Tabs, ",activeTabs);

        const applyTheme = async () => {
            try {
                const response = await axios.get(`/themes/${theme}.json`)
                monaco.editor.defineTheme("prefix", response.data)
                monaco.editor.setTheme("prefix")
                setThemeData(response.data)
            } catch (error) {
                console.error("Failed to load theme:", error)
            }
        }

        applyTheme()
    }, [theme, monaco, setThemeData])

    const colors = themeData?.colors || {}
    const editorBg = colors['editor.background'] || 'var(--background)'
    const headerBg = colors['editorGroupHeader.tabsBackground'] || (editorBg === '#FFFFFF' ? '#f3f4f6' : '#1e1e1e')
    const toolbarBg = colors['editor.background'] || 'var(--muted)'
    const fgColor = colors['editor.foreground'] || 'var(--foreground)'

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