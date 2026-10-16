"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Folder,
  Activity,
  HardDrive,
  Cpu,
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Plus,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { MOCK_PROJECTS } from "@/constants/mock-data"
import { CreateWorkspaceModal } from "@/components/organism/CreateWorkspaceModal"

export default function IdeDashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")

  const runningProjects = MOCK_PROJECTS.filter((p) => p.status === "Running")
  const totalCollaborators = new Set(
    MOCK_PROJECTS.flatMap((p) => p.collaborators.map((c) => c.email))
  ).size

  const handleOpenModal = (view: "template" | "git" = "template") => {
    setModalView(view)
    setModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            IDE Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Overview of your active cloud workspaces, containers, and
            collaborators
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenModal("git")}
            className="h-9 gap-1.5 border-border/60 bg-card/40 text-xs hover:bg-muted"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>Import Git</span>
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenModal("template")}
            className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Total Projects
            </span>
            <Folder className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {MOCK_PROJECTS.length}
            </span>
            <span className="text-xs text-muted-foreground">workspaces</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Across 5 framework templates
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Running Pods
            </span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {runningProjects.length} / {MOCK_PROJECTS.length}
            </span>
            <span className="text-xs text-emerald-400">active</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${(runningProjects.length / MOCK_PROJECTS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Allocated Compute
            </span>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              8.4 vCPU
            </span>
            <span className="text-xs text-muted-foreground">/ 20 vCPU</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div className="h-full w-[42%] rounded-full bg-blue-500" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Team Members
            </span>
            <HardDrive className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {totalCollaborators}
            </span>
            <span className="text-xs text-muted-foreground">active devs</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Multi-user collaboration
          </p>
        </div>
      </div>

      {/* Recent / Running Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Active Workspaces
          </h2>
          <Link
            href="/ide/projects"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>View all projects</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {runningProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-xl border border-border/50 bg-card/30 p-5 transition hover:border-primary/40 hover:bg-card/50"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${project.iconBg}`}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link
                        href={`/project/${project.id}`}
                        className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {project.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        {project.framework}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Running
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                <span>{project.branch}</span>
                <Link
                  href={`/project/${project.id}`}
                  className="flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <span>Open IDE</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView={modalView}
      />
    </div>
  )
}
