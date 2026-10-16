"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Folder,
  Users2,
  Plus,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react"
import { MOCK_PROJECTS } from "@/constants/mock-data"
import { CreateWorkspaceModal } from "@/components/organism/CreateWorkspaceModal"

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/ide/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/ide/projects",
    icon: Folder,
    badge: MOCK_PROJECTS.length,
  },
  {
    name: "Teams",
    href: "/ide/teams",
    icon: Users2,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-[#1c1f26] bg-[#0c0e12] text-foreground select-none">
        <div className="flex flex-col">
          {/* Workspace / Org Switcher Header */}
          <div className="flex h-14 items-center justify-between border-b border-[#1c1f26] px-4">
            <Link
              href="/ide/dashboard"
              className="flex items-center gap-2.5 truncate"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                ⚡
              </div>
              <div className="truncate">
                <span className="block truncate text-xs font-semibold text-foreground">
                  Acme Cloud
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  Pro Cluster · us-east
                </span>
              </div>
            </Link>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </div>

          {/* Navigation Section */}
          <div className="space-y-6 p-3">
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                IDE Platform
              </span>
              <div className="mt-1 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </span>
                      {item.badge !== undefined && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer User Info */}
        <div className="border-t border-[#1c1f26] p-3">
          <div className="flex items-center justify-between rounded-lg p-2 transition hover:bg-muted/20">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 text-xs font-bold text-white shadow-sm">
                R
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">
                  Ritick Lath
                </p>
                <p className="text-[10px] text-muted-foreground">
                  ritick@cloudide.io
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="text-muted-foreground hover:text-foreground"
              title="Settings"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Link>
          </div>
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
