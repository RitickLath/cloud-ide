import React from "react"
import { AppSidebar } from "@/components/organism/AppSidebar"

export default function IdeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0f12] text-foreground">
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}
