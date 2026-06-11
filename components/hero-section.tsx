"use client"

import { useEffect, useRef, useState } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { GridMotion } from "@/components/grid-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CYCLING_WORDS = ["DESIGN", "CRITIQUE", "IDENTITY", "SHOWCASE", "CRAFT"]
const CYCLE_INTERVAL = 5000

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

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % CYCLING_WORDS.length)
    }, CYCLE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 1.2,
        },
      })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(headlineRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(bodyRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2")
        .fromTo(ctaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")

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
      className="relative overflow-hidden"
      style={{ height: "calc(100dvh - 60px)" }}
    >
      {/* Grid Motion — starts at 35%, angled via skew */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          left: "35%",
          right: "-8%",
          top: "-12%",
          bottom: "-12%",
          transform: "skewX(-5deg)",
          transformOrigin: "top left",
        }}
      >
        <GridMotion rows={4} columns={3} speed={16} gap={10} glowColor="220, 160, 60" />
      </div>

      {/* Seamless left-edge fade — wide gradient dissolve, no hard seam */}
      <div
        className="absolute inset-y-0 pointer-events-none z-10"
        style={{
          left: "30%",
          width: "28%",
          background: "linear-gradient(to right, oklch(0.08 0 0) 0%, oklch(0.08 0 0) 25%, transparent 100%)",
        }}
      />

      {/* Content — left column, two-col feel, generous spacing */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col justify-between h-full px-10 md:px-16 lg:px-20"
        style={{ maxWidth: "52%" }}
      >

        {/* Upper: eyebrow + split-flap + body + CTAs */}
        <div className="flex flex-col justify-center flex-1 min-h-0 gap-0">

          <div ref={eyebrowRef} className="flex items-center gap-2.5 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Professional feedback. Peer-driven growth.
            </span>
          </div>

          <div ref={headlineRef} className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground/50 mb-4">
              The community for
            </p>
            <SplitFlapAudioProvider>
              <div className="relative inline-block">
                <SplitFlapText text={CYCLING_WORDS[wordIndex]} speed={40} />
                <div className="mt-3">
                  <SplitFlapMuteToggle />
                </div>
              </div>
            </SplitFlapAudioProvider>
          </div>

          <div ref={bodyRef} className="mb-8">
            <h2 className="font-[var(--font-bebas)] text-[clamp(1.25rem,2.4vw,2rem)] leading-tight text-foreground mb-3">
              Design Critiques, Peer Community, Portfolio Showcase
            </h2>
            <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed" style={{ maxWidth: "38ch" }}>
              For architects, interior designers, product designers, urban planners, and graphic professionals — share work, receive structured feedback, and grow your craft.
            </p>
          </div>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-5">
            <a
              href="#join"
              className="group inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-foreground bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-200"
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

        {/* Stats — pinned to bottom, fully within viewport */}
        <div
          ref={statsRef}
          className="flex-shrink-0 border-t border-border/20 pt-4 pb-5 flex items-end gap-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-1.5">
              <span className="font-[var(--font-bebas)] text-[clamp(1.6rem,2.8vw,2.4rem)] tracking-tight text-foreground leading-none">
                {stat.value}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/55 leading-tight">
                {stat.label}
              </span>
            </div>
          ))}

          <div className="ml-auto self-center flex-shrink-0">
            <div className="inline-flex items-center gap-2 border border-accent/25 bg-accent/5 px-3.5 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent/75 whitespace-nowrap">
                Open for Submissions
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
