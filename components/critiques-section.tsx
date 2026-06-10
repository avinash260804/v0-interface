"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const critiques = [
  {
    id: "01",
    discipline: "Architecture",
    title: "Tower residential — facade rhythm feels unresolved",
    author: "Mara Iliev",
    stage: "Work in Progress",
    tools: ["Rhino", "V-Ray"],
    responses: 8,
    note: "The curtain wall module repeats without any hierarchy. Looking for feedback on how to introduce scale variation without abandoning the grid.",
  },
  {
    id: "02",
    discipline: "Interior Design",
    title: "Warm Minimal — walnut and linen living space",
    author: "Jonah Reyes",
    stage: "Near Final",
    tools: ["SketchUp", "V-Ray"],
    responses: 14,
    note: "Seeking critique on material balance. The warm tones feel right but the lighting plan still reads as disconnected from the spatial flow.",
  },
  {
    id: "03",
    discipline: "Urban Design",
    title: "Waterfront promenade — activation strategy",
    author: "Sena Okoye",
    stage: "Concept",
    tools: ["AutoCAD", "Lumion"],
    responses: 6,
    note: "This is early-stage. Looking for structural critique on programming sequence — how to move people from transit node to water edge.",
  },
  {
    id: "04",
    discipline: "Product Design",
    title: "Tactile wayfinding system for public transit",
    author: "Ingrid Dahl",
    stage: "Prototype",
    tools: ["Figma", "Keyshot"],
    responses: 11,
    note: "The haptic language is established, but I'm unsure whether the spatial metaphors translate across cultures. Open to perspectives.",
  },
]

export function CritiquesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !stackRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      // Stack card interaction
      const cards = stackRef.current?.querySelectorAll<HTMLElement>("[data-card]")
      if (!cards || cards.length === 0) return

      const totalCards = cards.length
      const ITEM_DISTANCE = 120
      const ITEM_SCALE = 0.05
      const STACK_POSITION = "25%"

      // Initial stack state — all cards layered with scale/y offset
      cards.forEach((card, i) => {
        const reverseIndex = totalCards - 1 - i
        gsap.set(card, {
          y: reverseIndex * 16,
          scale: 1 - reverseIndex * ITEM_SCALE,
          opacity: reverseIndex > 2 ? 0 : 1,
          zIndex: i,
        })
      })

      // Pin the section and animate cards off the stack as we scroll
      ScrollTrigger.create({
        trigger: stackRef.current,
        start: `top ${STACK_POSITION}`,
        end: `+=${ITEM_DISTANCE * totalCards}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          const cardProgress = progress * totalCards

          cards.forEach((card, i) => {
            const cardStart = i / totalCards
            const cardEnd = (i + 1) / totalCards
            const p = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)))

            if (p > 0) {
              // This card animates off: slide up, fade out, rotate slightly
              gsap.set(card, {
                y: -120 * p,
                opacity: 1 - p,
                rotateX: 8 * p,
                scale: 1 - p * 0.08,
              })
            }

            // Re-stack cards below the active one
            const remainingIndex = Math.max(0, i - Math.floor(cardProgress))
            if (p === 0) {
              gsap.set(card, {
                y: remainingIndex * 16,
                scale: 1 - remainingIndex * ITEM_SCALE,
                opacity: remainingIndex > 2 ? 0 : 1,
                rotateX: 0,
              })
            }
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="critiques" ref={sectionRef} className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Critiques</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">OPEN FOR REVIEW</h2>
        <p className="mt-4 max-w-md font-mono text-xs text-muted-foreground leading-relaxed">
          Works in progress seeking structured feedback from the community. Scroll to move through active critique requests.
        </p>
      </div>

      {/* Scroll stack container */}
      <div
        ref={stackRef}
        className="relative h-[480px] md:h-[520px] perspective-[1200px]"
        style={{ perspective: "1200px" }}
      >
        {critiques.map((critique, index) => (
          <CritiqueCard key={critique.id} critique={critique} index={index} total={critiques.length} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="w-12 h-px bg-border" />
        <span>Scroll to browse critiques</span>
      </div>
    </section>
  )
}

function CritiqueCard({
  critique,
  index,
  total,
}: {
  critique: (typeof critiques)[number]
  index: number
  total: number
}) {
  const stageColors: Record<string, string> = {
    Concept: "text-muted-foreground border-muted-foreground/30",
    "Work in Progress": "text-accent border-accent/40",
    "Near Final": "text-foreground border-foreground/30",
    Prototype: "text-accent border-accent/40",
  }

  return (
    <article
      data-card
      className={cn(
        "absolute inset-0 border border-border/50 bg-card p-8 md:p-10",
        "flex flex-col justify-between",
        "origin-top",
      )}
      style={{ transformOrigin: "top center" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {critique.discipline}
            </span>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5",
                stageColors[critique.stage] ?? "text-muted-foreground border-muted-foreground/30",
              )}
            >
              {critique.stage}
            </span>
          </div>
          <h3 className="font-[var(--font-bebas)] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight max-w-2xl">
            {critique.title}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/40 flex-shrink-0">
          {critique.id} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Body */}
      <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-xl mt-6">
        {critique.note}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-foreground/70">by {critique.author}</span>
          <div className="flex items-center gap-2">
            {critique.tools.map((tool) => (
              <span
                key={tool}
                className="font-mono text-[10px] text-muted-foreground border border-border/40 px-2 py-0.5"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            {critique.responses} responses
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-30">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
