import React from 'react'
import { Button } from '../atom/button'
import { X, FileCode2 } from 'lucide-react'
import useActiveTabs from '@/store/useActiveTabs'
import { useEditorTheme } from '@/store/useEditorTheme'

interface TopTabPropType {
    filename: string
    fileIcon: string | undefined
    extension: string | undefined
}

const TopTabs = ({ filename, fileIcon, extension }: TopTabPropType) => {
    const workingTab = useActiveTabs((state: any) => state.workingTab)
    const removeActiveTab = useActiveTabs((state: any) => state.removeActiveTab)
    const setWorkingTab = useActiveTabs((state: any) => state.setWorkingTab)
    const activeTabs = useActiveTabs((state: any) => state.activeTabs)

    const themeData = useEditorTheme((state) => state.themeData)
    const colors = themeData?.colors || {}
    
    const isActive = workingTab === filename
    
    // Determine colors
    const activeBg = colors['tab.activeBackground'] || colors['editor.background'] || 'var(--background)'
    const activeFg = colors['tab.activeForeground'] || colors['editor.foreground'] || 'var(--foreground)'
    const inactiveBg = colors['tab.inactiveBackground'] || 'transparent'
    const inactiveFg = colors['tab.inactiveForeground'] || colors['editorWhitespace.foreground'] || 'var(--muted-foreground)'
    
    const borderActive = colors['tab.activeBorderTop'] || colors['editor.selectionBackground'] || 'transparent'

    const style = {
        backgroundColor: isActive ? activeBg : inactiveBg,
        color: isActive ? activeFg : inactiveFg,
        borderTop: isActive ? `2px solid ${borderActive}` : '2px solid transparent',
        borderRadius: 0,
        transition: 'all 0.15s ease'
    }
    
    return (
        <Button 
            variant="ghost" 
            style={style}
            className={`w-40 h-9 px-3 py-1 flex items-center justify-between rounded-none shadow-none hover:opacity-90 ${isActive ? 'opacity-100 z-10' : 'opacity-60 border-r border-border/20'}`} 
            onClick={() => setWorkingTab(filename)}
        >
            <div className='flex items-center gap-2 truncate'>
                <FileCode2 className="size-3.5 shrink-0 opacity-70" />
                <span className='font-medium text-[11px] truncate'>{filename}</span>
            </div>
            <div 
                className="size-5 shrink-0 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 rounded-sm ml-2 cursor-pointer transition-colors"
                onClick={(e) => {
                    e.stopPropagation()
                    removeActiveTab(filename)
                }}
            >
                <X className="size-3" />
            </div>
        </Button>
    )
}

export default TopTabs