"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "hero",       label: "Home",       short: "00" },
  { id: "critiques",  label: "Critiques",  short: "01" },
  { id: "work",       label: "Showcases",  short: "02" },
  { id: "principles", label: "Platform",   short: "03" },
  { id: "join",       label: "Join",       short: "04" },
  { id: "colophon",   label: "Community",  short: "05" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { threshold: [0.2, 0.5] },
    )

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav
      className="fixed left-0 top-0 z-40 h-screen w-[52px] hidden lg:flex flex-col justify-center border-r border-border/20 bg-background/60 backdrop-blur-md"
      aria-label="Section navigation"
    >
      {/* Logo mark */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent"
          style={{ writingMode: "vertical-rl" }}
        >
          DH
        </span>
      </div>

      <div className="flex flex-col items-center gap-5">
        {navItems.map(({ id, label, short }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-center w-full py-1"
            aria-label={`Go to ${label}`}
          >
            {/* Active line indicator */}
            <span
              className={cn(
                "block h-[1px] transition-all duration-300",
                activeSection === id
                  ? "w-5 bg-accent"
                  : "w-2.5 bg-muted-foreground/30 group-hover:w-4 group-hover:bg-muted-foreground/60",
              )}
            />
            {/* Tooltip on hover */}
            <span
              className={cn(
                "absolute left-[44px] font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none",
                activeSection === id ? "text-accent" : "text-muted-foreground",
              )}
            >
              {short} {label}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom scroll progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="w-px h-10 bg-border/30" />
        <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-widest"
          style={{ writingMode: "vertical-rl" }}>
          scroll
        </span>
      </div>
    </nav>
  )
}
