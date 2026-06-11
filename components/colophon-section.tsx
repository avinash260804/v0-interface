"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60, opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative py-24 px-6 md:px-16 lg:pl-[calc(52px+4rem)] border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">05 / Community</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">DESIGNERS HUB</h2>
      </div>

      {/* Multi-column layout — removed Stack column, added Social */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
        {/* Disciplines */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Disciplines</h4>
          <ul className="space-y-2">
            {["Architecture", "Interior Design", "Urban Design", "Product Design", "Graphic Design"].map((d) => (
              <li key={d}>
                <a href="#work" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {d}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Sections</h4>
          <ul className="space-y-2">
            {[
              { label: "Showcase",   href: "#work" },
              { label: "Critique",   href: "#critiques" },
              { label: "Discussions",href: "#critiques" },
              { label: "Help Forum", href: "#principles" },
              { label: "Resources",  href: "#principles" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Community</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/70">48k Professionals</li>
            <li className="font-mono text-xs text-foreground/70">120k Projects</li>
            <li className="font-mono text-xs text-foreground/70">6 Discipline Hubs</li>
            <li className="font-mono text-xs text-foreground/70">Beta — 2025</li>
          </ul>
        </div>

        {/* Social */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Follow</h4>
          <ul className="space-y-2">
            {[
              { label: "Twitter / X",  href: "#" },
              { label: "Instagram",    href: "#" },
              { label: "LinkedIn",     href: "#" },
              { label: "Discord",      href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>
              <a href="mailto:hello@designershub.co" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                hello@designershub.co
              </a>
            </li>
            <li>
              <a href="#join" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                Request Early Access
              </a>
            </li>
            <li>
              <a href="#" className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-200">
                Press Kit
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        ref={footerRef}
        className="mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2025 Designers Hub. All rights reserved.
          </p>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/50">
          Built for creative professionals. Designed with discipline.
        </p>
      </div>
    </section>
  )
}
