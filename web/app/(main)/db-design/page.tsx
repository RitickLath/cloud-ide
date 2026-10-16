"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Network,
  Plus,
  Table2,
  Key,
  Link2,
  Download,
  Share2,
  Sparkles,
  Search,
  Move,
  Layers,
  Code2,
} from "lucide-react"
import { Button } from "@/components/atom/button"
import { Input } from "@/components/atom/input"
import { MOCK_DB_SCHEMAS } from "@/constants/platform-data"

export default function DbDesignPage() {
  const [selectedSchema, setSelectedSchema] = useState(MOCK_DB_SCHEMAS[0])
  const [zoom, setZoom] = useState(100)
  const [viewMode, setViewMode] = useState<"diagram" | "ddl">("diagram")

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#1c1f26] bg-[#0c0e12]/90 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xs font-semibold text-foreground">
              {selectedSchema.name}
            </h1>
            <p className="text-[10px] text-muted-foreground">
              {selectedSchema.dialect} · {selectedSchema.tables.length} tables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-border/40 bg-muted/20 p-0.5 text-xs">
            <button
              onClick={() => setViewMode("diagram")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "diagram"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Visual Diagram
            </button>
            <button
              onClick={() => setViewMode("ddl")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === "ddl"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Export SQL (DDL)
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-border/50 bg-card/40 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:opacity-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Table</span>
          </Button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 bg-[#090b0e] opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, #252b36 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {viewMode === "diagram" ? (
          /* Visual Interactive Schema Canvas */
          <div className="relative z-10 flex flex-1 items-start gap-8 overflow-auto p-10">
            {selectedSchema.tables.map((table, idx) => (
              <div
                key={table.name}
                className="w-72 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-[#12151b]/95 shadow-2xl backdrop-blur-md transition-all hover:border-primary/50"
              >
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      {table.name}
                    </span>
                  </div>
                  <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {table.columns.length} cols
                  </span>
                </div>

                {/* Columns List */}
                <div className="divide-y divide-border/20 font-mono text-xs">
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      className="flex items-center justify-between px-3.5 py-2 hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-1.5">
                        {col.isPk ? (
                          <Key className="h-3 w-3 text-amber-400" />
                        ) : col.isFk ? (
                          <Link2 className="h-3 w-3 text-blue-400" />
                        ) : (
                          <span className="mr-0.5 ml-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                        <span className="text-foreground">{col.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DDL SQL Generation View */
          <div className="relative z-10 flex-1 overflow-auto p-6">
            <div className="rounded-xl border border-border/60 bg-[#090b0e] p-5 font-mono text-xs text-emerald-400">
              <pre className="whitespace-pre-wrap">{`-- Generated DDL for ${selectedSchema.name} (${selectedSchema.dialect})
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_cents BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
