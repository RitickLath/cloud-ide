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

export const ThemeSelector = () => {
  const { theme, setTheme } = useEditorTheme()

  return (
    <Select
      value={theme}
      onValueChange={(val) => {
        localStorage.setItem("theme", val);
        if (val) setTheme(val)
      }}
    >
      <SelectTrigger size="sm" className="w-45 h-8 text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <Palette className="size-3.5 text-primary shrink-0" />
          <SelectValue placeholder="Select Theme" />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-64">
        <SelectGroup>
          <SelectLabel>Themes ({themes.length})</SelectLabel>
          {themes.map((item) => (
            <SelectItem key={item.file} value={item.file} className="text-xs">
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ThemeSelector
