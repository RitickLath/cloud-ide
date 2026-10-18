"use client"

import React from "react"
import { Files, Settings, UserPlus } from "lucide-react"

interface WorkspaceActivityBarProps {
  activityBarBg: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onOpenInvite: () => void
  onOpenSettings: () => void
}

export const WorkspaceActivityBar: React.FC<WorkspaceActivityBarProps> = ({
  activityBarBg,
  isSidebarOpen,
  onToggleSidebar,
  onOpenInvite,
  onOpenSettings,
}) => {
  return (
    <div
      className="flex w-12 shrink-0 flex-col items-center border-r border-white/10 py-3"
      style={{ backgroundColor: activityBarBg }}
    >
      {/* File Explorer Toggle */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className={`mb-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors ${
          isSidebarOpen
            ? "bg-white/10 text-white"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
        title="Explorer"
      >
        <Files className="size-5" strokeWidth={1.5} />
      </button>

      {/* Invite Collaborator Button */}
      <button
        type="button"
        onClick={onOpenInvite}
        className="mb-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        title="Invite Collaborators"
      >
        <UserPlus className="size-5" strokeWidth={1.5} />
      </button>

      <div className="flex-1" />

      {/* Settings Toggle (Bottom) */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="mt-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        title="Settings"
      >
        <Settings className="size-5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
