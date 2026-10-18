"use client"

import React, { useState } from "react"
import Node from "@/components/molecule/Node"
import {
  NewFileIcon,
  NewFolderIcon,
  RefreshIcon,
  CollapseAllIcon,
} from "@/components/atom/ExplorerIcons"
import { ChevronDown, ChevronRight } from "@/components/atom/FileIcon"
import { Loader2, MoreHorizontal } from "lucide-react"
import useEditorStore from "@/store/useEditorStore"
import { useSocket } from "@/store/useSocket"

interface WorkspaceFileExplorerProps {
  projectId: string
  projectName: string
  treeData?: any
  isLoading: boolean
  isFetching: boolean
  sideBarBg: string
  fgColor: string
  onRefresh: () => void
}

export const WorkspaceFileExplorer: React.FC<WorkspaceFileExplorerProps> = ({
  projectId,
  projectName,
  treeData,
  isLoading,
  isFetching,
  sideBarBg,
  fgColor,
  onRefresh,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>(
    {}
  )
  const [isProjectExpanded, setIsProjectExpanded] = useState(true)

  const handleCollapseAll = () => {
    setExpandedPaths({})
  }

  const getTargetDirectory = () => {
    const activeExpanded = Object.keys(expandedPaths).filter(
      (path) => expandedPaths[path]
    )
    if (activeExpanded.length > 0) {
      return activeExpanded[activeExpanded.length - 1]
    }

    const currentFile = useEditorStore.getState().currentFile
    if (currentFile?.path) {
      return currentFile.path.substring(0, currentFile.path.lastIndexOf("/"))
    }

    // Fallback to workspace root folder
    return treeData?.path || ""
  }

  const handleNewFile = () => {
    const targetDir = getTargetDirectory()
    if (!targetDir) return

    const fileName = window.prompt("Enter file name:")
    if (!fileName?.trim()) return

    const trimmedName = fileName.trim()
    const filePath = `${targetDir}/${trimmedName}`
    const extension = trimmedName.split(".").pop() || ""
    const socket = useSocket.getState().socket

    socket?.emit("file-change", {
      action: "create",
      filePath,
      content: "",
      projectId,
    })

    // Immediately open the newly created file in an editor tab
    useEditorStore.getState().openFile({
      path: filePath,
      fileName: trimmedName,
      extension,
      content: "",
    })
  }

  const handleNewFolder = () => {
    const targetDir = getTargetDirectory()
    if (!targetDir) return

    const folderName = window.prompt("Enter folder name:")
    if (!folderName?.trim()) return

    const folderPath = `${targetDir}/${folderName.trim()}`
    const socket = useSocket.getState().socket

    socket?.emit("folder-change", {
      action: "create",
      folderPath,
      projectId,
    })

    // Keep parent and new folder expanded
    setExpandedPaths((prev) => ({
      ...prev,
      [targetDir]: true,
      [folderPath]: true,
    }))
  }

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-r border-white/10"
      style={{ backgroundColor: sideBarBg }}
    >
      {/* Explorer Header */}
      <div
        className="flex h-9 items-center justify-between px-4 text-xs font-semibold select-none"
        style={{ color: fgColor }}
      >
        <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">
          Explorer
        </span>
        <button
          type="button"
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          title="Views and More Actions..."
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {/* Collapsible Project Root Section Header */}
      <div
        className="group flex h-7 cursor-pointer items-center justify-between px-2 text-xs font-bold tracking-wide transition-colors select-none hover:bg-white/5"
        onClick={() => setIsProjectExpanded((prev) => !prev)}
        style={{ color: fgColor }}
      >
        <div className="flex min-w-0 items-center gap-1">
          <div className="flex h-4 w-4 items-center justify-center text-gray-400">
            {isProjectExpanded ? <ChevronDown /> : <ChevronRight />}
          </div>
          <span className="truncate text-xs font-bold">
            {projectName || "Workspace"}
          </span>
        </div>

        <div
          className="flex items-center gap-0.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsProjectExpanded(true)
              handleNewFile()
            }}
            title="New File..."
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10 hover:text-white"
          >
            <NewFileIcon size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsProjectExpanded(true)
              handleNewFolder()
            }}
            title="New Folder..."
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10 hover:text-white"
          >
            <NewFolderIcon size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRefresh()
            }}
            disabled={isFetching}
            title="Refresh Explorer"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshIcon
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCollapseAll()
            }}
            title="Collapse Folders in Explorer"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-white/10 hover:text-white"
          >
            <CollapseAllIcon size={16} />
          </button>
        </div>
      </div>

      {/* File Tree Area */}
      <div className="relative flex-1 overflow-hidden">
        {isLoading || !treeData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-xs font-medium text-foreground">
              Setting up workspace...
            </p>
            <p className="text-[10px] text-muted-foreground">
              Scaffolding files and dependencies in container
            </p>
          </div>
        ) : isProjectExpanded ? (
          <div className="h-full w-full">
            <Node
              list={treeData}
              isVisible={true}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
            />
          </div>
        ) : null}
      </div>
    </aside>
  )
}
