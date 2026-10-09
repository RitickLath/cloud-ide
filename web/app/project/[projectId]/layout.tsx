"use client"

import { useState } from "react";
import Node from "@/components/molecule/Node";
import { useGetProjectTree } from "@/features/queries/useGetProjectTree";
import { useParams } from "next/navigation";
import { useLoadEditorTheme } from "@/hooks/useLoadEditorTheme";
import ThemeSelector from "@/components/molecule/ThemeSelector";
import { Files, Settings, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog";

const ProjectLayout = ({children}: {
    children: React.ReactNode
}) => {
    const params = useParams();
    const projectId = params?.projectId as string;
    const { data, isLoading } = useGetProjectTree(projectId);
    
    // Sandbox theme values
    const { isThemeLoaded, editorBg, headerBg, toolbarBg, fgColor, sideBarBg, activityBarBg } = useLoadEditorTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!projectId) return null;
    
    // Prevent unstyled flash
    if (!isThemeLoaded) return <div className="h-screen w-screen bg-[#1e1e1e]"></div>;

    return (
        <div 
            className="flex h-screen w-screen overflow-hidden font-sans relative" 
            style={{ backgroundColor: editorBg, color: fgColor }}
        >
            {/* Activity Bar (Collapsible Actions) */}
            <div 
                className="w-12 shrink-0 flex flex-col items-center py-3 border-r border-white/10"
                style={{ backgroundColor: activityBarBg }}
            >
                {/* File Explorer Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-10 h-10 mb-2 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    title="Explorer"
                >
                    <Files className="size-5 text-gray-400 hover:text-white transition-colors" strokeWidth={1.5} />
                </button>

                <div className="flex-1"></div>

                {/* Settings Toggle (Bottom) */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-10 h-10 mt-auto rounded-md flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    title="Settings"
                >
                    <Settings className="size-5 text-gray-400 hover:text-white transition-colors" strokeWidth={1.5} />
                </button>
            </div>

            {/* Sidebar Explorer */}
            {isSidebarOpen && (
                <aside 
                    className="w-64 shrink-0 border-r border-white/10 flex flex-col"
                    style={{ backgroundColor: sideBarBg }}
                >
                    {/* Explorer Header */}
                    <div 
                        className="px-4 h-10 text-xs font-bold uppercase tracking-wider border-b border-white/10 select-none flex items-center justify-between opacity-80"
                        style={{ color: fgColor }}
                    >
                        Explorer
                    </div>
                    
                    {/* File Tree Area */}
                    <div className="flex-1 overflow-hidden relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center text-xs animate-pulse opacity-50">
                                Loading workspace...
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                <Node list={data?.data} isVisible={true} />
                            </div>
                        )}
                    </div>
                </aside>
            )}

            {/* Main Editor Area */}
            <main 
                className="flex-1 flex flex-col overflow-hidden" 
                style={{ backgroundColor: editorBg }}
            >
                <div className="flex-1 relative overflow-auto">
                    {children}
                </div>
            </main>

            {/* Settings Modal (Shadcn Dialog) */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent 
                    className="w-100 max-w-100 p-0 gap-0 border-white/10 shadow-2xl overflow-hidden" 
                    style={{ backgroundColor: headerBg, color: fgColor }}
                    showCloseButton={false}
                >
                    {/* Modal Header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2 m-0">
                            <Settings className="size-4 opacity-70" /> Settings
                        </DialogTitle>
                        <button onClick={() => setIsSettingsOpen(false)} className="hover:opacity-70 transition-opacity">
                            <X className="size-4" />
                        </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="p-5">
                        <div className="space-y-3">
                            <DialogHeader className="text-left space-y-1">
                                <label className="text-sm font-semibold opacity-90 m-0">Color Theme</label>
                                <DialogDescription className="text-[11px] opacity-60 m-0 p-0 pb-1">
                                    Select your preferred editor and UI theme.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="w-full max-w-62.5">
                                <ThemeSelector />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProjectLayout