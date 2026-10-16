import React from "react"
import Link from "next/link"
import { X } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0d0f12] text-foreground">
      {/* Background glow effects */}
      <div
        className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
        aria-hidden="true"
      />

      {/* Floating Auth Container */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Close / Return to Home button */}
        <div className="fixed top-6 right-6 z-30">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground backdrop-blur-md transition hover:scale-105 hover:bg-muted hover:text-foreground"
            title="Return to Dashboard"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        {/* Brand header */}
        <div className="mb-6 flex items-center justify-center">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/20 text-primary shadow-lg shadow-primary/10 transition group-hover:scale-105">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground drop-shadow-sm">
              CloudIDE
            </span>
          </Link>
        </div>

        {/* Auth Card Slot */}
        <div className="w-full max-w-[420px] animate-in transition-all duration-200 fade-in-50 zoom-in-95">
          {children}
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground/80 drop-shadow-sm">
          &copy; {new Date().getFullYear()} CloudIDE Platform. Secure developer
          environment.
        </footer>
      </div>
    </div>
  )
}
