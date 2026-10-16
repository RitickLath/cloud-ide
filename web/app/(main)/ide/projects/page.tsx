"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Folder, Plus, GitBranch, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/atom/button"
import { Input } from "@/components/atom/input"
import { MOCK_PROJECTS } from "@/constants/mock-data"
import { CreateWorkspaceModal } from "@/components/organism/CreateWorkspaceModal"

export default function IdeProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const categories = ["All", "Next.js", "React", "Node", "Python"]

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.framework.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleOpenModal = (view: "template" | "git" = "template") => {
    setModalView(view)
    setModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            IDE Projects
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your cloud dev containers and code sandboxes
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/10 p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8.5 w-full border-border/50 bg-card/40 pr-8 pl-8 text-xs sm:w-64"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${project.iconBg}`}
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      href={`/project/${project.id}`}
                      className="line-clamp-1 text-sm font-semibold text-foreground transition hover:text-primary"
                    >
                      {project.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">
                      {project.framework}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    project.status === "Running"
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : project.status === "Idle"
                        ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : "border border-border/40 bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      project.status === "Running"
                        ? "bg-emerald-400"
                        : project.status === "Idle"
                          ? "bg-amber-400"
                          : "bg-muted-foreground"
                    }`}
                  />
                  {project.status}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                {project.description}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {/* Specs & Branch */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  {project.branch}
                </span>
                <span>
                  {project.vCpu} · {project.ram}
                </span>
              </div>

              {/* Collaborators Avatar Stack */}
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {project.collaborators.map((collab) => (
                    <img
                      key={collab.id}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-background"
                      src={collab.avatar}
                      alt={collab.name}
                      title={`${collab.name} (${collab.role})`}
                    />
                  ))}
                </div>

                <Link
                  href={`/project/${project.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                >
                  <span>Open IDE</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView={modalView}
      />
    </div>
  )
}
