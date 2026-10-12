import { create } from "zustand"

interface EditorThemeState {
  theme: string
  themeData: any
  setTheme: (theme: string) => void
  setThemeData: (data: any) => void
}

const getDefaultTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "GitHub Dark"
  }
  return "GitHub Dark"
}

export const useEditorTheme = create<EditorThemeState>()((set) => ({
  theme: getDefaultTheme(),
  themeData: null,
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
    }
    set({ theme })
  },
  setThemeData: (data) => set({ themeData: data }),
}))
