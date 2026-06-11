"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { GridMotion } from "@/components/grid-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CYCLING_WORDS = ["DESIGN", "CRITIQUE", "IDENTITY", "SHOWCASE", "CRAFT"]
const CYCLE_INTERVAL = 5000 // ms — long enough to read each word comfortably

const stats = [
  { value: "48k", label: "Creative Professionals" },
  { value: "6", label: "Discipline Communities" },
  { value: "120k", label: "Projects Shared" },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [wordIndex, setWordIndex] = useState(0)

  // Advance to next word on a fixed interval
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length)
    }, CYCLE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Parallax fade-out on scroll
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.2,
        },
      })

      // Staggered entrance sequence
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(headlineRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(bodyRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2")
        .fromTo(ctaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")

      // Stats stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll("[data-stat]"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power3.out" },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col px-6 md:px-16 overflow-hidden"
      style={{ height: "calc(100dvh - 60px)", paddingTop: "clamp(1.5rem, 3vh, 3rem)" }}
    >
      <AnimatedNoise opacity={0.03} />

      {/* Grid Motion — right 55% of the hero, full height */}
      <div className="absolute top-0 right-0 bottom-0 w-[55%] pointer-events-none z-0">
        <GridMotion rows={4} columns={3} speed={16} gap={8} glowColor="220, 160, 60" />
      </div>

      {/* All content — left side, fills section minus its padding, stats pinned bottom */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-between max-w-[50%] overflow-hidden flex-1"
      >

        {/* Main content block — fills remaining space */}
        <div className="flex flex-col justify-center flex-1 min-h-0 py-3">

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Professional feedback. Peer-driven growth.
            </span>
          </div>

          {/* "The community for" + split-flap */}
          <div ref={headlineRef} className="mb-5">
            <p className="font-mono text-[clamp(0.6rem,1.1vw,0.78rem)] uppercase tracking-[0.35em] text-muted-foreground/60 mb-3">
              The community for
            </p>
            <SplitFlapAudioProvider>
              <div className="relative inline-block">
                <SplitFlapText text={CYCLING_WORDS[wordIndex]} speed={40} />
                <div className="mt-2.5">
                  <SplitFlapMuteToggle />
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>

          {/* Body copy */}
          <div ref={bodyRef} className="mb-6">
            <h2 className="font-[var(--font-bebas)] text-[clamp(1.1rem,2.2vw,1.75rem)] leading-tight text-foreground mb-2.5">
              Design Critiques, Peer Community, Portfolio Showcase
            </h2>
            <p className="font-mono text-[11px] md:text-xs text-muted-foreground/75 leading-relaxed max-w-sm">
              For architects, interior designers, product designers, urban planners, and graphic professionals — share work, receive structured feedback, and grow your craft.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href="#join"
              className="group inline-flex items-center gap-3 border border-foreground px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-foreground bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-200"
            >
              <ScrambleTextOnHover text="Join the Community" as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
            </a>
            <a
              href="#work"
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Explore Showcases
            </a>
          </div>
        </div>

        {/* Stats bar — strictly at the bottom, always fully visible */}
        <div
          ref={statsRef}
          className="flex-shrink-0 flex items-end gap-8 border-t border-border/20 pt-3 pb-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-1">
              <span className="font-[var(--font-bebas)] text-[clamp(1.4rem,2.5vw,2rem)] tracking-tight text-foreground leading-none">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 leading-tight whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}

          {/* Live status badge */}
          <div className="ml-auto flex-shrink-0 self-end pb-1">
            <div className="inline-flex items-center gap-1.5 border border-accent/30 bg-accent/5 px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent/80 whitespace-nowrap">Open</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
