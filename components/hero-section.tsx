"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
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
      className="relative min-h-screen flex flex-col justify-between pt-20 pb-10 px-6 md:px-16 overflow-hidden"
    >
      <AnimatedNoise opacity={0.03} />

      {/* All content */}
      <div ref={contentRef} className="flex flex-col flex-1 justify-between opacity-100" style={{ animationDelay: "0ms" }}>

        {/* Top block — eyebrow + headline + body + cta */}
        <div className="flex-1 flex flex-col justify-center pb-4">

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-2 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Professional feedback. Peer-driven growth.
            </span>
          </div>

          {/* Supporting subtitle — reduced weight */}
          <div ref={headlineRef}>
            <p className="font-mono text-[clamp(0.65rem,1.4vw,0.9rem)] uppercase tracking-[0.35em] text-muted-foreground/60 mb-10">
              The community for
            </p>

            {/* Split-flap spotlight — centered, refined dimensions */}
            <div className="flex justify-start">
              <SplitFlapAudioProvider>
                <div className="relative inline-block">
                  <SplitFlapText
                    text={CYCLING_WORDS[wordIndex]}
                    speed={40}
                  />
                  <div className="mt-4">
                    <SplitFlapMuteToggle />
                  </div>
                </div>
              </SplitFlapAudioProvider>
            </div>
          </div>

          {/* Body copy */}
          <div ref={bodyRef} className="mt-8 md:mt-10 max-w-2xl">
            <h2 className="font-[var(--font-bebas)] text-[clamp(2rem,5vw,4rem)] leading-tight text-foreground mb-6">
              Design Critiques, Peer Community, Portfolio Showcase
            </h2>
            <p className="font-mono text-sm md:text-base text-muted-foreground/80 leading-relaxed max-w-xl">
              For architects, interior designers, product designers, urban planners, and graphic professionals. Share work, receive structured feedback, connect with peers, and grow your craft in a respectful, expert-moderated space.
            </p>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#join"
              className="group inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground bg-foreground/5 hover:bg-foreground hover:text-background transition-all duration-200"
            >
              <ScrambleTextOnHover text="Join the Community" as="span" duration={0.6} />
              <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
            </a>
            <a
              href="#work"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Explore Showcases
            </a>
          </div>
        </div>

        {/* Stats bar — pinned to bottom */}
        <div
          ref={statsRef}
          className="mt-12 flex items-start flex-wrap gap-10 md:gap-16 border-t border-border/20 pt-6"
        >
          {stats.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-1">
              <span className="font-[var(--font-bebas)] text-4xl md:text-5xl tracking-tight text-foreground leading-none">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}

          {/* Open for submissions tag */}
          <div className="ml-auto self-end">
            <div className="border border-border/50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Open for Submissions
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-6 md:right-16 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-10 bg-border animate-pulse" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground" style={{ writingMode: "vertical-rl" }}>
          scroll
        </span>
      </div>
    </section>
  )
}
