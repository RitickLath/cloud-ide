"use client"

import React, { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { CheckCircle2, ArrowRight, X, Sparkles } from "lucide-react"
import { Button } from "@/components/atom/button"

interface ReadyEventPayload {
  workspaceId: string
  projectId: string
  userId?: string
  status: "READY"
  workspace?: {
    id: string
    name: string
    slug: string
    framework: string
  }
}

export function WorkspaceNotifier() {
  const queryClient = useQueryClient()
  const [notification, setNotification] = useState<ReadyEventPayload | null>(
    null
  )

  useEffect(() => {
    const socket: Socket = io("http://localhost:3001/workspace", {
      withCredentials: true,
      transports: ["websocket"],
    })

    socket.on("workspace-ready", (payload: ReadyEventPayload) => {
      // Invalidate project queries so dashboard cards immediately flip to READY
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setNotification(payload)
    })

    return () => {
      socket.disconnect()
    }
  }, [queryClient])

  if (!notification) return null

  const projectSlug =
    notification.workspace?.slug ||
    notification.projectId ||
    notification.workspaceId
  const workspaceName =
    notification.workspace?.name || notification.projectId || "Workspace"

  return (
    <div className="fixed right-6 bottom-6 z-50 flex max-w-sm animate-in items-center gap-3 rounded-xl border border-emerald-500/30 bg-card/95 p-4 shadow-2xl backdrop-blur-md duration-300 slide-in-from-bottom-5 fade-in">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span className="truncate">{workspaceName} is ready!</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
          Your cloud container has been successfully provisioned.
        </p>

        <div className="mt-2.5 flex items-center gap-2">
          <Link
            href={`/ide/project/${projectSlug}`}
            onClick={() => setNotification(null)}
          >
            <Button
              size="sm"
              className="h-7 gap-1 bg-emerald-600 text-[11px] font-semibold text-white shadow-xs hover:bg-emerald-500"
            >
              <span>Launch IDE</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <button
            onClick={() => setNotification(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      </div>

      <button
        onClick={() => setNotification(null)}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
