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
  const editorBg = colors["editor.background"] || "var(--background)"
  const headerBg =
    colors["editorGroupHeader.tabsBackground"] ||
    (editorBg === "#FFFFFF" ? "#f3f4f6" : "#1e1e1e")
  const fgColor = colors["editor.foreground"] || "var(--foreground)"

  return (
    <Select
      value={theme}
      onValueChange={(val) => {
        localStorage.setItem("theme", val)
        if (val) setTheme(val)
      }}
    >
      <SelectTrigger
        size="sm"
        className={
          iconOnly
            ? "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent shadow-none hover:bg-white/10 focus:ring-0 [&>svg:last-child]:hidden"
            : "h-9 w-full border-white/20 font-mono text-xs hover:bg-white/5"
        }
        style={{ backgroundColor: "rgba(0,0,0,0.15)", color: fgColor }}
      >
        {iconOnly ? (
          <Palette
            className="size-5 text-gray-400 transition-colors hover:text-white"
            strokeWidth={1.5}
          />
        ) : (
          <div className="flex items-center gap-2 truncate">
            <Palette className="size-3.5 shrink-0 opacity-70" />
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
          <SelectLabel
            style={{ color: fgColor, opacity: 0.6 }}
            className="mb-1"
          >
            Themes ({themes.length})
          </SelectLabel>
          {themes.map((item) => (
            <SelectItem
              key={item.file}
              value={item.file}
              className="cursor-pointer rounded-sm text-xs focus:bg-white/10"
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
