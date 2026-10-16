"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Cpu,
  Layers,
  Sparkles,
  Search,
  ArrowRight,
  Clock,
  Zap,
  BarChart2,
  Server,
  Database,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { Input } from "@/components/atom/input"
import { Button } from "@/components/atom/button"
import { MOCK_SYSTEM_DESIGNS } from "@/constants/platform-data"

export default function SystemDesignPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [search, setSearch] = useState("")

  const categories = [
    "All",
    "Distributed Systems",
    "Storage & Caching",
    "Realtime Messaging",
    "High Availability",
  ]

  const filteredDesigns = MOCK_SYSTEM_DESIGNS.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.components.some((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      )
    return matchesCat && matchesSearch
  })

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            <Cpu className="h-4 w-4" />
            <span>Architecture & Blueprints</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            System Design Engineering
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            In-depth architecture walk-throughs, scale benchmarks,
            back-of-the-envelope calculations, and component breakdowns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explore Blueprints</span>
          </Button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "border border-border bg-card text-foreground shadow-xs"
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
            placeholder="Search architecture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8.5 w-full border-border/50 bg-card/40 pr-8 pl-8 text-xs sm:w-64"
          />
        </div>
      </div>

      {/* Architecture Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className="group flex flex-col justify-between rounded-xl border border-border/50 bg-card/30 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60 hover:shadow-xl"
          >
            <div>
              <div className="flex items-start justify-between">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    design.difficulty === "Fundamental"
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : design.difficulty === "Intermediate"
                        ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
                        : "border border-purple-500/20 bg-purple-500/10 text-purple-400"
                  }`}
                >
                  {design.difficulty}
                </span>

                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {design.readTime}
                </span>
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground transition group-hover:text-primary">
                {design.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {design.summary}
              </p>

              {/* Architecture Components Stack */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {design.components.map((comp) => (
                  <span
                    key={comp}
                    className="rounded bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics Bar */}
            <div className="mt-6 border-t border-border/40 pt-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted/20 p-2">
                  <span className="block text-[10px] text-muted-foreground">
                    Throughput
                  </span>
                  <span className="font-semibold text-foreground">
                    {design.metrics.qps}
                  </span>
                </div>
                <div className="rounded-lg bg-muted/20 p-2">
                  <span className="block text-[10px] text-muted-foreground">
                    Latency
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {design.metrics.latency}
                  </span>
                </div>
                <div className="rounded-lg bg-muted/20 p-2">
                  <span className="block text-[10px] text-muted-foreground">
                    Storage
                  </span>
                  <span className="font-semibold text-blue-400">
                    {design.metrics.storage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
