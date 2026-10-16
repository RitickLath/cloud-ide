"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Users2,
  Folder,
  Mail,
  ShieldCheck,
  Search,
  UserPlus,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { Input } from "@/components/atom/input"
import { MOCK_PROJECTS, WorkspaceProject } from "@/constants/mock-data"

export default function IdeTeamsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [search, setSearch] = useState("")

  // Flatten collaborators paired with their project info
  const allRows = MOCK_PROJECTS.flatMap((project) =>
    project.collaborators.map((collab) => ({
      ...collab,
      project: {
        id: project.id,
        name: project.name,
        framework: project.framework,
        iconBg: project.iconBg,
      },
    }))
  )

  const filteredRows = allRows.filter((item) => {
    const matchesProject =
      selectedProjectId === "all" || item.project.id === selectedProjectId
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.project.name.toLowerCase().includes(search.toLowerCase())
    return matchesProject && matchesSearch
  })

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            IDE Teams & Collaborators
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            View team members, roles, and project access permissions
          </p>
        </div>

        <Button
          size="sm"
          className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Filter by Project and Search Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Project:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="h-8.5 rounded-lg border border-border/60 bg-card/40 px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="all" className="bg-[#14171d]">
              All Projects ({MOCK_PROJECTS.length})
            </option>
            {MOCK_PROJECTS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#14171d]">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search member or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8.5 w-full border-border/50 bg-card/40 pr-8 pl-8 text-xs sm:w-64"
          />
        </div>
      </div>

      {/* Table-wise representation */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/40 bg-muted/20 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3.5">Collaborator</th>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-xs text-muted-foreground"
                  >
                    No collaborators found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr
                    key={`${row.project.id}-${row.id}-${idx}`}
                    className="transition hover:bg-muted/10"
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.avatar}
                          alt={row.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-border/50"
                        />
                        <div>
                          <div className="font-semibold text-foreground">
                            {row.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {row.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Project info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${row.project.iconBg}`}
                        >
                          {row.project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/project/${row.project.id}`}
                            className="font-medium text-foreground hover:text-primary hover:underline"
                          >
                            {row.project.name}
                          </Link>
                          <div className="text-[10px] text-muted-foreground">
                            {row.project.framework}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          row.role === "Owner"
                            ? "border border-purple-500/20 bg-purple-500/10 text-purple-400"
                            : row.role === "Maintainer"
                              ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                              : "border border-border/40 bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {row.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] ${
                          row.status === "active"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.status === "active"
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }`}
                        />
                        {row.status === "active" ? "Active" : "Invited"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/project/${row.project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                      >
                        <span>Workspace</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
