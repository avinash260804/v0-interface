"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const showcases = [
  {
    title: "Warm Minimal",
    discipline: "Interior Design",
    author: "Jonah Reyes",
    tools: ["SketchUp", "V-Ray"],
    appreciations: 962,
    description: "A walnut and linen living space exploring tension between warmth and restraint.",
    height: "tall", // drives masonry visual weight
  },
  {
    title: "Tower Facade Study",
    discipline: "Architecture",
    author: "Mara Iliev",
    tools: ["Rhino", "Grasshopper"],
    appreciations: 741,
    description: "Parametric curtain wall studies for a 42-floor residential tower.",
    height: "short",
  },
  {
    title: "Waterfront Promenade",
    discipline: "Urban Design",
    author: "Sena Okoye",
    tools: ["AutoCAD", "Lumion"],
    appreciations: 584,
    description: "Activation strategy and programming sequence for a 2km riverbank edge.",
    height: "medium",
  },
  {
    title: "Tactile Wayfinding",
    discipline: "Product Design",
    author: "Ingrid Dahl",
    tools: ["Figma", "Keyshot"],
    appreciations: 812,
    description: "Haptic and spatial language system for public transit navigation.",
    height: "short",
  },
  {
    title: "Adaptive Courtyard",
    discipline: "Architecture",
    author: "Tomas Bek",
    tools: ["Revit", "Enscape"],
    appreciations: 439,
    description: "A heritage building transformation where the courtyard becomes the primary civic space.",
    height: "tall",
  },
  {
    title: "Editorial Grid System",
    discipline: "Graphic Design",
    author: "Pita Noa",
    tools: ["InDesign", "Illustrator"],
    appreciations: 1200,
    description: "Free grid system templates for editorial layout — 980 saves.",
    height: "medium",
  },
  {
    title: "Bioclimatic Housing",
    discipline: "Architecture",
    author: "Camille Voss",
    tools: ["ArchiCAD", "ClimateConsultant"],
    appreciations: 327,
    description: "Passive design strategies applied to affordable housing in humid subtropical climates.",
    height: "short",
  },
  {
    title: "Commercial Kitchen",
    discipline: "Interior Design",
    author: "Omar Faris",
    tools: ["SketchUp", "Photoshop"],
    appreciations: 651,
    description: "Tight spatial choreography for a 28-seat restaurant — flow, ergonomics, and atmosphere.",
    height: "medium",
  },
]

// Heights for masonry columns in px
const heightMap = {
  tall: 340,
  medium: 260,
  short: 200,
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const col3Ref = useRef<HTMLDivElement>(null)

  // Distribute into 3 masonry columns (greedy shortest-column algorithm)
  const columns: (typeof showcases)[] = [[], [], []]
  const colHeights = [0, 0, 0]
  showcases.forEach((item) => {
    const minCol = colHeights.indexOf(Math.min(...colHeights))
    columns[minCol].push(item)
    colHeights[minCol] += heightMap[item.height]
  })

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
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
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }

      // Animate each column with a vertical offset stagger
      ;[col1Ref, col2Ref, col3Ref].forEach((colRef, colIndex) => {
        if (!colRef.current) return
        const cards = colRef.current.querySelectorAll("article")
        if (cards.length === 0) return
        gsap.fromTo(
          cards,
          { y: 60 + colIndex * 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: colRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const colRefs = [col1Ref, col2Ref, col3Ref]

  return (
    <section ref={sectionRef} id="work" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-16 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Showcases</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">SELECTED WORKS</h2>
        </div>
        <p className="hidden md:block max-w-xs font-mono text-xs text-muted-foreground text-right leading-relaxed">
          Portfolio pieces from the community — architecture, interiors, urban design, and beyond.
        </p>
      </div>

      {/* Masonry grid — 3 columns on desktop, 1 on mobile */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            ref={colRefs[colIndex]}
            className="flex flex-col gap-4 md:gap-6 w-full md:flex-1"
          >
            {col.map((showcase, cardIndex) => (
              <ShowcaseCard
                key={`${colIndex}-${cardIndex}`}
                showcase={showcase}
                heightClass={showcase.height}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ShowcaseCard({
  showcase,
  heightClass,
}: {
  showcase: (typeof showcases)[number]
  heightClass: "tall" | "medium" | "short"
}) {
  const [isHovered, setIsHovered] = useState(false)

  const minHeightMap = {
    tall: "min-h-[300px] md:min-h-[340px]",
    medium: "min-h-[220px] md:min-h-[260px]",
    short: "min-h-[160px] md:min-h-[200px]",
  }

  return (
    <article
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden",
        minHeightMap[heightClass],
        isHovered && "border-accent/60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background hover layer */}
      <div
        className={cn(
          "absolute inset-0 bg-accent/5 transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Content top */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {showcase.discipline}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] transition-colors duration-300",
              isHovered ? "text-accent" : "text-muted-foreground/40",
            )}
          >
            {showcase.appreciations.toLocaleString()} appreciations
          </span>
        </div>
        <h3
          className={cn(
            "font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight transition-colors duration-300 leading-tight",
            isHovered ? "text-accent" : "text-foreground",
          )}
        >
          {showcase.title}
        </h3>
      </div>

      {/* Description — reveals on hover */}
      <div className="relative z-10 mt-4">
        <p
          className={cn(
            "font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {showcase.description}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-4 border-t border-border/20 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">by {showcase.author}</span>
        <div className="flex items-center gap-1.5">
          {showcase.tools.map((tool) => (
            <span
              key={tool}
              className="font-mono text-[10px] text-muted-foreground/60 border border-border/30 px-1.5 py-0.5"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
