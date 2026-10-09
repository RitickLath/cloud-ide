"use client"

import { Palette } from "lucide-react"
import { useEditorTheme } from "@/store/useEditorTheme"
import { themes } from "@/public/themes/index.js"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/atom/select"

export const ThemeSelector = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const { theme, setTheme, themeData } = useEditorTheme((state: any) => state)
  
  // Extract dynamic colors for the dropdown to perfectly match the modal background
  const colors = themeData?.colors || {}
  const editorBg = colors['editor.background'] || 'var(--background)'
  const headerBg = colors['editorGroupHeader.tabsBackground'] || (editorBg === '#FFFFFF' ? '#f3f4f6' : '#1e1e1e')
  const fgColor = colors['editor.foreground'] || 'var(--foreground)'

  return (
    <Select
      value={theme}
      onValueChange={(val) => {
        localStorage.setItem("theme", val);
        if (val) setTheme(val)
      }}
    >
      <SelectTrigger 
        size={iconOnly ? "icon" : "sm"} 
        className={iconOnly ? "w-10 h-10 flex items-center justify-center border-0 bg-transparent hover:bg-white/10 shadow-none focus:ring-0 rounded-md cursor-pointer [&>svg:last-child]:hidden" : "w-full h-9 text-xs font-mono border-white/20 hover:bg-white/5"}
        style={{ backgroundColor: 'rgba(0,0,0,0.15)', color: fgColor }}
      >
        {iconOnly ? (
          <Palette className="size-5 text-gray-400 hover:text-white transition-colors" strokeWidth={1.5} />
        ) : (
          <div className="flex items-center gap-2 truncate">
            <Palette className="size-3.5 opacity-70 shrink-0" />
            <SelectValue placeholder="Select Theme" />
          </div>
        )}
      </SelectTrigger>
      <SelectContent 
        alignItemWithTrigger={false} 
        side="bottom" 
        sideOffset={6}
        align="start"
        className="max-h-64 w-62.5 border-white/10 shadow-2xl"
        style={{ backgroundColor: headerBg, color: fgColor }}
      >
        <SelectGroup>
          <SelectLabel style={{ color: fgColor, opacity: 0.6 }} className="mb-1">Themes ({themes.length})</SelectLabel>
          {themes.map((item) => (
            <SelectItem 
                key={item.file} 
                value={item.file} 
                className="text-xs focus:bg-white/10 cursor-pointer rounded-sm"
                style={{ color: fgColor }}
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ThemeSelector
