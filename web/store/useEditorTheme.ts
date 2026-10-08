import { create } from 'zustand'

interface EditorThemeState {
  theme: string
  themeData: any
  setTheme: (theme: string) => void
  setThemeData: (data: any) => void
}

export const useEditorTheme = create<EditorThemeState>()((set) => ({
    theme: localStorage.getItem("theme") || "IDLE",
    themeData: null,
    setTheme: (theme) => set({ theme }),
    setThemeData: (data) => set({ themeData: data }),
}))
