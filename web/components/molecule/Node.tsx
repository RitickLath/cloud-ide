import React, { useState } from "react"
import { useParams } from "next/navigation"
import { FileIcon, ChevronDown, ChevronRight } from "../atom/FileIcon"
import useEditorStore from "@/store/useEditorStore"
import { useSocket } from "@/store/useSocket"
import FileContextMenu from "./FileContextMenu"

interface ContextMenuState {
  x: number
  y: number
  path: string
  name: string
  isFolder: boolean
}

const FileTreeNode = ({
  item,
  depth = 0,
  expandedPaths,
  togglePath,
  onContextMenu,
}: any) => {
  const isFolder = Array.isArray(item?.children)
  const isExpanded = !!expandedPaths[item.path]
  const { socket } = useSocket()
  const { openFile } = useEditorStore()

  const handleOpenFile = (path: string, fileName: string) => {
    const extension = fileName.split(".").pop() || ""

    // First open tab immediately with empty or existing content
    openFile({
      path,
      fileName,
      extension,
      content: "",
    })

    // Request file content via socket if connected
    socket?.emit(
      "file-change",
      { action: "read", filePath: path },
      (res: any) => {
        if (res?.content !== undefined) {
          useEditorStore.getState().updateFileContent(path, res.content)
        }
      }
    )
  }

  const handleRowClick = () => {
    if (isFolder) {
      togglePath(item.path)
    } else {
      handleOpenFile(item.path, item.name)
    }
  }

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onContextMenu?.({
      x: e.clientX,
      y: e.clientY,
      path: item.path,
      name: item.name,
      isFolder,
    })
  }

  return (
    <div className="flex flex-col font-mono text-sm text-inherit select-none">
      <div
        className="flex cursor-pointer items-center py-1 pr-2 transition-colors hover:bg-white/10"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleRowClick}
        onContextMenu={handleRightClick}
      >
        {/* Chevron Icon Container */}
        <div className="mr-1 flex h-4 w-4 items-center justify-center text-gray-500">
          {isFolder && (isExpanded ? <ChevronDown /> : <ChevronRight />)}
        </div>

        {/* File/Folder Icon Container */}
        <div className="mr-2 flex h-4 w-4 items-center justify-center">
          <FileIcon name={item.name} isFolder={isFolder} />
        </div>

        {/* File/Folder Name */}
        <span className="truncate">{item.name}</span>
      </div>

      {/* Recursive Children Render */}
      {isFolder && isExpanded && (
        <div className="flex flex-col">
          {item.children.map((child: any) => (
            <FileTreeNode
              key={child.path}
              item={child}
              depth={depth + 1}
              expandedPaths={expandedPaths}
              togglePath={togglePath}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Node = ({
  list,
  isVisible,
  expandedPaths: controlledExpandedPaths,
  setExpandedPaths: controlledSetExpandedPaths,
  initialDepth = 1,
}: any) => {
  const params = useParams()
  const projectId = params?.projectId as string
  const { socket } = useSocket()
  const { closeFile } = useEditorStore()

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [internalExpandedPaths, setInternalExpandedPaths] = useState<
    Record<string, boolean>
  >({})

  const expandedPaths = controlledExpandedPaths ?? internalExpandedPaths
  const setExpandedPaths =
    controlledSetExpandedPaths ?? setInternalExpandedPaths

  const togglePath = (path: string) => {
    setExpandedPaths((prev: Record<string, boolean>) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const handleDelete = (path: string, isFolder: boolean) => {
    const itemLabel = path.split("/").pop() || "item"
    if (!window.confirm(`Delete ${itemLabel}?`)) return

    if (isFolder) {
      socket?.emit("folder-change", {
        action: "delete",
        folderPath: path,
        projectId,
      })
    } else {
      socket?.emit("file-change", {
        action: "delete",
        filePath: path,
        projectId,
      })
      closeFile(path)
    }
  }

  const handleRename = (path: string, isFolder: boolean) => {
    const currentName = path.split("/").pop() || ""
    const newName = window.prompt("Rename to:", currentName)
    if (!newName || newName === currentName) return

    const parentDir = path.substring(0, path.lastIndexOf("/"))
    const newPath = `${parentDir}/${newName}`

    if (isFolder) {
      socket?.emit("folder-change", {
        action: "rename",
        folderPath: path,
        newPath,
        projectId,
      })
    } else {
      socket?.emit("file-change", {
        action: "rename",
        filePath: path,
        newPath,
        projectId,
      })
    }
  }

  const handleNewFile = (parentPath: string) => {
    const fileName = window.prompt("New file name:")
    if (!fileName) return

    const filePath = `${parentPath}/${fileName}`
    socket?.emit("file-change", {
      action: "create",
      filePath,
      content: "",
      projectId,
    })
  }

  const handleNewFolder = (parentPath: string) => {
    const folderName = window.prompt("New folder name:")
    if (!folderName) return

    const folderPath = `${parentPath}/${folderName}`
    socket?.emit("folder-change", {
      action: "create",
      folderPath,
      projectId,
    })
  }

  if (!isVisible || !list) return null

  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto bg-transparent pb-4">
      <div className="flex flex-col">
        {list.children?.map((item: any) => (
          <FileTreeNode
            key={item.path}
            item={item}
            depth={initialDepth}
            expandedPaths={expandedPaths}
            togglePath={togglePath}
            onContextMenu={setContextMenu}
          />
        ))}
      </div>

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          path={contextMenu.path}
          name={contextMenu.name}
          isFolder={contextMenu.isFolder}
          onClose={() => setContextMenu(null)}
          onDelete={handleDelete}
          onRename={handleRename}
          onNewFile={handleNewFile}
          onNewFolder={handleNewFolder}
        />
      )}
    </div>
  )
}

export default Node
