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
        if (useEditorStore.getState().openFile === payload.filePath) {
          console.log("File is open")
          useEditorStore
            .getState()
            .updateFileContent(payload.filePath, payload.content)
          useEditorStore.getState().markFileSaved(payload.filePath)
        }
      }
    } else if (payload.action === "delete") {
      useEditorStore.getState().closeFile(payload.filePath)
      onTreeChange?.()
    } else if (
      payload.action === "create" ||
      payload.action === "rename" ||
      payload.action === "move"
    ) {
      onTreeChange?.()
    }
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

    registerWorkspaceEvents(socket, onTreeChange)

    setSocket(socket)

    return () => {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [projectId, isEnabled, onTreeChange, setSocket, setIsConnected])
}
