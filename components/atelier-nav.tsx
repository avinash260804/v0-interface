"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"

/* ─── Navigation data ───────────────────────────────────────── */
const SECTIONS = [
  { id: "hero",       label: "Home",       index: "00" },
  { id: "critiques",  label: "Critiques",  index: "01" },
  { id: "work",       label: "Showcases",  index: "02" },
  { id: "principles", label: "Platform",   index: "03" },
  { id: "join",       label: "Join",       index: "04" },
  { id: "colophon",   label: "Community",  index: "05" },
]

const META_LINKS = [
  { label: "About Atelier",  href: "#colophon" },
  { label: "Guidelines",     href: "#principles" },
  { label: "FAQ",            href: "#colophon" },
  { label: "Contact",        href: "#colophon" },
]

export function AtelierNav() {
  const [isOpen, setIsOpen]               = useState(false)
  const [isVisible, setIsVisible]         = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const linksRef = useRef<HTMLDivElement>(null)
  const metaRef  = useRef<HTMLDivElement>(null)

  /* ── Section observer ────────────────────────────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { threshold: [0.2, 0.5] },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  /* ── Stagger content when opening ───────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const links = linksRef.current?.querySelectorAll("[data-link]")
    const metas = metaRef.current?.querySelectorAll("[data-meta]")

    if (links) {
      gsap.fromTo(links,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.07, delay: 0.35 }
      )
    }
    if (metas) {
      gsap.fromTo(metas,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.05, delay: 0.4 }
      )
    }
  }, [isOpen])

  /* ── Open / close ───────────────────────────────────────────── */
  const openMenu = () => {
    setIsVisible(true)
    document.body.style.overflow = "hidden"
    // rAF so CSS transition fires after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true))
    })
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = ""
    // Hide after transition completes (~550ms)
    setTimeout(() => setIsVisible(false), 600)
  }

  const scrollTo = (id: string) => {
    closeMenu()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 350)
  }

  /* ── Keyboard escape ─────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeMenu()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <>
      {/* ── Fixed top bar ─────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[60px] bg-background/80 backdrop-blur-md"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="font-[var(--font-bebas)] text-[22px] tracking-[0.25em] text-foreground hover:text-accent transition-colors duration-200"
          aria-label="Go to top"
        >
          ATELIER
        </button>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* MENU / CLOSE toggle */}
          <button
            onClick={isOpen ? closeMenu : openMenu}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.25em] border px-4 py-2 transition-all duration-200",
              isOpen
                ? "border-foreground/60 text-foreground bg-foreground/10 hover:bg-foreground/20"
                : "border-border/40 text-muted-foreground hover:border-foreground/60 hover:text-foreground",
            )}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>

          {/* Join CTA */}
          <a
            href="#join"
            onClick={() => isOpen && closeMenu()}
            className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 transition-all duration-200"
            style={{
              backgroundColor: "oklch(0.7 0.2 45)",
              color: "oklch(0.08 0 0)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "oklch(0.75 0.2 45)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "oklch(0.7 0.2 45)")}
          >
            Join Now
          </a>
        </div>
      </header>

      {/* ── Full-screen overlay ───────────────────────────────── */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{
            backgroundColor: "oklch(0.06 0 0)",
            transform: isOpen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation menu"
          aria-hidden={!isOpen}
        >
          {/* Spacer for the top bar */}
          <div className="h-[60px] flex-shrink-0 border-b border-border/10" />

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">

            {/* ── Left column: meta / small links ─────────────── */}
            <div
              ref={metaRef}
              className="w-[200px] md:w-[260px] flex-shrink-0 flex flex-col justify-between p-8 md:p-10 border-r border-border/10"
            >
              <div className="flex flex-col gap-8">
                {/* Meta links only */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40 mb-5" data-meta>
                    INFO
                  </p>
                  <ul className="flex flex-col gap-3" role="list">
                    {META_LINKS.map(({ label, href }) => (
                      <li key={label} data-meta>
                        <a
                          href={href}
                          onClick={() => isOpen && closeMenu()}
                          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom tagline */}
              <p
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/25 leading-relaxed"
                data-meta
              >
                The community for<br />design disciplines
              </p>
            </div>

            {/* ── Right area: large primary links ──────────────── */}
            <div
              ref={linksRef}
              className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-24 gap-0 overflow-hidden"
            >
              {SECTIONS.map(({ id, label, index }) => (
                <button
                  key={id}
                  data-link
                  onClick={() => scrollTo(id)}
                  className={cn(
                    "group flex items-baseline gap-4 text-left py-2 md:py-3 border-b border-border/10 last:border-b-0",
                    "transition-all duration-200 hover:pl-3",
                  )}
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/30 group-hover:text-accent transition-colors duration-200 w-6 flex-shrink-0">
                    {index}
                  </span>
                  <span
                    className={cn(
                      "font-[var(--font-bebas)] leading-none tracking-tight transition-colors duration-200",
                      "text-[clamp(2rem,5.5vw,5rem)]",
                      activeSection === id
                        ? "text-accent"
                        : "text-foreground/70 group-hover:text-foreground",
                    )}
                  >
                    {label}
                  </span>
                  <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors duration-300 self-center">
                    Go &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-8 md:px-10 h-12 border-t border-border/10">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/25">
              Atelier &mdash; The Design Forum
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/25">
              Est. 2025
            </span>
          </div>
        </div>
      )}
    </>
  )
}
