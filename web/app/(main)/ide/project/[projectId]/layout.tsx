"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { useGetProjectTree } from "@/features/queries/useGetProjectTree"
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme"
import { useProjectSocket } from "@/hooks/useProjectSocket"
import { WorkspaceActivityBar } from "@/components/molecule/WorkspaceActivityBar"
import { WorkspaceFileExplorer } from "@/components/organism/WorkspaceFileExplorer"
import { WorkspaceSettingsModal } from "@/components/molecule/WorkspaceSettingsModal"
import { InviteModal } from "@/components/organism/InviteModal"
import { Terminal, useTerminal } from "@wterm/react"
import "@wterm/react/css"
import { useTerminalSocket } from "@/hooks/useTerminalSocket"

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()
  const projectId = params?.projectId as string
  const { ref, write } = useTerminal()

  // Dedicated terminal socket stream (isolated from workspace socket)
  const { sendData, isConnected: isTerminalConnected } = useTerminalSocket({
    projectId,
    isEnabled: Boolean(projectId),
    onData: (incoming) => write(incoming),
  })

  // Fetch project file tree
  const { data, isLoading, refetch, isFetching } = useGetProjectTree(projectId)

  // Real-time collaborative workspace socket connection
  useProjectSocket({
    projectId,
    isEnabled: Boolean(projectId),
    onTreeChange: refetch,
  })

  // Theme styling tokens
  const {
    isThemeLoaded,
    editorBg,
    headerBg,
    fgColor,
    sideBarBg,
    activityBarBg,
  } = useLoadEditorTheme()

  // Layout UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  if (!projectId) return null

  // Prevent flash of unstyled theme
  if (!isThemeLoaded) {
    return <div className="h-screen w-screen bg-black" />
  }

  const projectName = data?.data?.name || projectId

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden font-sans"
      style={{ backgroundColor: editorBg, color: fgColor }}
    >
      {/* 1. Left Icon Activity Bar */}
      <WorkspaceActivityBar
        activityBarBg={activityBarBg}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenInvite={() => setIsInviteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. File Explorer Sidebar */}
      {isSidebarOpen && (
        <WorkspaceFileExplorer
          projectId={projectId}
          projectName={projectName}
          treeData={data?.data}
          isLoading={isLoading}
          isFetching={isFetching}
          sideBarBg={sideBarBg}
          fgColor={fgColor}
          onRefresh={refetch}
        />
      )}

      {/* 3. Main Monaco Editor Container */}
      <main
        className="flex flex-1 flex-col overflow-hidden"
        style={{ backgroundColor: editorBg }}
      >
        <div className="relative flex-1 overflow-auto">
          <div className="h-[78vh]">{children}</div>
          {isTerminalConnected && (
            <Terminal
              ref={ref}
              autoResize={true}
              onData={(data) => {
                console.log(data)
                sendData(data)
              }}
            />
          )}
        </div>
      </main>

      {/* 4. Settings Dialog */}
      <WorkspaceSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        headerBg={headerBg}
        fgColor={fgColor}
      />

      {/* 5. Invite Collaborator Dialog */}
      <InviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        projectId={projectId}
        projectName={projectName}
      />
    </div>
  )
}

export default ProjectLayout
