import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"

interface UseTerminalSocketOptions {
  projectId?: string
  isEnabled?: boolean
  onData?: (data: string) => void
}

export const useTerminalSocket = ({
  projectId,
  isEnabled = true,
  onData,
}: UseTerminalSocketOptions) => {
  const socketRef = useRef<Socket | null>(null)
  const onDataRef = useRef(onData)
  const [isConnected, setIsConnected] = useState(false)

  // Keep latest onData callback without triggering re-connection
  useEffect(() => {
    onDataRef.current = onData
  }, [onData])

  useEffect(() => {
    if (!projectId || !isEnabled) return

    const soc = io("http://localhost:3001/terminal", {
      withCredentials: true,
      transports: ["websocket"],
      query: { projectId },
    })

    soc.on("connect", () => {
      setIsConnected(true)
      soc.emit("join-terminal", { projectId })
    })

    // Listen for raw data / messages sent from backend terminal
    soc.on("data", (data: string) => {
      // Terminal Data Incoming add it to the terminal history
      onDataRef.current?.(data)
    })

    soc.on("disconnect", () => {
      setIsConnected(false)
    })

    socketRef.current = soc

    return () => {
      soc.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [projectId, isEnabled])

  const sendData = useCallback(
    (data: string) => {
      if (socketRef.current?.connected) {
        // Terminal Sending Data
        socketRef.current.emit("terminal:input", { projectId, data })
      } else {
        console.warn("[Terminal] Cannot send data - socket not connected")
      }
    },
    [projectId]
  )

  return {
    isConnected,
    sendData,
    socket: socketRef.current,
  }
}
