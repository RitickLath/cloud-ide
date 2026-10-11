import { X } from "lucide-react"
import useEditorStore from "@/store/useEditorStore"
import { useEditorTheme } from "@/store/useEditorTheme"
import { FileIcon } from "../atom/FileIcon"

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
  const activeBg =
    colors["tab.activeBackground"] ||
    colors["editor.background"] ||
    "var(--background)"
  const activeFg =
    colors["tab.activeForeground"] ||
    colors["editor.foreground"] ||
    "var(--foreground)"
  const inactiveBg = colors["tab.inactiveBackground"] || "transparent"
  const inactiveFg =
    colors["tab.inactiveForeground"] ||
    colors["editorWhitespace.foreground"] ||
    "var(--muted-foreground)"

  const borderActive = "#3b82f6"

  const style = {
    backgroundColor: isActive ? activeBg : inactiveBg,
    color: isActive ? activeFg : inactiveFg,
    borderBottom: isActive
      ? `2px solid ${borderActive}`
      : "2px solid transparent",
    transition: "background-color 0.15s ease",
  }

  return (
    <div
      style={style}
      className={`flex h-10 w-40 cursor-pointer items-center justify-between px-3 hover:opacity-100 ${isActive ? "z-10 opacity-100" : "border-r border-white/10 opacity-60"}`}
      onClick={() => switchFile(path)}
    >
      <div className="flex items-center gap-2 truncate">
        <div className="flex h-4 w-4 shrink-0 items-center justify-center">
          <FileIcon name={fileName} />
        </div>
        <span className="truncate text-[11px] font-medium">{fileName}</span>
        {isEdited && (
          <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
        )}
      </div>

      <div
        className="ml-2 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-black/10 dark:hover:bg-white/20"
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
