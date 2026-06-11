"use client"

import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const disciplines = [
  { label: "Architecture",    count: "12.4k" },
  { label: "Interior Design", count: "9.1k" },
  { label: "Urban Design",    count: "6.8k" },
  { label: "Product Design",  count: "11.2k" },
  { label: "Graphic Design",  count: "8.5k" },
]

export function JoinSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const disciplinesRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: headlineRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          },
        )
      }
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2,
            scrollTrigger: { trigger: formRef.current, start: "top 90%", toggleActions: "play none none reverse" },
          },
        )
      }
      if (disciplinesRef.current) {
        gsap.fromTo(
          disciplinesRef.current.querySelectorAll("[data-discipline]"),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: disciplinesRef.current, start: "top 92%", toggleActions: "play none none reverse" },
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section
      ref={sectionRef}
      id="join"
      className="relative py-32 px-6 md:px-16 lg:pl-[calc(52px+4rem)] border-t border-border/20"
    >
      {/* Accent background band */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none" />

      <div className="relative max-w-3xl">
        {/* Section label */}
        <div ref={headlineRef}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            04 / Early Access
          </span>

          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none">
            JOIN{" "}
            <span className="text-accent">48k</span>
            <br />
            DESIGNERS
          </h2>

          <p className="mt-6 max-w-lg font-mono text-sm text-muted-foreground leading-relaxed">
            Designers Hub is in beta. Get early access and be part of the founding community — the people who will shape how it grows.
          </p>
        </div>

        {/* Email form */}
        <div ref={formRef} className="mt-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent border border-border/60 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors duration-200"
              />
              <button
                type="submit"
                className="group px-6 py-3 font-mono text-xs uppercase tracking-widest bg-accent text-background hover:bg-accent/90 transition-all duration-200 border border-accent flex items-center gap-2 whitespace-nowrap"
              >
                Request Access
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3 max-w-md border border-accent/40 px-5 py-4 bg-accent/5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <p className="font-mono text-xs text-foreground/80 leading-relaxed">
                You&apos;re on the list. We&apos;ll reach out when your spot is ready.
              </p>
            </div>
          )}
          <p className="mt-3 font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            No spam. Unsubscribe any time.
          </p>
        </div>

        {/* Discipline breakdown */}
        <div ref={disciplinesRef} className="mt-16 pt-8 border-t border-border/20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Community breakdown
          </p>
          <div className="flex flex-wrap gap-6">
            {disciplines.map((d) => (
              <div key={d.label} data-discipline className="flex flex-col gap-1 min-w-[100px]">
                <span className="font-[var(--font-bebas)] text-3xl tracking-tight text-foreground leading-none">
                  {d.count}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
