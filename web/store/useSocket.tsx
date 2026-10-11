import type { Socket } from "socket.io-client"
import { create } from "zustand"

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  setSocket: (socket: Socket | null) => void
  setIsConnected: (connected: boolean) => void
}

export const useSocket = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  setSocket: (socket: Socket | null) => set({ socket }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
}))
