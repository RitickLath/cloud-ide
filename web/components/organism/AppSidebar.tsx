"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Folder,
  Users2,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
} from "lucide-react"
import { CreateWorkspaceModal } from "@/components/organism/CreateWorkspaceModal"
import { useGetAllProjects } from "@/features/queries/useGetAllProjects"
import { useGetMyInvites } from "@/features/queries/useGetMyInvites"

export function AppSidebar() {
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: projects = [] } = useGetAllProjects()
  const { data: invites = [] } = useGetMyInvites()
  const pendingInvitesCount = invites.filter(
    (i) => i.status === "PENDING"
  ).length

  const navItems = [
    {
      name: "Dashboard",
      href: "/ide",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/ide/projects",
      icon: Folder,
      badge: projects.length,
    },
    {
      name: "Teams",
      href: "/ide/teams",
      icon: Users2,
    },
    {
      name: "Invitations",
      href: "/ide/invites",
      icon: Mail,
      badge: pendingInvitesCount > 0 ? pendingInvitesCount : undefined,
      badgeVariant: "amber",
    },
  ]

  // Automatically collapse when opening a project workspace (/ide/project/[projectId])
  useEffect(() => {
    const isProjectOpen = pathname.startsWith("/ide/project/")

    if (isProjectOpen) {
      setIsCollapsed(true)
    }
  }, [pathname])

  return (
    <>
      <aside
        className={`z-30 flex h-screen shrink-0 flex-col justify-between border-r border-[#1c1f26] bg-[#0c0e12] text-foreground transition-all duration-200 select-none ${
          isCollapsed ? "w-16 items-center" : "w-64"
        }`}
      >
        <div className="flex w-full flex-col">
          {/* Workspace / Org Switcher Header */}
          <div
            className={`flex h-14 items-center border-b border-[#1c1f26] ${
              isCollapsed ? "justify-center px-2" : "justify-between px-4"
            }`}
          >
            <Link href="/ide" className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary shadow-xs">
                ⚡
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    Acme Cloud
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    Pro Cluster · us-east
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <div className={`space-y-6 ${isCollapsed ? "p-2" : "p-3"}`}>
            <div className="space-y-1">
              {!isCollapsed && (
                <span className="px-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  IDE Platform
                </span>
              )}
              <div className="mt-1 space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/ide" &&
                      pathname.startsWith(item.href + "/"))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.name}
                      className={`group flex items-center rounded-lg transition-all ${
                        isCollapsed
                          ? "mx-auto h-10 w-10 justify-center"
                          : "justify-between px-3 py-2.5"
                      } ${
                        isActive
                          ? "border border-primary/30 bg-primary/10 text-primary shadow-xs"
                          : "border border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      {isCollapsed ? (
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                      ) : (
                        <>
                          <span className="flex items-center gap-2.5">
                            <Icon
                              className={`h-4 w-4 shrink-0 ${
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            />
                            <span className="text-xs font-semibold">
                              {item.name}
                            </span>
                          </span>
                          {item.badge !== undefined && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                item.badgeVariant === "amber"
                                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-500"
                                  : isActive
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted/40 text-muted-foreground"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2">
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/40 text-foreground shadow-xs transition-all hover:border-primary/40 hover:bg-card hover:text-primary"
                  title="New Project"
                >
                  <Plus className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:border-primary/40 hover:bg-card hover:text-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Project</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer User Info & Expand Toggle */}
        <div className="flex w-full flex-col gap-2 border-t border-[#1c1f26] p-2">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 text-xs font-bold text-white shadow-xs"
                title="Ritick Lath (ritick@cloudide.io)"
              >
                R
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg p-2 transition hover:bg-muted/20">
              <div className="flex items-center gap-2.5 truncate">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 text-xs font-bold text-white shadow-sm">
                  R
                </div>
                <div className="truncate text-left">
                  <p className="truncate text-xs font-medium text-foreground">
                    Ritick Lath
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    ritick@cloudide.io
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="text-muted-foreground transition hover:text-foreground"
                title="Settings"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView="template"
      />
    </>
  )
}
