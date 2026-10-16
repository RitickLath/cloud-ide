"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atom/dialog"
import { Input } from "@/components/atom/input"
import { Button } from "@/components/atom/button"
import { Label } from "@/components/atom/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atom/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/atom/tabs"
import { ScrollArea } from "@/components/atom/scroll-area"
import {
  FolderGit2,
  Search,
  Globe,
  Lock,
  GitPullRequest,
  Laptop,
  Bot,
  Component,
  TerminalSquare,
  Box,
  Code2,
} from "lucide-react"
import { TemplateCard } from "../molecule/TemplateCard"
import { TEMPLATES } from "@/constants/template"

import { Loader2 } from "lucide-react"
import { useCreateProject } from "@/features/mutations/useCreateProject"
import { useRouter } from "next/navigation"

import { useEffect } from "react"

interface CreateWorkspaceModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialView?: "template" | "git"
  initialFramework?: string
}

export const CreateWorkspaceModal = ({
  open = true,
  onOpenChange,
  initialView = "template",
  initialFramework = "NEXTJS",
}: CreateWorkspaceModalProps) => {
  const router = useRouter()
  const [view, setView] = useState<"template" | "git">(initialView)
  const [selectedFramework, setSelectedFramework] =
    useState<string>(initialFramework)
  const [activeTab, setActiveTab] = useState<string>("All")
  const [search, setSearch] = useState("")
  const [workspaceName, setWorkspaceName] = useState("")
  const [gitUrl, setGitUrl] = useState("")

  // Synchronize state when modal is opened with new props
  useEffect(() => {
    if (open) {
      setView(initialView)
      if (initialFramework) {
        setSelectedFramework(initialFramework)
      }
    }
  }, [open, initialView, initialFramework])

  const { createWithTemplate, createWithGit } = useCreateProject()
  const isPending = createWithTemplate.isPending || createWithGit.isPending

  const handleSubmit = async () => {
    try {
      let createdProjectId = ""
      if (view === "template") {
        const res = await createWithTemplate.mutateAsync({
          framework: selectedFramework,
          name: workspaceName,
        })
        createdProjectId = res?.data?.projectId
      } else {
        const res = await createWithGit.mutateAsync({
          gitUrl,
          name: workspaceName,
        })
        createdProjectId = res?.data?.projectId
      }

      if (createdProjectId) {
        console.log("Hit", createdProjectId)
        router.push(`/project/${createdProjectId}`)
      }
    } catch (error) {
      console.error("Failed to create workspace:", error)
    }
  }

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesTab = activeTab === "All" || t.category === activeTab
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full gap-0 overflow-hidden border-border bg-background p-0 shadow-2xl sm:max-w-[800px]">
        <div className="border-b border-border p-6 pb-4">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FolderGit2 className="size-4" />
              </div>
              <DialogTitle className="text-xl">
                {view === "template"
                  ? "Create New Workspace"
                  : "Import from Git"}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-1.5 ml-8 text-left text-sm text-muted-foreground">
              {view === "template"
                ? "Start from a curated framework template."
                : "Clone an existing public Git repository into a new workspace."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/80">
                  Workspace Name
                </Label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  acme-corp/
                </span>
              </div>
              <div className="relative flex items-center">
                <FolderGit2 className="absolute left-3 size-4 text-muted-foreground/60" />
                <Input
                  placeholder="hyper-quantum-flux"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="h-9 border-border/60 bg-muted/20 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            {view === "git" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground/80">
                  Git Repository URL
                </Label>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3 size-4 text-muted-foreground/60" />
                  <Input
                    placeholder="https://github.com/user/repo.git"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    className="h-9 border-border/60 bg-muted/20 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                </div>
              </div>
            )}

            {/* Compute Preset */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground/80">
                  Compute Preset
                </Label>
                <span className="text-[10px] font-medium text-emerald-500">
                  Free Tier
                </span>
              </div>
              <Select defaultValue="standard">
                <SelectTrigger className="h-9 w-full border-border/60 bg-muted/20 text-xs focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Laptop className="size-3.5 text-muted-foreground" />
                      <span>Standard (2 vCPU, 4GB RAM) - Free</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pro" className="text-xs" disabled>
                    <div className="flex items-center gap-2">
                      <Laptop className="size-3.5 text-muted-foreground" />
                      <span>Pro (4 vCPU, 8GB RAM) - Upgrade</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {view === "template" && (
          <div className="bg-muted/10 p-6 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground/80">
                Starter Templates
              </Label>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-7"
              >
                <TabsList className="h-7 border border-border/40 bg-muted/40 p-0.5">
                  {["All", "Frontend", "Fullstack", "Backend & AI"].map(
                    (tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="h-full px-2.5 text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        {tab}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
              </Tabs>
            </div>

            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates (e.g. Next.js, Python, Vite)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-border/60 bg-background/50 pl-8 text-xs"
              />
            </div>

            <ScrollArea className="-mr-4 h-[260px] pr-4">
              <div className="grid grid-cols-2 gap-3 pb-2">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    title={template.title}
                    description={template.description}
                    tags={template.tags}
                    icon={template.icon}
                    isSelected={selectedFramework === template.id}
                    onClick={() => setSelectedFramework(template.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="items-center border-t border-border bg-background px-6 py-4 sm:justify-between">
          {view === "template" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("git")}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <GitPullRequest className="mr-2 size-3.5" />
              Import Git repository URL
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("template")}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <FolderGit2 className="mr-2 size-3.5" />
              Start from a template
            </Button>
          )}

          <div className="flex items-center gap-2">
            {view === "git" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("template")}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              disabled={
                isPending ||
                (view === "template"
                  ? !selectedFramework || !workspaceName
                  : !gitUrl || !workspaceName)
              }
              onClick={handleSubmit}
              className="h-8 px-4 text-xs"
            >
              {isPending && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              {view === "template" ? "Create Workspace" : "Import & Clone"}
              {!isPending && (
                <kbd className="pointer-events-none ml-2 inline-flex h-4 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
                  <span className="text-xs">↵</span> Enter
                </kbd>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
