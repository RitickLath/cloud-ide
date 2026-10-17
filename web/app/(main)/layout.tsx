import React from "react"
import { BottomRadialMenu } from "@/components/organism/BottomRadialMenu"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#0d0f12] text-foreground">
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        {children}
      </main>
      {/* Floating Bottom Radial Menu for switching pillars */}
      <BottomRadialMenu />
    </div>
  )
}

export default RootLayout
