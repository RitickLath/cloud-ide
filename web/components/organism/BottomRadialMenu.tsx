"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  Terminal,
  Code2,
  Database,
  Network,
  Cpu,
  X,
  Compass,
} from "lucide-react"

const PILLAR_ITEMS = [
  {
    name: "Cloud IDE",
    href: "/ide",
    icon: Terminal,
  },
  {
    name: "DSA Practice",
    href: "/dsa",
    icon: Code2,
  },
  {
    name: "SQL Lab",
    href: "/sql-lab",
    icon: Database,
  },
  {
    name: "DB Design",
    href: "/db-design",
    icon: Network,
  },
  {
    name: "System Design",
    href: "/system-design",
    icon: Cpu,
  },
]

type Corner = "bottom-left" | "bottom-right" | "top-left" | "top-right"

export function BottomRadialMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  const PADDING = 24
  const BTN_SIZE = 46 // Compact size

  // Corner snap coordinates
  const [corner, setCorner] = useState<Corner>("bottom-left")
  const [pos, setPos] = useState({ x: PADDING, y: PADDING })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{
    clientX: number
    clientY: number
    startX: number
    startY: number
  } | null>(null)
  const hasMovedRef = useRef(false)

  // Calculate coordinates for all 4 corners
  const getCornerPosition = (c: Corner) => {
    if (typeof window === "undefined") return { x: PADDING, y: PADDING }
    const maxX = window.innerWidth - BTN_SIZE - PADDING
    const maxY = window.innerHeight - BTN_SIZE - PADDING

    switch (c) {
      case "top-left":
        return { x: PADDING, y: PADDING }
      case "top-right":
        return { x: maxX, y: PADDING }
      case "bottom-left":
        return { x: PADDING, y: maxY }
      case "bottom-right":
        return { x: maxX, y: maxY }
    }
  }

  // Initialize position to bottom-right corner so it does not obstruct the sidebar user profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPos(getCornerPosition("bottom-right"))
    }
    const handleResize = () => {
      setPos(getCornerPosition(corner))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [corner])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Snap to ANY of the 4 corners based on closest Euclidean distance
  const snapTo4Corners = (currentX: number, currentY: number) => {
    if (typeof window === "undefined") return

    const midX = window.innerWidth / 2
    const midY = window.innerHeight / 2

    const isLeft = currentX < midX
    const isTop = currentY < midY

    let targetCorner: Corner
    if (isTop && isLeft) targetCorner = "top-left"
    else if (isTop && !isLeft) targetCorner = "top-right"
    else if (!isTop && isLeft) targetCorner = "bottom-left"
    else targetCorner = "bottom-right"

    setCorner(targetCorner)
    setPos(getCornerPosition(targetCorner))
  }

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    hasMovedRef.current = false
    setIsDragging(true)
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.clientX
    const dy = e.clientY - dragStartRef.current.clientY

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true
    }

    setPos({
      x: dragStartRef.current.startX + dx,
      y: dragStartRef.current.startY + dy,
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}

    snapTo4Corners(pos.x, pos.y)
    dragStartRef.current = null
  }

  const handleToggle = () => {
    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev)
    }
  }

  // Compact radius with clear distance so buttons don't collide
  const RADIUS = 88
  const total = PILLAR_ITEMS.length

  // Fan-out angle into viewport based on the active corner
  let startAngle = 270
  let endAngle = 360

  if (corner === "bottom-left") {
    startAngle = 270
    endAngle = 360
  } else if (corner === "bottom-right") {
    startAngle = 180
    endAngle = 270
  } else if (corner === "top-left") {
    startAngle = 0
    endAngle = 90
  } else if (corner === "top-right") {
    startAngle = 90
    endAngle = 180
  }

  const isRightSide = corner === "bottom-right" || corner === "top-right"

  return (
    <div
      ref={containerRef}
      className="fixed z-50 touch-none select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transition: isDragging
          ? "none"
          : "all 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.25)",
      }}
    >
      {/* Radial Options */}
      <AnimatePresence>
        {isOpen && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-black/75 blur-2xl"
            />

            {PILLAR_ITEMS.map((item, index) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/")

              // Angle interpolation for item
              const angle =
                startAngle + (index / (total - 1)) * (endAngle - startAngle)
              const rad = (angle * Math.PI) / 180
              const targetX = Math.round(RADIUS * Math.cos(rad))
              const targetY = Math.round(RADIUS * Math.sin(rad))

              return (
                <motion.div
                  key={item.href}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 22,
                    delay: index * 0.03,
                  }}
                  className="pointer-events-auto absolute"
                >
                  <Link
                    href={item.href}
                    title={item.name}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-115 active:scale-95 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground ring-2 shadow-primary/30 ring-primary/20"
                        : "border-border/70 bg-[#161a22]/95 text-foreground hover:border-primary/60 hover:bg-[#1f2530]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    {/* Tooltip positioned inwards */}
                    <span
                      className={`pointer-events-none absolute z-50 hidden rounded-md border border-border/70 bg-[#12151b] px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-foreground shadow-xl group-hover:block ${
                        isRightSide ? "right-12" : "left-12"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button - compact & sleek */}
      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative flex h-11.5 w-11.5 cursor-grab items-center justify-center rounded-full border shadow-xl backdrop-blur-xl active:cursor-grabbing ${
          isOpen
            ? "border-border/70 bg-[#1a1d24] text-foreground"
            : "border-primary/40 bg-gradient-to-tr from-primary via-blue-500 to-cyan-400 text-white shadow-primary/30"
        }`}
        title={
          isOpen ? "Close menu" : "Drag to any of 4 corners, or click to open"
        }
        aria-label="Toggle Navigation Hub"
      >
        {isOpen ? (
          <X className="pointer-events-none h-4.5 w-4.5" />
        ) : (
          <Compass className="pointer-events-none h-4.5 w-4.5" />
        )}
      </motion.button>
    </div>
  )
}
