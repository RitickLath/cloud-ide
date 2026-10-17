"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog"
import { Input } from "@/components/atom/input"
import { Button } from "@/components/atom/button"
import { Label } from "@/components/atom/label"
import {
  UserPlus,
  Mail,
  Shield,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Link2,
} from "lucide-react"
import { ProjectService } from "@/services/project.service"

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectName?: string
}

export function InviteModal({
  open,
  onOpenChange,
  projectId,
  projectName = "Workspace",
}: InviteModalProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setStatus(null)

    try {
      await ProjectService.inviteMember(projectId, {
        email: email.trim().toLowerCase(),
        role,
      })

      setStatus({
        type: "success",
        message: `Invitation successfully sent to ${email.trim()}`,
      })
      setEmail("")
    } catch (err: any) {
      // Gracefully handle if API is not yet implemented on backend or returns error
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send invite. Please try again."
      setStatus({
        type: "error",
        message: Array.isArray(msg) ? msg[0] : msg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyInviteLink = () => {
    if (typeof window === "undefined") return
    const inviteUrl = `${window.location.origin}/ide/project/${projectId}?join=true`
    navigator.clipboard.writeText(inviteUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-[#0e1117]/95 p-6 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Invite Collaborators
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Collaborate in real time on{" "}
                <span className="font-medium text-foreground">
                  {projectName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {status && (
          <div
            className={`mt-3 rounded-lg border p-3 text-xs font-medium ${
              status.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSendInvite} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="invite-email"
              className="text-xs font-medium text-foreground"
            >
              User Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 border-border/50 bg-background/50 pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">
              Permission Role
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("EDITOR")}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  role === "EDITOR"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Editor</span>
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  Can edit code & run files
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("VIEWER")}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  role === "VIEWER"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Viewer</span>
                </div>
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  Read-only view of files
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 text-xs font-semibold"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Sending invite...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Send Invitation</span>
              </>
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0e1117] px-2 text-muted-foreground">
              Or share workspace link
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              readOnly
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/ide/project/${projectId}`
                  : ""
              }
              className="h-8.5 border-border/40 bg-background/30 pr-3 pl-8 text-[11px] text-muted-foreground select-all"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyInviteLink}
            className="h-8.5 gap-1.5 border-border/60 text-xs"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
