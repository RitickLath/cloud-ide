import { useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { useSocket } from "@/store/useSocket"
import useEditorStore from "@/store/useEditorStore"

interface UseProjectSocketOptions {
  projectId?: string
  isEnabled?: boolean
  onTreeChange?: () => void
}

/**
 * Registers workspace-level real-time socket events for file/folder changes.
 */
const registerWorkspaceEvents = (socket: Socket, onTreeChange?: () => void) => {
  socket.on("file-change", (payload: any) => {
    if (payload.action === "edit" || payload.action === "save") {
      if (payload.content !== undefined) {
        const store = useEditorStore.getState()
        const isOpen = store.openFiles.some(
          (file) => file.path === payload.filePath
        )

        if (isOpen) {
          store.updateFileContent(payload.filePath, payload.content)
          store.markFileSaved(payload.filePath)
        }
      }
    } else if (payload.action === "delete") {
      useEditorStore.getState().closeFile(payload.filePath)
      onTreeChange?.()
    } else if (payload.action === "rename") {
      if (payload.newPath) {
        useEditorStore.getState().renameFile(payload.filePath, payload.newPath)
      }
      onTreeChange?.()
    } else if (payload.action === "create" || payload.action === "move") {
      onTreeChange?.()
    }
  })

  socket.on("folder-change", () => {
    onTreeChange?.()
  })

  socket.on("workspace-ready", (payload: any) => {
    onTreeChange?.()
  })
}

export const useProjectSocket = ({
  projectId,
  isEnabled = true,
  onTreeChange,
}: UseProjectSocketOptions) => {
  const setSocket = useSocket((state) => state.setSocket)
  const setIsConnected = useSocket((state) => state.setIsConnected)

  useEffect(() => {
    if (!projectId || !isEnabled) return

    const socket = io("http://localhost:3001/workspace", {
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

    registerWorkspaceEvents(socket, onTreeChange)

    setSocket(socket)

    return () => {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [projectId, isEnabled, onTreeChange, setSocket, setIsConnected])
}
