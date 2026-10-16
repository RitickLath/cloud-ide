import React from "react"
import Link from "next/link"
import { LandingContent } from "@/components/organism/LandingContent"

export default function RootLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header Navigation with the 5 pillars */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold tracking-tight"
            >
              <span className="text-xl text-primary">⚡</span>
              <span>CloudIDE</span>
            </Link>
            <nav className="hidden items-center gap-5 text-xs font-medium lg:flex">
              <Link
                href="/ide"
                className="text-muted-foreground transition hover:text-foreground"
              >
                Cloud IDE
              </Link>
              <Link
                href="/dsa"
                className="text-muted-foreground transition hover:text-foreground"
              >
                DSA Practice
              </Link>
              <Link
                href="/sql-lab"
                className="text-muted-foreground transition hover:text-foreground"
              >
                SQL Lab
              </Link>
              <Link
                href="/db-design"
                className="text-muted-foreground transition hover:text-foreground"
              >
                DB Design
              </Link>
              <Link
                href="/system-design"
                className="text-muted-foreground transition hover:text-foreground"
              >
                System Design
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing Hero & Pillars */}
      <main className="flex-1">
        <LandingContent />
      </main>
    </div>
  )
}
