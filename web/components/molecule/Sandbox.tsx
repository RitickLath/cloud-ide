"use client"
import React, { useEffect, useRef, useState } from "react"
import Editor, { type OnChange } from "@monaco-editor/react"
import TopTabs from "./TopTabs"
import useEditorStore, { type OpenFile } from "@/store/useEditorStore"
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme"
import { getLanguageFromExtension } from "@/lib/utils"
import { useSocket } from "@/store/useSocket"
import { useParams } from "next/navigation"
import { RefreshCw } from "lucide-react"

const EDITOR_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
} as const

const closeActiveTab = () => {
  const { currentFile, closeFile } = useEditorStore.getState()
  if (currentFile) {
    closeFile(currentFile.path)
  }
}

const Sandbox: React.FC = () => {
  const openFiles = useEditorStore((state) => state.openFiles)
  const currentFile = useEditorStore((state) => state.currentFile)
  const updateFileContent = useEditorStore((state) => state.updateFileContent)
  const markFileSaved = useEditorStore((state) => state.markFileSaved)

  const { isThemeLoaded, editorBg, headerBg } = useLoadEditorTheme()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const params = useParams()
  const projectId = params?.projectId as string
  const { socket } = useSocket()

  // Alt + W shortcut for window
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        !event.shiftKey &&
        (event.key.toLowerCase() === "w" || event.code === "KeyW")
      ) {
        event.preventDefault()
        closeActiveTab()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleSyncFile = () => {
    if (!currentFile || !socket || isSyncing) return

    setIsSyncing(true)
    socket.emit(
      "file-change",
      {
        projectId,
        action: "read",
        filePath: currentFile.path,
      },
      (res: any) => {
        setIsSyncing(false)
        if (res?.content !== undefined) {
          updateFileContent(currentFile.path, res.content)
          markFileSaved(currentFile.path)
        }
      }
    )
  }

  const handleEditorChange: OnChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      const filePathToSave = currentFile.path

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        socket?.emit(
          "file-change",
          {
            projectId,
            action: "edit",
            filePath: filePathToSave,
            content: value,
          },
          (res: any) => {
            if (res?.success) {
              markFileSaved(filePathToSave)
            }
          }
        )
      }, 1500)

      updateFileContent(filePathToSave, value)
    }
  }

  if (!isThemeLoaded) {
    return <div className="flex h-full w-full flex-col" />
  }

  return (
    <div
      className="flex h-full w-full flex-col"
      style={{ backgroundColor: editorBg }}
    >
      {/* Tabs & Actions Header */}
      <div
        className="flex items-center justify-between border-b border-border"
        style={{ backgroundColor: headerBg }}
      >
        <div className="flex flex-1 scrollbar-none gap-0 overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {openFiles.map((tab: OpenFile) => (
            <TopTabs
              key={tab.path}
              path={tab.path}
              fileName={tab.fileName}
              isEdited={tab.isEdited}
            />
          ))}
        </div>

        {currentFile && (
          <div className="flex items-center px-2">
            <button
              onClick={handleSyncFile}
              disabled={isSyncing}
              title="Sync file from disk"
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>Sync</span>
            </button>
          </div>
        )}
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
              // Alt + W shortcut inside Monaco editor
              editor.addCommand(
                monaco.KeyMod.Alt | monaco.KeyCode.KeyW,
                closeActiveTab
              )
            }}
            options={EDITOR_OPTIONS}
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
