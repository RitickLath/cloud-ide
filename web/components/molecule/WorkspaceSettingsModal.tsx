"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog"
import ThemeSelector from "@/components/molecule/ThemeSelector"
import { Settings, X } from "lucide-react"

interface WorkspaceSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  headerBg: string
  fgColor: string
}

export const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({
  open,
  onOpenChange,
  headerBg,
  fgColor,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-100 max-w-100 gap-0 overflow-hidden border-white/10 p-0 shadow-2xl"
        style={{ backgroundColor: headerBg, color: fgColor }}
        showCloseButton={false}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <DialogTitle className="m-0 flex items-center gap-2 text-sm font-semibold">
            <Settings className="size-4 opacity-70" /> Settings
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="transition-opacity hover:opacity-70"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5">
          <div className="space-y-3">
            <DialogHeader className="space-y-1 text-left">
              <label className="m-0 text-sm font-semibold opacity-90">
                Color Theme
              </label>
              <DialogDescription className="m-0 p-0 pb-1 text-[11px] opacity-60">
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
  )
}
