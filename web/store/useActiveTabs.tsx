import { create } from "zustand";

export interface ActiveTabsType {
    filename: string
    isActive?: boolean
    fileIcon?: string
    extension?: string
}

const defaultTabs: ActiveTabsType[] = [
    { filename: "main.js", fileIcon: "", extension: "js" },
    { filename: "index.html", fileIcon: "", extension: "html" },
    { filename: "style.css", fileIcon: "", extension: "css" },
]

interface ActiveTabsStore {
    activeTabs: ActiveTabsType[]
    workingTab: string
    addActiveTab: (tab: ActiveTabsType) => void
    removeActiveTab: (filename: string) => void
    setWorkingTab: (filename: string) => void
    clearActiveTabs: () => void
}

const useActiveTabs = create<ActiveTabsStore>((set) => ({
    activeTabs: defaultTabs,
    workingTab: "main.js",

    addActiveTab: (tab) => set((state) => ({ activeTabs: [...state.activeTabs, tab] })),

    removeActiveTab: (filename) => set((state) => ({ 
        activeTabs: state.activeTabs.filter((t) => t.filename !== filename),
        workingTab: state.workingTab === filename ? (state.activeTabs.find(t => t.filename !== filename)?.filename || "") : state.workingTab
    })),

    setWorkingTab: (filename) => set({ workingTab: filename }),

    clearActiveTabs: () => set({ activeTabs: [], workingTab: "" }),
}))

export default useActiveTabs