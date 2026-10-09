import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMonaco } from '@monaco-editor/react'
import { useEditorTheme } from '@/store/useEditorTheme'

export const useLoadEditorTheme = () => {
    const { theme, setThemeData, themeData } = useEditorTheme((state) => state)
    const monaco = useMonaco()
    const [isThemeLoaded, setIsThemeLoaded] = useState(false)

    useEffect(() => {
        if (!monaco || !theme) return

        const applyTheme = async () => {
            try {
                const response = await axios.get(`/themes/${theme}.json`)
                monaco.editor.defineTheme("prefix", response.data)
                monaco.editor.setTheme("prefix")
                setThemeData(response.data)
                setIsThemeLoaded(true)
            } catch (error) {
                console.error("Failed to load theme:", error)
                setIsThemeLoaded(true) // Still render the editor even if theme fails to load
            }
        }

        applyTheme()
    }, [theme, monaco, setThemeData])

    // Compute derived colors
    const colors = themeData?.colors || {}
    const editorBg = colors['editor.background'] || 'var(--background)'
    const headerBg = colors['editorGroupHeader.tabsBackground'] || (editorBg === '#FFFFFF' ? '#f3f4f6' : '#1e1e1e')
    const toolbarBg = colors['editor.background'] || 'var(--muted)'
    const fgColor = colors['editor.foreground'] || 'var(--foreground)'
    
    const sideBarBg = colors['sideBar.background'] || colors['editor.background'] || '#1e1e1e'
    const activityBarBg = colors['activityBar.background'] || sideBarBg

    return {
        isThemeLoaded,
        theme,
        editorBg,
        headerBg,
        toolbarBg,
        fgColor,
        sideBarBg,
        activityBarBg
    }
}
