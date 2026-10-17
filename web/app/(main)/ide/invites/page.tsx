"use client"

import React, { useState, useMemo, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  User,
  ArrowRight,
  Search,
  ExternalLink,
  Loader2,
  Inbox,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { Input } from "@/components/atom/input"
import {
  useGetMyInvites,
  useRespondToInvite,
  WorkspaceInviteItem,
} from "@/features/queries/useGetMyInvites"

function InvitesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightToken = searchParams.get("token")

  const [activeTab, setActiveTab] = useState<
    "PENDING" | "ACCEPTED" | "DECLINED" | "ALL"
  >("PENDING")
  const [search, setSearch] = useState("")

  const { data: invites = [], isLoading } = useGetMyInvites()
  const respondMutation = useRespondToInvite()

  const counts = useMemo(() => {
    return {
      PENDING: invites.filter((i) => i.status === "PENDING").length,
      ACCEPTED: invites.filter((i) => i.status === "ACCEPTED").length,
      DECLINED: invites.filter(
        (i) => i.status === "DECLINED" || i.status === "EXPIRED"
      ).length,
      ALL: invites.length,
    }
  }, [invites])

  const filteredInvites = useMemo(() => {
    return invites.filter((invite) => {
      // Tab filter
      if (activeTab === "PENDING" && invite.status !== "PENDING") return false
      if (activeTab === "ACCEPTED" && invite.status !== "ACCEPTED") return false
      if (
        activeTab === "DECLINED" &&
        invite.status !== "DECLINED" &&
        invite.status !== "EXPIRED"
      )
        return false

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase()
        const wsName = invite.workspace?.name?.toLowerCase() || ""
        const wsFw = invite.workspace?.framework?.toLowerCase() || ""
        const ownerEmail = invite.workspace?.owner?.email?.toLowerCase() || ""
        const ownerName = invite.workspace?.owner?.username?.toLowerCase() || ""
        return (
          wsName.includes(query) ||
          wsFw.includes(query) ||
          ownerEmail.includes(query) ||
          ownerName.includes(query)
        )
      }
      return true
    })
  }, [invites, activeTab, search])

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)

  const handleRespond = async (
    invite: WorkspaceInviteItem,
    action: "ACCEPT" | "DECLINE"
  ) => {
    try {
      setStatusMessage(null)
      await respondMutation.mutateAsync({ inviteId: invite.id, action })
      if (action === "ACCEPT") {
        setStatusMessage({
          type: "success",
          text: `You joined "${invite.workspace?.name || "the workspace"}"! Redirecting...`,
        })
        const wsId = invite.workspace?.id
        if (wsId) {
          setTimeout(() => {
            router.push(`/ide/project/${wsId}`)
          }, 800)
        }
      } else {
        setStatusMessage({
          type: "info",
          text: `Invitation to "${invite.workspace?.name || "workspace"}" declined.`,
        })
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          `Failed to ${action.toLowerCase()} invitation.`,
      })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {statusMessage && (
        <div
          className={`flex items-center justify-between rounded-lg border p-3 text-xs font-medium ${
            statusMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
              : statusMessage.type === "info"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                : "border-rose-500/30 bg-rose-500/10 text-rose-500"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Workspace Invitations
            </h1>
            {counts.PENDING > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                <Sparkles className="h-3 w-3" />
                {counts.PENDING} pending
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Review and respond to collaboration requests from workspace owners
          </p>
        </div>

        <Link href="/ide/projects">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-border/60 bg-card/40 text-xs hover:bg-muted"
          >
            <span>View All Workspaces</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/10 p-1">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "PENDING"
                ? "bg-card font-semibold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>Pending</span>
            <span
              className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                activeTab === "PENDING"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-muted/40 text-muted-foreground"
              }`}
            >
              {counts.PENDING}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ACCEPTED")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "ACCEPTED"
                ? "bg-card font-semibold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Accepted</span>
            <span className="py-0.2 rounded-full bg-muted/40 px-1.5 text-[10px] text-muted-foreground">
              {counts.ACCEPTED}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("DECLINED")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "DECLINED"
                ? "bg-card font-semibold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <XCircle className="h-3.5 w-3.5 text-rose-500" />
            <span>Declined / Expired</span>
            <span className="py-0.2 rounded-full bg-muted/40 px-1.5 text-[10px] text-muted-foreground">
              {counts.DECLINED}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === "ALL"
                ? "bg-card font-semibold text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All</span>
            <span className="py-0.2 rounded-full bg-muted/40 px-1.5 text-[10px] text-muted-foreground">
              {counts.ALL}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search workspaces or senders..."
            className="h-9 border-border/40 bg-card/40 pl-8 text-xs focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/20 p-8">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Fetching your workspace invitations...
          </p>
        </div>
      ) : filteredInvites.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/10 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/20">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            {activeTab === "PENDING"
              ? "No pending invitations"
              : activeTab === "ACCEPTED"
                ? "No accepted invitations found"
                : "No invitations match your filters"}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {activeTab === "PENDING"
              ? "When teammates invite you to collaborate on their cloud IDE workspaces, they will appear right here."
              : "Invitations you accept or decline will remain in your history for future reference."}
          </p>
          <div className="mt-5">
            <Link href="/ide/projects">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
              >
                <span>Browse Your Workspaces</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvites.map((invite) => {
            const isHighlighted =
              highlightToken && invite.token === highlightToken
            const isPending = invite.status === "PENDING"
            const isAccepted = invite.status === "ACCEPTED"
            const isDeclined = invite.status === "DECLINED"
            const isExpired =
              invite.status === "EXPIRED" ||
              (isPending && new Date(invite.expiresAt).getTime() < Date.now())

            const role = invite.role || "EDITOR"
            const workspace = invite.workspace
            const owner = workspace?.owner

            return (
              <div
                key={invite.id}
                className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-md ${
                  isHighlighted
                    ? "border-primary bg-primary/[0.04] shadow-md ring-2 ring-primary/20"
                    : "border-border/60 bg-card/40 hover:border-border"
                }`}
              >
                <div>
                  {/* Status header & Role badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 rounded-md border border-border/60 bg-muted/20 px-2 py-0.5 text-[11px] font-medium text-foreground">
                        <Shield className="h-3 w-3 text-primary" />
                        {role === "OWNER"
                          ? "Owner"
                          : role === "EDITOR"
                            ? "Editor"
                            : "Viewer"}
                      </span>

                      {isPending && !isExpired && (
                        <span className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                          <Clock className="h-2.5 w-2.5" />
                          Pending
                        </span>
                      )}

                      {isAccepted && (
                        <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Joined
                        </span>
                      )}

                      {(isDeclined || isExpired) && (
                        <span className="flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
                          <XCircle className="h-2.5 w-2.5" />
                          {isExpired ? "Expired" : "Declined"}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      {new Date(invite.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Workspace title & Framework */}
                  <div className="mt-3.5">
                    <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {workspace?.name || "Collaborative Workspace"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {workspace?.description ||
                        `Invited with ${role.toLowerCase()} permissions to collaborate in this cloud workspace.`}
                    </p>
                  </div>

                  {/* Inviter metadata */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/15 p-2.5 text-xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-foreground">
                        {owner?.username || "Workspace Owner"}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {owner?.email || "Unknown email"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="mt-5 border-t border-border/40 pt-4">
                  {isPending && !isExpired ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={respondMutation.isPending}
                        onClick={() => handleRespond(invite, "DECLINE")}
                        className="h-8 flex-1 border-border/60 text-xs hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        {respondMutation.isPending &&
                        respondMutation.variables?.inviteId === invite.id &&
                        respondMutation.variables?.action === "DECLINE" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Decline"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        disabled={respondMutation.isPending}
                        onClick={() => handleRespond(invite, "ACCEPT")}
                        className="h-8 flex-1 bg-primary text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90"
                      >
                        {respondMutation.isPending &&
                        respondMutation.variables?.inviteId === invite.id &&
                        respondMutation.variables?.action === "ACCEPT" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Accept & Open"
                        )}
                      </Button>
                    </div>
                  ) : isAccepted && workspace?.id ? (
                    <Link
                      href={`/ide/project/${workspace.id}`}
                      className="block w-full"
                    >
                      <Button
                        size="sm"
                        className="h-8 w-full gap-1.5 bg-primary text-xs font-medium text-primary-foreground hover:opacity-90"
                      >
                        <span>Open Workspace</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="text-[11px]">
                        {isExpired
                          ? "This invite has expired"
                          : "Invitation declined"}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled
                        className="h-7 text-[11px] text-muted-foreground opacity-50"
                      >
                        Inactive
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function WorkspaceInvitesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 flex-col items-center justify-center gap-2 p-8">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Loading invitations...
          </p>
        </div>
      }
    >
      <InvitesContent />
    </Suspense>
  )
}
