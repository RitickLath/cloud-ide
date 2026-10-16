"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Code2,
  CheckCircle2,
  Search,
  ArrowRight,
  Flame,
  Trophy,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/atom/input"
import { Button } from "@/components/atom/button"
import { MOCK_DSA_PROBLEMS } from "@/constants/platform-data"

export default function DsaProblemsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [search, setSearch] = useState("")

  const categories = [
    "All",
    "Arrays",
    "Strings",
    "Trees",
    "Dynamic Programming",
    "Graphs",
    "Binary Search",
  ]

  const difficulties = ["All", "Easy", "Medium", "Hard"]

  const filteredProblems = MOCK_DSA_PROBLEMS.filter((p) => {
    const matchesDiff =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty
    const matchesCat =
      selectedCategory === "All" || p.category === selectedCategory
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchesDiff && matchesCat && matchesSearch
  })

  const solvedCount = MOCK_DSA_PROBLEMS.filter((p) => p.solved).length

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <Code2 className="h-4 w-4" />
            <span>Algorithms & Data Structures</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            DSA Problem Solving
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            LeetCode-style algorithmic challenges with sub-second runner and
            testcases
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3.5 py-2 text-xs">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="font-semibold text-foreground">
              {solvedCount} / {MOCK_DSA_PROBLEMS.length} Solved
            </span>
          </div>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pick Random</span>
          </Button>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase">
              Easy Problems
            </span>
            <span>1 / 1 Solved</span>
          </div>
          <div className="mt-2 text-xl font-bold text-foreground">100%</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-amber-400 uppercase">
              Medium Problems
            </span>
            <span>1 / 3 Solved</span>
          </div>
          <div className="mt-2 text-xl font-bold text-foreground">33%</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div className="h-full w-1/3 rounded-full bg-amber-500" />
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/30 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-rose-400 uppercase">
              Hard Problems
            </span>
            <span>0 / 2 Solved</span>
          </div>
          <div className="mt-2 text-xl font-bold text-foreground">0%</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div className="h-full w-0 rounded-full bg-rose-500" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* Difficulty selection */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/10 p-1">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  selectedDifficulty === diff
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search problems or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8.5 w-full border-border/50 bg-card/40 pr-8 pl-8 text-xs sm:w-64"
            />
          </div>
        </div>

        {/* Categories row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/40 bg-card/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/40 bg-muted/20 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            <tr>
              <th className="w-12 px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Difficulty</th>
              <th className="px-5 py-3.5">Acceptance</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredProblems.map((prob) => (
              <tr key={prob.id} className="group transition hover:bg-muted/10">
                <td className="px-5 py-4 text-center">
                  {prob.solved ? (
                    <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" />
                  ) : (
                    <div className="mx-auto h-3 w-3 rounded-full border border-muted-foreground/30" />
                  )}
                </td>
                <td className="px-5 py-4">
                  <div>
                    <Link
                      href={`/dsa/${prob.slug}`}
                      className="font-semibold text-foreground transition group-hover:text-primary"
                    >
                      {prob.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-1.5">
                      {prob.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted/30 px-1.5 py-0.5 text-[9px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {prob.category}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      prob.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : prob.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-muted-foreground">
                  {prob.acceptanceRate}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dsa/${prob.slug}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    <span>Solve</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
