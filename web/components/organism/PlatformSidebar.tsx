"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Code2,
  Database,
  Terminal,
  Network,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react"

const PILLAR_ITEMS = [
  {
    name: "Cloud IDE",
    href: "/ide",
    icon: Terminal,
    desc: "Cloud sandboxes & containers",
  },
  {
    name: "DSA Practice",
    href: "/dsa",
    icon: Code2,
    desc: "Algorithms & data structures",
    badge: "150+",
  },
  {
    name: "SQL Lab",
    href: "/sql-lab",
    icon: Database,
    desc: "Query runner & challenges",
    badge: "Live",
  },
  {
    name: "DB Design",
    href: "/db-design",
    icon: Network,
    desc: "Visual schema & ERD editor",
  },
  {
    name: "System Design",
    href: "/system-design",
    icon: Cpu,
    desc: "Architectures & blueprints",
    badge: "Pro",
  },
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
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
          <Link
            href="/"
            className="flex items-center gap-2.5 truncate"
            title="CloudIDE Suite Home"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary shadow-xs">
              ⚡
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="block truncate text-xs font-semibold text-foreground">
                  CloudIDE Suite
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  Developer Workspace
                </span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Pillars Navigation */}
        <div className={`space-y-6 ${isCollapsed ? "p-2" : "p-3"}`}>
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                Developer Pillars
              </span>
            )}
            <div className="mt-1 space-y-1.5">
              {PILLAR_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/")

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
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                          <div className="truncate">
                            <span className="block truncate font-semibold">
                              {item.name}
                            </span>
                            <span className="block truncate text-[10px] text-muted-foreground/80">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        {item.badge && (
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
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile & Expand Toggle */}
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
              href="/login"
              className="ml-1 shrink-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Switch
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
