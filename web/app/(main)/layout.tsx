import React from "react"
import { PlatformSidebar } from "@/components/organism/PlatformSidebar"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0f12] text-foreground">
      <PlatformSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}

export default RootLayout
