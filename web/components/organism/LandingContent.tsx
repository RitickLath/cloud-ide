import React from "react"
import Link from "next/link"
import {
  Code2,
  Database,
  Terminal,
  Network,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react"

export function LandingContent() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
        aria-hidden="true"
      />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unified Engineering & Coding Suite</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1]">
            Build, solve DSA, query SQL & design architectures{" "}
            <span className="bg-linear-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              in one cloud suite.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A unified suite for modern engineers. Spin up instant Cloud IDE
            sandboxes, master LeetCode algorithmic problems, query live
            databases in SQL Lab, design ERD schemas, and learn distributed
            system design.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ide"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              <span>Launch Cloud IDE</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dsa"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-muted"
            >
              <Code2 className="h-4 w-4 text-primary" />
              <span>Practice DSA</span>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero setup required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Instant cloud containers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>5 Integrated Pillars</span>
            </div>
          </div>
        </div>

        {/* 5 Feature Pillars Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Cloud IDE */}
          <Link
            href="/ide"
            className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
              Full Cloud IDE
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Monaco Editor with real terminal access, live file watchman,
              automatic backups, and instant workspace containers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Open Cloud IDE</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 2. DSA */}
          <Link
            href="/dsa"
            className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
              DSA Problem Solving
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              LeetCode-style problems with sub-second execution, hidden
              testcases, memory metrics, and difficulty breakdowns.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Solve problems</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 3. SQL Lab */}
          <Link
            href="/sql-lab"
            className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
              Interactive SQL Lab
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Run real relational queries, inspect schemas, and practice complex
              analytical, window function, and reporting challenges.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Open SQL Lab</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 4. DB Design Editor */}
          <Link
            href="/db-design"
            className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
              Database Design (DrawSQL)
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Visual schema designer with foreign key relationships, interactive
              tables, ERD diagrams, and one-click DDL SQL generation.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Design schema</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 5. System Design */}
          <Link
            href="/system-design"
            className="group relative rounded-2xl border border-border bg-card/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
              System Design Platform
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Master distributed systems, rate limiters, Kafka queues, and
              high-scale blueprints with latency benchmarks and calculations.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span>Explore architectures</span>
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Performance Architecture Card */}
          <div className="relative rounded-2xl border border-border bg-card/40 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
              High-Speed Architecture
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Powered by BullMQ background jobs, Redis queues, and Docker
              container sandboxes.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Sub-second execution engine</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
