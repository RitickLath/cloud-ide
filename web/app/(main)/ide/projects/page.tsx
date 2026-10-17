"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Folder,
  Plus,
  GitBranch,
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { Input } from "@/components/atom/input"
import { CreateWorkspaceModal } from "@/components/organism/CreateWorkspaceModal"
import { useGetAllProjects } from "@/features/queries/useGetAllProjects"

export default function IdeProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"template" | "git">("template")
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const { data: projects = [], isLoading } = useGetAllProjects()

  const categories = ["All", "Next.js", "React", "Node", "Python", "Git"]

  const filteredProjects = projects.filter((p) => {
    const fw = p.framework?.toLowerCase() || ""
    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Next.js" && fw.includes("next")) ||
      (activeCategory === "React" && fw.includes("react")) ||
      (activeCategory === "Node" && fw.includes("node")) ||
      (activeCategory === "Python" && fw.includes("python")) ||
      (activeCategory === "Git" && (fw.includes("git") || Boolean(p.gitUrl)))

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      fw.includes(search.toLowerCase())

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

      {/* Loading state */}
      {isLoading && (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border/40 bg-card/20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Loading your workspaces...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/10 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/40 text-muted-foreground">
            <Folder className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              No projects found
            </h3>
            <p className="text-xs text-muted-foreground">
              {search || activeCategory !== "All"
                ? "No projects matched your criteria."
                : "Create your first project to get started."}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => handleOpenModal("template")}
            className="mt-2 h-8 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Workspace</span>
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectSlug = project.slug || project.id
            const isReady = project.status === "READY"
            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/ide/project/${projectSlug}`}
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
                        isReady
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isReady
                            ? "bg-emerald-400"
                            : "animate-pulse bg-amber-400"
                        }`}
                      />
                      {isReady ? "Ready" : project.status}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                    {project.description ||
                      (project.gitUrl
                        ? `Imported from ${project.gitUrl}`
                        : `${project.framework} cloud workspace`)}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      main
                    </span>
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary/70" />
                      <span>{project.owner?.username || "You"}</span>
                    </div>

                    <Link
                      href={`/ide/project/${projectSlug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                    >
                      <span>Open IDE</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CreateWorkspaceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialView={modalView}
      />
    </div>
  )
}
