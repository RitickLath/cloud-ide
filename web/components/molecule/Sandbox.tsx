"use client"
import React, { useEffect } from "react"
import Editor, { type OnChange } from "@monaco-editor/react"
import TopTabs from "./TopTabs"
import useEditorStore, { type OpenFile } from "@/store/useEditorStore"
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme"
import { getLanguageFromExtension } from "@/lib/utils"

const Sandbox: React.FC = () => {
  const openFiles: OpenFile[] = useEditorStore((state) => state.openFiles)
  const currentFile: OpenFile | null = useEditorStore(
    (state) => state.currentFile
  )
  const updateFileContent: (path: string, content: string) => void =
    useEditorStore((state) => state.updateFileContent)

  const { isThemeLoaded, theme, editorBg, headerBg } = useLoadEditorTheme()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        !event.shiftKey &&
        (event.key.toLowerCase() === "w" || event.code === "KeyW")
      ) {
        event.preventDefault()
        const { currentFile, closeFile } = useEditorStore.getState()
        if (currentFile) {
          closeFile(currentFile.path)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleEditorChange: OnChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      updateFileContent(currentFile.path, value)
    }
  }

  if (!isThemeLoaded) {
    return <div className="flex h-full w-full flex-col"></div>
  }

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ backgroundColor: editorBg }}
    >
      {/* Tabs Container */}
      <div
        className="flex scrollbar-none gap-0 overflow-x-auto border-b border-border [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundColor: headerBg }}
      >
        {openFiles.map((tab: OpenFile) => (
          <TopTabs
            key={tab.path}
            path={tab.path}
            fileName={tab.fileName}
            isEdited={tab.isEdited}
          />
        ))}
      </div>

      {/* Monaco Editor */}
      <div className="relative w-full flex-1 overflow-hidden">
        {currentFile ? (
          <Editor
            key={currentFile.path}
            height="100%"
            width="100%"
            language={getLanguageFromExtension(currentFile.extension)}
            theme="prefix"
            value={currentFile.content}
            onChange={handleEditorChange}
            onMount={(editor, monaco) => {
              // Register Alt+W directly inside Monaco editor
              editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyW, () => {
                const { currentFile, closeFile } = useEditorStore.getState()
                if (currentFile) {
                  closeFile(currentFile.path)
                }
              })
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm opacity-40 select-none">
            No file open. Select a file from the explorer to view.
          </div>
        )}
      </div>
    </div>
  )
}

export default Sandbox
