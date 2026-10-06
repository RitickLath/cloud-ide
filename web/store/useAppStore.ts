import { create } from 'zustand'

interface AppState {
  user: null | any
  setUser: (user: any) => void
}

export const useAppStore = create<AppState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
