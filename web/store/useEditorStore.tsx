import { create } from "zustand";

export interface OpenFile {
    path: string;
    fileName: string;
    content: string;
    extension: string;
    isEdited?: boolean;
}

interface ActiveTabsState {
    openFiles: OpenFile[];
    currentFile: OpenFile | null;

    // File lifecycle actions
    openFile: (file: { path: string; fileName: string; content?: string; extension?: string }) => void;
    closeFile: (path: string) => void;
    switchFile: (path: string) => void;
    updateFileContent: (path: string, content: string) => void;
    markFileSaved: (path: string) => void;
    closeAllFiles: () => void;
}

const useEditorStore = create<ActiveTabsState>((set) => ({
    openFiles: [],
    currentFile: null,

    openFile: ({ path, fileName, content = "", extension = "" }) => {
        set((state) => {
            const existingFile = state.openFiles.find((file) => file.path === path);
            if (existingFile) {
                // If file is already open in a tab, switch active focus to it
                return { currentFile: existingFile };
            }

            const newFile: OpenFile = {
                path,
                fileName,
                content,
                extension,
                isEdited: false,
            };

            return {
                openFiles: [...state.openFiles, newFile],
                currentFile: newFile,
            };
        });
    },

    closeFile: (path) => {
        set((state) => {
            const fileIndex = state.openFiles.findIndex((file) => file.path === path);
            const remainingFiles = state.openFiles.filter((file) => file.path !== path);

            // If closed file was not the active tab, keep current active tab
            if (state.currentFile?.path !== path) {
                return { openFiles: remainingFiles };
            }

            // If active tab was closed, switch to adjacent tab (next or previous)
            const nextFile = remainingFiles[fileIndex] || remainingFiles[fileIndex - 1] || null;

            return {
                openFiles: remainingFiles,
                currentFile: nextFile,
            };
        });
    },

    switchFile: (path) => {
        set((state) => ({
            currentFile: state.openFiles.find((file) => file.path === path) || null,
        }));
    },

    updateFileContent: (path, content) => {
        set((state) => ({
            openFiles: state.openFiles.map((file) =>
                file.path === path ? { ...file, content, isEdited: true } : file
            ),
            currentFile:
                state.currentFile?.path === path
                    ? { ...state.currentFile, content, isEdited: true }
                    : state.currentFile,
        }));
    },

    markFileSaved: (path) => {
        set((state) => ({
            openFiles: state.openFiles.map((file) =>
                file.path === path ? { ...file, isEdited: false } : file
            ),
            currentFile:
                state.currentFile?.path === path
                    ? { ...state.currentFile, isEdited: false }
                    : state.currentFile,
        }));
    },

    closeAllFiles: () => set({ openFiles: [], currentFile: null }),
}));

export default useEditorStore;