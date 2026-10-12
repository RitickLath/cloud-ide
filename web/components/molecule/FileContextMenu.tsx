"use client"

import React, { useEffect, useRef } from "react"
import {
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  Copy,
  FolderOpen,
} from "lucide-react"

export interface FileContextMenuProps {
  x: number
  y: number
  path: string
  name: string
  isFolder: boolean
  onClose: () => void
  onNewFile?: (parentPath: string) => void
  onNewFolder?: (parentPath: string) => void
  onRename?: (path: string, isFolder: boolean) => void
  onDelete?: (path: string, isFolder: boolean) => void
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  x,
  y,
  path,
  name,
  isFolder,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    // Capture phase ensures outside clicks are caught before other triggers
    document.addEventListener("mousedown", handleClickOutside, true)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  // Prevent menu from clipping outside viewport
  const adjustPosition = () => {
    const menuWidth = 180
    const menuHeight = isFolder ? 200 : 130

    let posX = x
    let posY = y

    if (typeof window !== "undefined") {
      if (posX + menuWidth > window.innerWidth) {
        posX = window.innerWidth - menuWidth - 8
      }
      if (posY + menuHeight > window.innerHeight) {
        posY = window.innerHeight - menuHeight - 8
      }
    }

    return { top: `${posY}px`, left: `${posX}px` }
  }

  const handleCopyPath = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(path)
    }
    onClose()
  }

  return (
    <div
      ref={menuRef}
      style={adjustPosition()}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed z-50 flex w-44 animate-in flex-col rounded-md border border-white/10 bg-[#1e1e1e]/95 p-1 font-sans text-xs text-neutral-200 shadow-xl backdrop-blur-md duration-100 select-none zoom-in-95 fade-in"
    >
      {/* File/Folder header name label */}
      <div className="mb-1 truncate border-b border-white/5 px-2 py-1 text-[11px] font-medium text-neutral-400">
        {name}
      </div>

      {/* Folder specific actions */}
      {isFolder && (
        <>
          <button
            onClick={() => {
              onNewFile?.(path)
              onClose()
            }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-white/10 hover:text-white"
          >
            <FilePlus className="h-3.5 w-3.5 text-neutral-400" />
            <span>New File</span>
          </button>

          <button
            onClick={() => {
              onNewFolder?.(path)
              onClose()
            }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-white/10 hover:text-white"
          >
            <FolderPlus className="h-3.5 w-3.5 text-neutral-400" />
            <span>New Folder</span>
          </button>

          <div className="my-1 border-t border-white/5" />
        </>
      )}

      {/* Rename */}
      <button
        onClick={() => {
          onRename?.(path, isFolder)
          onClose()
        }}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-white/10 hover:text-white"
      >
        <Pencil className="h-3.5 w-3.5 text-neutral-400" />
        <span>Rename</span>
      </button>

      {/* Copy Path */}
      <button
        onClick={handleCopyPath}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-white/10 hover:text-white"
      >
        <Copy className="h-3.5 w-3.5 text-neutral-400" />
        <span>Copy Path</span>
      </button>

      <div className="my-1 border-t border-white/5" />

      {/* Delete */}
      <button
        onClick={() => {
          onDelete?.(path, isFolder)
          onClose()
        }}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete</span>
      </button>
    </div>
  )
}

export default FileContextMenu
