"use client"

import { useEffect, useState } from "react"
import Node from "@/components/molecule/Node"
import { useGetProjectTree } from "@/features/queries/useGetProjectTree"
import { useParams } from "next/navigation"
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme"
import ThemeSelector from "@/components/molecule/ThemeSelector"
import { Files, Settings, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog"
import { useSocket } from "@/store/useSocket"
import { io } from "socket.io-client"

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()
  const projectId = params?.projectId as string
  const { data, isLoading, isError, isSuccess } = useGetProjectTree(projectId)

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
  const setSocket = useSocket((state) => state.setSocket)
  const setIsConnected = useSocket((state) => state.setIsConnected)

  useEffect(() => {
    // Only establish connection if project actually exists and query succeeded
    if (!projectId || isError || !isSuccess || !data) return

    const socket = io("http://localhost:3002/workspace", {
      withCredentials: true,
      transports: ["websocket"],
    })

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("join-project", { projectId })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [projectId, isSuccess, isError, data, setSocket, setIsConnected])

  if (!projectId) return null

  // Prevent unstyled flash
  if (!isThemeLoaded)
    return <div className="h-screen w-screen bg-[#1e1e1e]"></div>

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
            className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-xs font-bold tracking-wider uppercase opacity-80 select-none"
            style={{ color: fgColor }}
          >
            Explorer
          </div>

          {/* File Tree Area */}
          <div className="relative flex-1 overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center text-xs opacity-50">
                Loading workspace...
              </div>
            ) : (
              <div className="h-full w-full">
                <Node list={data?.data} isVisible={true} />
              </div>
            )}
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
    </div>
  )
}

export default ProjectLayout
