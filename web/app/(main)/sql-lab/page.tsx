"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Database,
  Play,
  RotateCcw,
  Sparkles,
  Table2,
  CheckCircle2,
  Clock,
  Terminal,
  Columns,
  Layers,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { MOCK_SQL_EXERCISES } from "@/constants/platform-data"

export default function SqlLabPage() {
  const [activeExercise, setActiveExercise] = useState(MOCK_SQL_EXERCISES[0])
  const [query, setQuery] = useState(
    `-- Exercise: ${MOCK_SQL_EXERCISES[0].title}
SELECT 
    DATE_TRUNC('month', renewed_at) AS billing_month,
    COUNT(DISTINCT user_id) AS active_subscribers,
    SUM(amount) AS monthly_recurring_revenue
FROM subscriptions
WHERE status = 'active'
GROUP BY 1
ORDER BY billing_month DESC
LIMIT 10;`
  )
  const [isRunning, setIsRunning] = useState(false)
  const [executionOutput, setExecutionOutput] = useState<{
    timeMs: number
    rows: Array<Record<string, string | number>>
  } | null>({
    timeMs: 4.8,
    rows: [
      {
        billing_month: "2026-10-01",
        active_subscribers: 1420,
        monthly_recurring_revenue: "$42,600",
      },
      {
        billing_month: "2026-09-01",
        active_subscribers: 1380,
        monthly_recurring_revenue: "$41,400",
      },
      {
        billing_month: "2026-08-01",
        active_subscribers: 1290,
        monthly_recurring_revenue: "$38,700",
      },
      {
        billing_month: "2026-07-01",
        active_subscribers: 1140,
        monthly_recurring_revenue: "$34,200",
      },
    ],
  })

  const handleRunQuery = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setExecutionOutput({
        timeMs: +(Math.random() * 3 + 2).toFixed(1),
        rows: [
          {
            billing_month: "2026-10-01",
            active_subscribers: 1420,
            monthly_recurring_revenue: "$42,600",
          },
          {
            billing_month: "2026-09-01",
            active_subscribers: 1380,
            monthly_recurring_revenue: "$41,400",
          },
          {
            billing_month: "2026-08-01",
            active_subscribers: 1290,
            monthly_recurring_revenue: "$38,700",
          },
          {
            billing_month: "2026-07-01",
            active_subscribers: 1140,
            monthly_recurring_revenue: "$34,200",
          },
        ],
      })
    }, 450)
  }

  const handleSelectExercise = (ex: (typeof MOCK_SQL_EXERCISES)[0]) => {
    setActiveExercise(ex)
    setQuery(`-- ${ex.title}
-- Schema context: ${ex.tableContext}
SELECT *
FROM subscriptions
LIMIT 10;`)
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#1c1f26] bg-[#0c0e12]/90 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-foreground">
              SQL Lab & Analytics Runner
            </h1>
            <p className="text-[10px] text-muted-foreground">
              PostgreSQL 16 Engine · In-Memory Container
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuery("")}
            className="h-8 gap-1 border-border/50 bg-card/40 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
          <Button
            size="sm"
            disabled={isRunning}
            onClick={handleRunQuery}
            className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:opacity-95"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isRunning ? "Running..." : "Run Query (⌘↵)"}</span>
          </Button>
        </div>
      </header>

      {/* Main Split Body: Left Exercises & Schema, Right Editor & Results */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Challenges & Table Schema context */}
        <aside className="w-72 shrink-0 space-y-6 overflow-y-auto border-r border-[#1c1f26] bg-[#0d0f14] p-4">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              SQL Challenges
            </span>
            <div className="mt-2 space-y-1.5">
              {MOCK_SQL_EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`w-full rounded-lg p-2.5 text-left text-xs transition ${
                    activeExercise.id === ex.id
                      ? "border border-primary/30 bg-primary/10 text-foreground"
                      : "border border-border/20 bg-card/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`py-0.2 rounded px-1.5 text-[9px] font-semibold uppercase ${
                        ex.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : ex.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                    {ex.solved && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-1.5 line-clamp-1 font-medium">
                    {ex.title}
                  </div>
                  <div className="mt-1 line-clamp-1 text-[10px] text-muted-foreground/80">
                    {ex.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Active Tables
            </span>
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-border/30 bg-card/20 p-2 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Table2 className="h-3.5 w-3.5 text-primary" />
                  <span>subscriptions</span>
                </div>
                <div className="mt-1.5 space-y-0.5 font-mono text-[10px] text-muted-foreground">
                  <div>id: uuid (PK)</div>
                  <div>user_id: uuid (FK)</div>
                  <div>amount: numeric(10,2)</div>
                  <div>status: text</div>
                  <div>renewed_at: timestamp</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Code Editor & Result Data Grid */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Query Editor Pane */}
          <div className="flex min-h-[260px] flex-1 flex-col border-b border-[#1c1f26] bg-[#090b0e]">
            <div className="flex h-8 items-center justify-between border-b border-[#1c1f26] px-4 text-[11px] text-muted-foreground">
              <span className="font-mono">query.sql</span>
              <span>PostgreSQL dialect</span>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full flex-1 resize-none bg-transparent p-4 font-mono text-xs text-foreground focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Results Output Pane */}
          <div className="flex h-64 shrink-0 flex-col bg-[#0d0f12]">
            <div className="flex h-9 items-center justify-between border-b border-[#1c1f26] px-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Table2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground">
                  Query Result
                </span>
                {executionOutput && (
                  <span className="text-[11px] text-emerald-400">
                    ({executionOutput.rows.length} rows in{" "}
                    {executionOutput.timeMs}ms)
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {executionOutput ? (
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-border/30 bg-muted/20 text-[10px] text-muted-foreground uppercase">
                    <tr>
                      {Object.keys(executionOutput.rows[0] || {}).map((col) => (
                        <th key={col} className="px-4 py-2">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-muted-foreground">
                    {executionOutput.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/10">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-2 text-foreground">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Run query to display output rows
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
