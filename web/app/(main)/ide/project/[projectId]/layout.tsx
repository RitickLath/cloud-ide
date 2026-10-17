"use client"

import { useEffect, useState } from "react"
import Node from "@/components/molecule/Node"
import { useGetProjectTree } from "@/features/queries/useGetProjectTree"
import { useParams } from "next/navigation"
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme"
import ThemeSelector from "@/components/molecule/ThemeSelector"
import { Files, Settings, X, MoreHorizontal, UserPlus } from "lucide-react"
import {
  NewFileIcon,
  NewFolderIcon,
  RefreshIcon,
  CollapseAllIcon,
} from "@/components/atom/ExplorerIcons"
import { ChevronDown, ChevronRight } from "@/components/atom/FileIcon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog"
import { useProjectSocket } from "@/hooks/useProjectSocket"
import useEditorStore from "@/store/useEditorStore"
import { useSocket } from "@/store/useSocket"
import { InviteModal } from "@/components/organism/InviteModal"

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()
  const projectId = params?.projectId as string
  const { data, isLoading, isError, isSuccess, refetch, isFetching } =
    useGetProjectTree(projectId)
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
    return data?.data?.path || ""
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

  // Manage workspace socket connection and event listeners
  useProjectSocket({
    projectId,
    isEnabled: isSuccess && !isError && !!data,
    onTreeChange: refetch,
  })

  // Sandbox theme values
  const {
    isThemeLoaded,
    editorBg,
    headerBg,
    toolbarBg,
    fgColor,
    sideBarBg,
    activityBarBg,
  } = useLoadEditorTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  if (!projectId) return null

  // Prevent unstyled flash
  if (!isThemeLoaded)
    return <div className="h-screen w-screen bg-[#000000]"></div>

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden font-sans"
      style={{ backgroundColor: editorBg, color: fgColor }}
    >
      {/* Activity Bar (Collapsible Actions) */}
      <div
        className="flex w-12 shrink-0 flex-col items-center border-r border-white/10 py-3"
        style={{ backgroundColor: activityBarBg }}
      >
        {/* File Explorer Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10"
          title="Explorer"
        >
          <Files
            className="size-5 text-gray-400 transition-colors hover:text-white"
            strokeWidth={1.5}
          />
        </button>

        {/* Invite Collaborator Button */}
        <button
          onClick={() => setIsInviteOpen(true)}
          className="mb-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10"
          title="Invite Collaborators"
        >
          <UserPlus
            className="size-5 text-gray-400 transition-colors hover:text-white"
            strokeWidth={1.5}
          />
        </button>

        <div className="flex-1"></div>

        {/* Settings Toggle (Bottom) */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="mt-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10"
          title="Settings"
        >
          <Settings
            className="size-5 text-gray-400 transition-colors hover:text-white"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Sidebar Explorer */}
      {isSidebarOpen && (
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
                {data?.data?.name || projectId || "Workspace"}
              </span>
            </div>

            <div
              className="flex items-center gap-0.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
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
                onClick={(e) => {
                  e.stopPropagation()
                  refetch()
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
            {isLoading ? (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center text-xs opacity-50">
                Loading workspace...
              </div>
            ) : isProjectExpanded ? (
              <div className="h-full w-full">
                <Node
                  list={data?.data}
                  isVisible={true}
                  expandedPaths={expandedPaths}
                  setExpandedPaths={setExpandedPaths}
                />
              </div>
            ) : null}
          </div>
        </aside>
      )}

      {/* Main Editor Area */}
      <main
        className="flex flex-1 flex-col overflow-hidden"
        style={{ backgroundColor: editorBg }}
      >
        <div className="relative flex-1 overflow-auto">{children}</div>
      </main>

      {/* Settings Modal (Shadcn Dialog) */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent
          className="w-100 max-w-100 gap-0 overflow-hidden border-white/10 p-0 shadow-2xl"
          style={{ backgroundColor: headerBg, color: fgColor }}
          showCloseButton={false}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <DialogTitle className="m-0 flex items-center gap-2 text-sm font-semibold">
              <Settings className="size-4 opacity-70" /> Settings
            </DialogTitle>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="transition-opacity hover:opacity-70"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5">
            <div className="space-y-3">
              <DialogHeader className="space-y-1 text-left">
                <label className="m-0 text-sm font-semibold opacity-90">
                  Color Theme
                </label>
                <DialogDescription className="m-0 p-0 pb-1 text-[11px] opacity-60">
                  Select your preferred editor and UI theme.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-w-62.5">
                <ThemeSelector />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Collaborator Modal */}
      <InviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        projectId={projectId}
        projectName={data?.data?.name || projectId}
      />
    </div>
  )
}

export default ProjectLayout
