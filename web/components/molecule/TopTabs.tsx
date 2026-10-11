import { X } from 'lucide-react'
import useEditorStore from '@/store/useEditorStore'
import { useEditorTheme } from '@/store/useEditorTheme'
import { FileIcon } from '../atom/FileIcon'

interface TopTabPropType {
    path: string
    fileName: string
    isEdited?: boolean
}

const TopTabs = ({ path, fileName, isEdited }: TopTabPropType) => {
    const currentFile = useEditorStore((state) => state.currentFile)
    const switchFile = useEditorStore((state) => state.switchFile)
    const closeFile = useEditorStore((state) => state.closeFile)

    const themeData = useEditorTheme((state) => state.themeData)
    const colors = themeData?.colors || {}
    
    const isActive = currentFile?.path === path
    
    // Determine colors based on the theme or fallback to a standard layout
    const activeBg = colors['tab.activeBackground'] || colors['editor.background'] || 'var(--background)'
    const activeFg = colors['tab.activeForeground'] || colors['editor.foreground'] || 'var(--foreground)'
    const inactiveBg = colors['tab.inactiveBackground'] || 'transparent'
    const inactiveFg = colors['tab.inactiveForeground'] || colors['editorWhitespace.foreground'] || 'var(--muted-foreground)'
    
    const borderActive = '#3b82f6'

    const style = {
        backgroundColor: isActive ? activeBg : inactiveBg,
        color: isActive ? activeFg : inactiveFg,
        borderBottom: isActive ? `2px solid ${borderActive}` : '2px solid transparent',
        transition: 'background-color 0.15s ease'
    }

    return (
        <div 
            style={style}
            className={`w-40 h-10 px-3 flex items-center justify-between cursor-pointer hover:opacity-100 ${isActive ? 'opacity-100 z-10' : 'opacity-60 border-r border-white/10'}`} 
            onClick={() => switchFile(path)}
        >
            <div className='flex items-center gap-2 truncate'>
                <div className="w-4 h-4 flex shrink-0 items-center justify-center">
                    <FileIcon name={fileName} />
                </div>
                <span className='font-medium text-[11px] truncate'>{fileName}</span>
                {isEdited && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 ml-1"></span>}
            </div>
            
            <div 
                className="size-5 shrink-0 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 rounded-sm ml-2 cursor-pointer transition-colors"
                onClick={(e) => {
                    e.stopPropagation()
                    closeFile(path)
                }}
            >
                <X className="size-3" />
            </div>
        </div>
    )
}

export default TopTabs